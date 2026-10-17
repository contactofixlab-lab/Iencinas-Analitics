/**
 * Diseñador de dashboards: tipos compartidos entre el servidor (consultas, validación, almacenamiento)
 * y el navegador (editor y lienzo). No importa nada del servidor.
 */

/* ── Fuentes de datos ──────────────────────────────────────────────────── */

export type FieldType = 'string' | 'number' | 'date' | 'boolean';

export type NumberFormat = 'auto' | 'integer' | 'decimal' | 'clp' | 'usd' | 'percent' | 'compact';

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  /** Formato sugerido cuando el campo se usa como valor. */
  format?: NumberFormat;
  /** Valores distintos (solo texto y sí/no, hasta 60) para ofrecerlos al filtrar. Los completa el catálogo. */
  values?: string[];
}

/**
 * Filtros que un módulo le pasa a sus gráficos (el proyecto elegido, la obra, los meses…).
 * Un conjunto de datos declara a qué campo corresponde cada uno; solo los gráficos con
 * «responder a los filtros del módulo» activado los aplican.
 */
export type ContextKey = 'proyecto' | 'obra' | 'estado' | 'cronograma' | 'oc' | 'severidad' | 'mes';

export interface ContextBinding {
  key: ContextKey;
  field: string;
  /** 'eq': igual al valor. 'monthRange': el campo es una fecha y se limita entre mesDesde y mesHasta. */
  kind?: 'eq' | 'monthRange';
}

export interface ContextFilters {
  proyecto?: string;
  obra?: string;
  estado?: string;
  cronograma?: string;
  oc?: string;
  severidad?: string;
  mesDesde?: number;
  mesHasta?: number;
}

export interface DatasetDef {
  id: string;
  sourceId: string;
  label: string;
  description: string;
  fields: FieldDef[];
  /** Si existe, las personas que no son administradoras solo ven filas de sus proyectos. */
  proyectoField?: string;
  /** Filtros de módulo que este conjunto de datos entiende. */
  context?: ContextBinding[];
}

export type SourceStatus = 'conectada' | 'sin_configurar';

export interface DataSourceDef {
  id: string;
  label: string;
  /** Tipo de origen: demostración, CRM, base SQL, API… (informativo). */
  kind: string;
  description: string;
  status: SourceStatus;
  datasets: DatasetDef[];
}

export type Row = Record<string, string | number | boolean | null>;

/** Campo especial para contar registros sin elegir una columna. */
export const ROWS_FIELD = '*';

/* ── Especificación de un gráfico ──────────────────────────────────────── */

export type ChartType =
  | 'bar' | 'barH' | 'barStacked' | 'barStacked100' | 'barHStacked'
  | 'line' | 'area' | 'areaStacked' | 'combo'
  | 'pie' | 'donut' | 'treemap' | 'funnel' | 'waterfall'
  | 'scatter' | 'bubble' | 'heatmap'
  | 'kpi' | 'gauge' | 'radialBar' | 'radar'
  | 'table';

export type AggFn = 'sum' | 'avg' | 'count' | 'countDistinct' | 'min' | 'max' | 'median';
export type DateBucket = 'year' | 'quarter' | 'month' | 'day';
export type FilterOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
export type PaletteId = 'hielo' | 'vivo' | 'verde' | 'calido' | 'azules';

export interface DimensionSpec {
  field: string;
  /** Solo campos de fecha: cómo agrupar (por defecto, mes). */
  bucket?: DateBucket;
}

export interface MeasureSpec {
  /** Identificador interno (m1, m2…): es la clave de la columna en el resultado. */
  id: string;
  field: string;
  agg: AggFn;
  label?: string;
  format?: NumberFormat;
  color?: string;
  /** Solo gráfico combinado: cómo se dibuja este valor y en qué eje. */
  kind?: 'bar' | 'line';
  axis?: 'left' | 'right';
}

export interface FilterSpec {
  field: string;
  op: FilterOp;
  /** Texto; para «en la lista» se separan los valores con «;». Los números y las fechas se interpretan según el campo. */
  value: string;
}

export interface SortSpec {
  by: 'dimension' | 'measure';
  /** Posición del valor (0 = el primero) cuando se ordena por valor. */
  measure?: number;
  dir: 'asc' | 'desc';
}

export interface ChartOptions {
  legend?: boolean;
  labels?: boolean;
  grid?: boolean;
  smooth?: boolean;
  palette?: PaletteId;
  /** Medidor: valor que representa el 100 %. */
  gaugeMax?: number;
  /** Aplicar los filtros del módulo donde se muestra (proyecto elegido, obra, meses…). */
  followContext?: boolean;
}

export interface ChartSpec {
  title: string;
  subtitle?: string;
  type: ChartType;
  sourceId: string;
  datasetId: string;
  dimension?: DimensionSpec;
  series?: DimensionSpec;
  measures: MeasureSpec[];
  filters: FilterSpec[];
  sort?: SortSpec;
  limit?: number;
  options: ChartOptions;
}

/* ── Resultado de una consulta ─────────────────────────────────────────── */

export interface ResultColumn {
  /** 'dim', 'ser' o el id del valor (m1…). */
  key: string;
  label: string;
  kind: 'dimension' | 'series' | 'measure';
  format?: NumberFormat;
  /** Para dimensión/serie de fecha: el agrupamiento, para mostrar bien las etiquetas. */
  bucket?: DateBucket;
}

export interface QueryResult {
  columns: ResultColumn[];
  rows: Record<string, string | number | null>[];
  /** Cantidad de filas de la fuente que cumplieron los filtros. */
  scanned: number;
  /** true si se recortó por el límite. */
  truncated: boolean;
}

/* ── Gráficos guardados y publicados ───────────────────────────────────── */

export type BiModule = 'general' | 'finanzas' | 'comercial' | 'marketing' | 'constructora';
export const BI_MODULES: { id: BiModule; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'finanzas', label: 'Finanzas' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'constructora', label: 'Constructora' },
];

export interface SavedChart {
  id: string;
  spec: ChartSpec;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  /** Gráfico que trae la aplicación (se puede editar, desactivar o eliminar como cualquiera). */
  system?: boolean;
  /** Si está inactivo no se muestra en ningún módulo, pero sigue guardado. */
  activo: boolean;
}

/** Posición de un gráfico dentro de un módulo (cuadrícula de 12 columnas). */
export interface Layout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Placement extends Layout {
  chartId: string;
  modulo: BiModule;
}

export interface ChartListItem extends SavedChart {
  modulos: BiModule[];
}

export interface ModuleItem {
  chartId: string;
  system?: boolean;
  spec: ChartSpec;
  layout: Layout;
  result: QueryResult | null;
  error?: string;
}

export interface ModuleView {
  /** La persona puede reorganizar la vista y quitar gráficos (usa el Diseñador). */
  editable: boolean;
  items: ModuleItem[];
}
