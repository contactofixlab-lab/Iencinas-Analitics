import { DataSource } from './types';
import { MockDataSource } from './mock';
import { CrmDataSource } from './crm';
import { config, isCrmConfigured } from '@/lib/config';
import {
  FinanzasData, ComercialData, MarketingData, ValorEmpresaData, ReportInfo, ModuleKey, QueryParams,
} from '@/types/domain';

/**
 * Returns the active datasource based on `DATA_SOURCE`.
 *
 *   mock → static demo data (default)
 *   crm  → real CRM; if it's not configured yet or a call fails and
 *          CRM_FALLBACK_TO_MOCK=true, it transparently serves mock data so the
 *          dashboard keeps working while the integration is built out.
 */
export function getDataSource(): DataSource {
  if (config.dataSource === 'crm') {
    if (!isCrmConfigured()) {
      if (config.fallbackToMock) {
        console.warn('[datasource] DATA_SOURCE=crm pero faltan credenciales — usando mock.');
        return new MockDataSource();
      }
      // Sin fallback: devolvemos el CRM igual; los métodos fallarán con un error claro.
    }
    const crm = new CrmDataSource();
    return config.fallbackToMock ? withMockFallback(crm) : crm;
  }
  return new MockDataSource();
}

/**
 * Wraps a source so that any failing method silently falls back to mock data.
 * Keeps the reported `name` of the wrapped source; failures are logged server-side.
 */
function withMockFallback(primary: DataSource): DataSource {
  const mock = new MockDataSource();
  const guard = async <T>(label: string, fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      console.warn(`[datasource] ${primary.name}.${label} falló, usando mock:`, (err as Error).message);
      return fallback();
    }
  };

  return {
    name: primary.name,
    getProyectos: (): Promise<any[]> =>
      guard('getProyectos', () => primary.getProyectos(), () => mock.getProyectos?.() || []),
    getFinanzas: (p?: QueryParams): Promise<FinanzasData> =>
      guard('getFinanzas', () => primary.getFinanzas(p), () => mock.getFinanzas()),
    getComercial: (p?: QueryParams): Promise<ComercialData> =>
      guard('getComercial', () => primary.getComercial(p), () => mock.getComercial()),
    getMarketing: (p?: QueryParams): Promise<MarketingData> =>
      guard('getMarketing', () => primary.getMarketing(p), () => mock.getMarketing()),
    getValorEmpresa: (p?: QueryParams): Promise<ValorEmpresaData> =>
      guard('getValorEmpresa', () => primary.getValorEmpresa(p), () => mock.getValorEmpresa()),
    getReportes: (modulo: ModuleKey, params?: QueryParams): Promise<ReportInfo[]> =>
      guard('getReportes', () => primary.getReportes(modulo, params), () => mock.getReportes(modulo)),
  };
}

export type { DataSource };
