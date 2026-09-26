import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { KloterService } from '@/application/services/kloter.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const detail = await KloterService.getKloterDetail(id);
    if (!detail) {
      return NextResponse.json({ success: false, message: 'Kloter tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: detail });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
