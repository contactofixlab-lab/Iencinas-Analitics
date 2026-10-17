import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ApiError } from '@/lib/api/server';
import { defaultLayout } from '@/lib/bi/catalog';
import type { BiModule, ChartListItem, ChartSpec, Layout, Placement, SavedChart } from '@/lib/bi/types';
import { BI_MODULES } from '@/lib/bi/types';
import { SYSTEM_CHARTS, SYSTEM_VERSION, systemChart } from './system';

/**
 * Gráficos guardados y su ubicación en cada módulo.
 * Igual que los usuarios y los filtros: archivo local en desarrollo y memoria del servidor en Vercel,
 * hasta que exista una base de datos persistente (la forma de los datos ya es la de una tabla).
 * Los gráficos del sistema se siembran al iniciar; si se eliminan, no vuelven hasta pedir «Restaurar».
 */

interface State {
  charts: SavedChart[];
  placements: Placement[];
  /** Ids de gráficos del sistema que se eliminaron a propósito (no se vuelven a sembrar solos). */
  eliminados: string[];
  systemVersion: number;
}

const MAX_CHARTS = 150;
const MAX_PER_MODULE = 40;
const GRID_COLS = 12;

const DATA_FILE = path.join(process.cwd(), '.data', 'bi.json');
const canPersist = !process.env.VERCEL;
const g = globalThis as unknown as { __iencinasBi?: State };

const MODULE_IDS = BI_MODULES.map(m => m.id);
const isModule = (v: unknown): v is BiModule => typeof v === 'string' && (MODULE_IDS as string[]).includes(v);

const now = () => new Date().toISOString();
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function load(): State {
  let st: State = { charts: [], placements: [], eliminados: [], systemVersion: 0 };
  if (canPersist) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as Partial<State>;
      const charts = (Array.isArray(parsed.charts) ? parsed.charts : [])
        .filter(c => c && typeof c.id === 'string' && c.spec)
        .map(c => ({ ...c, activo: c.activo !== false }));
      const ids = new Set(charts.map(c => c.id));
      st = {
        charts,
        placements: (Array.isArray(parsed.placements) ? parsed.placements : []).filter(p => p && ids.has(p.chartId) && isModule(p.modulo)),
        eliminados: Array.isArray(parsed.eliminados) ? parsed.eliminados.filter(x => typeof x === 'string') : [],
        systemVersion: typeof parsed.systemVersion === 'number' ? parsed.systemVersion : 0,
      };
    } catch {
      /* primera ejecución o archivo ilegible */
    }
  }
  seedSystem(st);
  return st;
}

/** Crea los gráficos del sistema que falten (salvo los eliminados a propósito). Devuelve cuántos creó. */
function seedSystem(st: State, includeDeleted = false): number {
  let created = 0;
  for (const sc of SYSTEM_CHARTS) {
    if (st.charts.some(c => c.id === sc.id)) continue;
    if (!includeDeleted && st.eliminados.includes(sc.id)) continue;
    st.charts.push({ id: sc.id, spec: clone(sc.spec), createdBy: 'sistema', createdAt: now(), updatedAt: now(), system: true, activo: true });
    st.placements.push({ chartId: sc.id, modulo: sc.modulo, ...sc.layout });
    created++;
  }
  st.systemVersion = SYSTEM_VERSION;
  return created;
}

function store(): State {
  return (g.__iencinasBi ??= load());
}

function persist() {
  if (!canPersist) return;
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(store(), null, 2), { mode: 0o600 });
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.warn('[bi] no se pudo guardar .data/bi.json:', (err as Error).message);
  }
}

const newId = () => `c_${crypto.randomBytes(5).toString('hex')}`;

export function modulosDe(chartId: string): BiModule[] {
  return store().placements.filter(p => p.chartId === chartId).map(p => p.modulo);
}

