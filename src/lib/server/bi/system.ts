import type { BiModule, ChartSpec, Layout, MeasureSpec } from '@/lib/bi/types';

/**
 * Gráficos que trae la aplicación. Se siembran al iniciar como gráficos normales del Diseñador (marcados «del sistema»):
 * se pueden editar, desactivar, mover o eliminar, y «Restaurar» los vuelve a crear con esta definición.
 * Si se agrega uno nuevo aquí, hay que subir SYSTEM_VERSION para que se siembre.
 */

export const SYSTEM_VERSION = 1;

export interface SystemChart {
  id: string;
  modulo: BiModule;
  spec: ChartSpec;
  layout: Layout;
}

const m = (n: number, field: string, extra: Partial<MeasureSpec> = {}): MeasureSpec => ({ id: `m${n}`, field, agg: 'sum', ...extra });

const spec = (s: Omit<ChartSpec, 'filters' | 'options'> & { filters?: ChartSpec['filters']; options?: ChartSpec['options'] }): ChartSpec => ({
  filters: [],
  ...s,
  options: { followContext: true, legend: true, grid: true, palette: 'hielo', ...(s.options ?? {}) },
});

const L = (x: number, y: number, w = 6, h = 4): Layout => ({ x, y, w, h });

const BLUE = '#78A8D7';
const ROSE = '#E09AA3';
const SOFT = '#B9D3EC';

