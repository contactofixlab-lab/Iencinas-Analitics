import type {
  AggFn, ChartOptions, ChartSpec, ChartType, DateBucket, FieldType, FilterOp, Layout, NumberFormat, PaletteId,
} from './types';

/** Catálogo de tipos de gráfico: qué necesita cada uno para dibujarse. Lo leen el editor, la validación y el dibujo. */

export interface ChartTypeDef {
  id: ChartType;
  label: string;
  group: string;
  description: string;
  /** El eje o categoría: obligatorio, opcional o no se usa. */
  dimension: 'required' | 'optional' | 'none';
  /** Admite desglosar por una segunda categoría (serie). Si la hay, solo se permite un valor. */
  series: 'optional' | 'required' | 'none';
  minMeasures: number;
  maxMeasures: number;
  /** Nombres de cada valor cuando tienen un papel fijo (dispersión: eje X, eje Y, tamaño). */
  measureRoles?: string[];
  defaultSize: { w: number; h: number };
  defaultOptions?: Partial<ChartOptions>;
}

const size = (w: number, h: number) => ({ w, h });

export const CHART_TYPES: ChartTypeDef[] = [
  // Comparación
  { id: 'bar', label: 'Columnas', group: 'Comparación', description: 'Compara valores entre categorías con columnas verticales.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4) },
  { id: 'barH', label: 'Barras', group: 'Comparación', description: 'Barras horizontales; ideales para nombres largos.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4) },
  { id: 'barStacked', label: 'Columnas apiladas', group: 'Comparación', description: 'Suma los valores o series apilándolos en una columna.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4) },
  { id: 'barStacked100', label: 'Columnas 100 % apiladas', group: 'Comparación', description: 'Muestra la proporción de cada parte dentro del total.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4) },
  { id: 'barHStacked', label: 'Barras apiladas', group: 'Comparación', description: 'Barras horizontales apiladas.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4) },
  // Tendencia
  { id: 'line', label: 'Líneas', group: 'Tendencia', description: 'Evolución en el tiempo o entre categorías ordenadas.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4), defaultOptions: { smooth: true } },
  { id: 'area', label: 'Áreas', group: 'Tendencia', description: 'Como las líneas, con el área rellena.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4), defaultOptions: { smooth: true } },
  { id: 'areaStacked', label: 'Áreas apiladas', group: 'Tendencia', description: 'Áreas que se suman para ver el total y su composición.', dimension: 'required', series: 'optional', minMeasures: 1, maxMeasures: 6, defaultSize: size(6, 4), defaultOptions: { smooth: true } },
  { id: 'combo', label: 'Combinado (columnas y línea)', group: 'Tendencia', description: 'Columnas y líneas en el mismo gráfico, con eje secundario opcional.', dimension: 'required', series: 'none', minMeasures: 2, maxMeasures: 6, defaultSize: size(6, 4), defaultOptions: { smooth: true } },
  // Composición
  { id: 'pie', label: 'Circular', group: 'Composición', description: 'Participación de cada categoría en el total.', dimension: 'required', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(4, 4), defaultOptions: { legend: true } },
  { id: 'donut', label: 'Anillo', group: 'Composición', description: 'Circular con el centro libre para mostrar el total.', dimension: 'required', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(4, 4), defaultOptions: { legend: true } },
  { id: 'treemap', label: 'Mapa de árbol', group: 'Composición', description: 'Rectángulos proporcionales al valor de cada categoría.', dimension: 'required', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(6, 4) },
  { id: 'funnel', label: 'Embudo', group: 'Composición', description: 'Etapas de un proceso, de mayor a menor.', dimension: 'required', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(4, 4), defaultOptions: { labels: true } },
  { id: 'waterfall', label: 'Cascada', group: 'Composición', description: 'Cómo suman y restan los aumentos y disminuciones hasta un total.', dimension: 'required', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(6, 4) },
  // Relación
  { id: 'scatter', label: 'Dispersión', group: 'Relación', description: 'Relaciona dos valores: cada punto es una categoría.', dimension: 'required', series: 'none', minMeasures: 2, maxMeasures: 2, measureRoles: ['Eje X', 'Eje Y'], defaultSize: size(6, 4) },
  { id: 'bubble', label: 'Burbujas', group: 'Relación', description: 'Dispersión con un tercer valor que define el tamaño.', dimension: 'required', series: 'none', minMeasures: 3, maxMeasures: 3, measureRoles: ['Eje X', 'Eje Y', 'Tamaño'], defaultSize: size(6, 4) },
  { id: 'heatmap', label: 'Mapa de calor', group: 'Relación', description: 'Cruza dos categorías y colorea según el valor.', dimension: 'required', series: 'required', minMeasures: 1, maxMeasures: 1, defaultSize: size(6, 4) },
  // Indicadores
  { id: 'kpi', label: 'Tarjeta (KPI)', group: 'Indicadores', description: 'Un número grande para un indicador clave.', dimension: 'none', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(3, 2) },
  { id: 'gauge', label: 'Medidor', group: 'Indicadores', description: 'Avance de un valor respecto de una meta.', dimension: 'none', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(3, 3) },
  { id: 'radialBar', label: 'Barras radiales', group: 'Indicadores', description: 'Barras en forma de anillos concéntricos.', dimension: 'required', series: 'none', minMeasures: 1, maxMeasures: 1, defaultSize: size(4, 4), defaultOptions: { legend: true } },
  { id: 'radar', label: 'Radar', group: 'Indicadores', description: 'Compara varios valores en una red de ejes.', dimension: 'required', series: 'none', minMeasures: 1, maxMeasures: 4, defaultSize: size(4, 4), defaultOptions: { legend: true } },
  // Detalle
  { id: 'table', label: 'Tabla', group: 'Detalle', description: 'Datos agrupados en filas y columnas.', dimension: 'optional', series: 'optional', minMeasures: 0, maxMeasures: 8, defaultSize: size(12, 4) },
];

export const CHART_GROUPS = ['Comparación', 'Tendencia', 'Composición', 'Relación', 'Indicadores', 'Detalle'];

export function chartTypeDef(id: string): ChartTypeDef | undefined {
  return CHART_TYPES.find(t => t.id === id);
}

/* ── Funciones de agregación, formatos y paletas ───────────────────────── */

export const AGGS: { id: AggFn; label: string; numericOnly: boolean }[] = [
  { id: 'sum', label: 'Suma', numericOnly: true },
  { id: 'avg', label: 'Promedio', numericOnly: true },
  { id: 'count', label: 'Conteo', numericOnly: false },
  { id: 'countDistinct', label: 'Conteo distinto', numericOnly: false },
  { id: 'min', label: 'Mínimo', numericOnly: true },
  { id: 'max', label: 'Máximo', numericOnly: true },
  { id: 'median', label: 'Mediana', numericOnly: true },
];

export const FORMATS: { id: NumberFormat; label: string }[] = [
  { id: 'auto', label: 'Automático' },
  { id: 'integer', label: 'Entero (1.234)' },
  { id: 'decimal', label: 'Decimal (1.234,56)' },
  { id: 'clp', label: 'Pesos ($1.234)' },
  { id: 'usd', label: 'Dólares (US$1.234)' },
  { id: 'percent', label: 'Porcentaje (12,3 %)' },
  { id: 'compact', label: 'Compacto (1,2 M)' },
];

export const BUCKETS: { id: DateBucket; label: string }[] = [
  { id: 'year', label: 'Año' },
  { id: 'quarter', label: 'Trimestre' },
  { id: 'month', label: 'Mes' },
  { id: 'day', label: 'Día' },
];

export const OPS: { id: FilterOp; label: string; types: FieldType[] }[] = [
  { id: 'eq', label: 'es igual a', types: ['string', 'number', 'date', 'boolean'] },
  { id: 'neq', label: 'es distinto de', types: ['string', 'number', 'date', 'boolean'] },
  { id: 'in', label: 'es uno de', types: ['string'] },
  { id: 'contains', label: 'contiene', types: ['string'] },
  { id: 'gt', label: 'es mayor que', types: ['number', 'date'] },
  { id: 'gte', label: 'es mayor o igual que', types: ['number', 'date'] },
  { id: 'lt', label: 'es menor que', types: ['number', 'date'] },
  { id: 'lte', label: 'es menor o igual que', types: ['number', 'date'] },
];

export const PALETTES: { id: PaletteId; label: string; colors: string[] }[] = [
  { id: 'hielo', label: 'Hielo (predeterminada)', colors: ['#78A8D7', '#A9D8C4', '#F2C9A3', '#E7B3BC', '#BFD6EE', '#C9B8E8', '#8FB9E0', '#E8D9A0'] },
  { id: 'vivo', label: 'Vivos', colors: ['#3B82C4', '#2FA37B', '#E08A3C', '#D2566B', '#7C5CC4', '#2EA6B8', '#C9A227', '#6B7C93'] },
  { id: 'azules', label: 'Azules', colors: ['#2E6FA8', '#4E8CC4', '#78A8D7', '#9BBFE3', '#BFD6EE', '#5F7F9E', '#8FB9E0', '#D6E8F8'] },
  { id: 'verde', label: 'Verdes', colors: ['#2F8F6B', '#52AE8A', '#7CC8A8', '#A9D8C4', '#CFEBDD', '#6F9E8A', '#94C11F', '#B7D98A'] },
  { id: 'calido', label: 'Cálidos', colors: ['#D9733B', '#E8A05A', '#F2C9A3', '#D2566B', '#E7B3BC', '#C9A227', '#B8654D', '#F0DDB0'] },
];

export function paletteColors(id?: PaletteId): string[] {
  return (PALETTES.find(p => p.id === id) ?? PALETTES[0]).colors;
}

export const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

/* ── Utilidades de presentación (las usan el editor y el dibujo) ───────── */

const nf = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat('es-CL', opts);
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatValue(v: number | null | undefined, format: NumberFormat = 'auto'): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  switch (format) {
    case 'integer': return nf({ maximumFractionDigits: 0 }).format(v);
    case 'decimal': return nf({ minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
    case 'clp': return `$${nf({ maximumFractionDigits: 0 }).format(v)}`;
    case 'usd': return `US$${nf({ maximumFractionDigits: 0 }).format(v)}`;
    case 'percent': return `${nf({ maximumFractionDigits: 1 }).format(v)} %`;
    case 'compact': return nf({ notation: 'compact', maximumFractionDigits: 1 }).format(v);
    default:
      if (Math.abs(v) >= 1_000_000) return nf({ notation: 'compact', maximumFractionDigits: 1 }).format(v);
      return Number.isInteger(v) ? nf({ maximumFractionDigits: 0 }).format(v) : nf({ maximumFractionDigits: 2 }).format(v);
  }
}

/** Valor para los ejes: igual que formatValue, pero con monedas abreviadas (US$6,2 M) para que no se corten. */
export function formatAxisValue(v: number | null | undefined, format: NumberFormat = 'auto'): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  if (format === 'usd' || format === 'clp') {
    const prefix = format === 'usd' ? 'US$' : '$';
    return `${prefix}${nf({ notation: 'compact', maximumFractionDigits: 1 }).format(v)}`;
  }
  return formatValue(v, format);
}

/** Etiqueta legible de un valor de eje: «2026-03» → «mar 2026». */
export function formatDimLabel(value: string | number | null | undefined, bucket?: DateBucket): string {
  if (value === null || value === undefined || value === '') return '(vacío)';
  const s = String(value);
  if (bucket === 'month' && /^\d{4}-\d{2}$/.test(s)) return `${MESES[Number(s.slice(5)) - 1] ?? s.slice(5)} ${s.slice(0, 4)}`;
  if (bucket === 'quarter') return s.replace('-T', ' T');
  if (bucket === 'day' && /^\d{4}-\d{2}-\d{2}$/.test(s)) return `${Number(s.slice(8))} ${MESES[Number(s.slice(5, 7)) - 1]} ${s.slice(2, 4)}`;
  return s;
}

export function defaultLayout(type: ChartType): Pick<Layout, 'w' | 'h'> {
  return chartTypeDef(type)?.defaultSize ?? { w: 6, h: 4 };
}

export function emptySpec(sourceId: string, datasetId: string): ChartSpec {
  return {
    title: 'Nuevo gráfico',
    type: 'bar',
    sourceId,
    datasetId,
    measures: [],
    filters: [],
    options: { legend: true, grid: true, palette: 'hielo' },
  };
}
