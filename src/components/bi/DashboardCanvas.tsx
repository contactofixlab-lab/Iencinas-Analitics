'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Responsive, WidthProvider, type Layout as RglLayout, type Layouts } from 'react-grid-layout';
import { AlertCircle, CheckCircle2, EyeOff, GripVertical, Move, Pencil, PencilRuler, Save, Trash2, X } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import ChartRenderer from './ChartRenderer';
import type { BiModule, ModuleItem, ModuleView } from '@/lib/bi/types';
import { chartTypeDef } from '@/lib/bi/catalog';

const Grid = WidthProvider(Responsive);

async function call<T>(url: string, method: 'GET' | 'PUT' | 'DELETE' | 'PATCH', body?: unknown): Promise<T | undefined> {
  const res = await fetch(url, {
    method,
    cache: 'no-store',
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json: { ok?: boolean; error?: string; data?: T } | null = null;
  try {
    json = await res.json();
  } catch {
    /* sin cuerpo */
  }
  if (!res.ok || !json || json.ok === false) throw new Error(json?.error || `Error ${res.status}`);
  return json.data;
}

const toRgl = (items: ModuleItem[]): RglLayout[] =>
  items.map(it => ({ i: it.chartId, x: it.layout.x, y: it.layout.y, w: it.layout.w, h: it.layout.h, minW: 2, minH: 2 }));

/**
 * Gráficos de un módulo. Los ve cualquier persona con acceso al módulo; quien tenga acceso al Diseñador
 * puede reorganizarlos (mover y cambiar de tamaño), editarlos, desactivarlos o quitarlos.
 * `ctx` son los filtros del módulo (proyecto elegido, obra, meses…): se aplican a los gráficos que lo tengan activado.
 */
export default function DashboardCanvas({ modulo, ctx }: { modulo: BiModule; ctx?: Record<string, string> }) {
  const [view, setView] = useState<ModuleView | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [layouts, setLayouts] = useState<Layouts>({});
  const [toRemove, setToRemove] = useState<ModuleItem | null>(null);
  const seq = useRef(0);

  const query = useMemo(() => new URLSearchParams(ctx ?? {}).toString(), [ctx]);

  const load = useCallback(async () => {
    const id = ++seq.current;
    setRefreshing(true);
    try {
      const v = (await call<ModuleView>(`/api/bi/modulo/${modulo}${query ? `?${query}` : ''}`, 'GET')) ?? null;
      if (id !== seq.current) return;
      setView(v);
      setLayouts({ lg: toRgl(v?.items ?? []), md: toRgl(v?.items ?? []) });
      setError('');
    } catch (err) {
      if (id !== seq.current) return;
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los gráficos.');
    } finally {
      if (id === seq.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [modulo, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = view?.items ?? [];
  const editable = !!view?.editable;
  const baseLayouts = useMemo<Layouts>(() => ({ lg: toRgl(items), md: toRgl(items) }), [items]);

  async function save() {
    const lg = layouts.lg ?? layouts.md ?? [];
    setSaving(true);
    setError('');
    try {
      await call(`/api/bi/modulo/${modulo}`, 'PUT', { layout: lg.map(l => ({ chartId: l.i, x: l.x, y: l.y, w: l.w, h: l.h })) });
      setEditing(false);
      setMsg('Se guardó el diseño de la vista.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el diseño.');
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setEditing(false);
    setLayouts(baseLayouts);
  }

  async function remove() {
    if (!toRemove) return;
    try {
      await call(`/api/bi/modulo/${modulo}`, 'DELETE', { chartId: toRemove.chartId });
      setMsg(`«${toRemove.spec.title}» se quitó de este módulo (sigue guardado en el Diseñador).`);
      setToRemove(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo quitar el gráfico.');
      setToRemove(null);
    }
  }

  async function deactivate(it: ModuleItem) {
    try {
      await call(`/api/bi/charts/${it.chartId}`, 'PATCH', { activo: false });
      setMsg(`«${it.spec.title}» está desactivado: ya no se muestra. Puedes activarlo de nuevo en el Diseñador.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo desactivar el gráfico.');
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-hidden="true">
        {[0, 1].map(i => <div key={i} className="skeleton h-[368px]" />)}
      </div>
    );
  }
  if (!view) return error ? <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm w-fit">{error}</p> : null;
  if (items.length === 0 && !editable) return null;

  return (
    <section aria-label="Gráficos" className="space-y-4">
      {(editable || msg || error || editing) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {editing && (
              <p role="status" className="chip chip-info !rounded-2xl !px-4 !py-2 !text-sm max-w-full">
                Arrastra una tarjeta por su encabezado para moverla y tira de la esquina inferior derecha para cambiar su tamaño. Luego guarda el diseño.
              </p>
            )}
            {msg && !editing && (
              <p role="status" className="chip chip-ok !rounded-2xl !px-4 !py-2 !text-sm flex items-start gap-2 max-w-full">
                <CheckCircle2 size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />{msg}
                <button type="button" onClick={() => setMsg('')} aria-label="Cerrar aviso" className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-white/60"><X size={13} strokeWidth={2.2} /></button>
              </p>
            )}
            {error && (
              <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2 !text-sm flex items-start gap-2 max-w-full">
                <AlertCircle size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />{error}
              </p>
            )}
          </div>
          {editable && (
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              {editing ? (
                <>
                  <button type="button" onClick={cancel} disabled={saving} className="btn btn-secondary btn-sm"><X size={14} />Cancelar</button>
                  <button type="button" onClick={save} disabled={saving} className="btn btn-primary btn-sm"><Save size={14} />{saving ? 'Guardando…' : 'Guardar diseño'}</button>
                </>
              ) : (
                <>
                  <Link href="/dashboard/disenador" className="btn btn-ghost btn-sm"><PencilRuler size={14} />Diseñador</Link>
                  {items.length > 0 && (
                    <button type="button" onClick={() => { setMsg(''); setEditing(true); }} className="btn btn-secondary btn-sm"><Move size={14} />Organizar</button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card text-center" style={{ padding: 'var(--pad-card)' }}>
          <p className="text-sm text-soft">Este módulo no tiene gráficos visibles.</p>
          <Link href="/dashboard/disenador" className="btn btn-primary btn-sm mt-4 inline-flex"><PencilRuler size={14} />Agregar gráficos en el Diseñador</Link>
        </div>
      ) : (
        <div className={`transition-opacity duration-200 ${refreshing ? 'opacity-70' : 'opacity-100'}`} aria-busy={refreshing}>
          <Grid
            className={`bi-grid ${editing ? 'bi-grid--editing' : ''}`}
            layouts={editing ? layouts : baseLayouts}
            breakpoints={{ lg: 1024, md: 768, sm: 0 }}
            cols={{ lg: 12, md: 12, sm: 1 }}
            rowHeight={80}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            isDraggable={editing}
            isResizable={editing}
            draggableHandle=".bi-drag"
            compactType="vertical"
            onLayoutChange={(_cur: RglLayout[], all: Layouts) => { if (editing) setLayouts(all); }}
          >
            {items.map(it => (
              <div key={it.chartId}>
                <article className="glass-card relative h-full flex flex-col overflow-hidden" style={{ padding: '14px 16px' }}>
                  <div className="sheen" />
                  <header className={`bi-drag flex items-start gap-2 mb-2 ${editing ? 'cursor-move' : ''}`}>
                    {editing && <GripVertical size={16} className="text-mute mt-0.5 shrink-0" aria-hidden="true" />}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-ink truncate" title={it.spec.title}>{it.spec.title}</h3>
                      {it.spec.subtitle && <p className="text-xs text-soft truncate">{it.spec.subtitle}</p>}
                    </div>
                    {editing && (
                      <div className="flex items-center shrink-0" onMouseDown={e => e.stopPropagation()}>
                        <Link href={`/dashboard/disenador/${it.chartId}`} aria-label={`Editar ${it.spec.title}`} title="Editar" className="btn btn-ghost btn-icon !w-8 !h-8 text-brand-deep"><Pencil size={15} strokeWidth={1.8} /></Link>
                        <button type="button" onClick={() => deactivate(it)} aria-label={`Desactivar ${it.spec.title}`} title="Desactivar (ocultar)" className="btn btn-ghost btn-icon !w-8 !h-8 text-brand-deep"><EyeOff size={15} strokeWidth={1.8} /></button>
                        <button type="button" onClick={() => setToRemove(it)} aria-label={`Quitar ${it.spec.title} de este módulo`} title="Quitar de este módulo" className="btn btn-ghost btn-icon !w-8 !h-8 text-danger-ink"><Trash2 size={15} strokeWidth={1.8} /></button>
                      </div>
                    )}
                  </header>
                  <div className="flex-1 min-h-0 relative z-10">
                    {it.result ? (
                      <ChartRenderer spec={it.spec} result={it.result} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-danger-ink text-center px-4">
                        {it.error || `No se pudo calcular este ${chartTypeDef(it.spec.type)?.label.toLowerCase() ?? 'gráfico'}.`}
                      </div>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </Grid>
        </div>
      )}

      {toRemove && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="modal-panel p-7 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(var(--danger) / 0.14)' }}>
              <Trash2 size={22} strokeWidth={1.8} className="text-danger-ink" />
            </div>
            <h3 className="text-lg font-semibold text-ink text-center">¿Quitar de este módulo?</h3>
            <p className="text-soft text-sm text-center mt-1 mb-6">«{toRemove.spec.title}» dejará de verse aquí, pero seguirá guardado en el Diseñador.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setToRemove(null)} className="btn btn-secondary flex-1">Cancelar</button>
              <button type="button" onClick={remove} className="btn btn-danger flex-1">Quitar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
