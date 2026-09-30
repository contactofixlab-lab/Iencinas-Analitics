import { NextRequest, NextResponse } from 'next/server';
import { fail } from '@/lib/api/server';
import { assertSameOrigin } from '@/lib/server/guard';
import { SESSION_COOKIE, sessionCookieOptions, verifySession } from '@/lib/server/session';
import { audit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (session) audit({ type: 'auth.logout', outcome: 'ok', actor: session.uid });
    const res = NextResponse.json({ ok: true });
    res.headers.set('Cache-Control', 'no-store');
    res.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
    return res;
  } catch (err) {
    return fail(err);
  }
}
