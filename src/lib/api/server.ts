import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from './types';
import { QueryParams } from '@/types/domain';

/** Wrap successful data in the standard envelope. */
export function ok<T>(data: T, source: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>({
    ok: true,
    data,
    source,
    generatedAt: new Date().toISOString(),
  });
}

/** Wrap an error in the standard envelope (HTTP 500 by default). */
export function fail(err: unknown, status = 500): NextResponse<ApiResponse<never>> {
  const error = err instanceof Error ? err.message : 'Error desconocido';
  console.error('[api]', err);
  return NextResponse.json<ApiResponse<never>>({ ok: false, error }, { status });
}

/** Extract common query filters (?from=&to=&...) from the request. */
export function parseParams(req: NextRequest): QueryParams {
  const out: QueryParams = {};
  req.nextUrl.searchParams.forEach((value, key) => { out[key] = value; });
  return out;
}
