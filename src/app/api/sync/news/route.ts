import { NextRequest, NextResponse } from 'next/server';
import { NewsSyncService } from '@/infrastructure/services/news-sync.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const lastSync = await NewsSyncService.getLastSyncTime();
    const availablePool = NewsSyncService.getOfficialNewsPool();

    return NextResponse.json({
      success: true,
      lastSync,
      totalAvailable: availablePool.length,
      source: 'papua.haji.go.id & haji.go.id',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal mengambil status sync berita',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await NewsSyncService.syncOfficialNews();
    return NextResponse.json({
      success: true,
      message: `Berhasil menyinkronkan ${result.syncedCount} berita resmi dari papua.haji.go.id & haji.go.id ke Layar TV & Web.`,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal menyinkronkan berita resmi',
      },
      { status: 500 }
    );
  }
}
