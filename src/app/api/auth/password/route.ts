import { NextRequest, NextResponse } from 'next/server';
import { ApiError, fail, readJson } from '@/lib/api/server';
import { clientIp, requireUser } from '@/lib/server/guard';
import { verifyPassword } from '@/lib/server/password';
import { clearFailures, registerFailure, retryAfterSeconds } from '@/lib/server/ratelimit';
import { SESSION_COOKIE, sessionCookieOptions, signSession } from '@/lib/server/session';
import { changeOwnPassword } from '@/lib/server/users';
import { audit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;

/** El usuario cambia su propia contraseña. Las demás sesiones abiertas (otros equipos) se cierran. */
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await readJson(req);
    const current = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const next = body.newPassword;
    if (!current) throw new ApiError(400, 'Ingresa tu contraseña actual.');

    const key = `pwd:${user.id}`;
    const wait = retryAfterSeconds(key, MAX_FAILS, WINDOW_MS);
    if (wait > 0) throw new ApiError(429, 'Demasiados intentos. Intenta de nuevo más tarde.', { 'Retry-After': String(wait) });

    if (!(await verifyPassword(current, user.passwordHash))) {
      registerFailure(key, WINDOW_MS);
      audit({ type: 'auth.password_change', outcome: 'fail', actor: user.id, ip: clientIp(req), detail: 'contraseña actual incorrecta' });
      throw new ApiError(400, 'La contraseña actual no es correcta.');
    }
    clearFailures(key);
    if (next === current) throw new ApiError(400, 'La nueva contraseña debe ser distinta de la actual.');

    const updated = await changeOwnPassword(user.id, next);
    audit({ type: 'auth.password_change', outcome: 'ok', actor: user.id, ip: clientIp(req) });
    const token = await signSession({ uid: updated.id, role: updated.role, tv: updated.tokenVersion });
    const res = NextResponse.json({ ok: true });
    res.headers.set('Cache-Control', 'no-store');
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    return fail(err);
  }
}
