import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { DashboardService } from '@/application/services/dashboard.service';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Autentikasi diperlukan untuk mengakses dashboard komando' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const regionId = searchParams.get('regionId') || undefined;

  try {
    const data = await DashboardService.getExecutiveData(session, regionId);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal memuat data dashboard';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
