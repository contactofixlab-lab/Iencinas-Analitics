import { ApiError } from '@/lib/api/server';
import { AGGS, BUCKETS, FORMATS, HEX_COLOR_RE, OPS, PALETTES, chartTypeDef } from '@/lib/bi/catalog';
import type {
  AggFn, ChartOptions, ChartSpec, DatasetDef, DateBucket, DimensionSpec, FieldDef, FilterSpec, MeasureSpec, NumberFormat, SortSpec,
} from '@/lib/bi/types';
import { ROWS_FIELD } from '@/lib/bi/types';
import { findDataset, type DataProvider } from './sources';

/**
 * Valida y limpia una especificación de gráfico recibida del navegador: solo pasan campos conocidos,
 * con tipos y largos acotados. Lo que no existe en el conjunto de datos se rechaza con un mensaje claro.
 */

const bad = (msg: string): never => {
  throw new ApiError(400, msg);
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

function text(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max) : '';
}

function fieldOf(ds: DatasetDef, id: string, what: string): FieldDef {
  const fd = ds.fields.find(x => x.id === id);
  if (!fd) bad(`El campo «${id}» (${what}) no existe en «${ds.label}».`);
  return fd as FieldDef;
}

function parseDimension(raw: unknown, ds: DatasetDef, what: string): DimensionSpec | undefined {
  if (!isObj(raw) || !raw.field) return undefined;
  const field = fieldOf(ds, text(raw.field, 60), what);
  const out: DimensionSpec = { field: field.id };
  if (field.type === 'date') {
    const b = text(raw.bucket, 10) as DateBucket;
    out.bucket = BUCKETS.some(x => x.id === b) ? b : 'month';
  }
  return out;
}

function parseMeasures(raw: unknown, ds: DatasetDef): MeasureSpec[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length > 8) bad('Un gráfico admite hasta 8 valores.');
  return raw.map((m, i) => {
    if (!isObj(m)) return bad('Valor inválido.');
    const fieldId = text(m.field, 60);
    const agg = text(m.agg, 20) as AggFn;
    const aggDef = AGGS.find(a => a.id === agg);
    if (!aggDef) bad('Elige cómo calcular cada valor (suma, promedio, conteo…).');
    let fd: FieldDef | undefined;
    if (fieldId === ROWS_FIELD) {
      if (agg !== 'count') bad('«Registros» solo se puede contar.');
    } else {
      fd = fieldOf(ds, fieldId, 'valor');
      if (aggDef!.numericOnly && fd.type !== 'number') bad(`«${aggDef!.label}» solo se puede aplicar a campos numéricos («${fd.label}» no lo es).`);
    }
    const out: MeasureSpec = { id: `m${i + 1}`, field: fieldId, agg };
    const label = text(m.label, 60);
    if (label) out.label = label;
    const format = text(m.format, 12) as NumberFormat;
    if (FORMATS.some(x => x.id === format)) out.format = format;
    const color = text(m.color, 7);
    if (color && HEX_COLOR_RE.test(color)) out.color = color;
    if (m.kind === 'bar' || m.kind === 'line') out.kind = m.kind;
    if (m.axis === 'left' || m.axis === 'right') out.axis = m.axis;
    return out;
  });
}

function parseFilters(raw: unknown, ds: DatasetDef): FilterSpec[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length > 10) bad('Se admiten hasta 10 filtros.');
  return raw.map(r => {
    if (!isObj(r)) return bad('Filtro inválido.');
    const fd = fieldOf(ds, text(r.field, 60), 'filtro');
    const op = OPS.find(o => o.id === r.op);
    if (!op) bad('Elige una condición para el filtro.');
    if (!op!.types.includes(fd.type)) bad(`La condición «${op!.label}» no se puede usar con «${fd.label}».`);
    const value = text(r.value, 200);
    if (value === '') bad(`Escribe el valor del filtro de «${fd.label}».`);
    if (fd.type === 'number' && !Number.isFinite(Number(value.replace(',', '.')))) bad(`«${value}» no es un número válido para «${fd.label}».`);
    if (fd.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) bad(`La fecha de «${fd.label}» debe tener el formato AAAA-MM-DD.`);
    if (fd.type === 'boolean' && value !== 'true' && value !== 'false') bad(`El valor de «${fd.label}» debe ser sí o no.`);
    return { field: fd.id, op: op!.id, value };
  });
}

