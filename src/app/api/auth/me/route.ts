import { NextRequest, NextResponse } from 'next/server';
import { ApiError, fail } from '@/lib/api/server';
import { requireUser } from '@/lib/server/guard';
import { toPublic } from '@/lib/server/users';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const res = NextResponse.json({ ok: true, user: toPublic(user) });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (err) {
    // Sin sesión no es un error para esta consulta: se informa user:null (evita ruido 401 en la consola).
    if (err instanceof ApiError && err.status === 401) {
      const res = NextResponse.json({ ok: true, user: null });
      res.headers.set('Cache-Control', 'no-store');
      return res;
    }
    return fail(err);
  }
}
