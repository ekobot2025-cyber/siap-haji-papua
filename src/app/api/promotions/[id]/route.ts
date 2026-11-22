import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { PromotionService } from '@/application/services/promotion.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slide = await PromotionService.getById(id);

    if (!slide) {
      return NextResponse.json(
        { success: false, message: 'Media promosi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: slide });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Autentikasi diperlukan' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    if (body.action === 'toggle') {
      const updated = await PromotionService.toggleActive(id);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: 'Item promosi tidak ditemukan' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `Status publikasi berhasil diubah (${updated.isActive ? 'Tayang' : 'Nonaktif'})`,
        data: updated,
      });
    }

    // Normal partial update
    const updated = await PromotionService.saveSlide({ ...body, id }, session);
    return NextResponse.json({
      success: true,
      message: 'Media promosi berhasil diperbarui',
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui item';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Autentikasi diperlukan' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const deleted = await PromotionService.deleteSlide(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Item promosi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Media promosi berhasil dihapus',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus item';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
