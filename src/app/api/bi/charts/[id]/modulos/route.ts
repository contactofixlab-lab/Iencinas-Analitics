import { NextRequest } from 'next/server';
import { fail, readJson } from '@/lib/api/server';
import { clientIp, requireDesigner } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { setPublicaciones } from '@/lib/server/bi/store';
import { chartId, json } from '@/lib/server/bi/run';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Publica el gráfico en los módulos indicados (y lo retira de los demás). */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireDesigner(req);
    const id = chartId(params.id);
    const body = await readJson(req);
    const modulos = setPublicaciones(id, body.modulos);
    audit({ type: 'bi.publish', outcome: 'ok', actor: admin.id, target: id, ip: clientIp(req), detail: modulos.length ? `módulos: ${modulos.join(', ')}` : 'sin publicar' });
    return json({ ok: true, data: { modulos } });
  } catch (err) {
    return fail(err);
  }
}
