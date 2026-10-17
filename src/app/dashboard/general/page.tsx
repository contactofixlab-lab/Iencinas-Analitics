'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import DashboardCanvas from '@/components/bi/DashboardCanvas';
import { GeneralData } from '@/types/domain';
import { DollarSign, Wallet, TrendingUp, CheckCircle2, Layers, Users, Percent, Building2 } from 'lucide-react';

const icons = [
  <DollarSign size={22} key="i" />, <Wallet size={22} key="e" />, <TrendingUp size={22} key="m" />, <CheckCircle2 size={22} key="v" />,
  <Layers size={22} key="p" />, <Users size={22} key="l" />, <Percent size={22} key="c" />, <Building2 size={22} key="a" />,
];

const money = (v: number) => (v === 0 ? '$0' : Math.abs(v) >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${Math.round(v / 1000)}K`);
const ESTADO_CHIP: Record<string, string> = { activo: 'chip chip-ok', completado: 'chip chip-info', inactivo: 'chip chip-neutral' };

export default function GeneralPage() {
  const [data, setData] = useState<GeneralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/general', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(res => setData(res.data || null))
      .catch(() => { setData(null); setError('No se pudo cargar el resumen general.'); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-ink">Resumen General</h1>
        <p className="text-soft text-sm mt-1">Visión consolidada de toda la empresa: finanzas, comercial, marketing y proyectos</p>
      </div>

      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm">{error}</p>}

      <div className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-[148px]" />)
          : (data?.metrics || []).map((m, i) => (
            <MetricCard key={m.label} label={m.label} value={m.value} trend={m.trend} up={m.up} color={m.color} icon={icons[i]} caption={m.caption} />
          ))}
      </div>

      <DashboardCanvas modulo="general" />

      <div className="table-glass">
        <div className="px-6 py-4 border-b border-line/25">
          <h3 className="text-sm font-semibold text-ink">Resumen por proyecto ({data?.resumenProyectos.length ?? 0})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Proyecto', 'Ubicación', 'Estado', 'Ingresos', 'Egresos', 'Margen', 'Ventas cerradas', 'Leads'].map(h => (
                  <th key={h} className="text-left px-6 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.resumenProyectos ?? []).map(r => {
                const margen = r.ingresos > 0 ? ((r.ingresos - r.egresos) / r.ingresos) * 100 : 0;
                return (
                  <tr key={r.proyecto}>
                    <td className="px-6 py-3 font-medium">{r.proyecto}</td>
                    <td className="px-6 py-3 text-soft">{r.ubicacion}</td>
                    <td className="px-6 py-3"><span className={ESTADO_CHIP[r.estado] || 'chip chip-neutral'}>{r.estado[0].toUpperCase() + r.estado.slice(1)}</span></td>
                    <td className="px-6 py-3 font-semibold text-ok-ink">{money(r.ingresos)}</td>
                    <td className="px-6 py-3 font-semibold text-danger-ink">{money(r.egresos)}</td>
                    <td className="px-6 py-3">{r.ingresos > 0 ? `${margen.toFixed(1)}%` : '—'}</td>
                    <td className="px-6 py-3">{r.ventasCerradas}</td>
                    <td className="px-6 py-3">{r.leads}</td>
                  </tr>
                );
              })}
              {!loading && !data?.resumenProyectos.length && (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-soft">Sin datos para mostrar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
