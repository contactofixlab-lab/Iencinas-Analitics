/**
 * Sesión firmada (HMAC-SHA256). Usa Web Crypto, por lo que funciona tanto en el
 * middleware (Edge) como en las rutas API (Node). La cookie es HttpOnly: el
 * JavaScript del navegador nunca puede leerla, y cualquier alteración invalida la firma.
 */

export const SESSION_COOKIE = 'iencinas_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

export interface SessionPayload {
  uid: string;
  role: string;
  /** Versión del token del usuario: subirla invalida todas sus sesiones. */
  tv: number;
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-insecure-secret-do-not-use-in-production-0000';
  }
  return null;
}

function toB64Url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(str: string) {
  const pad = str.length % 4 ? '='.repeat(4 - (str.length % 4)) : '';
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hmacKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, usage);
}

export function isAuthConfigured(): boolean {
  return getSecret() !== null;
}

export async function signSession(
  data: Pick<SessionPayload, 'uid' | 'role' | 'tv'>,
  ttlSeconds = SESSION_TTL_SECONDS,
): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error('AUTH_SECRET no está configurado (mínimo 32 caracteres).');
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { ...data, iat: now, exp: now + ttlSeconds };
  const body = toB64Url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(body)));
  return `${body}.${toB64Url(sig)}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || token.length > 2048) return null;
  const secret = getSecret();
  if (!secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  try {
    const key = await hmacKey(secret, ['verify']);
    // crypto.subtle.verify compara en tiempo constante.
    const valid = await crypto.subtle.verify('HMAC', key, fromB64Url(parts[1]), encoder.encode(parts[0]));
    if (!valid) return null;
    const payload = JSON.parse(decoder.decode(fromB64Url(parts[0]))) as SessionPayload;
    if (
      typeof payload.uid !== 'string' ||
      typeof payload.role !== 'string' ||
      typeof payload.tv !== 'number' ||
      typeof payload.exp !== 'number' ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}
