'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Lock, Trash2, SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GlassSelect from '@/components/GlassSelect';
import { setCatalogoFiltros, useFiltros } from '@/lib/filtros-client';
import { FILTRO_MAX_OPCIONES, type FiltroCategoriaDTO } from '@/lib/filtros';

async function call(method: 'POST' | 'DELETE', body: { categoria: string; nombre: string }): Promise<FiltroCategoriaDTO[]> {
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [toDelete, setToDelete] = useState<{ categoria: string; label: string; valor: string } | null>(null);

  useEffect(() => {
    if (user && user.role !== 'administrador') router.replace('/dashboard/finanzas');
  }, [user, router]);

  const catOptions = categorias.map(c => ({ label: `${c.label} · ${c.modulo}`, value: c.id }));

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
      const data = await call('POST', { categoria, nombre });
      setCatalogoFiltros(data);
      const cat = data.find(c => c.id === categoria);
      setOkMsg(`«${nombre.trim()}» se agregó a ${cat?.label ?? 'la categoría'}. Ya aparece en los filtros.`);
      setNombre('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar la opción.');
    } finally {
      setSaving(false);
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

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-ink">Filtros de la aplicación</h1>
        <p className="text-soft text-sm mt-0.5">
          Agrega opciones a las listas desplegables de todos los módulos: aparecen al instante en cada filtro.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleAdd} className="glass-card relative" style={{ padding: 'var(--pad-card)' }} noValidate>
        <div className="sheen" />
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-orb !w-9 !h-9"><SlidersHorizontal size={16} strokeWidth={1.8} /></div>
          <h3 className="text-sm font-semibold text-ink">Nueva opción de filtro</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
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
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="label !mb-0">Categoría (filtro donde aparecerá)</label>
            <GlassSelect value={categoria} options={catOptions} onChange={setCategoria} allLabel="Elige una categoría" />
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary !h-12 whitespace-nowrap">
            <Plus size={17} strokeWidth={1.8} />
            {saving ? 'Agregando…' : 'Agregar opción'}
          </button>
        </div>

        {error && (
          <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm mt-4 flex items-start gap-2 w-fit max-w-full">
            <AlertCircle size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />{error}
          </p>
        )}
        {okMsg && !error && (
          <p role="status" className="chip chip-ok !rounded-2xl !px-4 !py-2.5 !text-sm mt-4 flex items-start gap-2 w-fit max-w-full">
            <CheckCircle2 size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />{okMsg}
          </p>
        )}
      </form>

      {/* Catálogo */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading
          ? [0, 1, 2, 3].map(i => <div key={i} className="skeleton h-[170px]" />)
          : categorias.map(c => {
              const agregadas = c.opciones.filter(o => !o.predeterminada).length;
              return (
                <section key={c.id} className="glass-card relative" style={{ padding: 'var(--pad-card)' }} aria-label={c.label}>
                  <div className="sheen" />
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-semibold text-ink">{c.label}</h3>
                    <span className="chip chip-info">{c.modulo}</span>
                  </div>
                  <p className="text-xs text-mute mb-4">
                    {c.descripcion} · {c.opciones.length} opciones ({agregadas}/{FILTRO_MAX_OPCIONES} agregadas)
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {c.opciones.map(o => (
                      <li key={o.valor}>
                        {o.predeterminada ? (
                          <span className="chip chip-neutral" title="Predeterminada: no se puede quitar">
                            <Lock size={11} strokeWidth={2} />{o.valor}
                          </span>
                        ) : (
                          <span className="chip chip-ok">
                            {o.valor}
                            <button
                              type="button"
                              onClick={() => setToDelete({ categoria: c.id, label: c.label, valor: o.valor })}
                              aria-label={`Quitar ${o.valor} de ${c.label}`}
                              className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-white/60"
                            >
                              <X size={12} strokeWidth={2.2} />
                            </button>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
      </div>

      <p className="text-xs text-mute">
        Las opciones predeterminadas (con candado) no se pueden quitar. El perfil de acceso (Finanzas, Comercial, Marketing, Administrador)
        no se administra aquí porque define los permisos de la aplicación.
      </p>

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
