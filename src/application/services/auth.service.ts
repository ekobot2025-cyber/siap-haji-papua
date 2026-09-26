import { prisma } from '@/infrastructure/database/prisma.client';
import { verifyPassword } from '@/infrastructure/security/crypto';
import { signSessionToken, type UserSessionPayload } from '@/infrastructure/security/jwt';
import { AuditService } from './audit.service';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export class AuthService {
  /**
   * Authenticate user with password verification, lockout protection, and audit logging
   */
  public static async login(
    identifier: string, // username or email
    passwordPlain: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ token: string; session: UserSessionPayload }> {
    const cleanId = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanId }, { email: cleanId }],
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        region: true,
      },
    });

    if (!user) {
      await AuditService.log({
        actorUsername: identifier,
        actorRole: 'UNKNOWN',
        action: 'FAILED_LOGIN',
        module: 'AUTH',
        ipAddress,
        userAgent,
        afterState: { reason: 'User not found' },
      });
      throw new Error('Kredensial tidak valid. Silakan periksa kembali username dan password.');
    }

    // Check account active state
    if (!user.isActive) {
      throw new Error('Akun Anda dinonaktifkan. Silakan hubungi Administrator.');
    }

    // Check lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      throw new Error(`Akun terkunci sementara karena beberapa kali gagal login. Silakan coba lagi dalam ${waitMinutes} menit.`);
    }

    // Verify password hash
    const isValid = await verifyPassword(passwordPlain, user.passwordHash);

    if (!isValid) {
      const newFailedCount = user.failedLoginAttempts + 1;
      const willLock = newFailedCount >= MAX_FAILED_ATTEMPTS;
      const lockoutUntil = willLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedCount,
          lockoutUntil,
        },
      });

      await AuditService.log({
        actorId: user.id,
        actorUsername: user.username,
        actorRole: user.roles[0]?.role.code || 'UNKNOWN',
        action: 'FAILED_LOGIN',
        module: 'AUTH',
        ipAddress,
        userAgent,
        afterState: { failedAttempts: newFailedCount, lockedOut: willLock },
      });

      throw new Error('Kredensial tidak valid. Silakan periksa kembali username dan password.');
    }

    // Reset failed count and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const roleCodes = user.roles.map((r) => r.role.code);
    const sessionPayload: UserSessionPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roles: roleCodes,
      regionId: user.regionId,
      regionName: user.region?.name || null,
    };

    const token = await signSessionToken(sessionPayload);

    await AuditService.log({
      actorId: user.id,
      actorUsername: user.username,
      actorRole: roleCodes[0] || 'USER',
      action: 'LOGIN',
      module: 'AUTH',
      ipAddress,
      userAgent,
      afterState: { loginSuccess: true },
    });

    return { token, session: sessionPayload };
  }

  /**
   * Handle user logout audit
   */
  public static async logout(session: UserSessionPayload, ipAddress?: string): Promise<void> {
    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'LOGOUT',
      module: 'AUTH',
      ipAddress,
    });
  }
}
