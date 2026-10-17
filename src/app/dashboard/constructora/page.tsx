'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import DashboardCanvas from '@/components/bi/DashboardCanvas';
import SelectFilterPanel from '@/components/SelectFilterPanel';
import { useFiltros } from '@/lib/filtros-client';
import { ConstructoraData } from '@/types/domain';
import { Gauge, Timer, Coins, PiggyBank, ShoppingCart, FileText, PackageX, AlertTriangle, Info } from 'lucide-react';

const icons = [
  <Gauge size={22} key="a" />, <Timer size={22} key="s" />, <Coins size={22} key="c" />, <PiggyBank size={22} key="p" />,
  <ShoppingCart size={22} key="o" />, <FileText size={22} key="f" />, <PackageX size={22} key="k" />, <AlertTriangle size={22} key="i" />,
];

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  .map((label, i) => ({ label, value: String(i + 1) }));
const CRONOGRAMA = [
  { label: 'En plazo (SPI ≥ 1)', value: 'en_plazo' },
  { label: 'Con atraso (SPI < 1)', value: 'atraso' },
];
const SEVERIDAD = [
  { label: 'Alta', value: 'alta' },
  { label: 'Media', value: 'media' },
  { label: 'Baja', value: 'baja' },
];

const VACIO = { obra: '', estado: '', cronograma: '', oc: '', severidad: '', mesDesde: '', mesHasta: '' };
type Filtros = typeof VACIO;

export default function ConstructoraPage() {
  const { opciones } = useFiltros();
  const [data, setData] = useState<ConstructoraData | null>(null);
  const [obrasDisp, setObrasDisp] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState<Filtros>(VACIO);
  const seq = useRef(0);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    (Object.keys(filtros) as (keyof Filtros)[]).forEach(k => filtros[k] && sp.set(k, filtros[k]));
    return sp.toString();
  }, [filtros]);

  useEffect(() => {
    const id = ++seq.current;
    setRefreshing(true);
    fetch(`/api/constructora${query ? `?${query}` : ''}`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(res => {
        if (id !== seq.current) return;
        setData(res.data || null);
        if (res.data?.obrasDisponibles?.length) setObrasDisp(res.data.obrasDisponibles);
        setError('');
      })
      .catch(() => {
        if (id !== seq.current) return;
        setData(null);
        setError('No se pudo cargar el panel de la constructora.');
      })
      .finally(() => {
        if (id !== seq.current) return;
        setLoading(false);
        setRefreshing(false);
      });
  }, [query]);

  // Filtros que se envían a los gráficos del módulo (solo los que tienen valor).
  const ctx = useMemo(() => Object.fromEntries(Object.entries(filtros).filter(([, v]) => v)), [filtros]);

  const fields = [
    { key: 'obra', label: 'Obra', value: filtros.obra, options: obrasDisp.map(o => ({ label: o, value: o })), allLabel: 'Todas las obras' },
    { key: 'estado', label: 'Estado de la obra', value: filtros.estado, options: opciones('estado_obra') },
    { key: 'cronograma', label: 'Cronograma', value: filtros.cronograma, options: CRONOGRAMA },
    { key: 'oc', label: 'Estado de la orden de compra', value: filtros.oc, options: opciones('estado_oc') },
    { key: 'severidad', label: 'Severidad de incidencias', value: filtros.severidad, options: SEVERIDAD },
    { key: 'mesDesde', label: 'Desde (mes)', value: filtros.mesDesde, options: MESES.slice(1), allLabel: 'Enero' },
    { key: 'mesHasta', label: 'Hasta (mes)', value: filtros.mesHasta, options: MESES.slice(0, 11), allLabel: 'Diciembre' },
  ];

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Constructora</h1>
          <p className="text-soft text-sm mt-1">Avance de obras, costos, compras e incidencias de la cartera de construcción</p>
        </div>
        <span className="chip chip-info self-start"><Info size={14} strokeWidth={2} />Datos de demostración · se conectarán a Control de Obra</span>
      </div>

      <SelectFilterPanel
        fields={fields}
        onChange={(key, value) => setFiltros(prev => ({ ...prev, [key]: value }))}
        onClear={() => setFiltros(VACIO)}
      />

      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm">{error}</p>}
      {!error && data?.avisos.map(a => (
        <p key={a} role="status" className="chip chip-info !rounded-2xl !px-4 !py-2.5 !text-sm flex items-start gap-2 w-fit max-w-full">
          <Info size={15} strokeWidth={2} className="mt-0.5 shrink-0" />{a}
        </p>
      ))}

      <div className={`space-y-6 transition-opacity duration-200 ${refreshing && !loading ? 'opacity-60' : 'opacity-100'}`} aria-busy={refreshing}>
        <div className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-[148px]" />)
            : (data?.metrics || []).map((m, i) => (
              <MetricCard key={m.label} label={m.label} value={m.value} trend={m.trend} up={m.up} color={m.color} icon={icons[i]} caption={m.caption} />
            ))}
        </div>

        <DashboardCanvas modulo="constructora" ctx={ctx}/>

        <div className="table-glass">
          <div className="px-6 py-4 border-b border-line/25">
            <h3 className="text-sm font-semibold text-ink">Estado por obra ({data?.obras.length ?? 0})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['Obra', 'Estado', 'Avance real', 'Avance plan', 'SPI', 'CPI', 'Presupuesto', 'Costo real', 'OC pend.', 'Incid. abiertas'].map(h => (
                    <th key={h} className="text-left px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.obras ?? []).map(o => (
                  <tr key={o.obra}>
                    <td className="px-5 py-3 font-medium whitespace-nowrap">{o.obra}</td>
                    <td className="px-5 py-3"><span className="chip chip-info">{o.estado}</span></td>
                    <td className="px-5 py-3 font-semibold">{o.avanceReal}%</td>
                    <td className="px-5 py-3 text-soft">{o.avancePlan}%</td>
                    <td className="px-5 py-3"><span className={o.spi >= 1 ? 'chip chip-ok' : 'chip chip-warn'}>{o.spi.toFixed(2)}</span></td>
                    <td className="px-5 py-3"><span className={o.cpi >= 1 ? 'chip chip-ok' : 'chip chip-warn'}>{o.cpi.toFixed(2)}</span></td>
                    <td className="px-5 py-3">${o.presupuesto.toLocaleString('es-CL')}MM</td>
                    <td className="px-5 py-3">${o.costoReal.toLocaleString('es-CL')}MM</td>
                    <td className="px-5 py-3">{o.ocPendientes}</td>
                    <td className="px-5 py-3">{o.incidenciasAbiertas}</td>
                  </tr>
                ))}
                {!loading && !data?.obras.length && (
                  <tr><td colSpan={10} className="px-6 py-10 text-center text-soft">Ninguna obra coincide con los filtros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
