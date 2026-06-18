'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ProjectSelector from '@/components/ProjectSelector';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { FinanzasData, Metric } from '@/types/domain';
import { BarChart2, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const icons = [
  <DollarSign size={22} key="dollar" />,
  <Wallet size={22} key="wallet" />,
  <TrendingUp size={22} key="trend" />,
  <BarChart2 size={22} key="bar" />,
];

const transacciones = [
  { id: 'T001', concepto: 'Venta Departamento Las Condes', tipo: 'Ingreso', monto: '$320,000', fecha: '2026-06-10' },
  { id: 'T002', concepto: 'Comisiones vendedores Q2', tipo: 'Egreso', monto: '$48,000', fecha: '2026-06-09' },
  { id: 'T003', concepto: 'Venta Casa Lo Barnechea', tipo: 'Ingreso', monto: '$480,000', fecha: '2026-06-08' },
  { id: 'T004', concepto: 'Marketing campaña digital', tipo: 'Egreso', monto: '$15,000', fecha: '2026-06-07' },
  { id: 'T005', concepto: 'Arriendo oficinas Providencia', tipo: 'Egreso', monto: '$8,500', fecha: '2026-06-06' },
  { id: 'T006', concepto: 'Venta Loft Vitacura', tipo: 'Ingreso', monto: '$210,000', fecha: '2026-06-05' },
];

export default function FinanzasPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('bosques-del-mar');
  const [data, setData] = useState<FinanzasData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [filteredTransacciones, setFilteredTransacciones] = useState(transacciones);

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/finanzas?proyecto=${proyecto}`)
      .then(res => res.json())
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [proyecto]);

  const handleProyectoChange = (newProyecto: string) => {
    setProyecto(newProyecto);
    window.history.replaceState({}, '', `?proyecto=${newProyecto}`);
  };

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
    let filtered = transacciones;

    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.concepto.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.status && newFilters.status !== '') {
      filtered = filtered.filter(t => t.tipo === newFilters.status);
    }

    if (newFilters.dateRange) {
      const dateRange = newFilters.dateRange;
      filtered = filtered.filter(t => {
        const fecha = new Date(t.fecha);
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);
        return fecha >= from && fecha <= to;
      });
    }

    setFilteredTransacciones(filtered);
  };

  if (!data && !loading) return null;

  const combined = (data?.ingresos || []).map((d, i) => ({
    mes: d.mes,
    ingresos: d.valor / 1000000,
    gastos: (data?.gastos?.[i]?.valor || 0) / 1000000,
  }));

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Finanzas</h1>
          <p className="text-gray-400 text-sm mt-1">Resumen financiero del período actual</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      {/* Filters - Ahora arriba */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        showDateRange={true}
        showSearch={true}
        showStatus={true}
        statusOptions={[
          { label: 'Ingreso', value: 'Ingreso' },
          { label: 'Egreso', value: 'Egreso' },
        ]}
        statusLabel="Tipo de Transacción"
      />

      <div className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        {(data?.metrics || []).map((m, i) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            trend={m.trend}
            up={m.up}
            color={m.color}
            icon={icons[i]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Evolución de Ingresos" subtitle="USD millones · área acumulada" accent="green">
          {loading ? (
            <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={combined} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
                <Tooltip content={<GlassTooltip formatter={(v: number) => `Ingresos: $${v.toFixed(1)}M`} />} />
                <Area type="monotone" dataKey="ingresos" stroke="#4ade80" strokeWidth={3} fill="url(#fillIngresos)" name="Ingresos"
                  dot={false} activeDot={{ r: 6, fill: '#4ade80', stroke: '#0a1322', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Gastos Operativos por Mes" subtitle="USD millones · barras" accent="red">
          {loading ? (
            <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={combined} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.35} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Gastos: $${v.toFixed(1)}M`} />} />
                <Bar dataKey="gastos" fill="url(#fillGastos)" radius={[8, 8, 0, 0]} name="Gastos" maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}>
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Últimas Transacciones ({filteredTransacciones.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {['ID', 'Concepto', 'Tipo', 'Monto', 'Fecha'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransacciones.length > 0 ? filteredTransacciones.map(t => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3 font-mono text-gray-500 text-xs">{t.id}</td>
                  <td className="px-6 py-3 text-gray-300 font-medium">{t.concepto}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${t.tipo === 'Ingreso' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className={`px-6 py-3 font-semibold ${t.tipo === 'Ingreso' ? 'text-green-400' : 'text-red-400'}`}>{t.monto}</td>
                  <td className="px-6 py-3 text-gray-500">{t.fecha}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay transacciones que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
