import crypto from 'node:crypto';
import { argon2id } from 'hash-wasm';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard for AES-GCM
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  return Buffer.from(hexKey, 'hex');
}

function getBlindIndexSalt(): string {
  return process.env.BLIND_INDEX_SALT || 'siap-haji-papua-salt-default-2026';
}

/**
 * Encrypt plaintext using AES-256-GCM with authenticated tag
 */
export function encryptData(plaintext: string): string {
  if (!plaintext) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  // Return serialized string: iv:tag:ciphertext
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM encrypted payload
 */
export function decryptData(encryptedPayload: string): string {
  if (!encryptedPayload) return '';
  try {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) {
      return encryptedPayload; // Not in encrypted format
    }
    const [ivHex, tagHex, cipherHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '[ENCRYPTED_DATA]';
  }
}

/**
 * Deterministic blind indexing via HMAC-SHA256 for searching encrypted fields (e.g. NIK)
 */
export function hashBlindIndex(value: string): string {
  if (!value) return '';
  const clean = value.trim().toLowerCase();
  return crypto.createHmac('sha256', getBlindIndexSalt()).update(clean).digest('hex');
}

/**
 * Hash password using Argon2id (RFC 9106)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  try {
    const hash = await argon2id({
      password,
      salt,
      parallelism: 1,
      iterations: 3,
      memorySize: 4096, // 4MB for high security without stalling
      hashLength: 32,
      outputType: 'encoded',
    });
    return hash;
  } catch {
    // Fallback to secure scrypt if wasm fails
    const derivedKey = crypto.scryptSync(password, salt, 32);
    return `scrypt$${salt.toString('hex')}$${derivedKey.toString('hex')}`;
  }
}

/**
 * Verify password against stored hash (supports Argon2id and scrypt fallback)
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  if (storedHash.startsWith('$argon2id$')) {
    try {
      const parts = storedHash.split('$');
      // Format: $argon2id$v=19$m=4096,t=3,p=1$salt$hash
      const saltB64 = parts[4];
      const salt = Buffer.from(saltB64, 'base64');
      const testHash = await argon2id({
        password,
        salt,
        parallelism: 1,
        iterations: 3,
        memorySize: 4096,
        hashLength: 32,
        outputType: 'encoded',
      });
      return testHash === storedHash;
    } catch {
      return false;
    }
  }

  if (storedHash.startsWith('scrypt$')) {
    const [, saltHex, keyHex] = storedHash.split('$');
    const salt = Buffer.from(saltHex, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 32);
    return crypto.timingSafeEqual(Buffer.from(keyHex, 'hex'), derivedKey);
  }

  // Plaintext comparison for initial migration safety only
  return password === storedHash;
}
