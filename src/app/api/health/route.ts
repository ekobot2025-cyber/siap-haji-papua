import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { HealthService } from '@/application/services/health.service';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const regionId = searchParams.get('regionId') || undefined;
  const checkupStage = searchParams.get('checkupStage') || undefined;
  const istithaahStatus = searchParams.get('istithaahStatus') || undefined;
  const administrativeStatus = searchParams.get('administrativeStatus') || undefined;
  const jamaahId = searchParams.get('jamaahId') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const result = await HealthService.listRecords(
      { search, regionId, checkupStage, istithaahStatus, administrativeStatus, jamaahId, page, limit },
      session
    );
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
