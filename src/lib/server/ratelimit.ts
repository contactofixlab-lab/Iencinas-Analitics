/**
 * Límite de intentos fallidos en memoria (mejor esfuerzo: en un entorno serverless cada
 * instancia lleva su propio contador; con una base de datos real conviene moverlo allí).
 */

interface Entry {
  count: number;
  windowStart: number;
}

const g = globalThis as unknown as { __iencinasRateLimit?: Map<string, Entry> };
const store: Map<string, Entry> = (g.__iencinasRateLimit ??= new Map());

function prune(now: number, windowMs: number) {
  if (store.size < 5000) return;
  store.forEach((v, k) => {
    if (now - v.windowStart > windowMs) store.delete(k);
  });
}

/** Segundos que faltan para poder reintentar; 0 si no está bloqueado. */
export function retryAfterSeconds(key: string, max: number, windowMs: number): number {
  const now = Date.now();
  const e = store.get(key);
  if (!e) return 0;
  if (now - e.windowStart > windowMs) {
    store.delete(key);
    return 0;
  }
  return e.count >= max ? Math.ceil((e.windowStart + windowMs - now) / 1000) : 0;
}

export function registerFailure(key: string, windowMs: number): void {
  const now = Date.now();
  prune(now, windowMs);
  const e = store.get(key);
  if (!e || now - e.windowStart > windowMs) store.set(key, { count: 1, windowStart: now });
  else e.count += 1;
}

export function clearFailures(key: string): void {
  store.delete(key);
}
