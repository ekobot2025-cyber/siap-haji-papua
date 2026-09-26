import { prisma } from '@/infrastructure/database/prisma.client';

export interface CreateAuditLogParams {
  actorId?: string | null;
  actorUsername?: string | null;
  actorRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'FAILED_LOGIN'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'UNMASK'
    | 'SETTING_CHANGE'
    | 'RULE_CHANGE'
    | 'RECALCULATE_READINESS'
    | 'VERIFY_DOCUMENT'
    | 'REJECT_DOCUMENT'
    | 'ASSIGN_TASK'
    | 'RESOLVE_TASK';
  module:
    | 'AUTH'
    | 'JAMAAH'
    | 'READINESS'
    | 'SYSTEM'
    | 'DASHBOARD'
    | 'DOCUMENT'
    | 'ADMINISTRATION'
    | 'HEALTH'
    | 'MANASIK'
    | 'KLOTER'
    | 'EARLY_WARNING'
    | 'ACTION_CENTER';
  recordId?: string | null;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  dataSource?: 'INTERNAL' | 'DEMO' | 'SYSTEM';
}

export class AuditService {
  /**
   * Append-only Audit Trail creation.
   * STRICT SECURITY GUARANTEE: No update or delete operations are exposed.
   */
  public static async log(params: CreateAuditLogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          actorId: params.actorId || null,
          actorUsername: params.actorUsername || 'SYSTEM',
          actorRole: params.actorRole || 'SYSTEM',
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          action: params.action,
          module: params.module,
          recordId: params.recordId ? String(params.recordId) : null,
          beforeState: params.beforeState ? JSON.stringify(params.beforeState) : null,
          afterState: params.afterState ? JSON.stringify(params.afterState) : null,
          dataSource: params.dataSource || 'INTERNAL',
        },
      });
    } catch (error) {
      // In critical systems, audit failures must be logged to stderr without bringing down core workflow
      console.error('[AUDIT_LOG_ERROR] Failed to record audit event:', error);
    }
  }

  /**
   * Retrieve paginated immutable audit logs
   */
  public static async listLogs(params: {
    page?: number;
    pageSize?: number;
    module?: string;
    action?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(100, Math.max(10, params.pageSize || 25));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (params.module) where.module = params.module;
    if (params.action) where.action = params.action;

    const [total, items] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return {
      items,
      meta: {
        page,
        pageSize,
        totalRecords: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
