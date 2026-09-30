import { NewUserInput, User } from '@/types';

/**
 * Cliente de autenticación. La sesión vive en una cookie HttpOnly firmada por el servidor:
 * el navegador ya no guarda usuarios ni contraseñas (antes estaban en localStorage).
 */

export class ApiRequestError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    cache: 'no-store',
    credentials: 'same-origin',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  let json: { ok?: boolean; error?: string; [k: string]: unknown } | null = null;
  try {
    json = await res.json();
  } catch {
    /* respuesta sin cuerpo JSON */
  }
  if (!res.ok || !json || json.ok === false) {
    throw new ApiRequestError(json?.error || `Error ${res.status}`, res.status);
  }
  return json as T;
}

/** Usuario de la sesión actual, o null si no hay sesión válida. */
export async function fetchCurrentUser(): Promise<User | null> {
  const r = await request<{ user: User | null }>('/api/auth/me');
  return r.user ?? null;
}

export async function login(email: string, password: string): Promise<User> {
  const r = await request<{ user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return r.user;
}

/** Solo desarrollo local: el servidor responde 404 en producción. */
export async function devLogin(email: string): Promise<User> {
  const r = await request<{ user: User }>('/api/auth/dev-login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return r.user;
}

export async function logout(): Promise<void> {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } catch {
    /* si falla la red, igualmente se limpia el estado local */
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await request('/api/auth/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/* ── Administración de usuarios (solo administradores; el servidor lo verifica) ── */

export async function getUsers(): Promise<User[]> {
  const r = await request<{ data: User[] }>('/api/usuarios');
  return r.data;
}

export async function createUser(data: NewUserInput): Promise<User> {
  const r = await request<{ data: User }>('/api/usuarios', { method: 'POST', body: JSON.stringify(data) });
  return r.data;
}

export async function updateUser(id: string, data: Partial<NewUserInput>): Promise<User> {
  const r = await request<{ data: User }>(`/api/usuarios/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return r.data;
}

export async function deleteUser(id: string): Promise<void> {
  await request(`/api/usuarios/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
