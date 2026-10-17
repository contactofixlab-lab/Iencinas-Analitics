'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Trash2, SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GlassSelect from '@/components/GlassSelect';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import GlassCheck from '@/components/GlassCheck';
import { setCatalogoFiltros, useFiltros } from '@/lib/filtros-client';
import { FILTRO_MAX_OPCIONES, FILTROS_SISTEMA, type FiltroCategoriaDTO } from '@/lib/filtros';
import { Proyecto } from '@/types/domain';

type Origen = 'predeterminada' | 'agregada' | 'sistema' | 'datos';

interface Fila {
  key: string;
  /** Posición dentro de la lista desplegable (solo las activas aparecen); null si está inactiva. */
  orden: number | null;
  nombre: string;
  filtroId: string;
  filtro: string;
  modulo: string;
  origen: Origen;
  activa: boolean;
  /** Se puede activar/desactivar desde esta pantalla (las listas fijas y las de datos, no). */
  editable: boolean;
}

const ORIGEN: Record<Origen, { label: string; cls: string; ayuda: string }> = {
  predeterminada: { label: 'Predeterminada', cls: 'chip chip-neutral', ayuda: 'Viene con la aplicación; no se puede quitar' },
  agregada: { label: 'Agregada', cls: 'chip chip-ok', ayuda: 'La agregó un administrador; se puede quitar' },
  sistema: { label: 'Del sistema', cls: 'chip chip-info', ayuda: 'Lista fija definida por la aplicación' },
  datos: { label: 'De los datos', cls: 'chip chip-info', ayuda: 'Se alimenta de los proyectos y obras registrados' },
};

