import { NextRequest } from 'next/server';
import { fail, readJson } from '@/lib/api/server';
import { clientIp, requireDesigner } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { createChart, listCharts, setActivo, setPublicaciones } from '@/lib/server/bi/store';
import { validateChartSpec } from '@/lib/server/bi/validate';
import { json } from '@/lib/server/bi/run';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireDesigner(req);
    return json({ ok: true, data: listCharts() });
  } catch (err) {
    return fail(err);
  }
}

/** Crea un gráfico; si trae `modulos`, además lo publica en ellos. */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireDesigner(req);
    const body = await readJson(req, 40_000);
    const { spec } = validateChartSpec(body.spec);
    const chart = createChart(spec, admin.id);
    if (typeof body.activo === 'boolean') chart.activo = setActivo(chart.id, body.activo).activo;
    const modulos = body.modulos === undefined ? [] : setPublicaciones(chart.id, body.modulos);
    audit({ type: 'bi.chart.create', outcome: 'ok', actor: admin.id, target: chart.id, ip: clientIp(req), detail: `«${spec.title}» (${spec.type})${modulos.length ? ` publicado en ${modulos.join(', ')}` : ''}` });
    return json({ ok: true, data: { ...chart, modulos } }, 201);
  } catch (err) {
    return fail(err);
  }
}
