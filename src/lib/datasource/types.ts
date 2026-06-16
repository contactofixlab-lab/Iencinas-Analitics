import {
  FinanzasData,
  ComercialData,
  MarketingData,
  ValorEmpresaData,
  ReportInfo,
  ModuleKey,
  QueryParams,
  Proyecto,
} from '@/types/domain';

/**
 * The seam of the whole architecture.
 *
 * Every upstream data origin (mock, the sales CRM, a marketing API, an ERP, ...)
 * implements this same interface. Route handlers and the rest of the app talk to
 * a `DataSource` and never know or care where the numbers actually come from.
 *
 * To add the CRM tomorrow you only implement these methods in `crm.ts`.
 * To pull a single module from a *different* third party, override just that
 * method in a composite source (see `index.ts`).
 */
export interface DataSource {
  /** Human-readable id of the active source, echoed back in API responses. */
  readonly name: string;

  getProyectos(): Promise<Proyecto[]>;
  getFinanzas(params?: QueryParams): Promise<FinanzasData>;
  getComercial(params?: QueryParams): Promise<ComercialData>;
  getMarketing(params?: QueryParams): Promise<MarketingData>;
  getValorEmpresa(params?: QueryParams): Promise<ValorEmpresaData>;
  getReportes(modulo: ModuleKey, params?: QueryParams): Promise<ReportInfo[]>;
}
