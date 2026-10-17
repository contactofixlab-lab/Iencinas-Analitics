'use client';

import { DragEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle, ArrowLeft, Calendar, CheckCircle2, ChevronDown, Hash, Plus, RotateCcw, Save, Sigma, ToggleLeft, Trash2, Type, X,
} from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import { CHART_ICONS } from './icons';
import GlassCheck from '@/components/GlassCheck';
import {
  AGGS, BUCKETS, CHART_GROUPS, CHART_TYPES, FORMATS, OPS, PALETTES, chartTypeDef, emptySpec, type ChartTypeDef,
} from '@/lib/bi/catalog';
import {
  BI_MODULES, ROWS_FIELD,
  type AggFn, type BiModule, type ChartSpec, type ChartType, type DataSourceDef, type DatasetDef, type FieldDef, type FilterSpec,
  type MeasureSpec, type QueryResult, type SavedChart,
} from '@/lib/bi/types';

const TYPE_ICON = { string: Type, number: Hash, date: Calendar, boolean: ToggleLeft } as const;
const TYPE_LABEL = { string: 'texto', number: 'número', date: 'fecha', boolean: 'sí/no' } as const;

const renumber = (ms: MeasureSpec[]): MeasureSpec[] => ms.map((m, i) => ({ ...m, id: `m${i + 1}` }));

function newMeasure(ds: DatasetDef, used: MeasureSpec[], preferNumeric = true): MeasureSpec {
  const taken = new Set(used.map(m => m.field));
  const num = ds.fields.find(f => f.type === 'number' && !taken.has(f.id)) ?? ds.fields.find(f => f.type === 'number');
  if (preferNumeric && num) return { id: '', field: num.id, agg: 'sum', format: num.format };
  return { id: '', field: ROWS_FIELD, agg: 'count' };
}

/** Qué falta para poder dibujar el gráfico (vacío = listo). */
function missing(spec: ChartSpec, def: ChartTypeDef): string {
  if (def.dimension === 'required' && !spec.dimension) return 'Elige el campo del eje o categoría.';
  if (def.series === 'required' && !spec.series) return 'Elige la serie (segunda categoría).';
  if (spec.measures.length < def.minMeasures) return `Agrega al menos ${def.minMeasures} valor${def.minMeasures === 1 ? '' : 'es'}.`;
  if (def.id === 'table' && !spec.dimension && spec.measures.length === 0) return 'Elige al menos una categoría o un valor.';
  return '';
}

/** Ajusta la especificación al cambiar de tipo de gráfico (descarta lo que el nuevo tipo no usa y completa lo que exige). */
function adaptToType(spec: ChartSpec, type: ChartType, ds: DatasetDef | undefined): ChartSpec {
  const def = chartTypeDef(type)!;
  const next: ChartSpec = { ...spec, type, options: { ...spec.options, ...(def.defaultOptions ?? {}) } };
  if (def.dimension === 'none') next.dimension = undefined;
  if (def.series === 'none') next.series = undefined;
  let ms = next.measures.slice(0, def.maxMeasures);
  if (next.series && ms.length > 1) ms = ms.slice(0, 1);
  if (ds) while (ms.length < def.minMeasures) ms.push(newMeasure(ds, ms, ms.length < def.minMeasures));
  if (ds && def.dimension === 'required' && !next.dimension) {
    const d = ds.fields.find(f => f.type === 'date') ?? ds.fields.find(f => f.type === 'string');
    if (d) next.dimension = { field: d.id, ...(d.type === 'date' ? { bucket: 'month' as const } : {}) };
  }
  if (ds && def.series === 'required' && !next.series) {
    const s = ds.fields.find(f => f.type === 'string' && f.id !== next.dimension?.field);
    if (s) next.series = { field: s.id };
  }
  next.measures = renumber(ms);
  return next;
}

/** Especificación inicial razonable para un conjunto de datos. */
function starterSpec(src: DataSourceDef, ds: DatasetDef): ChartSpec {
  const base = emptySpec(src.id, ds.id);
  return adaptToType({ ...base, measures: [newMeasure(ds, [])] }, 'bar', ds);
}

/* ── Pequeños bloques de interfaz ──────────────────────────────────────── */

