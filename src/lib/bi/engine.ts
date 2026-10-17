import { chartTypeDef } from './catalog';
import type {
  AggFn, ChartSpec, ContextFilters, DatasetDef, DateBucket, DimensionSpec, FieldDef, FilterSpec, QueryResult, ResultColumn, Row,
} from './types';
import { ROWS_FIELD } from './types';

/**
 * Motor de consultas: recibe las filas de un conjunto de datos y una especificación de gráfico,
 * y devuelve las filas ya filtradas, agrupadas, agregadas, ordenadas y limitadas.
 * Es independiente de la fuente: cualquier base de datos que entregue filas sirve.
 */

export const MAX_ROWS_SCANNED = 200_000;

const r4 = (n: number) => Math.round(n * 10_000) / 10_000;

function fieldOf(dataset: DatasetDef, id: string): FieldDef | undefined {
  return dataset.fields.find(f => f.id === id);
}

/* ── Filtros ───────────────────────────────────────────────────────────── */

function toNumber(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function matchFilter(row: Row, f: FilterSpec, field: FieldDef): boolean {
  const cell = row[f.field];
  if (field.type === 'number') {
    const a = toNumber(cell);
    const b = toNumber(f.value);
    if (a === null || b === null) return f.op === 'neq';
    switch (f.op) {
      case 'eq': return a === b;
      case 'neq': return a !== b;
      case 'gt': return a > b;
      case 'gte': return a >= b;
      case 'lt': return a < b;
      case 'lte': return a <= b;
      default: return false;
    }
  }
  if (field.type === 'date') {
    const a = typeof cell === 'string' ? cell.slice(0, 10) : '';
    const b = f.value.slice(0, 10);
    switch (f.op) {
      case 'eq': return a === b;
      case 'neq': return a !== b;
      case 'gt': return a > b;
      case 'gte': return a >= b;
      case 'lt': return a < b;
      case 'lte': return a <= b;
      default: return false;
    }
  }
  if (field.type === 'boolean') {
    const a = cell === true || cell === 'true' ? 'true' : 'false';
    return f.op === 'neq' ? a !== f.value : a === f.value;
  }
  const a = String(cell ?? '').toLowerCase();
  const b = f.value.toLowerCase();
  switch (f.op) {
    case 'eq': return a === b;
    case 'neq': return a !== b;
    case 'contains': return a.includes(b);
    case 'in': return f.value.split(';').map(s => s.trim().toLowerCase()).filter(Boolean).includes(a);
    default: return false;
  }
}

/* ── Agrupación ────────────────────────────────────────────────────────── */

export function bucketDate(value: unknown, bucket: DateBucket): string {
  const s = typeof value === 'string' ? value.slice(0, 10) : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return '';
  switch (bucket) {
    case 'year': return s.slice(0, 4);
    case 'quarter': return `${s.slice(0, 4)}-T${Math.floor((Number(s.slice(5, 7)) - 1) / 3) + 1}`;
    case 'month': return s.slice(0, 7);
    default: return s;
  }
}

function groupValue(row: Row, dim: DimensionSpec, field: FieldDef): string {
  const v = row[dim.field];
  if (field.type === 'date') return bucketDate(v, dim.bucket ?? 'month');
  if (v === null || v === undefined || v === '') return '';
  return String(v);
}

function aggregate(values: unknown[], agg: AggFn, numeric: boolean): number | null {
  if (agg === 'count') return values.length;
  if (agg === 'countDistinct') return new Set(values.map(v => String(v))).size;
  if (!numeric) return null;
  const nums = values.map(toNumber).filter((n): n is number => n !== null);
  if (nums.length === 0) return null;
  switch (agg) {
    case 'sum': return r4(nums.reduce((a, b) => a + b, 0));
    case 'avg': return r4(nums.reduce((a, b) => a + b, 0) / nums.length);
    case 'min': return Math.min(...nums);
    case 'max': return Math.max(...nums);
    case 'median': {
      const s = [...nums].sort((a, b) => a - b);
      const m = Math.floor(s.length / 2);
      return r4(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2);
    }
    default: return null;
  }
}

interface Group {
  dim: string;
  ser: string;
  /** Valores crudos por cada medida. */
  vals: unknown[][];
}

/** Aplica los filtros que el módulo le pasa al gráfico (proyecto elegido, obra, meses…) según lo que declara el conjunto de datos. */
export function applyContext(rows: Row[], dataset: DatasetDef, ctx: ContextFilters): Row[] {
  let out = rows;
  for (const b of dataset.context ?? []) {
    if (b.kind === 'monthRange') {
      const from = Math.min(ctx.mesDesde ?? 1, ctx.mesHasta ?? 12);
      const to = Math.max(ctx.mesDesde ?? 1, ctx.mesHasta ?? 12);
      if (ctx.mesDesde === undefined && ctx.mesHasta === undefined) continue;
      out = out.filter(r => {
        const m = Number(String(r[b.field] ?? '').slice(5, 7));
        return m >= from && m <= to;
      });
      continue;
    }
    const raw = b.key === 'proyecto' ? ctx.proyecto : (ctx as Record<string, unknown>)[b.key];
    if (raw === undefined || raw === '' || (b.key === 'proyecto' && raw === 'todos')) continue;
    const want = String(raw).trim().toLowerCase();
    out = out.filter(r => String(r[b.field] ?? '').trim().toLowerCase() === want);
  }
  return out;
}

export function runQuery(rows: Row[], dataset: DatasetDef, spec: ChartSpec, ctx?: ContextFilters): QueryResult {
  if (ctx && spec.options.followContext && dataset.context?.length) rows = applyContext(rows, dataset, ctx);
  // 1) Filtros
  const filters = spec.filters
    .map(f => ({ f, field: fieldOf(dataset, f.field) }))
    .filter((x): x is { f: FilterSpec; field: FieldDef } => !!x.field);
  const source = rows.length > MAX_ROWS_SCANNED ? rows.slice(0, MAX_ROWS_SCANNED) : rows;
  const kept = filters.length ? source.filter(r => filters.every(({ f, field }) => matchFilter(r, f, field))) : source;

  const def = chartTypeDef(spec.type);
  const dimField = spec.dimension ? fieldOf(dataset, spec.dimension.field) : undefined;
  const serField = spec.series && def?.series !== 'none' ? fieldOf(dataset, spec.series.field) : undefined;
  const useDim = !!(spec.dimension && dimField);
  const useSer = !!(spec.series && serField && useDim);

  // 2) Agrupar y recolectar valores
  const groups = new Map<string, Group>();
  for (const row of kept) {
    const dim = useDim ? groupValue(row, spec.dimension!, dimField!) : '';
    const ser = useSer ? groupValue(row, spec.series!, serField!) : '';
    const key = `${dim}\u0000${ser}`;
    let g = groups.get(key);
    if (!g) {
      g = { dim, ser, vals: spec.measures.map(() => []) };
      groups.set(key, g);
    }
    spec.measures.forEach((m, i) => {
      g!.vals[i].push(m.field === ROWS_FIELD ? 1 : row[m.field]);
    });
  }
  // Sin dimensión (tarjeta, medidor): siempre una fila, aunque no haya datos.
  if (!useDim && groups.size === 0) groups.set('\u0000', { dim: '', ser: '', vals: spec.measures.map(() => []) });

  const numericOf = (i: number) => {
    const m = spec.measures[i];
    return m.field === ROWS_FIELD ? true : fieldOf(dataset, m.field)?.type === 'number';
  };

  let out = Array.from(groups.values()).map(g => {
    const row: Record<string, string | number | null> = { dim: g.dim, ser: g.ser };
    spec.measures.forEach((m, i) => {
      row[m.id] = aggregate(g.vals[i], m.agg, numericOf(i));
    });
    return row;
  });

  // 3) Orden
  const dimIsOrdered = dimField?.type === 'date' || dimField?.type === 'number';
  const sort = spec.sort;
  const byMeasureIdx = sort?.by === 'measure' ? Math.min(Math.max(sort.measure ?? 0, 0), Math.max(spec.measures.length - 1, 0)) : 0;
  const mKey = spec.measures[byMeasureIdx]?.id;

  // Total por categoría del primer valor (o del elegido) para ordenar y limitar con series.
  const dimTotals = new Map<string, number>();
  if (mKey) {
    const m = spec.measures[byMeasureIdx];
    const perDim = new Map<string, unknown[]>();
    groups.forEach(g => {
      const arr = perDim.get(g.dim) ?? [];
      arr.push(...g.vals[byMeasureIdx]);
      perDim.set(g.dim, arr);
    });
    perDim.forEach((vals, dim) => dimTotals.set(dim, aggregate(vals, m.agg, numericOf(byMeasureIdx)) ?? 0));
  }

  const cmpDim = (a: string, b: string) => {
    if (dimField?.type === 'number') return (toNumber(a) ?? 0) - (toNumber(b) ?? 0);
    return a.localeCompare(b, 'es', { numeric: true });
  };
  let dir: 'asc' | 'desc';
  let mode: 'dimension' | 'measure';
  if (sort) {
    mode = sort.by;
    dir = sort.dir;
  } else if (def?.id === 'heatmap' || !mKey || dimIsOrdered || spec.type === 'waterfall') {
    mode = 'dimension';
    dir = 'asc';
  } else {
    mode = 'measure';
    dir = 'desc';
  }

  const dimOrder = Array.from(new Set(out.map(r => String(r.dim ?? ''))));
  dimOrder.sort((a, b) => {
    const c = mode === 'measure' ? (dimTotals.get(a) ?? 0) - (dimTotals.get(b) ?? 0) : cmpDim(a, b);
    return dir === 'asc' ? c : -c;
  });

  let truncated = false;
  const limit = spec.limit && spec.limit > 0 ? spec.limit : undefined;
  let keepDims = dimOrder;
  if (limit && dimOrder.length > limit) {
    keepDims = dimOrder.slice(0, limit);
    truncated = true;
  }
  const rank = new Map(keepDims.map((d, i) => [d, i]));
  out = out.filter(r => rank.has(String(r.dim ?? '')));
  const serOrder = Array.from(new Set(out.map(r => String(r.ser ?? '')))).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  out.sort((a, b) => {
    const d = (rank.get(String(a.dim ?? '')) ?? 0) - (rank.get(String(b.dim ?? '')) ?? 0);
    if (d !== 0) return d;
    return serOrder.indexOf(String(a.ser ?? '')) - serOrder.indexOf(String(b.ser ?? ''));
  });

  // 4) Columnas del resultado
  const columns: ResultColumn[] = [];
  if (useDim) {
    columns.push({ key: 'dim', label: dimField!.label, kind: 'dimension', bucket: dimField!.type === 'date' ? spec.dimension!.bucket ?? 'month' : undefined });
  }
  if (useSer) {
    columns.push({ key: 'ser', label: serField!.label, kind: 'series', bucket: serField!.type === 'date' ? spec.series!.bucket ?? 'month' : undefined });
  }
  spec.measures.forEach(m => {
    const f = m.field === ROWS_FIELD ? undefined : fieldOf(dataset, m.field);
    columns.push({ key: m.id, label: m.label || measureLabel(m.agg, f?.label), kind: 'measure', format: m.format ?? f?.format });
  });

  return { columns, rows: out, scanned: kept.length, truncated };
}

const AGG_LABELS: Record<AggFn, string> = {
  sum: 'Suma', avg: 'Promedio', count: 'Conteo', countDistinct: 'Conteo distinto', min: 'Mínimo', max: 'Máximo', median: 'Mediana',
};

export function measureLabel(agg: AggFn, fieldLabel?: string): string {
  if (!fieldLabel) return 'Registros';
  return `${AGG_LABELS[agg]} de ${fieldLabel}`;
}
