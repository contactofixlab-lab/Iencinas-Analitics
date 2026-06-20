/**
 * Tiny authenticated HTTP helper for talking to upstream APIs (CRM, etc.).
 * Server-side only — never import this from a client component, so API keys
 * stay out of the browser bundle.
 */

export interface HttpOptions {
  baseUrl: string;
  apiKey?: string;
  authScheme?: 'bearer' | 'header';
  apiKeyHeader?: string;
  timeoutMs?: number;
}

export class HttpError extends Error {
  constructor(public status: number, public url: string, public body: string) {
    super(`HTTP ${status} on ${url}`);
    this.name = 'HttpError';
  }
}

export function createHttp(opts: HttpOptions) {
  const {
    baseUrl,
    apiKey,
    authScheme = 'bearer',
    apiKeyHeader = 'x-api-key',
    timeoutMs = 10000,
  } = opts;

  function authHeaders(): Record<string, string> {
    if (!apiKey) return {};
    return authScheme === 'bearer'
      ? { Authorization: `Bearer ${apiKey}` }
      : { [apiKeyHeader]: apiKey };
  }

  async function request<T>(
    path: string,
    init: RequestInit & { query?: Record<string, string | undefined> } = {},
  ): Promise<T> {
    const url = new URL(path.replace(/^\//, ''), baseUrl + '/');
    if (init.query) {
      for (const [k, v] of Object.entries(init.query)) {
        if (v != null) url.searchParams.set(k, v);
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url.toString(), {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders(),
          ...(init.headers || {}),
        },
        cache: 'no-store',
      });
      const text = await res.text();
      if (!res.ok) throw new HttpError(res.status, url.toString(), text);
      try {
        return (text ? JSON.parse(text) : null) as T;
      } catch (e) {
        throw new HttpError(500, url.toString(), `Invalid JSON: ${(e as Error).message}`);
      }
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    get: <T>(path: string, query?: Record<string, string | undefined>) =>
      request<T>(path, { method: 'GET', query }),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  };
}

export type Http = ReturnType<typeof createHttp>;
