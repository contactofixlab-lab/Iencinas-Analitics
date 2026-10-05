'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { ComercialData } from '@/types/domain';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac'];

export default function ComercialCharts({ data, loading }: { data: ComercialData | null; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Propiedades Vendidas por Mes" subtitle="Unidades cerradas" accent="green">
        {loading ? (
          <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.ventas || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#15803d" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Ventas: ${v}`} />} />
              <Bar dataKey="ventas" fill="url(#fillVentas)" radius={[8, 8, 0, 0]} name="Ventas" maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    
      <ChartCard title="Pipeline de Ventas" subtitle="Leads por etapa del embudo" accent="blue">
        {loading ? (
          <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.pipeline || []} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="etapa" type="category" tick={{ fontSize: 12, fill: '#9ca3af' }} width={100} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
              <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} name="Leads" maxBarSize={28}>
                {(data?.pipeline || []).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
