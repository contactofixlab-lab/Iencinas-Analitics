import { ApiError } from '@/lib/api/server';
import { LEADS, PROYECTOS, TRANSACCIONES, VALUACIONES, VENTAS } from '@/lib/mockDatabase';
import { buildConstructora } from '@/lib/datasource/constructora';
import { getDataSource } from '@/lib/datasource';
import type { ContextBinding, DataSourceDef, DatasetDef, FieldDef, Row, SourceStatus } from '@/lib/bi/types';
import type { StoredUser } from '@/lib/server/users';

/**
 * Registro de fuentes de datos del Diseñador.
 *
 * Para conectar otra base de datos (el CRM, una base SQL, una API…) basta con escribir un `DataProvider`
 * —sus conjuntos de datos con sus campos y la función que entrega las filas— y agregarlo a `PROVIDERS`.
 * El editor, el motor de consultas y los dashboards no cambian: eligen la fuente desde la lista.
 */

export interface DataProvider {
  id: string;
  label: string;
  kind: string;
  description: string;
  status(): SourceStatus;
  datasets(): DatasetDef[];
  rows(datasetId: string): Promise<Row[]> | Row[];
}

const f = (id: string, label: string, type: FieldDef['type'], format?: FieldDef['format']): FieldDef => ({ id, label, type, ...(format ? { format } : {}) });

const porProyecto: ContextBinding[] = [{ key: 'proyecto', field: 'proyectoId' }];

/** Guarda por unos segundos lo que cuesta armar (series por proyecto) para no recalcularlo en cada gráfico. */
const memoStore = new Map<string, { at: number; value: unknown }>();
async function memo<T>(key: string, fn: () => Promise<T>, ttlMs = 15_000): Promise<T> {
  const hit = memoStore.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
  const value = await fn();
  memoStore.set(key, { at: Date.now(), value });
  return value;
}

const MES_NUM: Record<string, string> = { Ene: '01', Feb: '02', Mar: '03', Abr: '04', May: '05', Jun: '06', Jul: '07', Ago: '08', Sep: '09', Oct: '10', Nov: '11', Dic: '12' };
const mesFecha = (mes: string) => `2026-${MES_NUM[mes] ?? '01'}-01`;

/* ── Base de demostración (inmobiliaria) ───────────────────────────────── */

const nombreProyecto = new Map(PROYECTOS.map(p => [p.id, p.nombre]));
const proyecto = (id: string) => nombreProyecto.get(id) ?? id;

/** Una fila por proyecto y mes/categoría, con las mismas series que muestran los módulos. */
async function seriesPorProyecto<T>(fn: (id: string) => Promise<T>, toRows: (id: string, data: T) => Row[]): Promise<Row[]> {
  const out: Row[] = [];
  for (const p of PROYECTOS) out.push(...toRows(p.id, await fn(p.id)));
  return out;
}

