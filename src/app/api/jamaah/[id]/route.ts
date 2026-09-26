import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { JamaahService } from '@/application/services/jamaah.service';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const unmask = searchParams.get('unmask') === 'true';
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  try {
    const data = await JamaahService.getJamaah360(id, session, unmask, ip);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal mengambil data profil jamaah';
    const status = errMessage.includes('AKSES DITOLAK') ? 403 : 404;
    return NextResponse.json({ success: false, message: errMessage }, { status });
  }
}
