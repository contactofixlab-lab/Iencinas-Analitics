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
  trend: string;   // e.g. "+12.4%"
  up: boolean;     // true = positive/green arrow
  color: MetricColor;
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

export interface ValorEmpresaData {
  metrics: Metric[];
  historico: { year: string; valor: number }[];
}

export type ModuleKey = 'finanzas' | 'comercial' | 'marketing' | 'valor-empresa';

/** Optional query filters every datasource method accepts (date ranges, etc.). */
export interface QueryParams {
  from?: string;   // ISO date
  to?: string;     // ISO date
  proyecto?: string; // proyecto ID or 'todos'
  [key: string]: string | undefined;
}
