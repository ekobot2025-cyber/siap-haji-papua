import type { UserSessionPayload } from './jwt';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  PROV_ADMIN: 'PROV_ADMIN',
  REGION_ADMIN: 'REGION_ADMIN',
  OFFICER: 'OFFICER',
  LEADER: 'LEADER',
  PETUGAS_KESEHATAN: 'PETUGAS_KESEHATAN',
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

/**
 * Check if the active session possesses any of the required roles
 */
export function hasRole(session: UserSessionPayload | null, requiredRoles: RoleCode | RoleCode[]): boolean {
  if (!session || !session.roles) return false;
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  // Super admin possesses all operational privileges
  if (session.roles.includes(ROLES.SUPER_ADMIN)) return true;
  return rolesArray.some((role) => session.roles.includes(role));
}

/**
 * Generates Prisma where clause for Row-Level Authorization based on user's geographic/unit scope.
 * CRITICAL SECURITY PRINCIPLE: Evaluated at the backend query layer, never solely in UI.
 */
export function getRowLevelRegionFilter(
  session: UserSessionPayload,
  requestedRegionId?: string | null
): { regionId?: string } | { id: 'FORBIDDEN_NO_ACCESS' } {
  // 1. Super Admin, Prov Admin, Executive Leader, and Petugas Kesehatan have provincial-wide scope
  if (
    session.roles.includes(ROLES.SUPER_ADMIN) ||
    session.roles.includes(ROLES.PROV_ADMIN) ||
    session.roles.includes(ROLES.LEADER) ||
    session.roles.includes(ROLES.PETUGAS_KESEHATAN)
  ) {
    if (requestedRegionId) {
      return { regionId: requestedRegionId };
    }
    return {}; // No geographic restriction (all regions)
  }

  // 2. Region Admin is strictly locked to their assigned regionId
  if (session.roles.includes(ROLES.REGION_ADMIN)) {
    if (!session.regionId) {
      // Misconfigured user with no region assigned: block all access
      return { id: 'FORBIDDEN_NO_ACCESS' };
    }
    return { regionId: session.regionId };
  }

  // 3. Officer default scoped to their assigned region
  if (session.roles.includes(ROLES.OFFICER) && session.regionId) {
    return { regionId: session.regionId };
  }

  // By default, if not authorized for regional data
  return { id: 'FORBIDDEN_NO_ACCESS' };
}

/**
 * Enforces row-level permission for accessing a specific single Jamaah record
 */
export function canAccessJamaahRecord(
  session: UserSessionPayload,
  record: { regionId: string; userId?: string | null }
): boolean {
  if (
    session.roles.includes(ROLES.SUPER_ADMIN) ||
    session.roles.includes(ROLES.PROV_ADMIN) ||
    session.roles.includes(ROLES.LEADER) ||
    session.roles.includes(ROLES.PETUGAS_KESEHATAN)
  ) {
    return true;
  }

  if (session.roles.includes(ROLES.REGION_ADMIN)) {
    return session.regionId === record.regionId;
  }

  if (session.roles.includes(ROLES.OFFICER)) {
    return session.regionId === record.regionId;
  }

  return false;
}

/**
 * Checks whether user has permission to unmask sensitive personal data (full NIK / Phone)
 */
export function canUnmaskSensitiveData(session: UserSessionPayload, targetRegionId?: string): boolean {
  if (session.roles.includes(ROLES.SUPER_ADMIN) || session.roles.includes(ROLES.PROV_ADMIN)) {
    return true;
  }

  if (session.roles.includes(ROLES.REGION_ADMIN)) {
    return session.regionId === targetRegionId;
  }

  return false;
}
