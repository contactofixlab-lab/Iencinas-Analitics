import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ok, fail, parseParams, ApiError } from '@/lib/api/server';
import { authorizeModule } from '@/lib/server/guard';
import { FILTRO_NOMBRE_RE } from '@/lib/filtros';
import { QueryParams } from '@/types/domain';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Filtros del resumen: texto corto con caracteres simples, listas cerradas y meses 1 a 12. Lo demás se descarta o se rechaza. */
function parseFiltros(req: NextRequest): QueryParams {
  const sp = req.nextUrl.searchParams;
  const out: QueryParams = {};

  for (const key of ['obra', 'estado', 'oc'] as const) {
    const v = sp.get(key);
    if (!v) continue;
    if (!FILTRO_NOMBRE_RE.test(v)) throw new ApiError(400, `Filtro «${key}» inválido.`);
    out[key] = v;
  }

  const cronograma = sp.get('cronograma');
  if (cronograma) {
    if (cronograma !== 'en_plazo' && cronograma !== 'atraso') throw new ApiError(400, 'Filtro «cronograma» inválido.');
    out.cronograma = cronograma;
  }

  const severidad = sp.get('severidad');
  if (severidad) {
    if (!['alta', 'media', 'baja'].includes(severidad)) throw new ApiError(400, 'Filtro «severidad» inválido.');
    out.severidad = severidad;
  }

  for (const key of ['mesDesde', 'mesHasta'] as const) {
    const v = sp.get(key);
    if (!v) continue;
    if (!/^(1[0-2]|[1-9])$/.test(v)) throw new ApiError(400, `Filtro «${key}» inválido (1 a 12).`);
    out[key] = v;
  }
  return out;
}

export async function GET(req: NextRequest) {
  try {
    const params = { ...parseParams(req), ...parseFiltros(req) };
    await authorizeModule(req, 'constructora', params.proyecto);
    const ds = getDataSource();
    const data = await ds.getConstructora(params);
    return ok(data, ds.name);
  } catch (err) {
    return fail(err);
  }
}
