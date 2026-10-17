import fs from 'node:fs';
import path from 'node:path';
import { ApiError } from '@/lib/api/server';
import {
  FILTRO_CATEGORIAS, FILTRO_MAX_OPCIONES, FILTRO_NOMBRE_RE, categoriaPorId,
  type FiltroCategoriaDTO,
} from '@/lib/filtros';

/**
 * Almacén de las opciones agregadas por el administrador (las predeterminadas viven en el código).
 * Igual que los usuarios: archivo local en desarrollo y memoria del servidor en Vercel,
 * hasta que exista una base de datos persistente.
 */

type Extras = Record<string, string[]>;

const DATA_FILE = path.join(process.cwd(), '.data', 'filtros.json');
const canPersist = !process.env.VERCEL;
const g = globalThis as unknown as { __iencinasFiltros?: Extras };

function load(): Extras {
  const out: Extras = {};
  let parsed: unknown = {};
  if (canPersist) {
    try {
      parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      /* primera ejecución o archivo ilegible */
    }
  }
  for (const c of FILTRO_CATEGORIAS) {
    const raw = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>)[c.id] : undefined;
    out[c.id] = Array.isArray(raw)
      ? raw.filter((v): v is string => typeof v === 'string' && FILTRO_NOMBRE_RE.test(v)).slice(0, FILTRO_MAX_OPCIONES)
      : [];
  }
  return out;
}

function store(): Extras {
  return (g.__iencinasFiltros ??= load());
}

function persist() {
  if (!canPersist) return;
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(store(), null, 2), { mode: 0o600 });
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.warn('[filtros] no se pudo guardar .data/filtros.json:', (err as Error).message);
  }
}

const norm = (s: string) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function listFiltros(): FiltroCategoriaDTO[] {
  const extras = store();
  return FILTRO_CATEGORIAS.map(c => ({
    id: c.id,
    label: c.label,
    modulo: c.modulo,
    descripcion: c.descripcion,
    opciones: [
      ...c.predeterminadas.map(valor => ({ valor, predeterminada: true })),
      ...(extras[c.id] || []).map(valor => ({ valor, predeterminada: false })),
    ],
  }));
}

function parseNombre(v: unknown): string {
  const nombre = typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '';
  if (!nombre) throw new ApiError(400, 'Escribe el nombre de la opción.');
  if (!FILTRO_NOMBRE_RE.test(nombre)) {
    throw new ApiError(400, 'El nombre debe tener entre 1 y 40 caracteres: letras, números, espacios y . , & ( ) / _ -');
  }
  return nombre;
}

function parseCategoria(v: unknown) {
  const cat = typeof v === 'string' ? categoriaPorId(v) : undefined;
  if (!cat) throw new ApiError(400, 'Elige una categoría válida.');
  return cat;
}

export function addFiltro(body: Record<string, unknown>): { categoria: string; valor: string } {
  const cat = parseCategoria(body.categoria);
  const nombre = parseNombre(body.nombre);
  const extras = store();
  const actuales = [...cat.predeterminadas, ...(extras[cat.id] || [])];
  if (actuales.some(o => norm(o) === norm(nombre))) {
    throw new ApiError(409, `«${nombre}» ya existe en ${cat.label}.`);
  }
  if ((extras[cat.id] || []).length >= FILTRO_MAX_OPCIONES) {
    throw new ApiError(400, `Se alcanzó el máximo de ${FILTRO_MAX_OPCIONES} opciones agregadas en ${cat.label}.`);
  }
  extras[cat.id] = [...(extras[cat.id] || []), nombre];
  persist();
  return { categoria: cat.id, valor: nombre };
}

export function removeFiltro(body: Record<string, unknown>): { categoria: string; valor: string } {
  const cat = parseCategoria(body.categoria);
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  if (cat.predeterminadas.some(o => norm(o) === norm(nombre))) {
    throw new ApiError(400, 'Las opciones predeterminadas no se pueden eliminar.');
  }
  const extras = store();
  const actuales = extras[cat.id] || [];
  const idx = actuales.findIndex(o => o === nombre);
  if (idx < 0) throw new ApiError(404, 'La opción no existe.');
  extras[cat.id] = actuales.filter((_, i) => i !== idx);
  persist();
  return { categoria: cat.id, valor: nombre };
}
