'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Copy, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ChartThumb from '@/components/bi/ChartThumb';
import FilterPanel, { type FilterConfig } from '@/components/FilterPanel';
import GlassCheck from '@/components/GlassCheck';
import { CHART_ICONS } from '@/components/bi/icons';
import { chartTypeDef } from '@/lib/bi/catalog';
import { canDesign } from '@/lib/bi/permissions';
import { BI_MODULES, type ChartListItem, type DataSourceDef } from '@/lib/bi/types';

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...init });
  let json: { ok?: boolean; error?: string; data?: T } | null = null;
  try {
    json = await res.json();
  } catch {
    /* sin cuerpo */
  }
  if (!res.ok || !json || json.ok === false) throw new Error(json?.error || `Error ${res.status}`);
  return json.data as T;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
const moduloLabel = (id: string) => BI_MODULES.find(m => m.id === id)?.label ?? id;

export default function DisenadorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [charts, setCharts] = useState<ChartListItem[] | null>(null);
  const [fuentes, setFuentes] = useState<DataSourceDef[]>([]);
  const [eliminados, setEliminados] = useState<{ id: string; title: string; modulo: string }[]>([]);
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [filtros, setFiltros] = useState<FilterConfig>({});
  const [toDelete, setToDelete] = useState<ChartListItem | null>(null);

  useEffect(() => {
    if (user && !canDesign(user.role)) router.replace('/dashboard/finanzas');
  }, [user, router]);

  const load = useCallback(async () => {
    try {
      const [c, f, e] = await Promise.all([
        call<ChartListItem[]>('/api/bi/charts'),
        call<DataSourceDef[]>('/api/bi/catalogo'),
        call<{ id: string; title: string; modulo: string }[]>('/api/bi/sistema'),
      ]);
      setCharts(c);
      setFuentes(f);
      setEliminados(e);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los gráficos.');
      setCharts([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const datasetLabel = (c: ChartListItem) => {
    const src = fuentes.find(s => s.id === c.spec.sourceId);
    const ds = src?.datasets.find(d => d.id === c.spec.datasetId);
    return `${src?.label.split(' · ')[0] ?? c.spec.sourceId} › ${ds?.label ?? c.spec.datasetId}`;
  };

  const visibles = useMemo(() => {
    const t = (filtros.search || '').trim().toLowerCase();
    return (charts ?? [])
      .filter(c =>
        (!t || `${c.spec.title} ${c.spec.subtitle ?? ''} ${chartTypeDef(c.spec.type)?.label ?? ''}`.toLowerCase().includes(t)) &&
        (!filtros.status || (filtros.status === 'sistema' ? !!c.system : !c.system)) &&
        (!filtros.type || (filtros.type === 'sin' ? c.modulos.length === 0 : c.modulos.includes(filtros.type as never))) &&
        (!filtros.estado || (filtros.estado === 'activo' ? c.activo : !c.activo)),
      )
      .sort((a, b) => Number(!!b.system) - Number(!!a.system) || a.spec.title.localeCompare(b.spec.title, 'es'));
  }, [charts, filtros]);

  async function duplicate(c: ChartListItem) {
    setError('');
    try {
      await call('/api/bi/charts', { method: 'POST', body: JSON.stringify({ spec: { ...c.spec, title: `${c.spec.title} (copia)`.slice(0, 80) } }) });
      setOkMsg(`Se creó una copia de «${c.spec.title}».`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo duplicar el gráfico.');
    }
  }

  async function toggle(c: ChartListItem, activo: boolean) {
    setError('');
    try {
      await call(`/api/bi/charts/${c.id}`, { method: 'PATCH', body: JSON.stringify({ activo }) });
      setOkMsg(activo ? `«${c.spec.title}» está activo: se muestra en sus módulos.` : `«${c.spec.title}» está inactivo: ya no se muestra en los módulos.`);
      await load();
    } catch (err) {
      setOkMsg('');
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el estado del gráfico.');
    }
  }

  async function remove() {
    if (!toDelete) return;
    try {
      await call(`/api/bi/charts/${toDelete.id}`, { method: 'DELETE' });
      setOkMsg(`Se eliminó «${toDelete.spec.title}»${toDelete.system ? ' (puedes recuperarlo con «Restaurar gráficos del sistema»)' : ''}.`);
      setError('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el gráfico.');
    }
    setToDelete(null);
  }

  async function restore() {
    try {
      const r = await call<{ restaurados: number }>('/api/bi/sistema', { method: 'POST' });
      setOkMsg(`Se restauraron ${r.restaurados} gráfico${r.restaurados === 1 ? '' : 's'} del sistema.`);
      setError('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron restaurar los gráficos.');
    }
  }

  const total = charts?.length ?? 0;

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Gráficos</h1>
          <p className="text-soft text-sm mt-0.5 max-w-3xl">
            Los gráficos son compartidos: los ve cualquier persona con acceso al módulo donde se publican. Aquí están los del sistema y los que crees;
            puedes editarlos, activarlos o desactivarlos, duplicarlos o eliminarlos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {eliminados.length > 0 && (
            <button type="button" onClick={restore} className="btn btn-secondary shrink-0 whitespace-nowrap"><RotateCcw size={16} strokeWidth={1.8} />Restaurar gráficos del sistema ({eliminados.length})</button>
          )}
          <Link href="/dashboard/disenador/nuevo" className="btn btn-primary shrink-0 whitespace-nowrap"><Plus size={17} strokeWidth={1.8} />Nuevo gráfico</Link>
        </div>
      </div>

      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</p>}
      {okMsg && (
        <p role="status" className="chip chip-ok !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />{okMsg}
          <button type="button" onClick={() => setOkMsg('')} aria-label="Cerrar aviso" className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-white/60"><X size={13} strokeWidth={2.2} /></button>
        </p>
      )}

      {total > 0 && (
        <FilterPanel
          onFilterChange={setFiltros}
          showDateRange={false}
          showSearch={true}
          showStatus={true}
          showType={true}
          statusLabel="Origen"
          statusOptions={[{ value: 'sistema', label: 'Del sistema' }, { value: 'propio', label: 'Creados por nosotros' }]}
          typeLabel="Módulo"
          typeOptions={[...BI_MODULES.map(m => ({ value: m.id, label: m.label })), { value: 'sin', label: 'Sin publicar' }]}
          extraFields={[{ key: 'estado', label: 'Estado', options: [{ value: 'activo', label: 'Activos' }, { value: 'inactivo', label: 'Inactivos' }] }]}
        />
      )}

      {charts === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{[0, 1, 2].map(i => <div key={i} className="skeleton h-[300px]" />)}</div>
      ) : total === 0 ? (
        <div className="glass-card text-center" style={{ padding: '48px 24px' }}>
          <p className="text-lg font-semibold text-ink">No hay gráficos</p>
          <p className="text-sm text-soft mt-1 mb-5">Crea uno nuevo o restaura los del sistema.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/dashboard/disenador/nuevo" className="btn btn-primary inline-flex"><Plus size={17} />Crear un gráfico</Link>
            {eliminados.length > 0 && <button type="button" onClick={restore} className="btn btn-secondary"><RotateCcw size={16} />Restaurar gráficos del sistema</button>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibles.map(c => {
            const def = chartTypeDef(c.spec.type);
            const Icon = CHART_ICONS[c.spec.type];
            return (
              <article key={c.id} className={`glass-card relative flex flex-col transition-opacity ${c.activo ? '' : 'opacity-70'}`} style={{ padding: 'var(--pad-card)' }}>
                <div className="sheen" />
                <div className="flex items-start gap-3 mb-3">
                  <div className="icon-orb !w-9 !h-9 shrink-0"><Icon size={16} strokeWidth={1.8} /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-ink truncate" title={c.spec.title}>{c.spec.title}</h3>
                    <p className="text-xs text-mute truncate" title={datasetLabel(c)}>{def?.label} · {datasetLabel(c)}</p>
                  </div>
                </div>
                <ChartThumb spec={c.spec} />
                <div className="mt-3 flex flex-wrap gap-1.5 min-h-[26px]">
                  {c.system && <span className="chip chip-neutral">Del sistema</span>}
                  {c.modulos.length === 0
                    ? <span className="chip chip-warn">Sin publicar</span>
                    : c.modulos.map(m => <span key={m} className="chip chip-info">{moduloLabel(m)}</span>)}
                </div>
                <div className="mt-3 pt-3 border-t border-line/25 flex flex-wrap items-center justify-between gap-2">
                  <GlassCheck variant="inline" checked={c.activo} onChange={v => toggle(c, v)} label={c.activo ? 'Activo' : 'Inactivo'} />
                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/disenador/${c.id}`} className="btn btn-ghost btn-icon !w-9 !h-9 text-brand-deep" title="Editar" aria-label={`Editar ${c.spec.title}`}><Pencil size={16} strokeWidth={1.8} /></Link>
                    <button type="button" onClick={() => duplicate(c)} className="btn btn-ghost btn-icon !w-9 !h-9 text-brand-deep" title="Duplicar" aria-label={`Duplicar ${c.spec.title}`}><Copy size={16} strokeWidth={1.8} /></button>
                    <button type="button" onClick={() => setToDelete(c)} className="btn btn-ghost btn-icon !w-9 !h-9 text-danger-ink" title="Eliminar" aria-label={`Eliminar ${c.spec.title}`}><Trash2 size={16} strokeWidth={1.8} /></button>
                  </div>
                </div>
                <p className="text-[11px] text-mute mt-2">Actualizado {fmtDate(c.updatedAt)}</p>
              </article>
            );
          })}
          {visibles.length === 0 && <p className="text-sm text-mute col-span-full text-center py-10">Ningún gráfico coincide con los filtros.</p>}
        </div>
      )}

      {toDelete && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="modal-panel p-7 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(var(--danger) / 0.14)' }}>
              <Trash2 size={22} strokeWidth={1.8} className="text-danger-ink" />
            </div>
            <h3 className="text-lg font-semibold text-ink text-center">¿Eliminar el gráfico?</h3>
            <p className="text-soft text-sm text-center mt-1 mb-6">
              «{toDelete.spec.title}» se borrará{toDelete.modulos.length ? ' y dejará de verse en los módulos donde está publicado' : ''}.{' '}
              {toDelete.system ? 'Como es del sistema, podrás recuperarlo con «Restaurar gráficos del sistema».' : 'Esta acción no se puede deshacer.'}
              {toDelete.activo && !toDelete.system ? ' Si solo quieres ocultarlo, desactívalo.' : ''}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setToDelete(null)} className="btn btn-secondary flex-1">Cancelar</button>
              <button type="button" onClick={remove} className="btn btn-danger flex-1">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
