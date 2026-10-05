'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { FinanzasData } from '@/types/domain';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function FinanzasCharts({ data, loading, combined }: { data: FinanzasData | null; loading: boolean; combined: { mes: string; ingresos: number; gastos: number }[] }) {
  return (
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
  );
}
