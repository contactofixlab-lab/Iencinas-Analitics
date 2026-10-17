import { NextRequest } from 'next/server';
import { fail, readJson } from '@/lib/api/server';
import { clientIp, requireDesigner } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { deleteChart, getChart, modulosDe, setActivo, setPublicaciones, updateChart } from '@/lib/server/bi/store';
import { validateChartSpec } from '@/lib/server/bi/validate';
import { chartId, json } from '@/lib/server/bi/run';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    await requireDesigner(req);
    const chart = getChart(chartId(params.id));
    return json({ ok: true, data: { ...chart, modulos: modulosDe(chart.id) } });
  } catch (err) {
    return fail(err);
  }
}

/** Actualiza el gráfico; si trae `modulos`, también deja su publicación en esos módulos. */
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const admin = await requireDesigner(req);
    const id = chartId(params.id);
    const body = await readJson(req, 40_000);
    const { spec } = validateChartSpec(body.spec);
    const chart = updateChart(id, spec);
    if (typeof body.activo === 'boolean') chart.activo = setActivo(id, body.activo).activo;
    const modulos = body.modulos === undefined ? modulosDe(id) : setPublicaciones(id, body.modulos);
    audit({ type: 'bi.chart.update', outcome: 'ok', actor: admin.id, target: id, ip: clientIp(req), detail: `«${spec.title}» (${spec.type})` });
    return json({ ok: true, data: { ...chart, modulos } });
  } catch (err) {
    return fail(err);
  }
}

/** Activa o desactiva el gráfico (inactivo: no se muestra en los módulos pero sigue guardado). */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const admin = await requireDesigner(req);
    const id = chartId(params.id);
    const body = await readJson(req);
    const chart = setActivo(id, body.activo);
    audit({ type: 'bi.chart.toggle', outcome: 'ok', actor: admin.id, target: id, ip: clientIp(req), detail: `«${chart.spec.title}» ${chart.activo ? 'activado' : 'desactivado'}` });
    return json({ ok: true, data: { ...chart, modulos: modulosDe(id) } });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const admin = await requireDesigner(req);
    const id = chartId(params.id);
    const title = getChart(id).spec.title;
    const { system } = deleteChart(id);
    audit({ type: 'bi.chart.delete', outcome: 'ok', actor: admin.id, target: id, ip: clientIp(req), detail: `«${title}»${system ? ' (del sistema)' : ''}` });
    return json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