const demoProvider: DataProvider = {
  id: 'demo',
  label: 'Base de demostración · Inmobiliaria',
  kind: 'Demostración',
  description: 'Proyectos, transacciones, ventas, leads y valuaciones de ejemplo. Reemplaza al CRM mientras no esté conectado.',
  status: () => 'conectada',
  datasets: () => [
    {
      id: 'transacciones', sourceId: 'demo', label: 'Transacciones', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Ingresos y egresos de cada proyecto.',
      fields: [
        f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('concepto', 'Concepto', 'string'),
        f('tipo', 'Tipo de transacción', 'string'), f('categoria', 'Categoría', 'string'), f('monto', 'Monto', 'number', 'usd'), f('fecha', 'Fecha', 'date'),
      ],
    },
    {
      id: 'ventas', sourceId: 'demo', label: 'Ventas', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Propiedades en cada etapa del embudo comercial.',
      fields: [
        f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('propiedad', 'Propiedad', 'string'),
        f('etapa', 'Etapa', 'string'), f('cantidad', 'Cantidad', 'number', 'integer'), f('valor', 'Valor', 'number', 'usd'),
        f('comision', 'Comisión', 'number', 'usd'), f('fecha', 'Fecha', 'date'),
      ],
    },
    {
      id: 'leads', sourceId: 'demo', label: 'Leads', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Contactos interesados, por canal y estado (sin datos personales).',
      fields: [
        f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('canal', 'Canal', 'string'),
        f('estado', 'Estado', 'string'), f('costo', 'Costo', 'number', 'usd'), f('fecha', 'Fecha', 'date'),
      ],
    },
    {
      id: 'valuaciones', sourceId: 'demo', label: 'Valuaciones', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Valor y crecimiento de cada proyecto por año.',
      fields: [
        f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('anio', 'Año', 'number', 'integer'),
        f('valor', 'Valor', 'number', 'usd'), f('crecimiento', 'Crecimiento', 'number', 'percent'), f('metodologia', 'Metodología', 'string'), f('fecha', 'Fecha', 'date'),
      ],
    },
    {
      id: 'proyectos', sourceId: 'demo', label: 'Proyectos', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Cartera de proyectos inmobiliarios.',
      fields: [
        f('proyectoId', 'ID del proyecto', 'string'), f('proyecto', 'Proyecto', 'string'), f('ubicacion', 'Ubicación', 'string'),
        f('estado', 'Estado', 'string'), f('fechaInicio', 'Fecha de inicio', 'date'),
      ],
    },
    // Series que muestran los módulos (las entrega el origen de datos configurado)
    {
      id: 'finanzas_mensual', sourceId: 'demo', label: 'Finanzas · ingresos y gastos por mes', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Serie mensual de ingresos y gastos de cada proyecto, la misma del módulo Finanzas.',
      fields: [f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('fecha', 'Mes', 'date'), f('ingresos', 'Ingresos', 'number', 'usd'), f('gastos', 'Gastos', 'number', 'usd')],
    },
    {
      id: 'comercial_ventas', sourceId: 'demo', label: 'Comercial · propiedades vendidas por mes', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Unidades cerradas por mes de cada proyecto, la misma serie del módulo Comercial.',
      fields: [f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('fecha', 'Mes', 'date'), f('ventas', 'Propiedades vendidas', 'number', 'integer')],
    },
    {
      id: 'comercial_pipeline', sourceId: 'demo', label: 'Comercial · pipeline por etapa', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Leads en cada etapa del embudo, por proyecto.',
      fields: [f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('etapa', 'Etapa', 'string'), f('cantidad', 'Leads', 'number', 'integer')],
    },
    {
      id: 'marketing_leads', sourceId: 'demo', label: 'Marketing · leads por mes', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Leads generados por mes en cada proyecto, la misma serie del módulo Marketing.',
      fields: [f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('fecha', 'Mes', 'date'), f('leads', 'Leads', 'number', 'integer')],
    },
    {
      id: 'marketing_canales', sourceId: 'demo', label: 'Marketing · rendimiento por canal', proyectoField: 'proyectoId', context: porProyecto,
      description: 'Leads e inversión por canal de marketing, por proyecto.',
      fields: [f('proyecto', 'Proyecto', 'string'), f('proyectoId', 'ID del proyecto', 'string'), f('canal', 'Canal', 'string'), f('leads', 'Leads', 'number', 'integer'), f('inversion', 'Inversión', 'number', 'usd')],
    },
    // Resumen de toda la empresa (módulo General)
    {
      id: 'general_proyectos', sourceId: 'demo', label: 'General · resumen por proyecto',
      description: 'Ingresos, egresos, ventas cerradas y leads de cada proyecto.',
      fields: [
        f('proyecto', 'Proyecto', 'string'), f('ubicacion', 'Ubicación', 'string'), f('estado', 'Estado', 'string'), f('ingresos', 'Ingresos', 'number', 'usd'),
        f('egresos', 'Egresos', 'number', 'usd'), f('ventasCerradas', 'Ventas cerradas', 'number', 'integer'), f('leads', 'Leads', 'number', 'integer'),
      ],
    },
    {
      id: 'general_ventas_etapa', sourceId: 'demo', label: 'General · ventas por etapa', description: 'Cantidad de ventas en cada etapa del embudo, de toda la empresa.',
      fields: [f('etapa', 'Etapa', 'string'), f('cantidad', 'Cantidad', 'number', 'integer')],
    },
    {
      id: 'general_leads_canal', sourceId: 'demo', label: 'General · leads por canal', description: 'Leads de toda la empresa por canal.',
      fields: [f('canal', 'Canal', 'string'), f('leads', 'Leads', 'number', 'integer')],
    },
    {
      id: 'general_proyectos_estado', sourceId: 'demo', label: 'General · proyectos por estado', description: 'Cantidad de proyectos en cada estado.',
      fields: [f('estado', 'Estado', 'string'), f('cantidad', 'Cantidad', 'number', 'integer')],
    },
  ],
  async rows(datasetId) {
    switch (datasetId) {
      case 'transacciones':
        return TRANSACCIONES.map(t => ({ proyecto: proyecto(t.proyectoId), proyectoId: t.proyectoId, concepto: t.concepto, tipo: t.tipo, categoria: t.categoria ?? null, monto: t.monto, fecha: t.fecha }));
      case 'ventas':
        return VENTAS.map(v => ({ proyecto: proyecto(v.proyectoId), proyectoId: v.proyectoId, propiedad: v.propiedad, etapa: v.etapa, cantidad: v.cantidad, valor: v.valor, comision: v.comision ?? null, fecha: v.fecha }));
      case 'leads':
        return LEADS.map(l => ({ proyecto: proyecto(l.proyectoId), proyectoId: l.proyectoId, canal: l.canal, estado: l.estado, costo: l.costo, fecha: l.fecha }));
      case 'valuaciones':
        return VALUACIONES.map(v => ({ proyecto: proyecto(v.proyectoId), proyectoId: v.proyectoId, anio: v.anio, valor: v.valor, crecimiento: v.crecimiento, metodologia: v.metodologia ?? null, fecha: v.fecha }));
      case 'proyectos':
        return PROYECTOS.map(p => ({ proyectoId: p.id, proyecto: p.nombre, ubicacion: p.ubicacion, estado: p.estado, fechaInicio: p.fechaInicio }));
      case 'finanzas_mensual':
        return memo(datasetId, () => seriesPorProyecto(id => getDataSource().getFinanzas({ proyecto: id }), (id, d) =>
          d.ingresos.map((m, i) => ({ proyecto: proyecto(id), proyectoId: id, fecha: mesFecha(m.mes), ingresos: m.valor, gastos: d.gastos[i]?.valor ?? null }))));
      case 'comercial_ventas':
        return memo(datasetId, () => seriesPorProyecto(id => getDataSource().getComercial({ proyecto: id }), (id, d) =>
          d.ventas.map(v => ({ proyecto: proyecto(id), proyectoId: id, fecha: mesFecha(v.mes), ventas: v.ventas }))));
      case 'comercial_pipeline':
        return memo(datasetId, () => seriesPorProyecto(id => getDataSource().getComercial({ proyecto: id }), (id, d) =>
          d.pipeline.map(p => ({ proyecto: proyecto(id), proyectoId: id, etapa: p.etapa, cantidad: p.cantidad }))));
      case 'marketing_leads':
        return memo(datasetId, () => seriesPorProyecto(id => getDataSource().getMarketing({ proyecto: id }), (id, d) =>
          d.leads.map(l => ({ proyecto: proyecto(id), proyectoId: id, fecha: mesFecha(l.mes), leads: l.leads }))));
      case 'marketing_canales':
        return memo(datasetId, () => seriesPorProyecto(id => getDataSource().getMarketing({ proyecto: id }), (id, d) =>
          d.canales.map(c => ({ proyecto: proyecto(id), proyectoId: id, canal: c.canal, leads: c.leads, inversion: c.inversion }))));
      case 'general_proyectos':
        return (await memo('general', () => getDataSource().getGeneral())).resumenProyectos.map(r => ({ ...r }));
      case 'general_ventas_etapa':
        return (await memo('general', () => getDataSource().getGeneral())).ventasPorEtapa.map(r => ({ ...r }));
      case 'general_leads_canal':
        return (await memo('general', () => getDataSource().getGeneral())).leadsPorCanal.map(r => ({ ...r }));
      case 'general_proyectos_estado':
        return (await memo('general', () => getDataSource().getGeneral())).proyectosPorEstado.map(r => ({ ...r }));
      default:
        return [];
    }
  },
};

