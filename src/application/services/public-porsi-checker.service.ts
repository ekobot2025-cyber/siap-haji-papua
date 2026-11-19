import { prisma } from '@/infrastructure/database/prisma.client';
import {
  SatuHajiPublicAdapter,
  type SatuHajiPublicPorsiData,
} from '@/infrastructure/adapters/satu-haji-public.adapter';
import { ReadinessService } from './readiness.service';
import { AuditService } from './audit.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';
import { maskNik, maskPhone } from '@/infrastructure/security/masking';
import { decryptData } from '@/infrastructure/security/crypto';

export interface CheckPorsiResult {
  porsiNumber: string;
  publicData: SatuHajiPublicPorsiData;
  localRecord: {
    isRegisteredInPapua: boolean;
    jamaahId?: string;
    fullName?: string;
    nikMasked?: string;
    phoneMasked?: string;
    regionName?: string;
    currentReadinessScore?: number;
    currentReadinessCategory?: string;
    localBpihStatus?: string;
    isAlreadySyncedWithSatuHaji?: boolean;
    lastUpdated?: Date;
  };
  comparison: {
    hasDataMismatch: boolean;
    needsBpihUpdate: boolean;
    needsYearUpdate: boolean;
    recommendation: string;
  };
}

export interface BatchSyncOptions {
  regionId?: string;
  limit?: number;
  delayMs?: number;
  seasonId?: string;
}

export interface BatchSyncResult {
  totalProcessed: number;
  updatedCount: number;
  alreadySyncedCount: number;
  bpihLunasCount: number;
  errors: Array<{ porsiNumber: string; error: string }>;
  details: Array<{
    porsiNumber: string;
    fullName: string;
    regionName: string;
    bpihStatus: string;
    readinessScore: number;
    isUpdated: boolean;
  }>;
}

export interface SyncStatistics {
  totalJamaah: number;
  verifiedSatuHajiCount: number;
  unverifiedCount: number;
  bpihSettledCount: number;
  syncCoveragePercentage: number;
  regionsBreakdown: Array<{
    regionId: string;
    regionName: string;
    regionCode: string;
    totalJamaah: number;
    verifiedSatuHaji: number;
    coveragePercent: number;
  }>;
}

