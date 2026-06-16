import { ApiResponse } from './types';
import {
  FinanzasData, ComercialData, MarketingData, ValorEmpresaData, ReportInfo, ModuleKey, QueryParams,
} from '@/types/domain';

/**
 * Typed frontend client. Use this from client components instead of importing
 * mockData directly — when the CRM goes live nothing in the UI changes.
 *
 *   const { data } = await api.finanzas();
 *
 * It calls our own /api/* routes (same origin), so the CRM key never reaches
 * the browser. The route decides where the data actually comes from.
 */

function qs(params?: QueryParams): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v != null) sp.set(k, v);
  const s = sp.toString();
  return s ? `?${s}` : '';
}

async function get<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    const json = (await res.json()) as ApiResponse<T>;
    return json;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error de red' };
  }
}

/** Throwing variant — returns data directly or throws. Handy with React Query/SWR. */
async function getData<T>(path: string): Promise<T> {
  const res = await get<T>(path);
  if (!res.ok) throw new Error(res.error);
  return res.data;
}

export const api = {
  // Envelope versions (let you read `source`, handle errors in UI)
  finanzas: (p?: QueryParams) => get<FinanzasData>(`/api/finanzas${qs(p)}`),
  comercial: (p?: QueryParams) => get<ComercialData>(`/api/comercial${qs(p)}`),
  marketing: (p?: QueryParams) => get<MarketingData>(`/api/marketing${qs(p)}`),
  valorEmpresa: (p?: QueryParams) => get<ValorEmpresaData>(`/api/valor-empresa${qs(p)}`),
  reportes: (modulo: ModuleKey) => get<ReportInfo[]>(`/api/reportes/${modulo}`),

  // Throwing versions (return data directly)
  $: {
    finanzas: (p?: QueryParams) => getData<FinanzasData>(`/api/finanzas${qs(p)}`),
    comercial: (p?: QueryParams) => getData<ComercialData>(`/api/comercial${qs(p)}`),
    marketing: (p?: QueryParams) => getData<MarketingData>(`/api/marketing${qs(p)}`),
    valorEmpresa: (p?: QueryParams) => getData<ValorEmpresaData>(`/api/valor-empresa${qs(p)}`),
    reportes: (modulo: ModuleKey) => getData<ReportInfo[]>(`/api/reportes/${modulo}`),
  },
};
