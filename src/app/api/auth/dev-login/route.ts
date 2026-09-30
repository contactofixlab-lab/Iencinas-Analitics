import { NextRequest, NextResponse } from 'next/server';
import { ApiError, fail, readJson } from '@/lib/api/server';
import { assertSameOrigin } from '@/lib/server/guard';
import { SESSION_COOKIE, sessionCookieOptions, signSession } from '@/lib/server/session';
import { findByEmail, toPublic } from '@/lib/server/users';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Acceso rápido SOLO para desarrollo local. En producción o fuera de localhost responde 404. */
export async function POST(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0];
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  if (process.env.NODE_ENV === 'production' || !isLocal) {
    return new NextResponse(null, { status: 404 });
  }
  try {
    assertSameOrigin(req);
    const body = await readJson(req);
    const user = typeof body.email === 'string' ? findByEmail(body.email) : undefined;
    if (!user) throw new ApiError(404, 'Usuario no encontrado.');
    const token = await signSession({ uid: user.id, role: user.role, tv: user.tokenVersion });
    const res = NextResponse.json({ ok: true, user: toPublic(user) });
    res.headers.set('Cache-Control', 'no-store');
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    return fail(err);
  }
}
