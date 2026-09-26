import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import { ReadinessService } from './readiness.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface HealthFilterParams {
  jamaahId?: string;
  regionId?: string;
  checkupStage?: string;
  istithaahStatus?: string;
  administrativeStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class HealthService {
  /**
   * List health administrative monitoring records
   */
  public static async listRecords(params: HealthFilterParams, session?: UserSessionPayload) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Row-Level Authorization
    if (session && session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN') && !session.roles.includes('EXECUTIVE_LEADER')) {
      where.jamaah = { regionId: session.regionId };
    } else if (params.regionId) {
      where.jamaah = { regionId: params.regionId };
    }

    if (params.jamaahId) {
      where.jamaahId = params.jamaahId;
    }

    if (params.checkupStage) {
      where.checkupStage = params.checkupStage;
    }

    if (params.istithaahStatus) {
      where.istithaahStatus = params.istithaahStatus;
    }

    if (params.administrativeStatus) {
      where.administrativeStatus = params.administrativeStatus;
    }

    if (params.search) {
      where.jamaah = {
        ...(where.jamaah || {}),
        OR: [
          { fullName: { contains: params.search } },
          { porsiNumber: { contains: params.search } },
        ],
      };
    }

    const [total, items] = await Promise.all([
      prisma.healthMonitoring.count({ where }),
      prisma.healthMonitoring.findMany({
        where,
        skip,
        take: limit,
        include: {
          jamaah: {
            select: {
              id: true,
              fullName: true,
              porsiNumber: true,
              bloodType: true,
              isPriorityElderly: true,
              elderlyAge: true,
              regionId: true,
              region: { select: { id: true, name: true, code: true } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update administrative health record
   */
  public static async updateRecord(
    id: string,
    payload: {
      istithaahStatus: string;
      administrativeStatus: string;
      locationName?: string;
      isVaccineMeningitis?: boolean;
      isVaccinePolio?: boolean;
      isVaccineCovid?: boolean;
      notesNonMedical?: string;
    },
    session: UserSessionPayload
  ) {
    const record = await prisma.healthMonitoring.findUnique({
      where: { id },
      include: { jamaah: true },
    });

    if (!record) {
      throw new Error('Data monitoring kesehatan tidak ditemukan');
    }

    // Row-Level Authorization check
    if (session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      if (record.jamaah.regionId !== session.regionId) {
        throw new Error('Akses ditolak: Data bukan milik wilayah kewenangan Anda.');
      }
    }

    const previousStatus = record.administrativeStatus;

    const updated = await prisma.healthMonitoring.update({
      where: { id },
      data: {
        istithaahStatus: payload.istithaahStatus,
        administrativeStatus: payload.administrativeStatus,
        locationName: payload.locationName ?? record.locationName,
        isVaccineMeningitis: payload.isVaccineMeningitis ?? record.isVaccineMeningitis,
        isVaccinePolio: payload.isVaccinePolio ?? record.isVaccinePolio,
        isVaccineCovid: payload.isVaccineCovid ?? record.isVaccineCovid,
        notesNonMedical: payload.notesNonMedical ?? record.notesNonMedical,
        examinationDate: payload.administrativeStatus === 'SELESAI' ? (record.examinationDate || new Date()) : record.examinationDate,
      },
    });

    // Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'UPDATE',
      module: 'HEALTH',
      recordId: id,
      beforeState: { status: previousStatus, istithaah: record.istithaahStatus },
      afterState: { status: payload.administrativeStatus, istithaah: payload.istithaahStatus },
    });

    // Resolve action items if health passed
    if (['MEMENUHI_SYARAT', 'MEMENUHI_DENGAN_PENDAMPING'].includes(payload.istithaahStatus) && payload.administrativeStatus === 'SELESAI') {
      await prisma.actionItem.updateMany({
        where: {
          jamaahId: record.jamaahId,
          category: 'PEMERIKSAAN',
          status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] },
        },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          notes: `Istitha'ah disetujui (${payload.istithaahStatus}) oleh ${session.username}`,
        },
      });
    }

    // Live Readiness Recalculation
    await ReadinessService.recalculateJamaah(record.jamaahId);

    return updated;
  }
}
