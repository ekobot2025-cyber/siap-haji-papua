import { prisma } from '@/infrastructure/database/prisma.client';
import { encryptData, decryptData, hashBlindIndex } from '@/infrastructure/security/crypto';
import { maskNik, maskPhone, maskKk } from '@/infrastructure/security/masking';
import { getRowLevelRegionFilter, canAccessJamaahRecord, canUnmaskSensitiveData } from '@/infrastructure/security/rbac';
import { ReadinessService } from './readiness.service';
import { AuditService } from './audit.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface JamaahListFilterParams {
  search?: string;
  regionId?: string;
  status?: string;
  readinessCategory?: string;
  gender?: string;
  isPriorityElderly?: boolean;
  seasonId?: string;
  page?: number;
  pageSize?: number;
}

export class JamaahService {
  /**
   * List paginated jamaah with mandatory server-side Row-Level Authorization
   */
  public static async listJamaah(params: JamaahListFilterParams, session: UserSessionPayload) {
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(100, Math.max(10, params.pageSize || 20));
    const skip = (page - 1) * pageSize;

    // 1. Enforce Row-Level Authorization for geographic scope
    const regionScope = getRowLevelRegionFilter(session, params.regionId);
    if ('id' in regionScope && regionScope.id === 'FORBIDDEN_NO_ACCESS') {
      return { items: [], meta: { page: 1, pageSize, totalRecords: 0, totalPages: 0 } };
    }

    const where: Record<string, unknown> = {
      deletedAt: null,
      ...regionScope,
    };

    if (params.seasonId) {
      where.seasonId = params.seasonId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.gender) {
      where.gender = params.gender;
    }

    if (params.isPriorityElderly !== undefined) {
      where.isPriorityElderly = params.isPriorityElderly;
    }

    if (params.readinessCategory) {
      where.readinessScore = {
        category: params.readinessCategory,
      };
    }

    // Search by Porsi, Name, or Blind-Indexed NIK
    if (params.search) {
      const query = params.search.trim();
      const isDigits = /^\d+$/.test(query);

      if (isDigits && query.length >= 10) {
        // Exact porsi search or blind index NIK search
        const nikHash = hashBlindIndex(query);
        where.OR = [
          { porsiNumber: { contains: query } },
          { fullName: { contains: query } },
          { nikHash },
        ];
      } else {
        where.OR = [
          { fullName: { contains: query } },
          { porsiNumber: { contains: query } },
          { district: { contains: query } },
        ];
      }
    }

    const [total, records] = await Promise.all([
      prisma.jamaah.count({ where }),
      prisma.jamaah.findMany({
        where,
        include: {
          region: { select: { id: true, name: true, code: true } },
          readinessScore: true,
        },
        orderBy: [{ isPriorityElderly: 'desc' }, { fullName: 'asc' }],
        skip,
        take: pageSize,
      }),
    ]);

    // Format and auto-mask sensitive fields for safe presentation
    const items = records.map((j) => {
      const decryptedNik = decryptData(j.nikEncrypted);
      const decryptedPhone = decryptData(j.phoneEncrypted || '');

      return {
        id: j.id,
        porsiNumber: j.porsiNumber,
        fullName: j.fullName,
        nikMasked: maskNik(decryptedNik),
        phoneMasked: maskPhone(decryptedPhone),
        gender: j.gender,
        birthDate: j.birthDate,
        birthPlace: j.birthPlace,
        district: j.district || '-',
        status: j.status,
        dataSource: j.dataSource,
        isPriorityElderly: j.isPriorityElderly,
        elderlyAge: j.elderlyAge,
        region: j.region,
        readiness: j.readinessScore
          ? {
              score: j.readinessScore.totalScore,
              category: j.readinessScore.category,
              lastCalculatedAt: j.readinessScore.lastCalculatedAt,
            }
          : {
              score: 0,
              category: 'PRIORITAS',
              lastCalculatedAt: j.createdAt,
            },
      };
    });

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

  /**
   * Get comprehensive Jamaah 360° Profile with RLA validation
   */
  public static async getJamaah360(
    jamaahId: string,
    session: UserSessionPayload,
    unmask = false,
    ipAddress?: string
  ) {
    const jamaah = await prisma.jamaah.findUnique({
      where: { id: jamaahId },
      include: {
        region: true,
        season: true,
        readinessScore: true,
        documents: {
          include: {
            documentType: true,
            verifications: {
              orderBy: { createdAt: 'desc' },
              include: { verifiedBy: { select: { fullName: true, username: true } } },
            },
          },
          orderBy: { documentType: { sortOrder: 'asc' } },
        },
        administrationRecords: {
          include: {
            verifiedBy: { select: { fullName: true, username: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        healthRecords: {
          orderBy: { createdAt: 'asc' },
        },
        manasikAttendances: {
          include: {
            event: true,
            verifiedBy: { select: { fullName: true, username: true } },
          },
          orderBy: { event: { sessionNumber: 'asc' } },
        },
        kloterMembership: {
          include: {
            kloter: true,
            group: true,
          },
        },
        actionItems: {
          include: {
            assignedTo: { select: { fullName: true, username: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        warningEvents: {
          include: {
            rule: true,
          },
          orderBy: { detectedAt: 'desc' },
        },
      },
    });

    if (!jamaah || jamaah.deletedAt) {
      throw new Error('Data jamaah tidak ditemukan');
    }

    // Enforce Row-Level Authorization
    const canAccess = canAccessJamaahRecord(session, {
      regionId: jamaah.regionId,
      userId: jamaah.userId,
    });

    if (!canAccess) {
      throw new Error('AKSES DITOLAK: Anda tidak berwenang mengakses data jamaah wilayah ini.');
    }

    const decryptedNik = decryptData(jamaah.nikEncrypted);
    const decryptedKk = decryptData(jamaah.kkNumberEncrypted || '');
    const decryptedPhone = decryptData(jamaah.phoneEncrypted || '');

    const hasUnmaskPrivilege = canUnmaskSensitiveData(session, jamaah.regionId);
    const shouldUnmask = unmask && hasUnmaskPrivilege;

    if (shouldUnmask) {
      // Audit unmasking event per UU PDP compliance
      await AuditService.log({
        actorId: session.userId,
        actorUsername: session.username,
        actorRole: session.roles[0],
        action: 'UNMASK',
        module: 'JAMAAH',
        recordId: jamaah.id,
        ipAddress,
        dataSource: 'INTERNAL',
      });
    }

    let parsedBreakdown: Record<string, unknown> = {};
    if (jamaah.readinessScore?.componentBreakdown) {
      try {
        parsedBreakdown = JSON.parse(jamaah.readinessScore.componentBreakdown);
      } catch {
        parsedBreakdown = {};
      }
    }

    return {
      id: jamaah.id,
      porsiNumber: jamaah.porsiNumber,
      fullName: jamaah.fullName,
      nik: shouldUnmask ? decryptedNik : maskNik(decryptedNik),
      kk: shouldUnmask ? decryptedKk : maskKk(decryptedKk),
      phone: shouldUnmask ? decryptedPhone : maskPhone(decryptedPhone),
      isUnmasked: shouldUnmask,
      canUnmask: hasUnmaskPrivilege,
      birthPlace: jamaah.birthPlace,
      birthDate: jamaah.birthDate,
      gender: jamaah.gender,
      maritalStatus: jamaah.maritalStatus,
      address: jamaah.address,
      district: jamaah.district,
      subDistrict: jamaah.subDistrict,
      postalCode: jamaah.postalCode,
      bloodType: jamaah.bloodType,
      occupation: jamaah.occupation,
      registrationYear: jamaah.registrationYear,
      estimatedDepartureYear: jamaah.estimatedDepartureYear,
      status: jamaah.status,
      dataSource: jamaah.dataSource,
      isPriorityElderly: jamaah.isPriorityElderly,
      elderlyAge: jamaah.elderlyAge,
      region: jamaah.region,
      season: jamaah.season,
      readiness: {
        score: jamaah.readinessScore?.totalScore ?? 0,
        category: jamaah.readinessScore?.category ?? 'PRIORITAS',
        breakdown: parsedBreakdown,
        lastCalculatedAt: jamaah.readinessScore?.lastCalculatedAt,
      },
      documents: jamaah.documents,
      administrationRecords: jamaah.administrationRecords,
      healthRecords: jamaah.healthRecords,
      manasikAttendances: jamaah.manasikAttendances,
      kloterMembership: jamaah.kloterMembership,
      actionItems: jamaah.actionItems,
      warningEvents: jamaah.warningEvents,
    };
  }

  /**
   * Create new Jamaah with encryption, blind indexing, readiness recalculation, and audit logging
   */
  public static async createJamaah(
    data: {
      seasonId: string;
      regionId: string;
      porsiNumber: string;
      nik: string;
      kkNumber?: string;
      fullName: string;
      birthPlace: string;
      birthDate: string | Date;
      gender: 'MALE' | 'FEMALE';
      maritalStatus?: string;
      address: string;
      district?: string;
      subDistrict?: string;
      postalCode?: string;
      phone?: string;
      bloodType?: string;
      occupation?: string;
      registrationYear: number;
      estimatedDepartureYear?: number;
      status?: string;
      dataSource?: string;
    },
    session: UserSessionPayload,
    ipAddress?: string
  ) {
    // Enforce region scope for Region Admin
    if (session.roles.includes('REGION_ADMIN') && session.regionId !== data.regionId) {
      throw new Error('AKSES DITOLAK: Anda hanya dapat menambahkan jamaah pada wilayah kerja Anda.');
    }

    const nikEncrypted = encryptData(data.nik);
    const nikHash = hashBlindIndex(data.nik);
    const kkNumberEncrypted = data.kkNumber ? encryptData(data.kkNumber) : null;
    const phoneEncrypted = data.phone ? encryptData(data.phone) : null;

    const birthDateObj = new Date(data.birthDate);
    const age = new Date().getFullYear() - birthDateObj.getFullYear();
    const isPriorityElderly = age >= 65;

    const created = await prisma.jamaah.create({
      data: {
        seasonId: data.seasonId,
        regionId: data.regionId,
        porsiNumber: data.porsiNumber,
        nikEncrypted,
        nikHash,
        kkNumberEncrypted,
        fullName: data.fullName,
        birthPlace: data.birthPlace,
        birthDate: birthDateObj,
        gender: data.gender,
        maritalStatus: data.maritalStatus || 'MARRIED',
        address: data.address,
        district: data.district,
        subDistrict: data.subDistrict,
        postalCode: data.postalCode,
        phoneEncrypted,
        bloodType: data.bloodType,
        occupation: data.occupation,
        registrationYear: data.registrationYear,
        estimatedDepartureYear: data.estimatedDepartureYear,
        status: data.status || 'TERDAFTAR',
        dataSource: data.dataSource || 'INTERNAL',
        isPriorityElderly,
        elderlyAge: isPriorityElderly ? age : null,
      },
    });

    // Automatically trigger initial readiness calculation
    await ReadinessService.recalculateJamaah(created.id);

    // Audit trail record
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'CREATE',
      module: 'JAMAAH',
      recordId: created.id,
      afterState: { porsiNumber: created.porsiNumber, fullName: created.fullName },
      ipAddress,
      dataSource: (data.dataSource as 'INTERNAL' | 'DEMO' | 'SYSTEM') || 'INTERNAL',
    });

    return created;
  }
}
