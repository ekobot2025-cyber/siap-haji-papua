import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest, AUTH_COOKIE_NAME } from '@/infrastructure/security/jwt';
import { AuthService } from '@/application/services/auth.service';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  if (session) {
    await AuthService.logout(session, ip);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logout berhasil',
  });

  // Clear HTTP-Only session cookie
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
