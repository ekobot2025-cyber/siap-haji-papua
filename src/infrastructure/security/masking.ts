/**
 * Auto-masking utilities for personal sensitive data (UU PDP compliant)
 */

export function maskNik(nik?: string | null): string {
  if (!nik) return '-';
  const clean = nik.replace(/\s+/g, '');
  if (clean.length < 8) return '********';
  // Keep first 6 digits (province/reg/dist) and last 4 digits, mask middle
  const prefix = clean.slice(0, 6);
  const suffix = clean.slice(-4);
  const maskedLength = Math.max(2, clean.length - 10);
  return `${prefix}${'*'.repeat(maskedLength)}${suffix}`;
}

export function maskKk(kk?: string | null): string {
  if (!kk) return '-';
  const clean = kk.replace(/\s+/g, '');
  if (clean.length < 8) return '********';
  const prefix = clean.slice(0, 6);
  const suffix = clean.slice(-3);
  return `${prefix}${'*'.repeat(clean.length - 9)}${suffix}`;
}

export function maskPhone(phone?: string | null): string {
  if (!phone) return '-';
  const clean = phone.replace(/[^0-9+]/g, '');
  if (clean.length < 7) return '***-***';
  const prefix = clean.slice(0, 4);
  const suffix = clean.slice(-3);
  return `${prefix}-****-${suffix}`;
}

export function maskPorsi(porsi?: string | null): string {
  if (!porsi) return '-';
  const clean = porsi.trim();
  if (clean.length <= 4) return clean;
  // E.g. 2700192841 -> 2700****41
  return `${clean.slice(0, 4)}****${clean.slice(-2)}`;
}
