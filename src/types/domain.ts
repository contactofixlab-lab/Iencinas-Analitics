/**
 * Domain DTOs — the STABLE contract the UI depends on.
 *
 * The frontend only ever consumes these shapes. Whatever the CRM (or any other
 * source) returns gets mapped INTO these types inside the datasource layer, so
 * swapping the data source never touches the UI.
 *
 * If the CRM exposes extra fields you want to surface, add them here first, then
 * map them in `src/lib/datasource/crm.ts`.
 */

export type MetricColor = 'green' | 'blue' | 'red' | 'purple' | 'orange';

/* ── Proyectos ────────────────────────────────────────────────────────────── */

export interface Proyecto {
  id: string;
  nombre: string;
  ubicacion?: string;
  estado: 'activo' | 'inactivo' | 'completado';
}

export interface ProyectoStatus {
  proyecto: Proyecto;
  activo: boolean;
}

export interface Metric {
  label: string;
  value: string;   // already formatted for display, e.g. "$7.1M", "8.7%"
  trend: string;   // e.g. "+12.4%" (vacío = sin comparación)
  up: boolean;     // true = positive/green arrow
  color: MetricColor;
  caption?: string; // texto bajo la tendencia; por defecto "vs mes anterior"
}

export interface MonthValue {
  mes: string;     // "Ene", "Feb", ...
  valor: number;
}

export interface ReportInfo {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;   // ISO date "2026-06-01"
  tipo: string;    // "Mensual" | "Trimestral" | ...
}

/* ── Per-module payloads ────────────────────────────────────────────────── */

export interface FinanzasData {
  metrics: Metric[];
  ingresos: MonthValue[];
  gastos: MonthValue[];
}

export interface ComercialData {
  metrics: Metric[];
  ventas: { mes: string; ventas: number }[];
  pipeline: { etapa: string; cantidad: number }[];
}

export interface MarketingData {
  metrics: Metric[];
  leads: { mes: string; leads: number }[];
  canales: { canal: string; leads: number; inversion: number }[];
}

/** Resumen de toda la empresa (todas las áreas y proyectos). */
export interface GeneralData {
  metrics: Metric[];
  ingresosEgresosPorProyecto: { proyecto: string; ingresos: number; egresos: number }[]; // USD
  ventasPorEtapa: { etapa: string; cantidad: number }[];
  leadsPorCanal: { canal: string; leads: number }[];
  proyectosPorEstado: { estado: string; cantidad: number }[];
  resumenProyectos: {
    proyecto: string;
    ubicacion: string;
    estado: string;
    ingresos: number;
    egresos: number;
    ventasCerradas: number;
    leads: number;
  }[];
}

/** Panel ejecutivo de la constructora (indicadores de obra). Montos en millones de pesos (MM$). */
export interface ObraResumen {
  obra: string;
  estado: string;
  avanceReal: number;     // %
  avancePlan: number;     // %
  presupuesto: number;    // MM$
  costoReal: number;      // MM$
  spi: number;
  cpi: number;
  ocPendientes: number;
  incidenciasAbiertas: number;
}

/** Filtros del resumen de Constructora (todos opcionales; vacío = sin filtrar). */
export interface ConstructoraFiltros {
  obra?: string;
  estado?: string;                       // estado de la obra
  cronograma?: 'en_plazo' | 'atraso';    // según SPI
  oc?: string;                           // estado de la orden de compra
  severidad?: 'alta' | 'media' | 'baja'; // severidad de las incidencias
  mesDesde?: number;                     // 1..12
  mesHasta?: number;                     // 1..12
}

export interface ConstructoraData {
  metrics: Metric[];
  /** Todas las obras de la cartera (para poblar el filtro aunque haya otro filtro aplicado). */
  obrasDisponibles: string[];
  /** Avisos sobre qué datos no se desglosan con los filtros aplicados. */
  avisos: string[];
  obras: ObraResumen[];
  curvaS: { mes: string; plan: number; real: number | null }[];
  comprasMensuales: { mes: string; monto: number }[];
  ordenesPorEstado: { estado: string; cantidad: number }[];
  incidenciasPorObra: { obra: string; alta: number; media: number; baja: number }[];
}

export type ModuleKey = 'general' | 'finanzas' | 'comercial' | 'marketing' | 'constructora';

/** Optional query filters every datasource method accepts (date ranges, etc.). */
export interface QueryParams {
  from?: string;   // ISO date
  to?: string;     // ISO date
  proyecto?: string; // proyecto ID or 'todos'
  [key: string]: string | undefined;
}