function parseOptions(raw: unknown): ChartOptions {
  const o = isObj(raw) ? raw : {};
  const out: ChartOptions = {};
  for (const k of ['legend', 'labels', 'grid', 'smooth', 'followContext'] as const) if (typeof o[k] === 'boolean') out[k] = o[k] as boolean;
  const palette = text(o.palette, 12);
  if (PALETTES.some(p => p.id === palette)) out.palette = palette as ChartOptions['palette'];
  const gm = Number(o.gaugeMax);
  if (Number.isFinite(gm) && gm > 0 && gm <= 1e12) out.gaugeMax = gm;
  return out;
}

export function validateChartSpec(raw: unknown): { spec: ChartSpec; provider: DataProvider; dataset: DatasetDef } {
  if (!isObj(raw)) bad('Gráfico inválido.');
  const r = raw as Record<string, unknown>;

  const title = text(r.title, 80);
  if (!title) bad('El gráfico necesita un título.');
  const def = chartTypeDef(text(r.type, 20));
  if (!def) bad('Elige un tipo de gráfico válido.');

  const found = findDataset(text(r.sourceId, 40), text(r.datasetId, 40));
  if (!found) bad('Elige una fuente de datos conectada y uno de sus conjuntos de datos.');
  const { provider, dataset } = found!;

  const spec: ChartSpec = {
    title,
    type: def!.id,
    sourceId: provider.id,
    datasetId: dataset.id,
    measures: [],
    filters: [],
    options: parseOptions(r.options),
  };
  const subtitle = text(r.subtitle, 120);
  if (subtitle) spec.subtitle = subtitle;

  if (def!.dimension !== 'none') spec.dimension = parseDimension(r.dimension, dataset, 'eje o categoría');
  if (def!.dimension === 'required' && !spec.dimension) bad(`«${def!.label}» necesita un eje o categoría.`);

  if (def!.series !== 'none') spec.series = parseDimension(r.series, dataset, 'serie');
  if (def!.series === 'required' && !spec.series) bad(`«${def!.label}» necesita una serie (segunda categoría).`);
  if (spec.series && spec.dimension && spec.series.field === spec.dimension.field) bad('La serie debe ser un campo distinto del eje.');
  if (spec.series && !spec.dimension) spec.series = undefined;

  spec.measures = parseMeasures(r.measures, dataset);
  const n = spec.measures.length;
  if (n < def!.minMeasures) bad(`«${def!.label}» necesita al menos ${def!.minMeasures} valor${def!.minMeasures === 1 ? '' : 'es'}.`);
  if (n > def!.maxMeasures) bad(`«${def!.label}» admite como máximo ${def!.maxMeasures} valor${def!.maxMeasures === 1 ? '' : 'es'}.`);
  if (spec.series && n !== 1) bad('Al desglosar por serie se usa un solo valor.');
  if (def!.id === 'table' && !spec.dimension && n === 0) bad('La tabla necesita al menos una categoría o un valor.');

  spec.filters = parseFilters(r.filters, dataset);

  if (isObj(r.sort)) {
    const by = r.sort.by === 'measure' ? 'measure' : r.sort.by === 'dimension' ? 'dimension' : null;
    const dir = r.sort.dir === 'asc' ? 'asc' : r.sort.dir === 'desc' ? 'desc' : null;
    if (by && dir) {
      const sort: SortSpec = { by, dir };
      if (by === 'measure') sort.measure = Math.min(Math.max(Math.floor(Number(r.sort.measure) || 0), 0), Math.max(n - 1, 0));
      spec.sort = sort;
    }
  }
  const limit = Math.floor(Number(r.limit));
  if (Number.isFinite(limit) && limit >= 1) spec.limit = Math.min(limit, 1000);

  return { spec, provider: provider, dataset };
}