export function listCharts(): ChartListItem[] {
  return store().charts
    .map(c => ({ ...c, modulos: modulosDe(c.id) }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getChart(id: string): SavedChart {
  const c = store().charts.find(x => x.id === id);
  if (!c) throw new ApiError(404, 'El gráfico no existe.');
  return c;
}

export function createChart(spec: ChartSpec, userId: string): SavedChart {
  const st = store();
  if (st.charts.length >= MAX_CHARTS) throw new ApiError(400, `Se alcanzó el máximo de ${MAX_CHARTS} gráficos guardados.`);
  const chart: SavedChart = { id: newId(), spec, createdBy: userId, createdAt: now(), updatedAt: now(), activo: true };
  st.charts.push(chart);
  persist();
  return chart;
}

export function updateChart(id: string, spec: ChartSpec): SavedChart {
  const chart = getChart(id);
  chart.spec = spec;
  chart.updatedAt = now();
  persist();
  return chart;
}

/** Activa o desactiva un gráfico: inactivo no se muestra en ningún módulo, pero sigue guardado. */
export function setActivo(id: string, activo: unknown): SavedChart {
  if (typeof activo !== 'boolean') throw new ApiError(400, 'El estado debe ser activo o inactivo.');
  const chart = getChart(id);
  chart.activo = activo;
  chart.updatedAt = now();
  persist();
  return chart;
}

export function deleteChart(id: string): { system: boolean } {
  const st = store();
  const chart = getChart(id);
  if (chart.system && !st.eliminados.includes(id)) st.eliminados.push(id);
  st.charts = st.charts.filter(c => c.id !== id);
  st.placements = st.placements.filter(p => p.chartId !== id);
  persist();
  return { system: !!chart.system };
}

/** Vuelve a crear los gráficos del sistema eliminados. Devuelve cuántos recuperó. */
export function restoreSystem(): number {
  const st = store();
  const n = seedSystem(st, true);
  st.eliminados = [];
  persist();
  return n;
}

export function eliminadosDelSistema(): { id: string; title: string; modulo: BiModule }[] {
  const st = store();
  return st.eliminados
    .map(id => systemChart(id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map(s => ({ id: s.id, title: s.spec.title, modulo: s.modulo }));
}

/** Devuelve un gráfico del sistema a su definición original (conserva dónde está publicado). */
export function resetSystemChart(id: string): SavedChart {
  const chart = getChart(id);
  const def = systemChart(id);
  if (!chart.system || !def) throw new ApiError(400, 'Solo los gráficos del sistema tienen una definición original.');
  chart.spec = clone(def.spec);
  chart.updatedAt = now();
  persist();
  return chart;
}

/** Deja el gráfico publicado exactamente en los módulos indicados (los nuevos se acomodan al final de la vista). */
export function setPublicaciones(chartId: string, modulos: unknown): BiModule[] {
  const chart = getChart(chartId);
  if (!Array.isArray(modulos)) throw new ApiError(400, 'Indica los módulos donde se publicará.');
  const wanted = Array.from(new Set(modulos.filter(isModule)));
  const st = store();

  for (const m of wanted) {
    if (st.placements.some(p => p.chartId === chartId && p.modulo === m)) continue;
    const enModulo = st.placements.filter(p => p.modulo === m);
    if (enModulo.length >= MAX_PER_MODULE) throw new ApiError(400, `El módulo ${m} ya tiene ${MAX_PER_MODULE} gráficos.`);
    const { w, h } = defaultLayout(chart.spec.type);
    // Se acomoda a la derecha del último gráfico si cabe en la misma fila; si no, abre una fila nueva abajo.
    const last = [...enModulo].sort((a, b) => a.y - b.y || a.x - b.x).pop();
    const cabe = last && last.x + last.w + w <= GRID_COLS;
    const x = cabe ? last!.x + last!.w : 0;
    const y = cabe ? last!.y : enModulo.reduce((acc, p) => Math.max(acc, p.y + p.h), 0);
    st.placements.push({ chartId, modulo: m, x, y, w, h });
  }
  st.placements = st.placements.filter(p => p.chartId !== chartId || wanted.includes(p.modulo));
  persist();
  return modulosDe(chartId);
}

/** Gráficos ACTIVOS publicados en un módulo, en el orden en que se ven. */
export function placementsOf(modulo: BiModule): (Placement & { chart: SavedChart })[] {
  const st = store();
  return st.placements
    .filter(p => p.modulo === modulo)
    .map(p => ({ ...p, chart: st.charts.find(c => c.id === p.chartId)! }))
    .filter(p => p.chart && p.chart.activo)
    .sort((a, b) => a.y - b.y || a.x - b.x);
}

const clampInt = (v: unknown, min: number, max: number) => Math.min(Math.max(Math.floor(Number(v) || 0), min), max);

export function saveLayout(modulo: BiModule, items: unknown): void {
  if (!Array.isArray(items) || items.length > MAX_PER_MODULE) throw new ApiError(400, 'Diseño inválido.');
  const st = store();
  for (const it of items) {
    if (!it || typeof it !== 'object') throw new ApiError(400, 'Diseño inválido.');
    const r = it as Record<string, unknown>;
    const p = st.placements.find(x => x.modulo === modulo && x.chartId === r.chartId);
    if (!p) continue;
    const w = clampInt(r.w, 1, GRID_COLS);
    const layout: Layout = { w, h: clampInt(r.h, 1, 20), x: clampInt(r.x, 0, GRID_COLS - w), y: clampInt(r.y, 0, 1000) };
    Object.assign(p, layout);
  }
  persist();
}

export function removePlacement(modulo: BiModule, chartId: string): void {
  const st = store();
  st.placements = st.placements.filter(p => !(p.modulo === modulo && p.chartId === chartId));
  persist();
}

export { isModule };