async function call(method: 'POST' | 'PATCH' | 'DELETE', body: { categoria: string; nombre: string; activa?: boolean }): Promise<FiltroCategoriaDTO[]> {
  const res = await fetch('/api/filtros', {
    method,
    cache: 'no-store',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let json: { ok?: boolean; error?: string; data?: FiltroCategoriaDTO[] } | null = null;
  try {
    json = await res.json();
  } catch {
    /* respuesta sin cuerpo */
  }
  if (!res.ok || !json || json.ok === false) throw new Error(json?.error || `Error ${res.status}`);
  return json.data ?? [];
}

export default function FiltrosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { categorias, loading } = useFiltros();
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [activaNueva, setActivaNueva] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [toDelete, setToDelete] = useState<{ categoria: string; label: string; valor: string } | null>(null);
  const [obras, setObras] = useState<string[]>([]);
  const [proyectos, setProyectos] = useState<string[]>([]);
  const [filtros, setFiltros] = useState<FilterConfig>({});

  useEffect(() => {
    if (user && user.role !== 'administrador') router.replace('/dashboard/finanzas');
  }, [user, router]);

  // Listas que se alimentan de los datos (solo consulta).
  useEffect(() => {
    fetch('/api/constructora', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(j => setObras(Array.isArray(j.data?.obrasDisponibles) ? j.data.obrasDisponibles : []))
      .catch(() => setObras([]));
    fetch('/api/mis-proyectos', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(j => setProyectos(Array.isArray(j.data) ? (j.data as Proyecto[]).map(p => p.nombre) : []))
      .catch(() => setProyectos([]));
  }, []);

  const filas = useMemo<Fila[]>(() => {
    const out: Fila[] = [];
    for (const c of categorias) {
      let pos = 0;
      for (const o of c.opciones) {
        out.push({
          key: `${c.id}:${o.valor}`,
          orden: o.activa ? ++pos : null,
          nombre: o.valor,
          filtroId: c.id,
          filtro: c.label,
          modulo: c.modulo,
          origen: o.predeterminada ? 'predeterminada' : 'agregada',
          activa: o.activa,
          editable: true,
        });
      }
    }
    for (const s of FILTROS_SISTEMA) {
      s.opciones.forEach((o, i) =>
        out.push({ key: `${s.id}:${o}`, orden: i + 1, nombre: o, filtroId: s.id, filtro: s.label, modulo: s.modulo, origen: 'sistema', activa: true, editable: false }),
      );
    }
    obras.forEach((o, i) => out.push({ key: `obra:${o}`, orden: i + 1, nombre: o, filtroId: 'obra', filtro: 'Obra', modulo: 'Constructora', origen: 'datos', activa: true, editable: false }));
    proyectos.forEach((o, i) => out.push({ key: `proyecto:${o}`, orden: i + 1, nombre: o, filtroId: 'proyecto', filtro: 'Proyecto', modulo: 'Todos los módulos', origen: 'datos', activa: true, editable: false }));
    return out;
  }, [categorias, obras, proyectos]);

  // Opciones de los filtros del propio listado.
  const filtroOptions = useMemo(() => {
    const seen = new Map<string, string>();
    filas.forEach(f => seen.set(f.filtroId, f.filtro));
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [filas]);
  const estadoOptions = [
    { value: 'activa', label: 'Activa' },
    { value: 'inactiva', label: 'Inactiva' },
  ];
  const origenOptions = (Object.keys(ORIGEN) as Origen[]).map(k => ({ value: k, label: ORIGEN[k].label }));

  const visibles = useMemo(() => {
    const q = (filtros.search || '').trim().toLowerCase();
    return filas.filter(
      f =>
        (!q || `${f.nombre} ${f.filtro} ${f.modulo}`.toLowerCase().includes(q)) &&
        (!filtros.status || f.origen === filtros.status) &&
        (!filtros.type || f.filtroId === filtros.type) &&
        (!filtros.estado || (filtros.estado === 'activa' ? f.activa : !f.activa)),
    );
  }, [filas, filtros]);

  const catOptions = categorias.map(c => ({ label: `${c.label} · ${c.modulo}`, value: c.id }));

  function openAdd() {
    setNombre('');
    setCategoria('');
    setActivaNueva(true);
    setError('');
    setOkMsg('');
    setShowAdd(true);
  }

  function closeAdd() {
    setShowAdd(false);
    setError('');
  }

  // Escape cierra la ventana (si no hay un menú desplegable abierto).
  useEffect(() => {
    if (!showAdd) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.getElementById('glass-select-dd')) setShowAdd(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showAdd]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError('');
    setOkMsg('');
    if (!categoria) {
      setError('Elige en qué categoría se va a agregar.');
      return;
    }
    if (!nombre.trim()) {
      setError('Escribe el nombre de la nueva opción.');
      return;
    }
    setSaving(true);
    try {
      const data = await call('POST', { categoria, nombre, activa: activaNueva });
      setCatalogoFiltros(data);
      const cat = data.find(c => c.id === categoria);
      setOkMsg(
        activaNueva
          ? `«${nombre.trim()}» se agregó a ${cat?.label ?? 'la categoría'}. Ya aparece en los filtros.`
          : `«${nombre.trim()}» se agregó a ${cat?.label ?? 'la categoría'} como inactiva: no aparecerá en los filtros hasta que la actives.`,
      );
      setNombre('');
      setCategoria('');
      setShowAdd(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar la opción.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActiva(f: Fila, activa: boolean) {
    setError('');
    try {
      const data = await call('PATCH', { categoria: f.filtroId, nombre: f.nombre, activa });
      setCatalogoFiltros(data);
      setOkMsg(
        activa
          ? `«${f.nombre}» está activa: ya aparece en el filtro «${f.filtro}».`
          : `«${f.nombre}» está inactiva: dejó de aparecer en el filtro «${f.filtro}».`,
      );
    } catch (err) {
      setOkMsg('');
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el estado de la opción.');
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      const data = await call('DELETE', { categoria: toDelete.categoria, nombre: toDelete.valor });
      setCatalogoFiltros(data);
      setOkMsg(`«${toDelete.valor}» se quitó de ${toDelete.label}.`);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo quitar la opción.');
    }
    setToDelete(null);
  }

  const agregadas = filas.filter(f => f.origen === 'agregada').length;

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-ink">Filtros de la aplicación</h1>
        <p className="text-soft text-sm mt-0.5">
          Listado de todas las opciones de las listas desplegables. Usa el botón «+» del listado para agregar una nueva: aparece al instante en su filtro.
        </p>
      </div>

      {okMsg && (
        <p role="status" className="chip chip-ok !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full">
          <CheckCircle2 size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />{okMsg}
          <button type="button" onClick={() => setOkMsg('')} aria-label="Cerrar aviso" className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-white/60">
            <X size={13} strokeWidth={2.2} />
          </button>
        </p>
      )}
      {error && !showAdd && (
        <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full">
          <AlertCircle size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />{error}
        </p>
      )}

      {/* Filtros del listado */}
      <FilterPanel
        onFilterChange={setFiltros}
        showDateRange={false}
        showSearch={true}
        showStatus={true}
        showType={true}
        statusOptions={origenOptions}
        typeOptions={filtroOptions}
        statusLabel="Origen"
        typeLabel="Filtro"
        extraFields={[{ key: 'estado', label: 'Estado', options: estadoOptions }]}
      />

      {/* Listado */}
      <div className="table-glass">
        <div className="px-5 py-4 border-b border-line/25 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-ink">
              Todas las opciones ({visibles.length}{visibles.length !== filas.length ? ` de ${filas.length}` : ''})
            </h3>
            <button
              type="button"
              onClick={openAdd}
              aria-label="Agregar opción de filtro"
              title="Agregar opción de filtro"
              className="btn btn-primary btn-icon !w-9 !h-9 !rounded-full shrink-0"
            >
              <Plus size={18} strokeWidth={2.2} />
            </button>
          </div>
          <p className="text-xs text-mute">
            {agregadas} agregada{agregadas === 1 ? '' : 's'} · «Orden» es la posición de la opción dentro de la lista desplegable
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Orden', 'Opción', 'Filtro al que pertenece', 'Módulo', 'Origen', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-soft uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [0, 1, 2, 3, 4].map(i => (
                    <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="skeleton h-7" /></td></tr>
                  ))
                : visibles.map(f => (
                    <tr key={f.key} className={f.activa ? '' : 'opacity-60'}>
                      <td className="px-5 py-3">
                        {f.orden !== null ? (
                          <span className="inline-flex w-8 h-8 items-center justify-center rounded-full text-xs font-semibold text-brand-deep" style={{ background: 'rgb(var(--brand-soft) / 0.8)' }}>
                            {f.orden}
                          </span>
                        ) : (
                          <span className="inline-flex w-8 h-8 items-center justify-center text-mute" title="Inactiva: no aparece en la lista desplegable">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-ink">{f.nombre}</td>
                      <td className="px-5 py-3 text-soft">{f.filtro}</td>
                      <td className="px-5 py-3 text-soft whitespace-nowrap">{f.modulo}</td>
                      <td className="px-5 py-3">
                        <span className={ORIGEN[f.origen].cls} title={ORIGEN[f.origen].ayuda}>{ORIGEN[f.origen].label}</span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {f.editable ? (
                          <GlassCheck
                            variant="inline"
                            checked={f.activa}
                            onChange={v => toggleActiva(f, v)}
                            label={f.activa ? 'Activa' : 'Inactiva'}
                          />
                        ) : (
                          <span className="text-mute text-xs" title="Lista fija: no se activa ni desactiva desde aquí">Fija</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {f.origen === 'agregada' ? (
                          <button
                            type="button"
                            onClick={() => setToDelete({ categoria: f.filtroId, label: f.filtro, valor: f.nombre })}
                            aria-label={`Quitar ${f.nombre} de ${f.filtro}`}
                            title="Quitar"
                            className="btn btn-ghost btn-icon !w-9 !h-9 text-danger-ink"
                          >
                            <Trash2 size={16} strokeWidth={1.8} />
                          </button>
                        ) : (
                          <span className="text-mute text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              {!loading && visibles.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-mute">Ninguna opción coincide con los filtros</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-mute">
        Marca o desmarca «Activa» para mostrar u ocultar una opción en su lista desplegable (en cada filtro debe quedar al menos una activa).
        Solo se pueden quitar las opciones «Agregadas». Las del sistema (por ejemplo el perfil de acceso, que define los permisos) y las que
        vienen de los datos (proyectos y obras) no se editan aquí. Máximo {FILTRO_MAX_OPCIONES} opciones agregadas por filtro.
      </p>

      {showAdd && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filtro-modal-titulo"
          onMouseDown={e => { if (e.target === e.currentTarget) closeAdd(); }}
        >
          <form onSubmit={handleAdd} noValidate className="modal-panel w-full max-w-lg my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line/25">
              <div className="flex items-center gap-3">
                <div className="icon-orb !w-9 !h-9"><SlidersHorizontal size={16} strokeWidth={1.8} /></div>
                <h2 id="filtro-modal-titulo" className="text-xl font-bold text-ink">Nueva opción de filtro</h2>
              </div>
              <button type="button" onClick={closeAdd} aria-label="Cerrar" className="btn btn-ghost btn-icon">
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="filtro-nombre" className="label !mb-0">Nombre que se agregará</label>
                <input
                  id="filtro-nombre"
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  maxLength={40}
                  placeholder="Ej.: Bodega, Estacionamiento, Oficina…"
                  className="field w-full"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label !mb-0">Categoría (filtro donde aparecerá)</label>
                <GlassSelect value={categoria} options={catOptions} onChange={setCategoria} allLabel="Elige una categoría" />
                <p className="text-xs text-mute">Se agrega al final de la lista de esa categoría.</p>
              </div>

              <GlassCheck
                checked={activaNueva}
                onChange={setActivaNueva}
                label="Activa"
                description="Si está activa, aparece en la lista desplegable del filtro. Puedes cambiarlo después desde el listado."
              />

              {error && (
                <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full">
                  <AlertCircle size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />{error}
                </p>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-line/25">
              <button type="button" onClick={closeAdd} className="btn btn-secondary flex-1">Cancelar</button>
              <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                {saving ? 'Agregando…' : 'Agregar opción'}
              </button>
            </div>
          </form>
        </div>
      )}

      {toDelete && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="modal-panel p-7 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(var(--danger) / 0.14)' }}>
              <Trash2 size={22} strokeWidth={1.8} className="text-danger-ink" />
            </div>
            <h3 className="text-lg font-semibold text-ink text-center">¿Quitar la opción?</h3>
            <p className="text-soft text-sm text-center mt-1 mb-6">
              «{toDelete.valor}» dejará de aparecer en el filtro «{toDelete.label}».
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setToDelete(null)} className="btn btn-secondary flex-1">Cancelar</button>
              <button type="button" onClick={handleDelete} className="btn btn-danger flex-1">Quitar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
