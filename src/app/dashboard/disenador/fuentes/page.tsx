'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle2, CircleOff, Database, Hash, ToggleLeft, Type } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { DataSourceDef } from '@/lib/bi/types';

const TYPE_ICON = { string: Type, number: Hash, date: Calendar, boolean: ToggleLeft } as const;
const TYPE_LABEL = { string: 'Texto', number: 'Número', date: 'Fecha', boolean: 'Sí / No' } as const;

export default function FuentesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [fuentes, setFuentes] = useState<DataSourceDef[] | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'administrador') router.replace('/dashboard/finanzas');
  }, [user, router]);

  useEffect(() => {
    fetch('/api/bi/catalogo', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(j => setFuentes(j.data as DataSourceDef[]))
      .catch(() => { setError('No se pudo cargar el catálogo de fuentes de datos.'); setFuentes([]); });
  }, []);

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-ink">Fuentes de datos</h1>
        <p className="text-soft text-sm mt-0.5">Bases de datos disponibles para crear gráficos, con sus conjuntos de datos y campos.</p>
      </div>
      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm w-fit">{error}</p>}

      {fuentes === null ? (
        <div className="space-y-4">{[0, 1, 2].map(i => <div key={i} className="skeleton h-[110px]" />)}</div>
      ) : (
        <div className="space-y-4">
          {fuentes.map(s => {
            const ok = s.status === 'conectada';
            return (
              <section key={s.id} className="glass-card relative" style={{ padding: 'var(--pad-card)' }} aria-label={s.label}>
                <div className="sheen" />
                <div className="flex flex-wrap items-start gap-3">
                  <div className="icon-orb !w-10 !h-10 shrink-0"><Database size={18} strokeWidth={1.8} /></div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-ink">{s.label}</h2>
                    <p className="text-sm text-soft mt-0.5">{s.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="chip chip-neutral">{s.kind}</span>
                    {ok
                      ? <span className="chip chip-ok"><CheckCircle2 size={13} strokeWidth={2} />Conectada</span>
                      : <span className="chip chip-warn"><CircleOff size={13} strokeWidth={2} />Sin conectar</span>}
                  </div>
                </div>

                {s.datasets.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {s.datasets.map(d => {
                      const key = `${s.id}:${d.id}`;
                      const isOpen = open === key;
                      return (
                        <div key={d.id} className="rounded-2xl" style={{ background: 'rgb(255 255 255 / 0.35)', border: '1px solid rgb(var(--line) / 0.28)' }}>
                          <button type="button" onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen} className="w-full flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-left">
                            <span>
                              <span className="block text-sm font-semibold text-ink">{d.label}</span>
                              <span className="block text-xs text-soft">{d.description}</span>
                            </span>
                            <span className="text-xs text-mute">{d.fields.length} campos{d.proyectoField ? ' · filtrado por proyecto asignado' : ''}</span>
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr>{['Campo', 'Tipo', 'Valores de ejemplo'].map(h => <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-soft uppercase tracking-wider">{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                  {d.fields.map(f => {
                                    const Icon = TYPE_ICON[f.type];
                                    return (
                                      <tr key={f.id} className="border-t border-line/20">
                                        <td className="py-2 pr-4 font-medium text-ink">{f.label}</td>
                                        <td className="py-2 pr-4 text-soft whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><Icon size={13} className="text-mute" />{TYPE_LABEL[f.type]}</span></td>
                                        <td className="py-2 text-mute text-xs">{f.values ? f.values.slice(0, 6).join(' · ') + (f.values.length > 6 ? ' …' : '') : '—'}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          <section className="glass-card relative" style={{ padding: 'var(--pad-card)' }}>
            <div className="sheen" />
            <h2 className="text-base font-semibold text-ink">¿Cómo se conecta otra base de datos?</h2>
            <p className="text-sm text-soft mt-1">
              Cada base de datos se agrega como una nueva fuente en <code className="text-xs bg-white/60 px-1.5 py-0.5 rounded">src/lib/server/bi/sources.ts</code>:
              se describen sus conjuntos de datos con sus campos y se indica cómo leer las filas. En cuanto exista, aparece en esta lista y en el editor de gráficos,
              sin cambiar nada más. Las personas que no son administradoras solo ven las filas de los proyectos que tienen asignados.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
