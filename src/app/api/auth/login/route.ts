import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/application/services/auth.service';
import { AUTH_COOKIE_NAME } from '@/infrastructure/security/jwt';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Username atau email minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// In-memory rate limiting map for authentication
const loginAttemptsMap = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 10;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // 1. Rate Limiting Check
  const now = Date.now();
  const clientAttempts = loginAttemptsMap.get(ip);
  if (clientAttempts) {
    if (now - clientAttempts.lastAttempt < RATE_LIMIT_WINDOW_MS) {
      if (clientAttempts.count >= MAX_ATTEMPTS_PER_WINDOW) {
        return NextResponse.json(
          { success: false, message: 'Terlalu banyak percobaan login. Silakan tunggu 1 menit.' },
          { status: 429 }
        );
      }
      clientAttempts.count++;
      clientAttempts.lastAttempt = now;
    } else {
      loginAttemptsMap.set(ip, { count: 1, lastAttempt: now });
    }
  } else {
    loginAttemptsMap.set(ip, { count: 1, lastAttempt: now });
  }

  // 2. Validate input schema
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Data input tidak valid' },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;

    // 3. Authenticate user
    const { token, session } = await AuthService.login(identifier, password, ip, userAgent);

    // 4. Set Secure HTTP-Only Cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: session.userId,
          username: session.username,
          fullName: session.fullName,
          email: session.email,
          roles: session.roles,
          regionId: session.regionId,
          regionName: session.regionName,
        },
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Terjadi kesalahan autentikasi internal';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 401 }
    );
  }
}
