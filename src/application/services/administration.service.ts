import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import { ReadinessService } from './readiness.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface AdminFilterParams {
  jamaahId?: string;
  regionId?: string;
  stageName?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class AdministrationService {
  /**
   * List administration records with filtering and RLA scoping
   */
  public static async listRecords(params: AdminFilterParams, session?: UserSessionPayload) {
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

    if (params.stageName) {
      where.stageName = params.stageName;
    }

    if (params.status) {
      where.status = params.status;
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
      prisma.administrationRecord.count({ where }),
      prisma.administrationRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          jamaah: {
            select: {
              id: true,
              fullName: true,
              porsiNumber: true,
              status: true,
              regionId: true,
              region: { select: { id: true, name: true, code: true } },
            },
          },
          verifiedBy: {
            select: { id: true, fullName: true, username: true },
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
   * Update administration status (e.g. Confirm BPIH payment)
   */
  public static async updateRecord(
    id: string,
    payload: {
      status: string;
      amountPaid?: number;
      paymentReference?: string;
      notes?: string;
    },
    session: UserSessionPayload
  ) {
    const record = await prisma.administrationRecord.findUnique({
      where: { id },
      include: { jamaah: true },
    });

    if (!record) {
      throw new Error('Catatan administrasi tidak ditemukan');
    }

    // Row-Level Authorization check
    if (session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      if (record.jamaah.regionId !== session.regionId) {
        throw new Error('Akses ditolak: Data bukan milik wilayah kewenangan Anda.');
      }
    }

    const previousStatus = record.status;

    const updated = await prisma.administrationRecord.update({
      where: { id },
      data: {
        status: payload.status,
        amountPaid: payload.amountPaid !== undefined ? payload.amountPaid : record.amountPaid,
        paymentReference: payload.paymentReference !== undefined ? payload.paymentReference : record.paymentReference,
        notes: payload.notes !== undefined ? payload.notes : record.notes,
        completionDate: payload.status === 'SELESAI' ? new Date() : record.completionDate,
        verifiedById: session.userId,
      },
    });

    // Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'UPDATE',
      module: 'ADMINISTRATION',
      recordId: id,
      beforeState: { status: previousStatus },
      afterState: { status: payload.status, amountPaid: payload.amountPaid },
    });

    // If BPIH is settled, resolve any pending ActionItem in category ADMINISTRASI
    if (record.stageName === 'PELUNASAN_BPIH' && payload.status === 'SELESAI') {
      await prisma.actionItem.updateMany({
        where: {
          jamaahId: record.jamaahId,
          category: 'ADMINISTRASI',
          status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] },
        },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          notes: `BPIH lunas diverifikasi oleh ${session.username}`,
        },
      });
    }

    // Live Readiness Recalculation
    await ReadinessService.recalculateJamaah(record.jamaahId);

    return updated;
  }
}
