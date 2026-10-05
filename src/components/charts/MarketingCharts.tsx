'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { MarketingData } from '@/types/domain';
import { Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MarketingCharts({ data, loading }: { data: MarketingData | null; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Leads Generados por Mes" subtitle="Tendencia mensual" accent="purple">
        {loading ? (
          <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data?.leads || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
              <Area type="monotone" dataKey="leads" stroke="#c084fc" strokeWidth={3} fill="url(#fillLeads)" name="Leads"
                dot={false} activeDot={{ r: 6, fill: '#c084fc', stroke: '#0a1322', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    
      <ChartCard title="Leads por Canal de Marketing" subtitle="Distribución por origen" accent="purple">
        {loading ? (
          <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.canales || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillCanales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="canal" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
              <Bar dataKey="leads" fill="url(#fillCanales)" radius={[8, 8, 0, 0]} name="Leads" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
