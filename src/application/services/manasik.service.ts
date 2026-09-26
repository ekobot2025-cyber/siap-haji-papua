import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import { ReadinessService } from './readiness.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export class ManasikService {
  /**
   * List manasik events with participant stats
   */
  public static async listEvents(regionId?: string, session?: UserSessionPayload) {
    const where: any = { isActive: true };

    if (session && session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN') && !session.roles.includes('EXECUTIVE_LEADER')) {
      where.regionId = session.regionId;
    } else if (regionId) {
      where.regionId = regionId;
    }

    const events = await prisma.manasikEvent.findMany({
      where,
      include: {
        region: { select: { id: true, name: true, code: true } },
        _count: {
          select: { attendances: true },
        },
      },
      orderBy: { eventDate: 'asc' },
    });

    return events;
  }

  /**
   * Get single event with attendance list
   */
  public static async getEventDetail(eventId: string) {
    return prisma.manasikEvent.findUnique({
      where: { id: eventId },
      include: {
        region: true,
        attendances: {
          include: {
            jamaah: {
              select: {
                id: true,
                fullName: true,
                porsiNumber: true,
                region: { select: { name: true } },
              },
            },
            verifiedBy: { select: { fullName: true, username: true } },
          },
          orderBy: { checkInTime: 'desc' },
        },
      },
    });
  }

  /**
   * Record or update attendance for a jamaah
   */
  public static async recordAttendance(
    eventId: string,
    jamaahId: string,
    status: 'HADIR' | 'TIDAK_HADIR' | 'IZIN' | 'SAKIT',
    attendanceMethod: 'QR_SCAN' | 'MANUAL_OPERATOR',
    session: UserSessionPayload
  ) {
    const event = await prisma.manasikEvent.findUnique({ where: { id: eventId } });
    if (!event) throw new Error('Kegiatan Manasik tidak ditemukan');

    const jamaah = await prisma.jamaah.findUnique({ where: { id: jamaahId } });
    if (!jamaah) throw new Error('Jamaah tidak ditemukan');

    const attendance = await prisma.manasikAttendance.upsert({
      where: {
        eventId_jamaahId: {
          eventId,
          jamaahId,
        },
      },
      update: {
        status,
        attendanceMethod,
        checkInTime: new Date(),
        verifiedById: session.userId,
      },
      create: {
        eventId,
        jamaahId,
        status,
        attendanceMethod,
        checkInTime: new Date(),
        verifiedById: session.userId,
      },
    });

    // Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'UPDATE',
      module: 'MANASIK',
      recordId: attendance.id,
      afterState: { eventId, jamaahId, status, attendanceMethod },
    });

    // If attended, resolve action items for MANASIK if applicable
    if (status === 'HADIR') {
      await prisma.actionItem.updateMany({
        where: {
          jamaahId,
          category: 'MANASIK',
          status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] },
        },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          notes: `Presensi manasik terkonfirmasi (${attendanceMethod}) oleh ${session.username}`,
        },
      });
    }

    // Live Readiness Recalculation
    await ReadinessService.recalculateJamaah(jamaahId);

    return attendance;
  }
}
