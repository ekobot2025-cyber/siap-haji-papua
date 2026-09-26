import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import { ReadinessService } from './readiness.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface DocumentFilterParams {
  jamaahId?: string;
  regionId?: string;
  status?: string; // PENDING (MENUNGGU_VERIFIKASI), TERVERIFIKASI, DITOLAK, BELUM_ADA
  typeCode?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class DocumentService {
  /**
   * List documents with filtering, RLA scoping, and pagination
   */
  public static async listDocuments(params: DocumentFilterParams, session?: UserSessionPayload) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Row-Level Authorization: Scoped Region Admin
    if (session && session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN') && !session.roles.includes('EXECUTIVE_LEADER')) {
      where.jamaah = { regionId: session.regionId };
    } else if (params.regionId) {
      where.jamaah = { regionId: params.regionId };
    }

    if (params.jamaahId) {
      where.jamaahId = params.jamaahId;
    }

    if (params.typeCode) {
      where.documentType = { code: params.typeCode };
    }

    if (params.status) {
      if (params.status === 'PENDING') {
        where.status = { in: ['UPLOADED', 'MENUNGGU_VERIFIKASI'] };
      } else {
        where.status = params.status;
      }
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
      prisma.jamaahDocument.count({ where }),
      prisma.jamaahDocument.findMany({
        where,
        skip,
        take: limit,
        include: {
          jamaah: {
            select: {
              id: true,
              fullName: true,
              porsiNumber: true,
              regionId: true,
              region: { select: { id: true, name: true, code: true } },
            },
          },
          documentType: true,
          verifications: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              verifiedBy: { select: { id: true, fullName: true, username: true } },
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
   * Get document by ID
   */
  public static async getDocumentById(id: string) {
    return prisma.jamaahDocument.findUnique({
      where: { id },
      include: {
        jamaah: {
          include: { region: true },
        },
        documentType: true,
        verifications: {
          orderBy: { createdAt: 'desc' },
          include: { verifiedBy: { select: { id: true, fullName: true, username: true } } },
        },
      },
    });
  }

  /**
   * Verify or reject document
   */
  public static async verifyDocument(
    documentId: string,
    action: 'VERIFY' | 'REJECT' | 'NEED_REVISION',
    notes: string,
    session: UserSessionPayload
  ) {
    const doc = await prisma.jamaahDocument.findUnique({
      where: { id: documentId },
      include: { jamaah: true, documentType: true },
    });

    if (!doc) {
      throw new Error('Dokumen tidak ditemukan');
    }

    // Row-Level Authorization verification check
    if (session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      if (doc.jamaah.regionId !== session.regionId) {
        throw new Error('Akses ditolak: Dokumen bukan milik wilayah kewenangan Anda.');
      }
    }

    const previousStatus = doc.status;
    let newStatus = 'TERVERIFIKASI';
    if (action === 'REJECT') {
      newStatus = 'DITOLAK';
    } else if (action === 'NEED_REVISION') {
      newStatus = 'MENUNGGU_VERIFIKASI';
    }

    const [updatedDoc] = await prisma.$transaction([
      prisma.jamaahDocument.update({
        where: { id: documentId },
        data: {
          status: newStatus,
          rejectionReason: action === 'REJECT' ? notes : null,
          notes: notes || doc.notes,
        },
      }),
      prisma.documentVerification.create({
        data: {
          jamaahDocumentId: documentId,
          action,
          notes,
          verifiedById: session.userId,
        },
      }),
    ]);

    // Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: action === 'VERIFY' ? 'VERIFY_DOCUMENT' : 'REJECT_DOCUMENT',
      module: 'DOCUMENT',
      recordId: documentId,
      beforeState: { status: previousStatus },
      afterState: { status: newStatus, notes, action },
    });

    // Synchronize Action Center items for DOKUMEN
    if (action === 'VERIFY') {
      await prisma.actionItem.updateMany({
        where: {
          jamaahId: doc.jamaahId,
          category: 'DOKUMEN',
          status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] },
        },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          notes: `Diselesaikan otomatis via verifikasi dokumen ${doc.documentType.name} oleh ${session.username}`,
        },
      });
    } else if (action === 'REJECT') {
      await prisma.actionItem.create({
        data: {
          jamaahId: doc.jamaahId,
          category: 'DOKUMEN',
          title: `Revisi Dokumen: ${doc.documentType.name}`,
          description: `Dokumen ditolak: ${notes}`,
          priority: 'HIGH',
          status: 'OPEN',
          notes,
          assignedByUserId: session.userId,
        },
      });
    }

    // Live Readiness Recalculation
    await ReadinessService.recalculateJamaah(doc.jamaahId);

    return updatedDoc;
  }
}
