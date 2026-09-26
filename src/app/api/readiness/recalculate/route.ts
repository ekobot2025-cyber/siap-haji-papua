import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { ReadinessService } from '@/application/services/readiness.service';
import { prisma } from '@/infrastructure/database/prisma.client';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  // Recalculation privilege restricted to administrators
  const isAuthorized = session.roles.some((r) => ['SUPER_ADMIN', 'PROV_ADMIN', 'REGION_ADMIN'].includes(r));
  if (!isAuthorized) {
    return NextResponse.json({ success: false, message: 'AKSES DITOLAK: Tidak memiliki wewenang kalkulasi kesiapan' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { jamaahId, seasonId } = body;

    if (jamaahId) {
      const result = await ReadinessService.recalculateJamaah(jamaahId);
      return NextResponse.json({
        success: true,
        message: 'Kalkulasi kesiapan jamaah berhasil diperbarui',
        data: result,
      });
    }

    // Default to active season batch recalculation
    let targetSeasonId = seasonId;
    if (!targetSeasonId) {
      const activeSeason = await prisma.hajjSeason.findFirst({ where: { isActive: true } });
      targetSeasonId = activeSeason?.id;
    }

    if (!targetSeasonId) {
      return NextResponse.json({ success: false, message: 'Musim haji aktif tidak ditemukan' }, { status: 400 });
    }

    const batchResult = await ReadinessService.recalculateAllInSeason(targetSeasonId, session);

    return NextResponse.json({
      success: true,
      message: `Batch recalculation selesai: ${batchResult.processedCount} jamaah diperbarui`,
      data: batchResult,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal mengeksekusi kalkulasi kesiapan';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