/* ── Control de Obra (demostración) ────────────────────────────────────── */

const obrasProvider: DataProvider = {
  id: 'obras',
  label: 'Control de Obra · Constructora (demostración)',
  kind: 'Demostración',
  description: 'Avance, costos, compras e incidencias de las obras. Datos de ejemplo hasta conectar Control de Obra.',
  status: () => 'conectada',
  datasets: () => [
    {
      id: 'obras', sourceId: 'obras', label: 'Obras', description: 'Estado de cada obra: avance, presupuesto y costo.',
      context: [{ key: 'obra', field: 'obra' }, { key: 'estado', field: 'estado' }, { key: 'cronograma', field: 'cronograma' }],
      fields: [
        f('obra', 'Obra', 'string'), f('estado', 'Estado de la obra', 'string'), f('cronograma', 'Cronograma', 'string'), f('avanceReal', 'Avance real (%)', 'number', 'percent'),
        f('avancePlan', 'Avance planificado (%)', 'number', 'percent'), f('presupuesto', 'Presupuesto (MM$)', 'number', 'decimal'),
        f('costoReal', 'Costo real (MM$)', 'number', 'decimal'), f('spi', 'SPI', 'number', 'decimal'), f('cpi', 'CPI', 'number', 'decimal'),
        f('ocPendientes', 'OC pendientes', 'number', 'integer'), f('incidenciasAbiertas', 'Incidencias abiertas', 'number', 'integer'),
      ],
    },
    {
      id: 'compras', sourceId: 'obras', label: 'Compras mensuales', description: 'Monto de órdenes de compra por mes.',
      context: [{ key: 'mes', field: 'fecha', kind: 'monthRange' }],
      fields: [f('fecha', 'Mes', 'date'), f('monto', 'Monto (MM$)', 'number', 'decimal')],
    },
    {
      id: 'curva_s', sourceId: 'obras', label: 'Curva S', description: 'Avance acumulado planificado y real por mes.',
      context: [{ key: 'mes', field: 'fecha', kind: 'monthRange' }],
      fields: [f('fecha', 'Mes', 'date'), f('plan', 'Avance planificado (%)', 'number', 'percent'), f('real', 'Avance real (%)', 'number', 'percent')],
    },
    {
      id: 'ordenes', sourceId: 'obras', label: 'Órdenes de compra por estado', description: 'Cantidad de órdenes de compra en cada estado.',
      context: [{ key: 'oc', field: 'estado' }],
      fields: [f('estado', 'Estado de la OC', 'string'), f('cantidad', 'Cantidad', 'number', 'integer')],
    },
    {
      id: 'incidencias', sourceId: 'obras', label: 'Incidencias', description: 'Incidencias abiertas por obra y severidad.',
      context: [{ key: 'obra', field: 'obra' }, { key: 'estado', field: 'estadoObra' }, { key: 'cronograma', field: 'cronograma' }, { key: 'severidad', field: 'severidad' }],
      fields: [f('obra', 'Obra', 'string'), f('estadoObra', 'Estado de la obra', 'string'), f('cronograma', 'Cronograma', 'string'), f('severidad', 'Severidad', 'string'), f('cantidad', 'Cantidad', 'number', 'integer')],
    },
  ],
  rows(datasetId) {
    const d = buildConstructora();
    const crono = (spi: number) => (spi >= 1 ? 'en_plazo' : 'atraso');
    switch (datasetId) {
      case 'obras':
        return d.obras.map(o => ({ ...o, cronograma: crono(o.spi) }));
      case 'compras':
        return d.comprasMensuales.map(c => ({ fecha: mesFecha(c.mes), monto: c.monto }));
      case 'curva_s':
        return d.curvaS.map(c => ({ fecha: mesFecha(c.mes), plan: c.plan, real: c.real }));
      case 'ordenes':
        return d.ordenesPorEstado.map(o => ({ ...o }));
      case 'incidencias':
        return d.incidenciasPorObra.flatMap(i => {
          const o = d.obras.find(x => x.obra === i.obra);
          const base = { obra: i.obra, estadoObra: o?.estado ?? '', cronograma: o ? crono(o.spi) : '' };
          return [
            { ...base, severidad: 'Alta', cantidad: i.alta },
            { ...base, severidad: 'Media', cantidad: i.media },
            { ...base, severidad: 'Baja', cantidad: i.baja },
          ];
        });
      default:
        return [];
    }
  },
};

