import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson } from '@/lib/api/server';
import { clientIp, requireAdmin } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { createUser, listUsers } from '@/lib/server/users';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const res = NextResponse.json({ ok: true, data: listUsers() });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (err) {
    return fail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const user = await createUser(await readJson(req));
    audit({ type: 'user.create', outcome: 'ok', actor: admin.id, target: user.id, ip: clientIp(req), detail: `rol ${user.role}` });
    const res = NextResponse.json({ ok: true, data: user }, { status: 201 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (err) {
    return fail(err);
  }
}
