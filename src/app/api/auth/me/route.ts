import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Tidak terotentikasi' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: session.userId,
        username: session.username,
        email: session.email,
        fullName: session.fullName,
        roles: session.roles,
        regionId: session.regionId,
        regionName: session.regionName,
      },
    },
  });
}
