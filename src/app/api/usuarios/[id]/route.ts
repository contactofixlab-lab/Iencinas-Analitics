import { NextRequest, NextResponse } from 'next/server';
import { ApiError, fail, readJson } from '@/lib/api/server';
import { clientIp, requireAdmin } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { deleteUser, updateUser } from '@/lib/server/users';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    const body = await readJson(req);
    const user = await updateUser(params.id, body);
    const changed = Object.keys(body).filter(k => k !== 'password').concat(body.password ? ['password'] : []).join(',');
    audit({ type: 'user.update', outcome: 'ok', actor: admin.id, target: params.id, ip: clientIp(req), detail: `campos: ${changed}` });
    const res = NextResponse.json({ ok: true, data: user });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    if (admin.id === params.id) throw new ApiError(409, 'No puedes eliminar tu propia cuenta.');
    deleteUser(params.id);
    audit({ type: 'user.delete', outcome: 'ok', actor: admin.id, target: params.id, ip: clientIp(req) });
    const res = NextResponse.json({ ok: true });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (err) {
    return fail(err);
  }
}