function Section({ title, hint, children, defaultOpen = true }: { title: string; hint?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="glass-card relative" style={{ padding: '14px 16px' }}>
      <div className="sheen" />
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-2 text-left">
        <span>
          <span className="block text-sm font-semibold text-ink">{title}</span>
          {hint && <span className="block text-xs text-mute mt-0.5">{hint}</span>}
        </span>
        <ChevronDown size={16} className={`text-mute transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </section>
  );
}

const selectCls = 'field w-full !h-10 !text-sm';

function FieldSelect({ value, onChange, fields, allowRows, numericOnly, placeholder, id }: {
  value: string; onChange: (v: string) => void; fields: FieldDef[]; allowRows?: boolean; numericOnly?: boolean; placeholder?: string; id?: string;
}) {
  const list = numericOnly ? fields.filter(f => f.type === 'number') : fields;
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {allowRows && <option value={ROWS_FIELD}>Registros (cantidad de filas)</option>}
      {list.map(f => <option key={f.id} value={f.id}>{f.label} · {TYPE_LABEL[f.type]}</option>)}
    </select>
  );
}

function DropWell({ onDropField, children, label }: { onDropField: (field: string) => void; children: React.ReactNode; label: string }) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setOver(false);
        const t = e.dataTransfer.getData('text/plain');
        if (t.startsWith('bi-field:')) onDropField(t.slice(9));
      }}
      aria-label={label}
      className="rounded-2xl p-3 transition-colors"
      style={{ background: over ? 'rgb(var(--brand-soft) / 0.85)' : 'rgb(255 255 255 / 0.30)', border: `1px dashed ${over ? 'rgb(var(--brand))' : 'rgb(var(--line) / 0.45)'}` }}
    >
      {children}
    </div>
  );
}

/* ── Editor ────────────────────────────────────────────────────────────── */

export default function ChartEditor({ chartId }: { chartId?: string }) {
  const router = useRouter();
  const [fuentes, setFuentes] = useState<DataSourceDef[] | null>(null);
  const [spec, setSpec] = useState<ChartSpec | null>(null);
  const [modulos, setModulos] = useState<BiModule[]>([]);
  const [savedId, setSavedId] = useState<string | undefined>(chartId);
  const [activo, setActivo] = useState(true);
  const [system, setSystem] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [preview, setPreview] = useState<QueryResult | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');

  /* Carga del catálogo y, si se edita, del gráfico */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cat = await fetch('/api/bi/catalogo', { cache: 'no-store' }).then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))));
        const sources = cat.data as DataSourceDef[];
        if (!alive) return;
        setFuentes(sources);
        if (chartId) {
          const res = await fetch(`/api/bi/charts/${chartId}`, { cache: 'no-store' });
          const json = await res.json();
          if (!res.ok || !json.ok) throw new Error(json.error || 'No se encontró el gráfico.');
          const c = json.data as SavedChart & { modulos: BiModule[] };
          if (!alive) return;
          setSpec(c.spec);
          setModulos(c.modulos);
          setActivo(c.activo !== false);
          setSystem(!!c.system);
        } else {
          const src = sources.find(s => s.status === 'conectada' && s.datasets.length > 0);
          if (!src) throw new Error('No hay fuentes de datos conectadas.');
          setSpec(starterSpec(src, src.datasets[0]));
        }
      } catch (err) {
        if (alive) setLoadError(err instanceof Error ? err.message : 'No se pudo cargar el editor.');
      }
    })();
    return () => { alive = false; };
  }, [chartId]);

  const source = useMemo(() => fuentes?.find(s => s.id === spec?.sourceId), [fuentes, spec?.sourceId]);
  const dataset = useMemo(() => source?.datasets.find(d => d.id === spec?.datasetId), [source, spec?.datasetId]);
  const def = spec ? chartTypeDef(spec.type) : undefined;
  const hint = spec && def ? missing(spec, def) : '';
  const specKey = spec ? JSON.stringify(spec) : '';

  /* Vista previa en vivo */
  useEffect(() => {
    if (!spec || !def) return;
    if (hint) {
      setPreview(null);
      setPreviewError('');
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const res = await fetch('/api/bi/query', {
          method: 'POST', cache: 'no-store', signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ spec }),
        });
        const json = await res.json();
        if (ctrl.signal.aborted) return;
        if (!res.ok || !json.ok) throw new Error(json.error || `Error ${res.status}`);
        setPreview(json.data as QueryResult);
        setPreviewError('');
      } catch (err) {
        if (ctrl.signal.aborted || (err instanceof DOMException && err.name === 'AbortError')) return;
        setPreview(null);
        setPreviewError(err instanceof Error ? err.message : 'No se pudo calcular la vista previa.');
      } finally {
        if (!ctrl.signal.aborted) setPreviewLoading(false);
      }
    }, 450);
    return () => { clearTimeout(t); ctrl.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey]);

  const update = useCallback((patch: Partial<ChartSpec>) => { setOkMsg(''); setSpec(s => (s ? { ...s, ...patch } : s)); }, []);
  const updateOptions = (patch: Partial<ChartSpec['options']>) => spec && update({ options: { ...spec.options, ...patch } });

  if (loadError) return <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm w-fit">{loadError}</p>;
  if (!fuentes || !spec || !def) return <div className="skeleton h-[480px]" aria-busy="true" />;

  const fields = dataset?.fields ?? [];
  const fieldById = (id: string) => fields.find(f => f.id === id);

  /* ── Cambios de fuente, conjunto de datos y tipo ── */
  function changeSource(id: string) {
    const src = fuentes!.find(s => s.id === id);
    if (!src || src.datasets.length === 0) return;
    setOkMsg('');
    setSpec(s => adaptToType({ ...starterSpec(src, src.datasets[0]), title: s!.title, subtitle: s!.subtitle, options: s!.options }, s!.type, src.datasets[0]));
  }
  function changeDataset(id: string) {
    const ds = source?.datasets.find(d => d.id === id);
    if (!ds || !source) return;
    setOkMsg('');
    setSpec(s => adaptToType({ ...s!, datasetId: id, dimension: undefined, series: undefined, measures: [newMeasure(ds, [])], filters: [], sort: undefined }, s!.type, ds));
  }
  function changeType(type: ChartType) {
    setOkMsg('');
    setSpec(s => adaptToType(s!, type, dataset));
  }

  /* ── Campos: dimensión, serie y valores ── */
  const setDimension = (field: string) => {
    const fd = fieldById(field);
    update({ dimension: field && fd ? { field, ...(fd.type === 'date' ? { bucket: spec.dimension?.bucket ?? 'month' } : {}) } : undefined });
  };
  const setSeries = (field: string) => {
    const fd = fieldById(field);
    update({ series: field && fd ? { field, ...(fd.type === 'date' ? { bucket: spec.series?.bucket ?? 'month' } : {}) } : undefined, measures: field ? spec.measures.slice(0, 1) : spec.measures });
  };
  const patchMeasure = (i: number, patch: Partial<MeasureSpec>) =>
    update({ measures: renumber(spec.measures.map((m, idx) => (idx === i ? { ...m, ...patch } : m))) });
  const addMeasure = (field?: string) => {
    if (!dataset || spec.measures.length >= def.maxMeasures || (spec.series && spec.measures.length >= 1)) return;
    const base = field && field !== ROWS_FIELD
      ? { id: '', field, agg: (fieldById(field)?.type === 'number' ? 'sum' : 'count') as AggFn, format: fieldById(field)?.format }
      : field === ROWS_FIELD ? { id: '', field: ROWS_FIELD, agg: 'count' as AggFn } : newMeasure(dataset, spec.measures);
    update({ measures: renumber([...spec.measures, base]) });
  };
  const removeMeasure = (i: number) => update({ measures: renumber(spec.measures.filter((_, idx) => idx !== i)) });

  /** Al hacer clic o soltar un campo: lo coloca donde mejor encaja. */
  function placeField(id: string, target?: 'dimension' | 'series' | 'value') {
    const fd = id === ROWS_FIELD ? undefined : fieldById(id);
    if (id !== ROWS_FIELD && !fd) return;
    const canDim = def!.dimension !== 'none';
    const canSer = def!.series !== 'none' && !!spec!.dimension;
    const canVal = def!.maxMeasures > spec!.measures.length && !(spec!.series && spec!.measures.length >= 1);
    let to = target;
    if (!to) {
      if (id === ROWS_FIELD || fd!.type === 'number') to = canVal ? 'value' : canDim && !spec!.dimension ? 'dimension' : undefined;
      else to = canDim && !spec!.dimension ? 'dimension' : canSer && !spec!.series ? 'series' : canVal ? 'value' : undefined;
    }
    if (to === 'dimension' && canDim && id !== ROWS_FIELD) setDimension(id);
    else if (to === 'series' && canSer && id !== ROWS_FIELD) setSeries(id);
    else if (to === 'value') addMeasure(id);
  }

  /* ── Filtros ── */
  const addFilter = () => {
    if (!dataset || spec.filters.length >= 10) return;
    const f0 = dataset.fields[0];
    update({ filters: [...spec.filters, { field: f0.id, op: 'eq', value: f0.values?.[0] ?? '' }] });
  };
  const patchFilter = (i: number, patch: Partial<FilterSpec>) =>
    update({ filters: spec.filters.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });

  /* ── Guardar ── */
  async function save() {
    setSaving(true);
    setError('');
    setOkMsg('');
    try {
      const res = await fetch(savedId ? `/api/bi/charts/${savedId}` : '/api/bi/charts', {
        method: savedId ? 'PUT' : 'POST', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ spec, modulos, activo }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || `Error ${res.status}`);
      const chart = json.data as SavedChart & { modulos: BiModule[] };
      setOkMsg(modulos.length ? `Guardado y publicado en ${modulos.length} módulo${modulos.length === 1 ? '' : 's'}.` : 'Guardado. Elige módulos en «Publicar en» para mostrarlo.');
      if (!savedId) {
        setSavedId(chart.id);
        router.replace(`/dashboard/disenador/${chart.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el gráfico.');
    } finally {
      setSaving(false);
    }
  }

  /** Gráfico del sistema: vuelve a su definición original. */
  async function restoreOriginal() {
    if (!savedId) return;
    setError('');
    try {
      const res = await fetch(`/api/bi/charts/${savedId}/restablecer`, { method: 'POST', cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || `Error ${res.status}`);
      setSpec((json.data as SavedChart).spec);
      setOkMsg('Se restableció la definición original del gráfico.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer el gráfico.');
    }
  }

  const sortValue = spec.sort ? (spec.sort.by === 'dimension' ? `dim:${spec.sort.dir}` : `m${spec.sort.measure ?? 0}:${spec.sort.dir}`) : 'auto';
  const setSort = (v: string) => {
    if (v === 'auto') return update({ sort: undefined });
    const [k, dir] = v.split(':');
    update({ sort: k === 'dim' ? { by: 'dimension', dir: dir as 'asc' | 'desc' } : { by: 'measure', measure: Number(k.slice(1)), dir: dir as 'asc' | 'desc' } });
  };

  const dimField = spec.dimension ? fieldById(spec.dimension.field) : undefined;
  const serField = spec.series ? fieldById(spec.series.field) : undefined;
  const canAddMeasure = spec.measures.length < def.maxMeasures && !(spec.series && spec.measures.length >= 1);

  return (
    <div className="space-y-5">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard/disenador" className="btn btn-ghost btn-sm"><ArrowLeft size={14} />Gráficos</Link>
        <div className="flex-1 min-w-[220px]">
          <label htmlFor="bi-titulo" className="sr-only">Título del gráfico</label>
          <input id="bi-titulo" value={spec.title} onChange={e => update({ title: e.target.value })} maxLength={80} placeholder="Título del gráfico" className="field w-full !h-11 !text-base font-semibold" />
        </div>
        <button type="button" onClick={save} disabled={saving || !!hint || !spec.title.trim()} className="btn btn-primary">
          <Save size={16} />{saving ? 'Guardando…' : savedId ? 'Guardar cambios' : 'Guardar gráfico'}
        </button>
      </div>
      {system && (
        <p role="status" className="chip chip-info !rounded-2xl !px-4 !py-2.5 !text-sm flex flex-wrap items-center gap-2 max-w-full">
          Este gráfico viene con el sistema: puedes modificarlo, desactivarlo o eliminarlo, y volver a su versión original cuando quieras.
          <button type="button" onClick={restoreOriginal} className="btn btn-secondary btn-sm !h-8"><RotateCcw size={13} />Restablecer original</button>
        </p>
      )}
      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</p>}
      {okMsg && <p role="status" className="chip chip-ok !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full"><CheckCircle2 size={16} className="mt-0.5 shrink-0" />{okMsg}</p>}

      <div className="grid grid-cols-1 xl:grid-cols-[250px_minmax(0,1fr)_360px] gap-5 items-start">
        {/* ── Datos ── */}
        <div className="space-y-4">
          <Section title="Fuente de datos" hint="Elige la base y el conjunto de datos">
            <div>
              <label htmlFor="bi-fuente" className="label">Base de datos</label>
              <select id="bi-fuente" value={spec.sourceId} onChange={e => changeSource(e.target.value)} className={selectCls}>
                {fuentes.map(s => <option key={s.id} value={s.id} disabled={s.status !== 'conectada' || s.datasets.length === 0}>{s.label}{s.status !== 'conectada' ? ' (sin conectar)' : ''}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bi-dataset" className="label">Conjunto de datos</label>
              <select id="bi-dataset" value={spec.datasetId} onChange={e => changeDataset(e.target.value)} className={selectCls}>
                {(source?.datasets ?? []).map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
              {dataset && <p className="text-xs text-mute mt-1.5">{dataset.description}</p>}
            </div>
          </Section>

          <Section title="Campos" hint="Haz clic en un campo o arrástralo a Eje, Serie o Valores">
            <ul className="space-y-1.5">
              <li>
                <button type="button" draggable onDragStart={e => e.dataTransfer.setData('text/plain', `bi-field:${ROWS_FIELD}`)} onClick={() => placeField(ROWS_FIELD)}
                  className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm hover:bg-white/60 cursor-grab active:cursor-grabbing">
                  <Sigma size={14} className="text-brand-deep shrink-0" /><span className="text-ink truncate">Registros (cantidad)</span>
                </button>
              </li>
              {fields.map(f => {
                const Icon = TYPE_ICON[f.type];
                return (
                  <li key={f.id}>
                    <button type="button" draggable onDragStart={e => e.dataTransfer.setData('text/plain', `bi-field:${f.id}`)} onClick={() => placeField(f.id)}
                      title={`${f.label} · ${TYPE_LABEL[f.type]}`}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm hover:bg-white/60 cursor-grab active:cursor-grabbing">
                      <Icon size={14} className="text-mute shrink-0" /><span className="text-ink truncate">{f.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>
        </div>

        {/* ── Vista previa ── */}
        <div className="space-y-4 min-w-0">
          <section className="glass-card relative" style={{ padding: '16px 18px' }}>
            <div className="sheen" />
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-ink">{spec.title || 'Sin título'}</h3>
              <label htmlFor="bi-subtitulo" className="sr-only">Subtítulo</label>
              <input id="bi-subtitulo" value={spec.subtitle ?? ''} onChange={e => update({ subtitle: e.target.value || undefined })} maxLength={120} placeholder="Subtítulo (opcional)" className="w-full bg-transparent text-xs text-soft outline-none placeholder:text-mute mt-0.5" />
            </div>
            <div className="h-[420px] relative z-10">
              {hint ? (
                <div className="h-full flex items-center justify-center text-sm text-mute text-center px-6">{hint}</div>
              ) : previewError ? (
                <div role="alert" className="h-full flex items-center justify-center text-sm text-danger-ink text-center px-6">{previewError}</div>
              ) : preview ? (
                <div className={`h-full transition-opacity ${previewLoading ? 'opacity-50' : ''}`}><ChartRenderer spec={spec} result={preview} /></div>
              ) : (
                <div className="skeleton h-full" aria-busy="true" />
              )}
            </div>
            {preview && !hint && (
              <p className="text-xs text-mute mt-3">{preview.scanned.toLocaleString('es-CL')} registros considerados{preview.truncated ? ` · se muestran solo los primeros ${spec.limit}` : ''}</p>
            )}
          </section>
        </div>

        {/* ── Configuración ── */}
        <div className="space-y-4">
          <Section title="Tipo de gráfico" hint={def.description}>
            {CHART_GROUPS.map(group => (
              <div key={group}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-mute mb-1.5">{group}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {CHART_TYPES.filter(t => t.group === group).map(t => {
                    const Icon = CHART_ICONS[t.id];
                    const active = t.id === spec.type;
                    return (
                      <button key={t.id} type="button" onClick={() => changeType(t.id)} title={`${t.label}: ${t.description}`} aria-pressed={active} aria-label={t.label}
                        className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] leading-tight text-center transition-colors"
                        style={{ background: active ? 'rgb(var(--brand-soft) / 0.9)' : 'rgb(255 255 255 / 0.35)', border: active ? '1px solid rgb(var(--brand))' : '1px solid rgb(var(--line) / 0.30)' }}>
                        <Icon size={18} strokeWidth={1.8} className={active ? 'text-brand-deep' : 'text-soft'} />
                        <span className={active ? 'text-ink font-semibold' : 'text-soft'}>{t.label.replace(' (columnas y línea)', '').replace(' (KPI)', '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </Section>

          <Section title="Campos del gráfico">
            {def.dimension !== 'none' && (
              <DropWell label="Eje o categoría" onDropField={f => placeField(f, 'dimension')}>
                <label htmlFor="bi-dim" className="label">Eje / categoría{def.dimension === 'optional' ? ' (opcional)' : ''}</label>
                <FieldSelect id="bi-dim" value={spec.dimension?.field ?? ''} onChange={setDimension} fields={fields} placeholder={def.dimension === 'required' ? 'Elige un campo' : 'Sin categoría'} />
                {dimField?.type === 'date' && (
                  <select aria-label="Agrupar fecha por" value={spec.dimension?.bucket ?? 'month'} onChange={e => update({ dimension: { field: dimField.id, bucket: e.target.value as 'year' } })} className={`${selectCls} mt-2`}>
                    {BUCKETS.map(b => <option key={b.id} value={b.id}>Agrupar por {b.label.toLowerCase()}</option>)}
                  </select>
                )}
              </DropWell>
            )}

            {def.series !== 'none' && (
              <DropWell label="Serie" onDropField={f => placeField(f, 'series')}>
                <label htmlFor="bi-ser" className="label">Serie (desglose){def.series === 'optional' ? ' · opcional' : ''}</label>
                <FieldSelect id="bi-ser" value={spec.series?.field ?? ''} onChange={setSeries} fields={fields.filter(f => f.id !== spec.dimension?.field)} placeholder={def.series === 'required' ? 'Elige un campo' : 'Sin desglose'} />
                {serField?.type === 'date' && (
                  <select aria-label="Agrupar serie por" value={spec.series?.bucket ?? 'month'} onChange={e => update({ series: { field: serField.id, bucket: e.target.value as 'year' } })} className={`${selectCls} mt-2`}>
                    {BUCKETS.map(b => <option key={b.id} value={b.id}>Agrupar por {b.label.toLowerCase()}</option>)}
                  </select>
                )}
                {spec.series && <p className="text-xs text-mute mt-1.5">Con serie se usa un solo valor.</p>}
              </DropWell>
            )}

            <DropWell label="Valores" onDropField={f => placeField(f, 'value')}>
              <p className="label">Valores{def.maxMeasures > 1 ? ` (hasta ${def.maxMeasures})` : ''}</p>
              <div className="space-y-3">
                {spec.measures.map((m, i) => {
                  const fd = m.field === ROWS_FIELD ? undefined : fieldById(m.field);
                  const role = def.measureRoles?.[i];
                  const aggs = AGGS.filter(a => !a.numericOnly || fd?.type === 'number');
                  return (
                    <div key={i} className="rounded-2xl p-2.5 space-y-2" style={{ background: 'rgb(255 255 255 / 0.45)', border: '1px solid rgb(var(--line) / 0.28)' }}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-soft">{role ?? `Valor ${i + 1}`}</span>
                        {spec.measures.length > def.minMeasures && (
                          <button type="button" onClick={() => removeMeasure(i)} aria-label={`Quitar valor ${i + 1}`} className="btn btn-ghost btn-icon !w-7 !h-7 text-danger-ink"><X size={14} /></button>
                        )}
                      </div>
                      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-2">
                        <select aria-label="Cómo calcular" value={m.agg} onChange={e => patchMeasure(i, { agg: e.target.value as AggFn })} className={selectCls}>
                          {aggs.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                        </select>
                        <FieldSelect value={m.field} fields={fields} allowRows onChange={v => {
                          const nf = v === ROWS_FIELD ? undefined : fieldById(v);
                          const numericAgg = AGGS.find(a => a.id === m.agg)?.numericOnly;
                          patchMeasure(i, { field: v, agg: v === ROWS_FIELD ? 'count' : numericAgg && nf?.type !== 'number' ? 'count' : m.agg, format: nf?.format });
                        }} />
                      </div>
                      <input aria-label="Nombre del valor" value={m.label ?? ''} onChange={e => patchMeasure(i, { label: e.target.value || undefined })} maxLength={60} placeholder="Nombre en el gráfico (opcional)" className="field w-full !h-10 !text-sm" />
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 items-center">
                        <select aria-label="Formato" value={m.format ?? 'auto'} onChange={e => patchMeasure(i, { format: e.target.value as 'auto' })} className={selectCls}>
                          {FORMATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                        </select>
                        <input aria-label="Color" type="color" value={m.color ?? PALETTES.find(p => p.id === (spec.options.palette ?? 'hielo'))!.colors[i % 8]} onChange={e => patchMeasure(i, { color: e.target.value })} className="w-10 h-10 rounded-xl border border-line/40 bg-white/60 p-1 cursor-pointer" />
                      </div>
                      {def.id === 'combo' && (
                        <div className="grid grid-cols-2 gap-2">
                          <select aria-label="Cómo se dibuja" value={m.kind ?? (i === 0 ? 'bar' : 'line')} onChange={e => patchMeasure(i, { kind: e.target.value as 'bar' | 'line' })} className={selectCls}>
                            <option value="bar">Columnas</option><option value="line">Línea</option>
                          </select>
                          <select aria-label="Eje" value={m.axis ?? 'left'} onChange={e => patchMeasure(i, { axis: e.target.value as 'left' | 'right' })} className={selectCls}>
                            <option value="left">Eje izquierdo</option><option value="right">Eje derecho</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
                {spec.measures.length === 0 && <p className="text-xs text-mute">Arrastra un campo aquí o usa el botón.</p>}
                <button type="button" onClick={() => addMeasure()} disabled={!canAddMeasure} className="btn btn-secondary btn-sm w-full"><Plus size={14} />Agregar valor</button>
              </div>
            </DropWell>
          </Section>

          <Section title="Filtros" hint="Limita los datos que se usan" defaultOpen={false}>
            {spec.filters.map((flt, i) => {
              const fd = fieldById(flt.field);
              const ops = OPS.filter(o => fd && o.types.includes(fd.type));
              const listed = fd?.values && (flt.op === 'eq' || flt.op === 'neq');
              return (
                <div key={i} className="rounded-2xl p-2.5 space-y-2" style={{ background: 'rgb(255 255 255 / 0.45)', border: '1px solid rgb(var(--line) / 0.28)' }}>
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <FieldSelect value={flt.field} fields={fields} onChange={v => {
                        const nf = fieldById(v)!;
                        patchFilter(i, { field: v, op: nf.type === 'string' || nf.type === 'boolean' ? 'eq' : 'gte', value: nf.values?.[0] ?? (nf.type === 'boolean' ? 'true' : '') });
                      }} />
                    </div>
                    <button type="button" onClick={() => update({ filters: spec.filters.filter((_, idx) => idx !== i) })} aria-label={`Quitar filtro ${i + 1}`} className="btn btn-ghost btn-icon !w-10 !h-10 text-danger-ink shrink-0"><Trash2 size={15} /></button>
                  </div>
                  <select aria-label="Condición" value={flt.op} onChange={e => patchFilter(i, { op: e.target.value as FilterSpec['op'] })} className={selectCls}>
                    {ops.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  {fd?.type === 'boolean' ? (
                    <select aria-label="Valor" value={flt.value} onChange={e => patchFilter(i, { value: e.target.value })} className={selectCls}><option value="true">Sí</option><option value="false">No</option></select>
                  ) : listed ? (
                    <select aria-label="Valor" value={flt.value} onChange={e => patchFilter(i, { value: e.target.value })} className={selectCls}>
                      {fd!.values!.map(v => <option key={v} value={v}>{v}</option>)}
                      {!fd!.values!.includes(flt.value) && <option value={flt.value}>{flt.value || '(elige)'}</option>}
                    </select>
                  ) : (
                    <input aria-label="Valor" type={fd?.type === 'date' ? 'date' : 'text'} inputMode={fd?.type === 'number' ? 'decimal' : undefined} value={flt.value} onChange={e => patchFilter(i, { value: e.target.value })}
                      placeholder={flt.op === 'in' ? 'Valores separados por ;' : 'Valor'} className="field w-full !h-10 !text-sm" />
                  )}
                </div>
              );
            })}
            <button type="button" onClick={addFilter} disabled={spec.filters.length >= 10} className="btn btn-secondary btn-sm w-full"><Plus size={14} />Agregar filtro</button>
          </Section>

          <Section title="Orden y límite" defaultOpen={false}>
            <div>
              <label htmlFor="bi-orden" className="label">Ordenar</label>
              <select id="bi-orden" value={sortValue} onChange={e => setSort(e.target.value)} className={selectCls}>
                <option value="auto">Automático</option>
                <option value="dim:asc">Por categoría (A → Z, menor → mayor)</option>
                <option value="dim:desc">Por categoría (Z → A, mayor → menor)</option>
                {spec.measures.map((m, i) => (
                  <optgroup key={i} label={m.label || `Valor ${i + 1}`}>
                    <option value={`m${i}:desc`}>Por valor {i + 1} (mayor primero)</option>
                    <option value={`m${i}:asc`}>Por valor {i + 1} (menor primero)</option>
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="bi-limite" className="label">Mostrar solo los primeros (categorías)</label>
              <input id="bi-limite" type="number" min={1} max={1000} value={spec.limit ?? ''} onChange={e => update({ limit: e.target.value ? Math.min(Math.max(Math.floor(Number(e.target.value)), 1), 1000) : undefined })} placeholder="Todos" className="field w-full !h-10 !text-sm" />
            </div>
          </Section>

          <Section title="Formato" defaultOpen={false}>
            <div>
              <label htmlFor="bi-paleta" className="label">Paleta de colores</label>
              <select id="bi-paleta" value={spec.options.palette ?? 'hielo'} onChange={e => updateOptions({ palette: e.target.value as 'hielo' })} className={selectCls}>
                {PALETTES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <div className="flex gap-1 mt-2" aria-hidden="true">
                {PALETTES.find(p => p.id === (spec.options.palette ?? 'hielo'))!.colors.map(c => <span key={c} className="w-5 h-5 rounded-full" style={{ background: c }} />)}
              </div>
            </div>
            <GlassCheck variant="inline" checked={spec.options.legend !== false} onChange={v => updateOptions({ legend: v })} label="Mostrar leyenda" />
            <GlassCheck variant="inline" checked={!!spec.options.labels} onChange={v => updateOptions({ labels: v })} label="Mostrar valores sobre el gráfico" />
            <GlassCheck variant="inline" checked={spec.options.grid !== false} onChange={v => updateOptions({ grid: v })} label="Mostrar líneas de cuadrícula" />
            <GlassCheck variant="inline" checked={!!spec.options.smooth} onChange={v => updateOptions({ smooth: v })} label="Suavizar las curvas" />
            {!!dataset?.context?.length && (
              <GlassCheck checked={!!spec.options.followContext} onChange={v => updateOptions({ followContext: v })} label="Responder a los filtros del módulo"
                description="Aplica el proyecto elegido, la obra, los meses… del módulo donde se muestra el gráfico." />
            )}
            {def.id === 'gauge' && (
              <div>
                <label htmlFor="bi-meta" className="label">Valor que representa el 100 %</label>
                <input id="bi-meta" type="number" min={0} value={spec.options.gaugeMax ?? ''} onChange={e => updateOptions({ gaugeMax: e.target.value ? Number(e.target.value) : undefined })} placeholder="Automático" className="field w-full !h-10 !text-sm" />
              </div>
            )}
          </Section>

          <Section title="Publicar en módulos" hint="Lo ve cualquier persona con acceso al módulo">
            <GlassCheck checked={activo} onChange={v => { setOkMsg(''); setActivo(v); }} label="Gráfico activo"
              description="Si lo desactivas deja de mostrarse en los módulos, sin borrarlo." />
            {BI_MODULES.map(m => (
              <GlassCheck key={m.id} checked={modulos.includes(m.id)} label={m.label}
                onChange={v => { setOkMsg(''); setModulos(cur => (v ? [...cur, m.id] : cur.filter(x => x !== m.id))); }}
                description={m.id === 'general' || m.id === 'constructora' ? 'Solo lo ven administradores' : undefined} />
            ))}
            <p className="text-xs text-mute">Se agrega al final de la vista del módulo. Allí lo puedes mover y cambiar de tamaño con «Organizar».</p>
          </Section>
        </div>
      </div>
    </div>
  );
}
