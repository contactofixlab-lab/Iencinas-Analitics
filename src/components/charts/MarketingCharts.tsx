'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { MarketingData } from '@/types/domain';
import { Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MarketingCharts({ data, loading }: { data: MarketingData | null; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Leads Generados por Mes" subtitle="Tendencia mensual" accent="purple">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data?.leads || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78A8D7" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#78A8D7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
              <Area type="monotone" dataKey="leads" stroke="#9BBFE3" strokeWidth={2.5} fill="url(#fillLeads)" name="Leads"
                dot={false} activeDot={{ r: 5, fill: '#9BBFE3', stroke: '#FFFFFF', strokeWidth: 2.5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    
      <ChartCard title="Leads por Canal de Marketing" subtitle="Distribución por origen" accent="purple">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.canales || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillCanales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9BBFE3" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#5C93C7" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" vertical={false} />
              <XAxis dataKey="canal" tick={{ fontSize: 11, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
              <Bar dataKey="leads" fill="url(#fillCanales)" radius={[8, 8, 0, 0]} name="Leads" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
