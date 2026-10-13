'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MetricCard from '@/components/MetricCard';
import { ConstructoraData } from '@/types/domain';
import { Gauge, Timer, Coins, PiggyBank, ShoppingCart, FileText, PackageX, AlertTriangle, Info } from 'lucide-react';

const ConstructoraCharts = dynamic(() => import('@/components/charts/ConstructoraCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-[330px]" />)}
    </div>
  ),
});
if (typeof window !== 'undefined') void import('@/components/charts/ConstructoraCharts');

const icons = [
  <Gauge size={22} key="a" />, <Timer size={22} key="s" />, <Coins size={22} key="c" />, <PiggyBank size={22} key="p" />,
  <ShoppingCart size={22} key="o" />, <FileText size={22} key="f" />, <PackageX size={22} key="k" />, <AlertTriangle size={22} key="i" />,
];

export default function ConstructoraPage() {
  const [data, setData] = useState<ConstructoraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/constructora', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(res => setData(res.data || null))
      .catch(() => { setData(null); setError('No se pudo cargar el panel de la constructora.'); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Constructora</h1>
          <p className="text-soft text-sm mt-1">Avance de obras, costos, compras e incidencias de la cartera de construcción</p>
        </div>
        <span className="chip chip-info self-start"><Info size={14} strokeWidth={2} />Datos de demostración · se conectarán a Control de Obra</span>
      </div>

      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm">{error}</p>}

      <div className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-[148px]" />)
          : (data?.metrics || []).map((m, i) => (
            <MetricCard key={m.label} label={m.label} value={m.value} trend={m.trend} up={m.up} color={m.color} icon={icons[i]} caption={m.caption} />
          ))}
      </div>

      <ConstructoraCharts data={data} loading={loading} />

      <div className="table-glass">
        <div className="px-6 py-4 border-b border-line/25">
          <h3 className="text-sm font-semibold text-ink">Estado por obra</h3>
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
                <tr><td colSpan={10} className="px-6 py-10 text-center text-soft">Sin obras para mostrar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
