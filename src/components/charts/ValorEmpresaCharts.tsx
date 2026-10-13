'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { ValorEmpresaData } from '@/types/domain';
import { Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ValorEmpresaCharts({ data, loading }: { data: ValorEmpresaData | null; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Evolución de Valuación" subtitle="USD millones · histórico" accent="green">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data?.historico || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78A8D7" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#78A8D7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8195A8' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip formatter={(v: number) => `Valuación: $${v}M`} />} />
              <Area type="monotone" dataKey="valor" stroke="#78A8D7" strokeWidth={2.5} fill="url(#fillValor)" name="Valuación"
                dot={{ fill: '#78A8D7', r: 4, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#78A8D7', stroke: '#FFFFFF', strokeWidth: 2.5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    
      <ChartCard title="Crecimiento Anual de Valuación" subtitle="USD millones · barras" accent="blue">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.historico || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillValorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9BBFE3" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#5C93C7" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8195A8' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number) => `Valuación: $${v}M`} />} />
              <Bar dataKey="valor" fill="url(#fillValorBar)" radius={[8, 8, 0, 0]} name="Valuación" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
