import { scrypt, randomBytes, timingSafeEqual, type ScryptOptions } from 'node:crypto';

/** Hash de contraseñas con scrypt (memoria-dura, resistente a GPU). Formato: scrypt$N$r$p$salt$hash */

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 32;

function scryptAsync(password: string, salt: Buffer, keylen: number, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  try {
    const expected = Buffer.from(hashB64, 'base64');
    const actual = await scryptAsync(password, Buffer.from(saltB64, 'base64'), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

const COMMON = new Set([
  '123456', '1234567', '12345678', '123456789', '1234567890', 'password', 'contraseña', 'qwerty',
  'iencinas', 'iencinas123', 'admin123', 'abc123', '111111', '000000',
]);

/** Devuelve un mensaje de error si la contraseña no cumple la política, o null si es válida. */
export function validatePasswordPolicy(pw: unknown): string | null {
  if (typeof pw !== 'string') return 'La contraseña es obligatoria.';
  if (pw.length < 10) return 'La contraseña debe tener al menos 10 caracteres.';
  if (pw.length > 128) return 'La contraseña es demasiado larga (máximo 128 caracteres).';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'La contraseña debe combinar letras y números.';
  if (COMMON.has(pw.toLowerCase())) return 'Esa contraseña es demasiado común. Elige otra.';
  return null;
}
