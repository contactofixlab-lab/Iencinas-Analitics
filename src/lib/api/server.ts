import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from './types';
import { QueryParams } from '@/types/domain';

/** Error controlado: su mensaje es seguro de mostrar al usuario. */
export class ApiError extends Error {
  constructor(public status: number, message: string, public headers?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Wrap successful data in the standard envelope. */
export function ok<T>(data: T, source: string): NextResponse<ApiResponse<T>> {
  const res = NextResponse.json<ApiResponse<T>>({
    ok: true,
    data,
    source,
    generatedAt: new Date().toISOString(),
  });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

/**
 * Wrap an error in the standard envelope. Los errores inesperados (5xx) se registran en el
 * servidor pero al navegador solo se envía un mensaje genérico, para no filtrar detalles internos.
 */
export function fail(err: unknown, status = 500): NextResponse<ApiResponse<never>> {
  let message: string;
  let headers: Record<string, string> | undefined;
  if (err instanceof ApiError) {
    status = err.status;
    message = err.message;
    headers = err.headers;
  } else if (status >= 500) {
    console.error('[api]', err);
    message = 'Error interno del servidor';
  } else {
    message = err instanceof Error ? err.message : 'Solicitud inválida';
  }
  const res = NextResponse.json<ApiResponse<never>>({ ok: false, error: message }, { status });
  res.headers.set('Cache-Control', 'no-store');
  if (headers) for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const PROJECT_ID_RE = /^[a-z0-9][a-z0-9-]{0,39}$/;

/** Extrae solo los filtros conocidos (?from=&to=&proyecto=) y descarta cualquier otro parámetro. */
export function parseParams(req: NextRequest): QueryParams {
  const out: QueryParams = {};
  const sp = req.nextUrl.searchParams;
  const from = sp.get('from');
  const to = sp.get('to');
  const proyecto = sp.get('proyecto');
  if (from && DATE_RE.test(from)) out.from = from;
  if (to && DATE_RE.test(to)) out.to = to;
  if (proyecto) {
    if (!PROJECT_ID_RE.test(proyecto)) throw new ApiError(400, 'Proyecto inválido.');
    out.proyecto = proyecto;
  }
  return out;
}

/** Lee el cuerpo JSON con límite de tamaño. */
export async function readJson(req: NextRequest, maxBytes = 10_000): Promise<Record<string, unknown>> {
  const type = req.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new ApiError(415, 'Se esperaba application/json');
  const text = await req.text();
  if (text.length > maxBytes) throw new ApiError(413, 'Solicitud demasiado grande');
  try {
    const body = JSON.parse(text);
    if (body === null || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new ApiError(400, 'JSON inválido');
  }
}
