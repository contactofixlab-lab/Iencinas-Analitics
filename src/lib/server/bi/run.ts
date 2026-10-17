import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/server';
import { runQuery } from '@/lib/bi/engine';
import type { ChartSpec, ContextFilters, QueryResult } from '@/lib/bi/types';
import type { StoredUser } from '@/lib/server/users';
import { findDataset, loadRows } from './sources';

/** Ejecuta un gráfico para una persona concreta (respeta los proyectos que tiene asignados). */
export async function runSpec(spec: ChartSpec, user: Pick<StoredUser, 'role' | 'proyectos'>, ctx?: ContextFilters): Promise<QueryResult> {
  const found = findDataset(spec.sourceId, spec.datasetId);
  if (!found) throw new ApiError(404, 'La fuente de datos de este gráfico ya no está disponible.');
  const rows = await loadRows(found.provider, found.dataset, user);
  return runQuery(rows, found.dataset, spec, ctx);
}

export const CHART_ID_RE = /^[a-z0-9_]{3,40}$/;

export function chartId(id: string): string {
  if (!CHART_ID_RE.test(id)) throw new ApiError(404, 'El gráfico no existe.');
  return id;
}

export function json(body: unknown, status = 200) {
  const res = NextResponse.json(body, { status });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
