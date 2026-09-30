import fs from 'node:fs';
import path from 'node:path';
import { User, UserRole } from '@/types';
import { ApiError, PROJECT_ID_RE } from '@/lib/api/server';
import { hashPassword, validatePasswordPolicy } from './password';

/**
 * Almacén de usuarios del servidor. Las contraseñas solo existen aquí como hash scrypt.
 * Mientras no haya base de datos real: en local se persiste en `.data/users.json`
 * (ignorado por git); en Vercel (disco de solo lectura) vive en memoria con los usuarios semilla.
 */

export interface StoredUser extends User {
  passwordHash: string;
  tokenVersion: number;
  /** Cuenta de demostración con contraseña inicial conocida; se desactiva en producción hasta cambiar la clave. */
  demo?: boolean;
}

export const ROLES: UserRole[] = ['finanzas', 'comercial', 'marketing', 'administrador'];

const PERMISSIONS_BY_ROLE: Record<UserRole, string[]> = {
  finanzas: ['finanzas', 'reportes'],
  comercial: ['comercial', 'reportes'],
  marketing: ['marketing', 'reportes'],
  administrador: ['finanzas', 'comercial', 'marketing', 'valor-empresa', 'admin', 'reportes'],
};

// Cuentas de demostración. Las contraseñas iniciales son de ejemplo: cámbialas antes de producción.
const SEED: StoredUser[] = [
  {
    id: '1', nombre: 'Juan', apellido1: 'Díaz', apellido2: 'Morales', email: 'juan@iencinas.cl',
    role: 'finanzas', departamento: 'Finanzas', permissions: PERMISSIONS_BY_ROLE.finanzas,
    proyectos: ['proj-001', 'proj-002'], createdAt: '2026-01-15', tokenVersion: 1, demo: true,
    passwordHash: 'scrypt$16384$8$1$sSkLtsrNr5a7/+7EoutZtw==$k9t1AgcKRHBYZF8HadAPoHzmbrnaZ5/3vTHNvW8jf3M=',
  },
  {
    id: '2', nombre: 'María', apellido1: 'Rodríguez', apellido2: 'García', email: 'maria@iencinas.cl',
    role: 'comercial', departamento: 'Comercial', permissions: PERMISSIONS_BY_ROLE.comercial,
    proyectos: ['proj-001', 'proj-009'], createdAt: '2026-01-20', tokenVersion: 1, demo: true,
    passwordHash: 'scrypt$16384$8$1$7M9i6sqc0k4oMRzdqf4Kaw==$P9AQxMPMUOv3HU1kD8mw4okCSmLPtbdIilGlUOTVfQk=',
  },
  {
    id: '3', nombre: 'Carlos', apellido1: 'Cortés', apellido2: 'Pérez', email: 'carlos@iencinas.cl',
    role: 'marketing', departamento: 'Marketing', permissions: PERMISSIONS_BY_ROLE.marketing,
    proyectos: ['proj-001', 'proj-002', 'proj-009'], createdAt: '2026-02-01', tokenVersion: 1, demo: true,
    passwordHash: 'scrypt$16384$8$1$XoccOSXT3Iy9kDgMrwL9oQ==$zZ7kZQXOS4cRHZ3fqg+QAkWoTtjDWrO56S/92URN37I=',
  },
  {
    id: '4', nombre: 'Ana', apellido1: 'Silva', apellido2: 'Torres', email: 'ana@iencinas.cl',
    role: 'administrador', departamento: 'Administración', permissions: PERMISSIONS_BY_ROLE.administrador,
    proyectos: ['proj-001', 'proj-002', 'proj-009'], createdAt: '2026-01-01', tokenVersion: 1, demo: true,
    passwordHash: 'scrypt$16384$8$1$J5ShLudRul6DGC8xMuoPMg==$xQ8hzDkryVLXQYBgwar+X6ujbKuvfk+wRq2fCmntxRs=',
  },
];

/** Hash de relleno: se verifica contra él cuando el correo no existe, para que el tiempo de respuesta no delate cuentas. */
export const DUMMY_HASH = SEED[0].passwordHash;

const DATA_FILE = path.join(process.cwd(), '.data', 'users.json');
const canPersist = !process.env.VERCEL;

const g = globalThis as unknown as { __iencinasUsers?: StoredUser[] };

function load(): StoredUser[] {
  if (canPersist) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as StoredUser[];
    } catch {
      /* primera ejecución o archivo ilegible: se usan los usuarios semilla */
    }
  }
  return SEED.map(u => ({ ...u, proyectos: [...(u.proyectos || [])] }));
}

function store(): StoredUser[] {
  return (g.__iencinasUsers ??= load());
}

function persist() {
  if (!canPersist) return;
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(store(), null, 2), { mode: 0o600 });
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.warn('[users] no se pudo guardar .data/users.json:', (err as Error).message);
  }
}

export function toPublic(u: StoredUser): User {
  // Desestructurar deja fuera passwordHash y tokenVersion.
  const { passwordHash: _h, tokenVersion: _t, demo: _d, ...safe } = u;
  void _h; void _t; void _d;
  return safe;
}

export function listUsers(): User[] {
  return store().map(toPublic);
}

export function findById(id: string): StoredUser | undefined {
  return store().find(u => u.id === id);
}

export function findByEmail(email: string): StoredUser | undefined {
  const e = email.trim().toLowerCase();
  return store().find(u => u.email.toLowerCase() === e);
}

/* ── Validación ─────────────────────────────────────────────────────────── */

const NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ſ'’. -]{1,60}$/;
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function parseFields(body: Record<string, unknown>, partial: boolean) {
  const out: Partial<Pick<User, 'nombre' | 'apellido1' | 'apellido2' | 'email' | 'role' | 'departamento' | 'proyectos'>> = {};

  const need = (key: string) => {
    if (!partial && body[key] === undefined) throw new ApiError(400, `Falta el campo "${key}".`);
    return body[key] !== undefined;
  };

  if (need('nombre')) {
    const v = str(body.nombre);
    if (!NAME_RE.test(v)) throw new ApiError(400, 'Nombre inválido.');
    out.nombre = v;
  }
  if (need('apellido1')) {
    const v = str(body.apellido1);
    if (!NAME_RE.test(v)) throw new ApiError(400, 'Primer apellido inválido.');
    out.apellido1 = v;
  }
  if (body.apellido2 !== undefined) {
    const v = str(body.apellido2);
    if (v && !NAME_RE.test(v)) throw new ApiError(400, 'Segundo apellido inválido.');
    out.apellido2 = v;
  } else if (!partial) out.apellido2 = '';
  if (need('email')) {
    const v = str(body.email).toLowerCase();
    if (v.length > 254 || !EMAIL_RE.test(v)) throw new ApiError(400, 'Correo electrónico inválido.');
    out.email = v;
  }
  if (need('role')) {
    if (!ROLES.includes(body.role as UserRole)) throw new ApiError(400, 'Rol inválido.');
    out.role = body.role as UserRole;
  }
  if (body.departamento !== undefined) {
    const v = str(body.departamento);
    if (v.length < 1 || v.length > 60 || /[<>]/.test(v)) throw new ApiError(400, 'Área de trabajo inválida.');
    out.departamento = v;
  } else if (!partial) out.departamento = 'General';
  if (body.proyectos !== undefined) {
    if (!Array.isArray(body.proyectos) || body.proyectos.length > 100 ||
        !body.proyectos.every(p => typeof p === 'string' && PROJECT_ID_RE.test(p))) {
      throw new ApiError(400, 'Lista de proyectos inválida.');
    }
    out.proyectos = Array.from(new Set(body.proyectos as string[]));
  } else if (!partial) out.proyectos = [];

  return out;
}

function adminCount() {
  return store().filter(u => u.role === 'administrador').length;
}

/* ── Operaciones ────────────────────────────────────────────────────────── */

export async function createUser(body: Record<string, unknown>): Promise<User> {
  const fields = parseFields(body, false) as Required<ReturnType<typeof parseFields>>;
  const policyError = validatePasswordPolicy(body.password);
  if (policyError) throw new ApiError(400, policyError);
  if (findByEmail(fields.email)) throw new ApiError(409, 'Ya existe un usuario con ese correo.');

  const user: StoredUser = {
    id: crypto.randomUUID(),
    ...fields,
    permissions: PERMISSIONS_BY_ROLE[fields.role],
    createdAt: new Date().toISOString().split('T')[0],
    passwordHash: await hashPassword(body.password as string),
    tokenVersion: 1,
  };
  store().push(user);
  persist();
  return toPublic(user);
}

export async function updateUser(id: string, body: Record<string, unknown>): Promise<User> {
  const existing = findById(id);
  if (!existing) throw new ApiError(404, 'Usuario no encontrado.');
  const fields = parseFields(body, true);

  if (fields.email && fields.email !== existing.email.toLowerCase()) {
    const other = findByEmail(fields.email);
    if (other && other.id !== id) throw new ApiError(409, 'Ya existe un usuario con ese correo.');
  }
  if (fields.role && fields.role !== existing.role) {
    if (existing.role === 'administrador' && adminCount() <= 1) {
      throw new ApiError(409, 'Debe existir al menos un administrador.');
    }
    existing.permissions = PERMISSIONS_BY_ROLE[fields.role];
    existing.tokenVersion += 1; // el cambio de rol cierra sus sesiones abiertas
  }
  if (body.password !== undefined && body.password !== '') {
    const policyError = validatePasswordPolicy(body.password);
    if (policyError) throw new ApiError(400, policyError);
    existing.passwordHash = await hashPassword(body.password as string);
    existing.tokenVersion += 1;
    existing.demo = false;
  }
  Object.assign(existing, fields);
  persist();
  return toPublic(existing);
}

export function deleteUser(id: string): void {
  const existing = findById(id);
  if (!existing) throw new ApiError(404, 'Usuario no encontrado.');
  if (existing.role === 'administrador' && adminCount() <= 1) {
    throw new ApiError(409, 'Debe existir al menos un administrador.');
  }
  g.__iencinasUsers = store().filter(u => u.id !== id);
  persist();
}

/** El propio usuario cambia su contraseña. Devuelve el usuario actualizado (con tokenVersion nuevo). */
export async function changeOwnPassword(id: string, newPassword: unknown): Promise<StoredUser> {
  const existing = findById(id);
  if (!existing) throw new ApiError(404, 'Usuario no encontrado.');
  const policyError = validatePasswordPolicy(newPassword);
  if (policyError) throw new ApiError(400, policyError);
  existing.passwordHash = await hashPassword(newPassword as string);
  existing.tokenVersion += 1;
  existing.demo = false;
  persist();
  return existing;
}

/** Las cuentas de demostración no pueden iniciar sesión en producción salvo opt-in explícito (ALLOW_DEMO_ACCOUNTS=true). */
export function isLoginAllowed(u: StoredUser): boolean {
  if (!u.demo) return true;
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEMO_ACCOUNTS === 'true';
}
