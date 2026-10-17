import fs from 'node:fs';
import path from 'node:path';
import { ApiError } from '@/lib/api/server';
import {
  FILTRO_CATEGORIAS, FILTRO_MAX_OPCIONES, FILTRO_NOMBRE_RE, categoriaPorId,
  type FiltroCategoriaDTO,
} from '@/lib/filtros';

/**
 * Almacén de las opciones agregadas por el administrador y del estado activo/inactivo de las opciones
 * (las predeterminadas viven en el código; aquí solo se guarda cuáles están desactivadas).
 * Igual que los usuarios: archivo local en desarrollo y memoria del servidor en Vercel,
 * hasta que exista una base de datos persistente.
 */

interface Agregada {
  nombre: string;
  activa: boolean;
}

interface Estado {
  agregadas: Record<string, Agregada[]>;
  /** Nombres de opciones predeterminadas que el administrador desactivó, por categoría. */
  inactivas: Record<string, string[]>;
}

const DATA_FILE = path.join(process.cwd(), '.data', 'filtros.json');
const canPersist = !process.env.VERCEL;
const g = globalThis as unknown as { __iencinasFiltros?: Estado };

const validNombre = (v: unknown): v is string => typeof v === 'string' && FILTRO_NOMBRE_RE.test(v);

function load(): Estado {
  const out: Estado = { agregadas: {}, inactivas: {} };
  let parsed: unknown = {};
  if (canPersist) {
    try {
      parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      /* primera ejecución o archivo ilegible */
    }
  }
  const root = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, unknown>;
  // Formato nuevo: { agregadas, inactivas }. Formato anterior: { categoria: [nombres] }.
  const agregadas = (root.agregadas && typeof root.agregadas === 'object' ? root.agregadas : root) as Record<string, unknown>;
  const inactivas = (root.inactivas && typeof root.inactivas === 'object' ? root.inactivas : {}) as Record<string, unknown>;

  for (const c of FILTRO_CATEGORIAS) {
    const raw = agregadas[c.id];
    out.agregadas[c.id] = Array.isArray(raw)
      ? raw
          .map((v): Agregada | null => {
            if (validNombre(v)) return { nombre: v, activa: true };
            if (v && typeof v === 'object' && validNombre((v as Agregada).nombre)) {
              return { nombre: (v as Agregada).nombre, activa: (v as Agregada).activa !== false };
            }
            return null;
          })
          .filter((v): v is Agregada => v !== null)
          .slice(0, FILTRO_MAX_OPCIONES)
      : [];
    const inact = inactivas[c.id];
    out.inactivas[c.id] = Array.isArray(inact) ? inact.filter(n => typeof n === 'string' && c.predeterminadas.includes(n)) : [];
  }
  return out;
}

function store(): Estado {
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
  const st = store();
  return FILTRO_CATEGORIAS.map(c => ({
    id: c.id,
    label: c.label,
    modulo: c.modulo,
    descripcion: c.descripcion,
    opciones: [
      ...c.predeterminadas.map(valor => ({ valor, predeterminada: true, activa: !st.inactivas[c.id].includes(valor) })),
      ...st.agregadas[c.id].map(a => ({ valor: a.nombre, predeterminada: false, activa: a.activa })),
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

function parseActiva(v: unknown, porDefecto?: boolean): boolean {
  if (v === undefined && porDefecto !== undefined) return porDefecto;
  if (typeof v !== 'boolean') throw new ApiError(400, 'El estado debe ser activo o inactivo.');
  return v;
}

/** Cantidad de opciones activas de la categoría (predeterminadas + agregadas). */
function activasDe(catId: string): number {
  const c = categoriaPorId(catId)!;
  const st = store();
  return c.predeterminadas.filter(n => !st.inactivas[catId].includes(n)).length + st.agregadas[catId].filter(a => a.activa).length;
}

export function addFiltro(body: Record<string, unknown>): { categoria: string; valor: string; activa: boolean } {
  const cat = parseCategoria(body.categoria);
  const nombre = parseNombre(body.nombre);
  const activa = parseActiva(body.activa, true);
  const st = store();
  const actuales = [...cat.predeterminadas, ...st.agregadas[cat.id].map(a => a.nombre)];
  if (actuales.some(o => norm(o) === norm(nombre))) {
    throw new ApiError(409, `«${nombre}» ya existe en ${cat.label}.`);
  }
  if (st.agregadas[cat.id].length >= FILTRO_MAX_OPCIONES) {
    throw new ApiError(400, `Se alcanzó el máximo de ${FILTRO_MAX_OPCIONES} opciones agregadas en ${cat.label}.`);
  }
  st.agregadas[cat.id] = [...st.agregadas[cat.id], { nombre, activa }];
  persist();
  return { categoria: cat.id, valor: nombre, activa };
}

/** Activa o desactiva una opción (predeterminada o agregada). Siempre debe quedar al menos una activa por categoría. */
export function setFiltroActivo(body: Record<string, unknown>): { categoria: string; valor: string; activa: boolean } {
  const cat = parseCategoria(body.categoria);
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const activa = parseActiva(body.activa);
  const st = store();

  const pred = cat.predeterminadas.find(n => n === nombre);
  const agr = st.agregadas[cat.id].find(a => a.nombre === nombre);
  if (!pred && !agr) throw new ApiError(404, 'La opción no existe.');

  const estabaActiva = pred ? !st.inactivas[cat.id].includes(pred) : !!agr?.activa;
  if (estabaActiva === activa) return { categoria: cat.id, valor: nombre, activa };
  if (!activa && activasDe(cat.id) <= 1) {
    throw new ApiError(400, `En ${cat.label} debe quedar al menos una opción activa.`);
  }

  if (pred) {
    st.inactivas[cat.id] = activa ? st.inactivas[cat.id].filter(n => n !== pred) : [...st.inactivas[cat.id], pred];
  } else if (agr) {
    agr.activa = activa;
  }
  persist();
  return { categoria: cat.id, valor: nombre, activa };
}

export function removeFiltro(body: Record<string, unknown>): { categoria: string; valor: string } {
  const cat = parseCategoria(body.categoria);
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  if (cat.predeterminadas.some(o => norm(o) === norm(nombre))) {
    throw new ApiError(400, 'Las opciones predeterminadas no se pueden eliminar (puedes desactivarlas).');
  }
  const st = store();
  const idx = st.agregadas[cat.id].findIndex(a => a.nombre === nombre);
  if (idx < 0) throw new ApiError(404, 'La opción no existe.');
  if (st.agregadas[cat.id][idx].activa && activasDe(cat.id) <= 1) {
    throw new ApiError(400, `En ${cat.label} debe quedar al menos una opción activa.`);
  }
  st.agregadas[cat.id] = st.agregadas[cat.id].filter((_, i) => i !== idx);
  persist();
  return { categoria: cat.id, valor: nombre };
}
