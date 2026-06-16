/**
 * Runtime configuration — read from environment variables (server-side only).
 *
 * Switch the whole app between fake data and the real CRM by changing ONE var:
 *   DATA_SOURCE=mock   → uses src/lib/datasource/mock.ts   (default, works offline)
 *   DATA_SOURCE=crm    → uses src/lib/datasource/crm.ts    (real CRM, needs creds)
 *
 * See `.env.example` for the full list.
 */

export type DataSourceKind = 'mock' | 'crm';

function bool(v: string | undefined, fallback = false): boolean {
  if (v == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
}

export const config = {
  /** Which datasource implementation to use. */
  dataSource: ((process.env.DATA_SOURCE as DataSourceKind) || 'mock'),

  /** Sales CRM connection (filled in tomorrow). */
  crm: {
    baseUrl: process.env.CRM_API_BASE_URL?.replace(/\/$/, '') || '',
    apiKey: process.env.CRM_API_KEY || '',
    /** How the key is sent: 'bearer' → Authorization: Bearer, 'header' → x-api-key. */
    authScheme: (process.env.CRM_API_AUTH_SCHEME as 'bearer' | 'header') || 'bearer',
    apiKeyHeader: process.env.CRM_API_KEY_HEADER || 'x-api-key',
    timeoutMs: Number(process.env.CRM_API_TIMEOUT_MS || 10000),
  },

  /**
   * If a real source fails or isn't configured yet, fall back to mock data so the
   * dashboard never shows a blank screen. Set CRM_FALLBACK_TO_MOCK=false to surface
   * the real error instead (useful while debugging the CRM integration).
   */
  fallbackToMock: bool(process.env.CRM_FALLBACK_TO_MOCK, true),
} as const;

export function isCrmConfigured(): boolean {
  return Boolean(config.crm.baseUrl && config.crm.apiKey);
}