export const SYSTEM_CHARTS: SystemChart[] = [
  /* ── Finanzas ── */
  {
    id: 'sys_fin_ingresos', modulo: 'finanzas', layout: L(0, 0),
    spec: spec({ title: 'Evolución de Ingresos', subtitle: 'USD · área acumulada', type: 'area', sourceId: 'demo', datasetId: 'finanzas_mensual', dimension: { field: 'fecha', bucket: 'month' }, measures: [m(1, 'ingresos', { label: 'Ingresos', format: 'compact', color: BLUE })], options: { smooth: true, legend: false } }),
  },
  {
    id: 'sys_fin_gastos', modulo: 'finanzas', layout: L(6, 0),
    spec: spec({ title: 'Gastos Operativos por Mes', subtitle: 'USD · barras', type: 'bar', sourceId: 'demo', datasetId: 'finanzas_mensual', dimension: { field: 'fecha', bucket: 'month' }, measures: [m(1, 'gastos', { label: 'Gastos', format: 'compact', color: ROSE })], options: { legend: false } }),
  },
  /* ── Comercial ── */
  {
    id: 'sys_com_ventas', modulo: 'comercial', layout: L(0, 0),
    spec: spec({ title: 'Propiedades Vendidas por Mes', subtitle: 'Unidades cerradas', type: 'bar', sourceId: 'demo', datasetId: 'comercial_ventas', dimension: { field: 'fecha', bucket: 'month' }, measures: [m(1, 'ventas', { label: 'Ventas', format: 'integer', color: BLUE })], options: { legend: false } }),
  },
  {
    id: 'sys_com_pipeline', modulo: 'comercial', layout: L(6, 0),
    spec: spec({ title: 'Pipeline de Ventas', subtitle: 'Leads por etapa del embudo', type: 'barH', sourceId: 'demo', datasetId: 'comercial_pipeline', dimension: { field: 'etapa' }, measures: [m(1, 'cantidad', { label: 'Leads', format: 'integer', color: BLUE })], options: { legend: false } }),
  },
  /* ── Marketing ── */
  {
    id: 'sys_mkt_leads', modulo: 'marketing', layout: L(0, 0),
    spec: spec({ title: 'Leads Generados por Mes', subtitle: 'Tendencia mensual', type: 'area', sourceId: 'demo', datasetId: 'marketing_leads', dimension: { field: 'fecha', bucket: 'month' }, measures: [m(1, 'leads', { label: 'Leads', format: 'integer', color: '#9BBFE3' })], options: { smooth: true, legend: false } }),
  },
  {
    id: 'sys_mkt_canales', modulo: 'marketing', layout: L(6, 0),
    spec: spec({ title: 'Leads por Canal de Marketing', subtitle: 'Distribución por origen', type: 'bar', sourceId: 'demo', datasetId: 'marketing_canales', dimension: { field: 'canal' }, measures: [m(1, 'leads', { label: 'Leads', format: 'integer', color: '#9BBFE3' })], options: { legend: false } }),
  },
  /* ── General ── */
  {
    id: 'sys_gen_ingegr', modulo: 'general', layout: L(0, 0),
    spec: spec({ title: 'Ingresos vs egresos por proyecto', subtitle: 'USD · principales proyectos', type: 'bar', sourceId: 'demo', datasetId: 'general_proyectos', dimension: { field: 'proyecto' }, measures: [m(1, 'ingresos', { label: 'Ingresos', format: 'usd', color: BLUE }), m(2, 'egresos', { label: 'Egresos', format: 'usd', color: ROSE })], sort: { by: 'measure', measure: 0, dir: 'desc' }, limit: 8 }),
  },
  {
    id: 'sys_gen_ventas', modulo: 'general', layout: L(6, 0),
    spec: spec({ title: 'Ventas por etapa', subtitle: 'Embudo comercial consolidado', type: 'donut', sourceId: 'demo', datasetId: 'general_ventas_etapa', dimension: { field: 'etapa' }, measures: [m(1, 'cantidad', { label: 'Ventas', format: 'integer' })] }),
  },
  {
    id: 'sys_gen_leads', modulo: 'general', layout: L(0, 4),
    spec: spec({ title: 'Leads por canal', subtitle: 'Toda la empresa', type: 'barH', sourceId: 'demo', datasetId: 'general_leads_canal', dimension: { field: 'canal' }, measures: [m(1, 'leads', { label: 'Leads', format: 'integer', color: BLUE })], options: { legend: false } }),
  },
  {
    id: 'sys_gen_estado', modulo: 'general', layout: L(6, 4),
    spec: spec({ title: 'Proyectos por estado', subtitle: 'Cartera de proyectos', type: 'donut', sourceId: 'demo', datasetId: 'general_proyectos_estado', dimension: { field: 'estado' }, measures: [m(1, 'cantidad', { label: 'Proyectos', format: 'integer' })] }),
  },
  /* ── Constructora ── */
  {
    id: 'sys_con_avance', modulo: 'constructora', layout: L(0, 0),
    spec: spec({ title: 'Avance físico por obra', subtitle: '% real vs planificado', type: 'bar', sourceId: 'obras', datasetId: 'obras', dimension: { field: 'obra' }, measures: [m(1, 'avancePlan', { agg: 'avg', label: 'Plan', format: 'percent', color: SOFT }), m(2, 'avanceReal', { agg: 'avg', label: 'Real', format: 'percent', color: BLUE })], sort: { by: 'dimension', dir: 'asc' } }),
  },
  {
    id: 'sys_con_curva', modulo: 'constructora', layout: L(6, 0),
    spec: spec({ title: 'Curva S de la cartera', subtitle: 'Avance acumulado % · plan vs real', type: 'line', sourceId: 'obras', datasetId: 'curva_s', dimension: { field: 'fecha', bucket: 'month' }, measures: [m(1, 'plan', { agg: 'max', label: 'Plan', format: 'percent', color: '#A9C6E4' }), m(2, 'real', { agg: 'max', label: 'Real', format: 'percent', color: BLUE })], options: { smooth: true } }),
  },
  {
    id: 'sys_con_presup', modulo: 'constructora', layout: L(0, 4),
    spec: spec({ title: 'Presupuesto vs costo real', subtitle: 'Millones de pesos por obra', type: 'bar', sourceId: 'obras', datasetId: 'obras', dimension: { field: 'obra' }, measures: [m(1, 'presupuesto', { label: 'Presupuesto', format: 'integer', color: SOFT }), m(2, 'costoReal', { label: 'Costo real', format: 'integer', color: '#5C93C7' })], sort: { by: 'dimension', dir: 'asc' } }),
  },
  {
    id: 'sys_con_compras', modulo: 'constructora', layout: L(6, 4),
    spec: spec({ title: 'Compras por mes', subtitle: 'Monto de órdenes de compra · MM$', type: 'bar', sourceId: 'obras', datasetId: 'compras', dimension: { field: 'fecha', bucket: 'month' }, measures: [m(1, 'monto', { label: 'Compras', format: 'integer', color: BLUE })], options: { legend: false } }),
  },
  {
    id: 'sys_con_oc', modulo: 'constructora', layout: L(0, 8),
    spec: spec({ title: 'Órdenes de compra por estado', subtitle: 'Cantidad de OC', type: 'donut', sourceId: 'obras', datasetId: 'ordenes', dimension: { field: 'estado' }, measures: [m(1, 'cantidad', { label: 'OC', format: 'integer' })], sort: { by: 'measure', measure: 0, dir: 'desc' } }),
  },
  {
    id: 'sys_con_incid', modulo: 'constructora', layout: L(6, 8),
    spec: spec({ title: 'Incidencias abiertas por obra', subtitle: 'Por severidad', type: 'barStacked', sourceId: 'obras', datasetId: 'incidencias', dimension: { field: 'obra' }, series: { field: 'severidad' }, measures: [m(1, 'cantidad', { label: 'Incidencias', format: 'integer' })], sort: { by: 'dimension', dir: 'asc' } }),
  },
];

export function systemChart(id: string): SystemChart | undefined {
  return SYSTEM_CHARTS.find(c => c.id === id);
}
