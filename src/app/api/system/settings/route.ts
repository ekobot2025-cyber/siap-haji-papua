import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { SettingsService } from '@/application/services/settings.service';

export async function GET() {
  const config = await SettingsService.getAppConfig();
  return NextResponse.json({
    success: true,
    data: config,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  if (!session.roles.includes('SUPER_ADMIN')) {
    return NextResponse.json(
      { success: false, message: 'AKSES DITOLAK: Hanya Super Admin yang berwenang mengubah konfigurasi sistem' },
      { status: 403 }
    );
  }

  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof value !== 'string') {
      return NextResponse.json({ success: false, message: 'Parameter key dan value wajib diisi' }, { status: 400 });
    }

    await SettingsService.updateSetting(key, value, session, ip);

    return NextResponse.json({
      success: true,
      message: `Pengaturan ${key} berhasil diperbarui`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal memperbarui pengaturan';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
