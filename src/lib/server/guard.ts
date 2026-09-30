import { NextRequest } from 'next/server';
import { ApiError, PROJECT_ID_RE } from '@/lib/api/server';
import { ModuleKey } from '@/types/domain';
import { UserRole } from '@/types';
import { SESSION_COOKIE, verifySession } from './session';
import { findById, StoredUser } from './users';
import { audit } from './audit';

/** Qué roles pueden consultar cada módulo (misma regla que el menú lateral). */
export const MODULE_ROLES: Record<ModuleKey, UserRole[]> = {
  finanzas: ['finanzas', 'administrador'],
  comercial: ['comercial', 'administrador'],
  marketing: ['marketing', 'administrador'],
  'valor-empresa': ['administrador'],
};

/** Rechaza peticiones que cambian datos y vienen de otro sitio web (defensa CSRF adicional a SameSite=Strict). */
export function assertSameOrigin(req: NextRequest): void {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return;
  const origin = req.headers.get('origin');
  if (!origin) return;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  let originHost = '';
  try {
    originHost = new URL(origin).host;
  } catch {
    /* origen ilegible */
  }
  if (!host || originHost !== host) throw new ApiError(403, 'Origen no permitido.');
}

/** Devuelve el usuario de la sesión o lanza 401. Consulta el almacén, así que un usuario eliminado o con rol cambiado pierde el acceso al instante. */
export async function requireUser(req: NextRequest): Promise<StoredUser> {
  assertSameOrigin(req);
  const payload = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!payload) throw new ApiError(401, 'No autenticado.');
  const user = findById(payload.uid);
  if (!user || user.tokenVersion !== payload.tv) throw new ApiError(401, 'Sesión inválida o expirada.');
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<StoredUser> {
  const user = await requireUser(req);
  if (user.role !== 'administrador') {
    audit({ type: 'access.denied', outcome: 'denied', actor: user.id, ip: clientIp(req), detail: `${req.method} ${req.nextUrl.pathname} (requiere administrador)` });
    throw new ApiError(403, 'No tienes permiso para esta acción.');
  }
  return user;
}

/** Proyecto efectivo de la consulta (por defecto el mismo que usa el datasource). */
export function effectiveProject(proyecto?: string): string {
  return proyecto || 'proj-001';
}

/** Verifica sesión + acceso al módulo + acceso al proyecto solicitado. */
export async function authorizeModule(req: NextRequest, modulo: ModuleKey, proyecto?: string): Promise<StoredUser> {
  const user = await requireUser(req);
  if (!MODULE_ROLES[modulo]?.includes(user.role)) {
    audit({ type: 'access.denied', outcome: 'denied', actor: user.id, ip: clientIp(req), detail: `módulo ${modulo}` });
    throw new ApiError(403, 'No tienes acceso a este módulo.');
  }
  const pid = effectiveProject(proyecto);
  if (!PROJECT_ID_RE.test(pid)) throw new ApiError(400, 'Proyecto inválido.');
  if (user.role !== 'administrador' && !(user.proyectos || []).includes(pid)) {
    audit({ type: 'access.denied', outcome: 'denied', actor: user.id, ip: clientIp(req), detail: `módulo ${modulo}, proyecto ${pid}` });
    throw new ApiError(403, 'No tienes acceso a este proyecto.');
  }
  return user;
}

export function clientIp(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
}
