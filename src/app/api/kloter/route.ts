import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { KloterService } from '@/application/services/kloter.service';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get('seasonId') || undefined;

  try {
    const kloters = await KloterService.listKloters(seasonId);
    return NextResponse.json({ success: true, data: kloters });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