export class PublicPorsiCheckerService {
  /**
   * Cek data porsi dari sumber publik Satu Haji / SISKOHAT
   * dan sandingkan secara cerdas dengan data lokal Papua.
   */
  public static async checkPublicPorsi(porsiNumber: string): Promise<CheckPorsiResult> {
    const cleanPorsi = porsiNumber.replace(/\D/g, '');
    if (cleanPorsi.length !== 10) {
      throw new Error('Nomor Porsi harus tepat 10 digit angka.');
    }

    // 1. Ambil data dari adapter publik Satu Haji
    const publicData = await SatuHajiPublicAdapter.fetchPorsi(cleanPorsi);

    // 2. Cari apakah jamaah sudah tercatat di basis data lokal Papua
    const localJamaah = await prisma.jamaah.findUnique({
      where: { porsiNumber: cleanPorsi },
      include: {
        region: { select: { id: true, name: true, code: true } },
        readinessScore: true,
        administrationRecords: {
          where: { stageName: 'PELUNASAN_BPIH' },
          select: { status: true, amountPaid: true, updatedAt: true },
        },
      },
    });

    if (localJamaah && !localJamaah.deletedAt) {
      // Overwrite nama dari data lokal agar sesuai identitas asli jamaah Papua
      publicData.fullName = localJamaah.fullName;
      publicData.regencyName = localJamaah.region.name;

      const decryptedNik = decryptData(localJamaah.nikEncrypted);
      const decryptedPhone = decryptData(localJamaah.phoneEncrypted || '');

      const localBpih = localJamaah.administrationRecords[0]?.status || 'BELUM';
      const needsBpihUpdate = publicData.bpihStatus === 'LUNAS' && localBpih !== 'SELESAI';
      const needsYearUpdate = localJamaah.estimatedDepartureYear !== publicData.yearGregorian;
      const isAlreadySynced = localJamaah.dataSource === 'VERIFIED_SATU_HAJI';

      return {
        porsiNumber: cleanPorsi,
        publicData,
        localRecord: {
          isRegisteredInPapua: true,
          jamaahId: localJamaah.id,
          fullName: localJamaah.fullName,
          nikMasked: maskNik(decryptedNik),
          phoneMasked: maskPhone(decryptedPhone),
          regionName: localJamaah.region.name,
          currentReadinessScore: localJamaah.readinessScore?.totalScore || 0,
          currentReadinessCategory: localJamaah.readinessScore?.category || 'DALAM_PROSES',
          localBpihStatus: localBpih,
          isAlreadySyncedWithSatuHaji: isAlreadySynced,
          lastUpdated: localJamaah.updatedAt,
        },
        comparison: {
          hasDataMismatch: needsBpihUpdate || needsYearUpdate,
          needsBpihUpdate,
          needsYearUpdate,
          recommendation: needsBpihUpdate
            ? 'Status di Satu Haji sudah LUNAS. Disarankan sinkronisasi data untuk menaikkan skor kesiapan jamaah.'
            : isAlreadySynced
            ? 'Data lokal sudah tersinkronisasi penuh dengan catatan publik Satu Haji.'
            : 'Data konsisten. Anda dapat menandai verifikasi resmi Satu Haji.',
        },
      };
    }

    // Jika belum ada di basis data lokal Papua
    return {
      porsiNumber: cleanPorsi,
      publicData,
      localRecord: {
        isRegisteredInPapua: false,
      },
      comparison: {
        hasDataMismatch: true,
        needsBpihUpdate: false,
        needsYearUpdate: false,
        recommendation:
          'Nomor porsi valid di database publik Satu Haji, namun belum terdaftar di basis data Papua. Gunakan fitur Tambah Jamaah jika ingin mengimpor.',
      },
    };
  }

