import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { DashboardService } from '@/application/services/dashboard.service';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  const { searchParams } = new URL(request.url);
  const regionId = searchParams.get('regionId') || undefined;

  try {
    const data = session
      ? await DashboardService.getExecutiveData(session, regionId)
      : await DashboardService.getPublicExecutiveData(regionId);

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