/* ── CRM (aún sin conectar) ────────────────────────────────────────────── */

const crmProvider: DataProvider = {
  id: 'crm',
  label: 'CRM inmobiliario (API)',
  kind: 'API',
  description: 'Se conectará cuando el CRM entregue su API. Aparecerá aquí con sus conjuntos de datos sin cambiar nada más.',
  status: () => 'sin_configurar',
  datasets: () => [],
  rows() {
    throw new ApiError(503, 'Esta fuente de datos todavía no está conectada.');
  },
};

const PROVIDERS: DataProvider[] = [demoProvider, obrasProvider, crmProvider];

/* ── Acceso para el resto del servidor ─────────────────────────────────── */

const MAX_DISTINCT = 60;

/** Catálogo completo; con `values`, los campos de texto traen sus valores distintos (para los filtros del editor). */
export async function catalogo(withValues = false): Promise<DataSourceDef[]> {
  const out: DataSourceDef[] = [];
  for (const p of PROVIDERS) {
    const status = p.status();
    const datasets: DatasetDef[] = [];
    for (const ds of p.datasets()) {
      let fields = ds.fields;
      if (withValues && status === 'conectada') {
        const rows = await p.rows(ds.id);
        fields = ds.fields.map(fd => {
          if (fd.type !== 'string' && fd.type !== 'boolean') return fd;
          const set = new Set<string>();
          for (const r of rows) {
            const v = r[fd.id];
            if (v !== null && v !== undefined && v !== '') set.add(String(v));
            if (set.size > MAX_DISTINCT) break;
          }
          return { ...fd, values: set.size <= MAX_DISTINCT ? Array.from(set).sort((a, b) => a.localeCompare(b, 'es')) : undefined };
        });
      }
      datasets.push({ ...ds, fields });
    }
    out.push({ id: p.id, label: p.label, kind: p.kind, description: p.description, status, datasets });
  }
  return out;
}

export function findDataset(sourceId: string, datasetId: string): { provider: DataProvider; dataset: DatasetDef } | null {
  const provider = PROVIDERS.find(p => p.id === sourceId);
  if (!provider || provider.status() !== 'conectada') return null;
  const dataset = provider.datasets().find(d => d.id === datasetId);
  return dataset ? { provider, dataset } : null;
}

/** Filas del conjunto de datos; quien no es administrador solo ve las de sus proyectos. */
export async function loadRows(provider: DataProvider, dataset: DatasetDef, user: Pick<StoredUser, 'role' | 'proyectos'>): Promise<Row[]> {
  const rows = await provider.rows(dataset.id);
  if (user.role === 'administrador' || !dataset.proyectoField) return rows;
  const allowed = new Set(user.proyectos || []);
  return rows.filter(r => allowed.has(String(r[dataset.proyectoField!])));
}