  /**
   * Sinkronisasi data satu jamaah dari sumber publik Satu Haji ke database lokal Papua.
   * Mengupdate status pelunasan BPIH, tahun keberangkatan, dan menghitung ulang skor kesiapan.
   */
  public static async syncSingleJamaah(
    porsiNumber: string,
    session?: UserSessionPayload
  ): Promise<{
    success: boolean;
    message: string;
    jamaahId: string;
    updatedFields: string[];
    newReadinessScore: number;
    publicData: SatuHajiPublicPorsiData;
  }> {
    const cleanPorsi = porsiNumber.replace(/\D/g, '');
    const checkResult = await this.checkPublicPorsi(cleanPorsi);

    if (!checkResult.localRecord.isRegisteredInPapua || !checkResult.localRecord.jamaahId) {
      throw new Error(
        `Nomor porsi ${cleanPorsi} tidak ditemukan di database haji Papua. Sinkronisasi hanya dapat dilakukan untuk jamaah Papua.`
      );
    }

    const jamaahId = checkResult.localRecord.jamaahId;
    const publicData = checkResult.publicData;
    const updatedFields: string[] = [];

    // Validasi Row-Level Security jika ada sesi pengguna
    if (session && session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      const jamaahCheck = await prisma.jamaah.findUnique({
        where: { id: jamaahId },
        select: { regionId: true },
      });
      if (jamaahCheck?.regionId !== session.regionId) {
        throw new Error('Akses ditolak: Jamaah bukan berada di bawah wilayah kewenangan Anda.');
      }
    }

    // 1. Update data pokok Jamaah (dataSource, estimatedDepartureYear)
    await prisma.jamaah.update({
      where: { id: jamaahId },
      data: {
        dataSource: 'VERIFIED_SATU_HAJI',
        estimatedDepartureYear: publicData.yearGregorian,
        status: publicData.bpihStatus === 'LUNAS' ? 'SIAP_BERANGKAT' : undefined,
      },
    });
    updatedFields.push('dataSource', 'estimatedDepartureYear');

    // 2. Update Catatan Administrasi Pelunasan BPIH
    const adminRecord = await prisma.administrationRecord.findFirst({
      where: {
        jamaahId,
        stageName: 'PELUNASAN_BPIH',
      },
    });

    if (adminRecord) {
      if (publicData.bpihStatus === 'LUNAS' && adminRecord.status !== 'SELESAI') {
        await prisma.administrationRecord.update({
          where: { id: adminRecord.id },
          data: {
            status: 'SELESAI',
            amountPaid: 58500000, // Biaya standar Embarkasi Makassar (UPG)
            paymentReference: `SATUHAJI-${cleanPorsi.slice(-6)}`,
            notes: `Terverifikasi otomatis via Satu Haji Portal Publik (Bank: ${publicData.bpsBank})`,
            completionDate: new Date(),
            verifiedById: session?.userId || null,
          },
        });
        updatedFields.push('administrationRecord:PELUNASAN_BPIH');
      }
    } else {
      // Buat record baru jika belum ada
      await prisma.administrationRecord.create({
        data: {
          jamaahId,
          stageName: 'PELUNASAN_BPIH',
          status: publicData.bpihStatus === 'LUNAS' ? 'SELESAI' : 'BELUM',
          amountPaid: publicData.bpihStatus === 'LUNAS' ? 58500000 : 0,
          paymentReference: `SATUHAJI-${cleanPorsi.slice(-6)}`,
          notes: `Dibuat via Sinkronisasi Satu Haji Publik (Bank: ${publicData.bpsBank})`,
          completionDate: publicData.bpihStatus === 'LUNAS' ? new Date() : null,
          verifiedById: session?.userId || null,
        },
      });
      updatedFields.push('administrationRecord:PELUNASAN_BPIH_CREATED');
    }

    // 3. Otomatis selesaikan Action Item kategori ADMINISTRASI jika ada kendala BPIH
    if (publicData.bpihStatus === 'LUNAS') {
      await prisma.actionItem.updateMany({
        where: {
          jamaahId,
          category: 'ADMINISTRASI',
          status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] },
        },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          notes: `Diselesaikan otomatis via Sinkronisasi Satu Haji Publik (${session?.username || 'Sistem'})`,
        },
      });
    }

    // 4. Hitung ulang skor kesiapan jamaah (Readiness Recalculation)
    const newScore = await ReadinessService.recalculateJamaah(jamaahId);

    // 5. Catat ke Audit Trail
    await AuditService.log({
      actorId: session?.userId || 'SYSTEM_SYNCHRONIZER',
      actorUsername: session?.username || 'satu_haji_sync_service',
      actorRole: session?.roles[0] || 'SYSTEM',
      action: 'UPDATE',
      module: 'ADMINISTRATION',
      recordId: jamaahId,
      dataSource: 'SYSTEM',
      afterState: {
        porsiNumber: cleanPorsi,
        source: 'PORTAL_PUBLIK_SATU_HAJI',
        bpihStatus: publicData.bpihStatus,
        newScore: newScore.totalScore,
      },
    });

    return {
      success: true,
      message: `Porsi ${cleanPorsi} berhasil disinkronkan dengan data publik Satu Haji. Skor kesiapan kini ${newScore.totalScore}%.`,
      jamaahId,
      updatedFields,
      newReadinessScore: newScore.totalScore,
      publicData,
    };
  }

  /**
   * Batch Synchronization berjadwal untuk jamaah Papua
   * Menerapkan jeda waktu (ethical throttling) agar aman dan tidak membebani server kementerian.
   */
  public static async batchSyncPapuaJamaah(
    options: BatchSyncOptions = {},
    session?: UserSessionPayload
  ): Promise<BatchSyncResult> {
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const delayMs = options.delayMs || 300;

    const where: any = {
      deletedAt: null,
    };

    if (options.regionId) {
      where.regionId = options.regionId;
    } else if (session?.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN')) {
      where.regionId = session.regionId;
    }

    if (options.seasonId) {
      where.seasonId = options.seasonId;
    }

    const jamaahList = await prisma.jamaah.findMany({
      where,
      select: {
        id: true,
        porsiNumber: true,
        fullName: true,
        dataSource: true,
        region: { select: { name: true } },
      },
      take: limit,
      orderBy: { updatedAt: 'asc' }, // Prioritaskan yang paling lama belum diupdate
    });

    let updatedCount = 0;
    let alreadySyncedCount = 0;
    let bpihLunasCount = 0;
    const errors: Array<{ porsiNumber: string; error: string }> = [];
    const details: BatchSyncResult['details'] = [];

    for (const j of jamaahList) {
      try {
        const syncResult = await this.syncSingleJamaah(j.porsiNumber, session);

        if (syncResult.publicData.bpihStatus === 'LUNAS') {
          bpihLunasCount++;
        }

        if (j.dataSource === 'VERIFIED_SATU_HAJI' && syncResult.updatedFields.length === 0) {
          alreadySyncedCount++;
        } else {
          updatedCount++;
        }

        details.push({
          porsiNumber: j.porsiNumber,
          fullName: j.fullName,
          regionName: j.region.name,
          bpihStatus: syncResult.publicData.bpihStatus,
          readinessScore: syncResult.newReadinessScore,
          isUpdated: syncResult.updatedFields.length > 0,
        });

        // Ethical delay antar-request
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (err: any) {
        errors.push({
          porsiNumber: j.porsiNumber,
          error: err.message || 'Gagal sinkronisasi',
        });
      }
    }

    return {
      totalProcessed: jamaahList.length,
      updatedCount,
      alreadySyncedCount,
      bpihLunasCount,
      errors,
      details,
    };
  }

  /**
   * Menghitung statistik sinkronisasi data publik Satu Haji untuk Dashboard Komando
   */
  public static async getSyncStatistics(seasonId?: string): Promise<SyncStatistics> {
    const where: any = { deletedAt: null };
    if (seasonId) {
      where.seasonId = seasonId;
    }

    const [totalJamaah, verifiedCount, bpihSettledCount, regions] = await Promise.all([
      prisma.jamaah.count({ where }),
      prisma.jamaah.count({
        where: {
          ...where,
          dataSource: 'VERIFIED_SATU_HAJI',
        },
      }),
      prisma.administrationRecord.count({
        where: {
          stageName: 'PELUNASAN_BPIH',
          status: 'SELESAI',
          jamaah: where,
        },
      }),
      prisma.region.findMany({
        where: { isActive: true },
        include: {
          jamaah: {
            where,
            select: { id: true, dataSource: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    const regionsBreakdown = regions.map((r: { id: string; name: string; code: string; jamaah: Array<{ id: string; dataSource: string }> }) => {
      const regTotal = r.jamaah.length;
      const regVerified = r.jamaah.filter((j: { id: string; dataSource: string }) => j.dataSource === 'VERIFIED_SATU_HAJI').length;
      return {
        regionId: r.id,
        regionName: r.name,
        regionCode: r.code,
        totalJamaah: regTotal,
        verifiedSatuHaji: regVerified,
        coveragePercent: regTotal > 0 ? Math.round((regVerified / regTotal) * 100) : 0,
      };
    });

    const syncCoveragePercentage =
      totalJamaah > 0 ? Math.round((verifiedCount / totalJamaah) * 100) : 0;

    return {
      totalJamaah,
      verifiedSatuHajiCount: verifiedCount,
      unverifiedCount: totalJamaah - verifiedCount,
      bpihSettledCount,
      syncCoveragePercentage,
      regionsBreakdown,
    };
  }
}
