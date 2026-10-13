'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { FinanzasData } from '@/types/domain';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function FinanzasCharts({ data, loading, combined }: { data: FinanzasData | null; loading: boolean; combined: { mes: string; ingresos: number; gastos: number }[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Evolución de Ingresos" subtitle="USD millones · área acumulada" accent="green">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={combined} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78A8D7" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#78A8D7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8195A8' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip formatter={(v: number) => `Ingresos: $${v.toFixed(1)}M`} />} />
              <Area type="monotone" dataKey="ingresos" stroke="#78A8D7" strokeWidth={2.5} fill="url(#fillIngresos)" name="Ingresos"
                dot={false} activeDot={{ r: 5, fill: '#78A8D7', stroke: '#FFFFFF', strokeWidth: 2.5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    
      <ChartCard title="Gastos Operativos por Mes" subtitle="USD millones · barras" accent="red">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={combined} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EBAEB5" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#D9808B" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8195A8' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number) => `Gastos: $${v.toFixed(1)}M`} />} />
              <Bar dataKey="gastos" fill="url(#fillGastos)" radius={[8, 8, 0, 0]} name="Gastos" maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
