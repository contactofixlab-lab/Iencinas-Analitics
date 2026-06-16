import { DataSource } from './types';
import { createHttp, Http } from './http';
import { config } from '@/lib/config';
import {
  FinanzasData, ComercialData, MarketingData, ValorEmpresaData, ReportInfo, ModuleKey, QueryParams,
} from '@/types/domain';

/**
 * ════════════════════════════════════════════════════════════════════════
 *  SALES CRM DATASOURCE  —  COMPLETAR MAÑANA
 * ════════════════════════════════════════════════════════════════════════
 *
 * Pasos para conectar el CRM:
 *
 *  1. En `.env.local` define:
 *        DATA_SOURCE=crm
 *        CRM_API_BASE_URL=https://api.tu-crm.com
 *        CRM_API_KEY=xxxxxxxx
 *        CRM_API_AUTH_SCHEME=bearer        # o "header"
 *
 *  2. Ajusta las rutas reales del CRM en ENDPOINTS (abajo).
 *
 *  3. Implementa cada función `map*()` para transformar la respuesta cruda del
 *     CRM en los tipos de dominio (src/types/domain.ts). Esos tipos son lo único
 *     que ve la UI, así que aquí es donde "traduces" el CRM al dashboard.
 *
 *  4. Mientras una función no esté implementada, lanza NotImplemented; el
 *     selector (index.ts) hará fallback automático a datos mock si
 *     CRM_FALLBACK_TO_MOCK=true, para que el dashboard nunca quede en blanco.
 *
 *  Otras fuentes (marketing, ERP, etc.): puedes pedir un módulo a otra API
 *  creando otra clase DataSource y combinándola en index.ts (composite).
 */

// TODO: reemplazar por las rutas reales del CRM
const ENDPOINTS = {
  finanzas: '/finance/summary',
  comercial: '/sales/summary',
  marketing: '/marketing/summary',
  valorEmpresa: '/valuation/summary',
  reportes: '/reports',           // se usará como `${reportes}?module=comercial`
} as const;

class NotImplemented extends Error {
  constructor(fn: string) {
    super(`CRM mapping "${fn}" aún no implementado. Edita src/lib/datasource/crm.ts`);
    this.name = 'NotImplemented';
  }
}

export class CrmDataSource implements DataSource {
  readonly name = 'crm';
  private http: Http;

  constructor() {
    this.http = createHttp({
      baseUrl: config.crm.baseUrl,
      apiKey: config.crm.apiKey,
      authScheme: config.crm.authScheme,
      apiKeyHeader: config.crm.apiKeyHeader,
      timeoutMs: config.crm.timeoutMs,
    });
  }

  async getFinanzas(params?: QueryParams): Promise<FinanzasData> {
    const raw = await this.http.get<unknown>(ENDPOINTS.finanzas, params);
    return mapFinanzas(raw);
  }

  async getComercial(params?: QueryParams): Promise<ComercialData> {
    const raw = await this.http.get<unknown>(ENDPOINTS.comercial, params);
    return mapComercial(raw);
  }

  async getMarketing(params?: QueryParams): Promise<MarketingData> {
    const raw = await this.http.get<unknown>(ENDPOINTS.marketing, params);
    return mapMarketing(raw);
  }

  async getValorEmpresa(params?: QueryParams): Promise<ValorEmpresaData> {
    const raw = await this.http.get<unknown>(ENDPOINTS.valorEmpresa, params);
    return mapValorEmpresa(raw);
  }

  async getReportes(modulo: ModuleKey): Promise<ReportInfo[]> {
    const raw = await this.http.get<unknown>(ENDPOINTS.reportes, { module: modulo });
    return mapReportes(raw);
  }
}

/* ── Mapeos CRM → dominio (IMPLEMENTAR) ─────────────────────────────────── */
/* Reciben la respuesta cruda del CRM (`raw`) y devuelven el tipo de dominio.   */
/* Ejemplo de cómo se vería implementado:                                        */
/*                                                                               */
/*   function mapComercial(raw: any): ComercialData {                            */
/*     return {                                                                  */
/*       metrics: [                                                              */
/*         { label: 'Propiedades Vendidas', value: String(raw.deals_won),        */
/*           trend: pct(raw.deals_won_delta), up: raw.deals_won_delta >= 0,       */
/*           color: 'green' },                                                   */
/*         ...                                                                   */
/*       ],                                                                      */
/*       ventas: raw.monthly_sales.map(s => ({ mes: s.month, ventas: s.count })),*/
/*       pipeline: raw.stages.map(s => ({ etapa: s.name, cantidad: s.count })),  */
/*     };                                                                        */
/*   }                                                                           */

function mapFinanzas(_raw: unknown): FinanzasData { throw new NotImplemented('mapFinanzas'); }
function mapComercial(_raw: unknown): ComercialData { throw new NotImplemented('mapComercial'); }
function mapMarketing(_raw: unknown): MarketingData { throw new NotImplemented('mapMarketing'); }
function mapValorEmpresa(_raw: unknown): ValorEmpresaData { throw new NotImplemented('mapValorEmpresa'); }
function mapReportes(_raw: unknown): ReportInfo[] { throw new NotImplemented('mapReportes'); }
