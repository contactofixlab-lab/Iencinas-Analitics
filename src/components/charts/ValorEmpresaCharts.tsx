'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { ValorEmpresaData } from '@/types/domain';
import { Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ValorEmpresaCharts({ data, loading }: { data: ValorEmpresaData | null; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Evolución de Valuación" subtitle="USD millones · histórico" accent="green">
        {loading ? (
          <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data?.historico || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip formatter={(v: number) => `Valuación: $${v}M`} />} />
              <Area type="monotone" dataKey="valor" stroke="#4ade80" strokeWidth={3} fill="url(#fillValor)" name="Valuación"
                dot={{ fill: '#4ade80', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#4ade80', stroke: '#0a1322', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    
      <ChartCard title="Crecimiento Anual de Valuación" subtitle="USD millones · barras" accent="blue">
        {loading ? (
          <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.historico || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillValorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Valuación: $${v}M`} />} />
              <Bar dataKey="valor" fill="url(#fillValorBar)" radius={[8, 8, 0, 0]} name="Valuación" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
