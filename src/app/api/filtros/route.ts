import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson } from '@/lib/api/server';
import { clientIp, requireAdmin, requireUser } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { addFiltro, listFiltros, removeFiltro } from '@/lib/server/filtros';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function json(body: unknown, status = 200) {
  const res = NextResponse.json(body, { status });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

/** Cualquier persona con sesión puede leer las opciones (las usan los filtros de todos los módulos). */
export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    return json({ ok: true, data: listFiltros() });
  } catch (err) {
    return fail(err);
  }
}

/** Solo administradores: agregar una opción a una categoría. */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const r = addFiltro(await readJson(req));
    audit({ type: 'filtro.create', outcome: 'ok', actor: admin.id, target: r.categoria, ip: clientIp(req), detail: `opción «${r.valor}»` });
    return json({ ok: true, data: listFiltros() }, 201);
  } catch (err) {
    return fail(err);
  }
}

/** Solo administradores: quitar una opción agregada (las predeterminadas no se pueden quitar). */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const r = removeFiltro(await readJson(req));
    audit({ type: 'filtro.delete', outcome: 'ok', actor: admin.id, target: r.categoria, ip: clientIp(req), detail: `opción «${r.valor}»` });
    return json({ ok: true, data: listFiltros() });
  } catch (err) {
    return fail(err);
  }
}
