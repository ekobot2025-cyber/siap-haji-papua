import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BerhakLunasService } from '@/application/services/berhak-lunas.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'summary';

    if (mode === 'summary') {
      const summary = BerhakLunasService.getSummary();
      return NextResponse.json({
        success: true,
        data: summary,
      });
    }

    const search = searchParams.get('search') || undefined;
    const kabKota = searchParams.get('kabKota') || undefined;
    const kategori = searchParams.get('kategori') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '15', 10);

    const result = BerhakLunasService.list({
      search,
      kabKota,
      kategori,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
