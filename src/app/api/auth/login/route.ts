import { NextRequest, NextResponse } from 'next/server';
import { ApiError, fail, readJson } from '@/lib/api/server';
import { assertSameOrigin, clientIp } from '@/lib/server/guard';
import { verifyPassword } from '@/lib/server/password';
import { clearFailures, registerFailure, retryAfterSeconds } from '@/lib/server/ratelimit';
import { SESSION_COOKIE, sessionCookieOptions, signSession } from '@/lib/server/session';
import { DUMMY_HASH, findByEmail, isLoginAllowed, toPublic } from '@/lib/server/users';
import { audit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_ACCOUNT = 5;
const MAX_PER_IP = 20;

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    const body = await readJson(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password || email.length > 254 || password.length > 128) {
      throw new ApiError(400, 'Ingresa tu correo y contraseña.');
    }

    const ip = clientIp(req);
    const accountKey = `login:${ip}:${email}`;
    const ipKey = `login-ip:${ip}`;
    const wait = Math.max(
      retryAfterSeconds(accountKey, MAX_PER_ACCOUNT, WINDOW_MS),
      retryAfterSeconds(ipKey, MAX_PER_IP, WINDOW_MS),
    );
    if (wait > 0) {
      audit({ type: 'auth.lockout', outcome: 'denied', actor: email, ip, detail: 'demasiados intentos fallidos' });
      throw new ApiError(429, `Demasiados intentos fallidos. Intenta de nuevo en ${Math.ceil(wait / 60)} minuto(s).`, {
        'Retry-After': String(wait),
      });
    }

    const user = findByEmail(email);
    // Se verifica siempre (contra un hash de relleno si no existe) para no revelar qué correos existen por el tiempo de respuesta.
    const valid = await verifyPassword(password, user ? user.passwordHash : DUMMY_HASH);
    if (!user || !valid || !isLoginAllowed(user)) {
      registerFailure(accountKey, WINDOW_MS);
      registerFailure(ipKey, WINDOW_MS);
      const why = user && valid && !isLoginAllowed(user) ? 'cuenta de demostración deshabilitada en producción' : 'credenciales inválidas';
      audit({ type: 'auth.login', outcome: 'fail', actor: email, ip, detail: why });
      throw new ApiError(401, 'Correo o contraseña incorrectos.');
    }

    clearFailures(accountKey);
    audit({ type: 'auth.login', outcome: 'ok', actor: user.id, ip });
    const token = await signSession({ uid: user.id, role: user.role, tv: user.tokenVersion });
    const res = NextResponse.json({ ok: true, user: toPublic(user) });
    res.headers.set('Cache-Control', 'no-store');
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    return fail(err);
  }
}
