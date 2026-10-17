import { NextRequest } from 'next/server';
import { fail } from '@/lib/api/server';
import { clientIp, requireDesigner } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { modulosDe, resetSystemChart } from '@/lib/server/bi/store';
import { chartId, json } from '@/lib/server/bi/run';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Devuelve un gráfico del sistema a su definición original. */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireDesigner(req);
    const id = chartId(params.id);
    const chart = resetSystemChart(id);
    audit({ type: 'bi.chart.update', outcome: 'ok', actor: admin.id, target: id, ip: clientIp(req), detail: `«${chart.spec.title}» restablecido a su definición original` });
    return json({ ok: true, data: { ...chart, modulos: modulosDe(id) } });
  } catch (err) {
    return fail(err);
  }
}
