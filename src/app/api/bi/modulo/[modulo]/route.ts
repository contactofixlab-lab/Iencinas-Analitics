import { NextRequest } from 'next/server';
import { ApiError, fail, readJson } from '@/lib/api/server';
import { clientIp, MODULE_ROLES, requireDesigner, requireUser } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { isModule, placementsOf, removePlacement, saveLayout } from '@/lib/server/bi/store';
import { chartId, json, runSpec } from '@/lib/server/bi/run';
import { canDesign } from '@/lib/bi/permissions';
import { FILTRO_NOMBRE_RE } from '@/lib/filtros';
import { PROJECT_ID_RE } from '@/lib/api/server';
import type { BiModule, ContextFilters, ModuleItem, ModuleView } from '@/lib/bi/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: { modulo: string } };

function modulo(v: string): BiModule {
  if (!isModule(v)) throw new ApiError(404, 'El módulo no existe.');
  return v;
}

/** Filtros que el módulo envía a sus gráficos (proyecto elegido, obra, meses…). Solo pasa lo que valida; el resto se rechaza. */
function parseContext(req: NextRequest): ContextFilters {
  const sp = req.nextUrl.searchParams;
  const ctx: ContextFilters = {};
  const proyecto = sp.get('proyecto');
  if (proyecto) {
    if (proyecto !== 'todos' && !PROJECT_ID_RE.test(proyecto)) throw new ApiError(400, 'Proyecto inválido.');
    ctx.proyecto = proyecto;
  }
  for (const key of ['obra', 'estado', 'oc'] as const) {
    const v = sp.get(key);
    if (!v) continue;
    if (!FILTRO_NOMBRE_RE.test(v)) throw new ApiError(400, `Filtro «${key}» inválido.`);
    ctx[key] = v;
  }
  const cron = sp.get('cronograma');
  if (cron) {
    if (cron !== 'en_plazo' && cron !== 'atraso') throw new ApiError(400, 'Filtro «cronograma» inválido.');
    ctx.cronograma = cron;
  }
  const sev = sp.get('severidad');
  if (sev) {
    if (!['alta', 'media', 'baja'].includes(sev)) throw new ApiError(400, 'Filtro «severidad» inválido.');
    ctx.severidad = sev;
  }
  for (const key of ['mesDesde', 'mesHasta'] as const) {
    const v = sp.get(key);
    if (!v) continue;
    if (!/^(1[0-2]|[1-9])$/.test(v)) throw new ApiError(400, `Filtro «${key}» inválido (1 a 12).`);
    ctx[key] = Number(v);
  }
  return ctx;
}

/** Gráficos activos publicados en un módulo, con sus datos ya calculados. Los ve cualquier persona con acceso al módulo. */
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const m = modulo(params.modulo);
    const user = await requireUser(req);
    if (!MODULE_ROLES[m].includes(user.role)) {
      audit({ type: 'access.denied', outcome: 'denied', actor: user.id, ip: clientIp(req), detail: `gráficos del módulo ${m}` });
      throw new ApiError(403, 'No tienes acceso a este módulo.');
    }
    const ctx = parseContext(req);
    const items: ModuleItem[] = [];
    for (const p of placementsOf(m)) {
      const layout = { x: p.x, y: p.y, w: p.w, h: p.h };
      try {
        items.push({ chartId: p.chartId, spec: p.chart.spec, layout, system: p.chart.system, result: await runSpec(p.chart.spec, user, ctx) });
      } catch (err) {
        items.push({ chartId: p.chartId, spec: p.chart.spec, layout, system: p.chart.system, result: null, error: err instanceof ApiError ? err.message : 'No se pudo calcular el gráfico.' });
      }
    }
    const view: ModuleView = { editable: canDesign(user.role), items };
    return json({ ok: true, data: view });
  } catch (err) {
    return fail(err);
  }
}

/** Guarda la posición y el tamaño de los gráficos del módulo (solo administradores). */
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const m = modulo(params.modulo);
    const admin = await requireDesigner(req);
    const body = await readJson(req, 20_000);
    saveLayout(m, body.layout);
    audit({ type: 'bi.layout', outcome: 'ok', actor: admin.id, target: m, ip: clientIp(req), detail: 'diseño de la vista actualizado' });
    return json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

/** Quita un gráfico de este módulo (el gráfico sigue guardado en el Diseñador). */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const m = modulo(params.modulo);
    const admin = await requireDesigner(req);
    const body = await readJson(req);
    const id = chartId(typeof body.chartId === 'string' ? body.chartId : '');
    removePlacement(m, id);
    audit({ type: 'bi.publish', outcome: 'ok', actor: admin.id, target: id, ip: clientIp(req), detail: `retirado del módulo ${m}` });
    return json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
