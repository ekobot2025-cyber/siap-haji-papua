import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface ActionItemFilterParams {
  category?: string;
  status?: string;
  priority?: string;
  assignedToUserId?: string;
  regionId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class ActionCenterService {
  /**
   * Get action item statistics grouped by category and status
   */
  public static async getStats(session?: UserSessionPayload) {
    const where: any = {};

    if (session && session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN') && !session.roles.includes('EXECUTIVE_LEADER')) {
      where.jamaah = { regionId: session.regionId };
    }

    const [categoryGroups, statusGroups, priorityGroups, totalOpen] = await Promise.all([
      prisma.actionItem.groupBy({
        by: ['category'],
        where,
        _count: { _all: true },
      }),
      prisma.actionItem.groupBy({
        by: ['status'],
        where,
        _count: { _all: true },
      }),
      prisma.actionItem.groupBy({
        by: ['priority'],
        where: { ...where, status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } },
        _count: { _all: true },
      }),
      prisma.actionItem.count({
        where: { ...where, status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } },
      }),
    ]);

    const categories = {
      DOKUMEN: categoryGroups.find((c) => c.category === 'DOKUMEN')?._count._all || 0,
      PEMERIKSAAN: categoryGroups.find((c) => c.category === 'PEMERIKSAAN')?._count._all || 0,
      ADMINISTRASI: categoryGroups.find((c) => c.category === 'ADMINISTRASI')?._count._all || 0,
      MANASIK: categoryGroups.find((c) => c.category === 'MANASIK')?._count._all || 0,
      KLOTER: categoryGroups.find((c) => c.category === 'KLOTER')?._count._all || 0,
    };

    const statuses = {
      OPEN: statusGroups.find((s) => s.status === 'OPEN')?._count._all || 0,
      IN_PROGRESS: statusGroups.find((s) => s.status === 'IN_PROGRESS')?._count._all || 0,
      ESCALATED: statusGroups.find((s) => s.status === 'ESCALATED')?._count._all || 0,
      RESOLVED: statusGroups.find((s) => s.status === 'RESOLVED')?._count._all || 0,
    };

    const priorities = {
      URGENT: priorityGroups.find((p) => p.priority === 'URGENT')?._count._all || 0,
      HIGH: priorityGroups.find((p) => p.priority === 'HIGH')?._count._all || 0,
      MEDIUM: priorityGroups.find((p) => p.priority === 'MEDIUM')?._count._all || 0,
      LOW: priorityGroups.find((p) => p.priority === 'LOW')?._count._all || 0,
    };

    return {
      totalOpen,
      categories,
      statuses,
      priorities,
    };
  }

  /**
   * List action items with filtering and RLA scoping
   */
  public static async listItems(params: ActionItemFilterParams, session?: UserSessionPayload) {
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

    if (params.category && params.category !== 'ALL') {
      where.category = params.category;
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }

    if (params.priority && params.priority !== 'ALL') {
      where.priority = params.priority;
    }

    if (params.assignedToUserId) {
      where.assignedToUserId = params.assignedToUserId;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search } },
        { description: { contains: params.search } },
        { jamaah: { fullName: { contains: params.search } } },
        { jamaah: { porsiNumber: { contains: params.search } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.actionItem.count({ where }),
      prisma.actionItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          jamaah: {
            select: {
              id: true,
              fullName: true,
              porsiNumber: true,
              isPriorityElderly: true,
              elderlyAge: true,
              status: true,
              region: { select: { id: true, name: true, code: true } },
              readinessScore: { select: { totalScore: true, category: true } },
            },
          },
          assignedTo: { select: { id: true, fullName: true, username: true } },
          assignedBy: { select: { id: true, fullName: true, username: true } },
        },
        orderBy: [
          { priority: 'asc' }, // URGENT, HIGH ...
          { createdAt: 'desc' },
        ],
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
   * Update action item status, assignment, or deadline
   */
  public static async updateItem(
    id: string,
    payload: {
      status?: string;
      priority?: string;
      assignedToUserId?: string | null;
      deadline?: Date | null;
      notes?: string;
    },
    session: UserSessionPayload
  ) {
    const item = await prisma.actionItem.findUnique({
      where: { id },
      include: { jamaah: true },
    });

    if (!item) throw new Error('Action item tidak ditemukan');

    // RLA check
    if (session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      if (item.jamaah.regionId !== session.regionId) {
        throw new Error('Akses ditolak: Task bukan milik wilayah Anda.');
      }
    }

    const previousStatus = item.status;
    const isNowResolved = payload.status === 'RESOLVED';

    const updated = await prisma.actionItem.update({
      where: { id },
      data: {
        status: payload.status ?? item.status,
        priority: payload.priority ?? item.priority,
        assignedToUserId: payload.assignedToUserId !== undefined ? payload.assignedToUserId : item.assignedToUserId,
        deadline: payload.deadline !== undefined ? payload.deadline : item.deadline,
        notes: payload.notes ?? item.notes,
        resolvedAt: isNowResolved ? new Date() : (payload.status && payload.status !== 'RESOLVED' ? null : item.resolvedAt),
      },
      include: {
        jamaah: true,
        assignedTo: true,
      },
    });

    // Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: isNowResolved ? 'RESOLVE_TASK' : 'UPDATE',
      module: 'ACTION_CENTER',
      recordId: id,
      beforeState: { status: previousStatus, priority: item.priority },
      afterState: { status: updated.status, priority: updated.priority, assignedTo: updated.assignedTo?.username },
    });

    return updated;
  }

  /**
   * Create an action item manually
   */
  public static async createItem(
    payload: {
      jamaahId: string;
      category: string;
      title: string;
      description?: string;
      priority?: string;
      deadline?: Date;
      assignedToUserId?: string;
    },
    session: UserSessionPayload
  ) {
    const jamaah = await prisma.jamaah.findUnique({ where: { id: payload.jamaahId } });
    if (!jamaah) throw new Error('Jamaah tidak ditemukan');

    // RLA check
    if (session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      if (jamaah.regionId !== session.regionId) {
        throw new Error('Akses ditolak: Jamaah bukan di wilayah Anda.');
      }
    }

    const item = await prisma.actionItem.create({
      data: {
        jamaahId: payload.jamaahId,
        category: payload.category,
        title: payload.title,
        description: payload.description,
        priority: payload.priority || 'HIGH',
        deadline: payload.deadline,
        assignedToUserId: payload.assignedToUserId,
        assignedByUserId: session.userId,
        status: 'OPEN',
      },
    });

    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'ASSIGN_TASK',
      module: 'ACTION_CENTER',
      recordId: item.id,
      afterState: { title: payload.title, category: payload.category, priority: payload.priority },
    });

    return item;
  }
}
