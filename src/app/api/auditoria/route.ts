import { NextRequest, NextResponse } from 'next/server';
import { fail } from '@/lib/api/server';
import { requireAdmin } from '@/lib/server/guard';
import { recentAudit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Registro de eventos de seguridad recientes. Solo administradores. */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const res = NextResponse.json({ ok: true, data: recentAudit(200) });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (err) {
    return fail(err);
  }
}
