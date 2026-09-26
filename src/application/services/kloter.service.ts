import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import { ReadinessService } from './readiness.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export class KloterService {
  /**
   * List all Kloters for active hajj season with occupancy stats
   */
  public static async listKloters(seasonId?: string) {
    const where: any = {};
    if (seasonId) {
      where.seasonId = seasonId;
    }

    const kloters = await prisma.kloter.findMany({
      where,
      include: {
        _count: {
          select: { members: true, officers: true },
        },
        officers: true,
        groups: {
          include: {
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { kloterNumber: 'asc' },
    });

    return kloters.map((k) => ({
      ...k,
      occupancyPercentage: Math.round((k._count.members / k.capacityTotal) * 100),
    }));
  }

  /**
   * Get detailed Kloter info including manifest and groups
   */
  public static async getKloterDetail(kloterId: string) {
    return prisma.kloter.findUnique({
      where: { id: kloterId },
      include: {
        officers: true,
        groups: {
          include: {
            members: {
              include: {
                jamaah: {
                  select: {
                    id: true,
                    fullName: true,
                    porsiNumber: true,
                    gender: true,
                    isPriorityElderly: true,
                    elderlyAge: true,
                    region: { select: { name: true } },
                    readinessScore: { select: { totalScore: true, category: true } },
                  },
                },
              },
            },
          },
        },
        members: {
          include: {
            jamaah: {
              select: {
                id: true,
                fullName: true,
                porsiNumber: true,
                gender: true,
                isPriorityElderly: true,
                elderlyAge: true,
                region: { select: { name: true } },
                readinessScore: { select: { totalScore: true, category: true } },
              },
            },
            group: true,
          },
          orderBy: { seatNumber: 'asc' },
        },
      },
    });
  }

  /**
   * Assign or update a Jamaah seat/group in a Kloter
   */
  public static async assignMember(
    kloterId: string,
    jamaahId: string,
    seatNumber: string | undefined,
    groupId: string | undefined,
    session: UserSessionPayload
  ) {
    const kloter = await prisma.kloter.findUnique({ where: { id: kloterId } });
    if (!kloter) throw new Error('Kloter tidak ditemukan');

    const member = await prisma.kloterMember.upsert({
      where: { jamaahId },
      update: {
        kloterId,
        seatNumber: seatNumber || null,
        groupId: groupId || null,
        assignedAt: new Date(),
      },
      create: {
        kloterId,
        jamaahId,
        seatNumber: seatNumber || null,
        groupId: groupId || null,
      },
    });

    // Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'UPDATE',
      module: 'KLOTER',
      recordId: member.id,
      afterState: { kloterId, jamaahId, seatNumber, groupId },
    });

    // Live Readiness Recalculation
    await ReadinessService.recalculateJamaah(jamaahId);

    return member;
  }
}
