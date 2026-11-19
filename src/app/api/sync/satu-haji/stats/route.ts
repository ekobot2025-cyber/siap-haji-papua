import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { PublicPorsiCheckerService } from '@/application/services/public-porsi-checker.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi diperlukan.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId') || undefined;

    const stats = await PublicPorsiCheckerService.getSyncStatistics(seasonId);

    return NextResponse.json({
      success: true,
      message: 'Statistik sinkronisasi data publik Satu Haji berhasil dimuat',
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Gagal memuat statistik sinkronisasi',
      },
      { status: 400 }
    );
  }
}
