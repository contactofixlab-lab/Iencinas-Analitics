import fs from 'node:fs';
import path from 'node:path';

/**
 * Registro de auditoría de seguridad (ISO/IEC 27002:2022 control 8.15).
 * Guarda quién hizo qué, cuándo y desde dónde. Nunca registra contraseñas ni tokens.
 * Salida: consola en formato JSON (los proveedores de hosting la recogen), memoria reciente
 * para la pantalla de Auditoría y, en local, el archivo `.data/audit.log`.
 */

export type AuditOutcome = 'ok' | 'fail' | 'denied';

export interface AuditEvent {
  ts: string;
  type: string;
  outcome: AuditOutcome;
  actor?: string;
  target?: string;
  ip?: string;
  detail?: string;
}

const MAX_IN_MEMORY = 500;
const LOG_FILE = path.join(process.cwd(), '.data', 'audit.log');
const canPersist = !process.env.VERCEL;

const g = globalThis as unknown as { __iencinasAudit?: AuditEvent[] };
const buffer: AuditEvent[] = (g.__iencinasAudit ??= []);

function clean(v: string | undefined, max = 200): string | undefined {
  if (v === undefined) return undefined;
  return v.replace(/[\r\n\t]/g, ' ').slice(0, max);
}

export function audit(ev: Omit<AuditEvent, 'ts'>): void {
  const event: AuditEvent = {
    ts: new Date().toISOString(),
    type: ev.type,
    outcome: ev.outcome,
    actor: clean(ev.actor),
    target: clean(ev.target),
    ip: clean(ev.ip, 64),
    detail: clean(ev.detail),
  };
  buffer.push(event);
  if (buffer.length > MAX_IN_MEMORY) buffer.splice(0, buffer.length - MAX_IN_MEMORY);

  const line = JSON.stringify({ audit: true, ...event });
  console.log(line);
  if (canPersist) {
    try {
      fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
      fs.appendFileSync(LOG_FILE, line + '\n', { mode: 0o600 });
    } catch {
      /* el registro en consola sigue disponible */
    }
  }
}

/** Eventos más recientes primero. */
export function recentAudit(limit = 200): AuditEvent[] {
  return buffer.slice(-limit).reverse();
}
