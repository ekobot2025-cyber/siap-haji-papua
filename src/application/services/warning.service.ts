import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface WarningFilterParams {
  regionId?: string;
  severity?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class WarningService {
  /**
   * List warning events with filters and RLA scoping
   */
  public static async listWarnings(params: WarningFilterParams, session?: UserSessionPayload) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Row-Level Authorization
    if (session && session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN') && !session.roles.includes('EXECUTIVE_LEADER')) {
      where.regionId = session.regionId;
    } else if (params.regionId) {
      where.regionId = params.regionId;
    }

    if (params.severity) {
      where.severity = params.severity;
    }

    if (params.status) {
      where.status = params.status;
    }

    const [total, items, severityCounts] = await Promise.all([
      prisma.warningEvent.count({ where }),
      prisma.warningEvent.findMany({
        where,
        skip,
        take: limit,
        include: {
          rule: true,
          jamaah: {
            select: {
              id: true,
              fullName: true,
              porsiNumber: true,
              status: true,
              isPriorityElderly: true,
              elderlyAge: true,
              region: { select: { id: true, name: true, code: true } },
            },
          },
          region: { select: { id: true, name: true, code: true } },
          actionItems: true,
        },
        orderBy: [{ detectedAt: 'desc' }],
      }),
      prisma.warningEvent.groupBy({
        by: ['severity'],
        where: where.regionId ? { regionId: where.regionId, status: 'OPEN' } : { status: 'OPEN' },
        _count: { _all: true },
      }),
    ]);

    const stats = {
      critical: severityCounts.find((s) => s.severity === 'CRITICAL')?._count._all || 0,
      warning: severityCounts.find((s) => s.severity === 'WARNING')?._count._all || 0,
      attention: severityCounts.find((s) => s.severity === 'ATTENTION')?._count._all || 0,
      normal: severityCounts.find((s) => s.severity === 'NORMAL')?._count._all || 0,
    };

    return {
      items,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Resolve or dismiss a warning event
   */
  public static async resolveWarning(
    id: string,
    notes: string,
    session: UserSessionPayload
  ) {
    const event = await prisma.warningEvent.findUnique({
      where: { id },
      include: { jamaah: true },
    });

    if (!event) throw new Error('Warning event tidak ditemukan');

    // RLA check
    if (session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      if (event.regionId !== session.regionId) {
        throw new Error('Akses ditolak: Peringatan bukan di wilayah Anda.');
      }
    }

    const updated = await prisma.warningEvent.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedById: session.userId,
        resolutionNotes: notes,
      },
    });

    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'UPDATE',
      module: 'EARLY_WARNING',
      recordId: id,
      afterState: { status: 'RESOLVED', notes },
    });

    return updated;
  }
}
