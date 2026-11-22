import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { PromotionService } from '@/application/services/promotion.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel') as 'ALL' | 'WEB' | 'TV' | null;
    const activeOnly = searchParams.get('active') !== 'false';

    const slides = await PromotionService.getAll({
      channel: channel || undefined,
      activeOnly,
    });

    return NextResponse.json({
      success: true,
      data: slides,
      total: slides.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat media promosi';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Autentikasi diperlukan untuk memperbarui konten promosi' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.judul || !body.ringkas) {
      return NextResponse.json(
        { success: false, message: 'Judul dan ringkasan informasi wajib diisi' },
        { status: 400 }
      );
    }

    const saved = await PromotionService.saveSlide(body, session);

    return NextResponse.json({
      success: true,
      message: 'Media promosi berhasil disimpan dan dipublikasikan',
      data: saved,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan media promosi';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
