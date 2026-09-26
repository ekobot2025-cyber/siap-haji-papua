import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { ActionCenterService } from '@/application/services/action-center.service';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  try {
    const stats = await ActionCenterService.getStats(session);
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
