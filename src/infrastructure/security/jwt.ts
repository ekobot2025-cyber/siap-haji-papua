import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'siap_haji_session';
const JWT_EXPIRES_IN = '8h';

export interface UserSessionPayload {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  regionId: string | null;
  regionName?: string | null;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.APP_SECRET || 'siap-haji-papua-fallback-jwt-secret-key-32-chars';
  return new TextEncoder().encode(secret);
}

/**
 * Sign JWT session token with embedded roles and region scope
 */
export async function signSessionToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(getJwtSecret());
}

/**
 * Verify JWT session token and return typed payload
 */
export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const verified = await jwtVerify(token, getJwtSecret());
    return verified.payload as unknown as UserSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Extract active user session from server cookies or request header
 */
export async function getServerSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Extract session from NextRequest (for API route middleware/handlers)
 */
export async function getSessionFromRequest(request: NextRequest): Promise<UserSessionPayload | null> {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    return verifySessionToken(cookieToken);
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7);
    return verifySessionToken(bearerToken);
  }

  return null;
}
