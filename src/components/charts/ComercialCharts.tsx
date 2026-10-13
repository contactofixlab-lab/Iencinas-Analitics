'use client';

import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { ComercialData } from '@/types/domain';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#4F86BC', '#5C93C7', '#78A8D7', '#9BBFE3', '#BFD6EE'];

export default function ComercialCharts({ data, loading }: { data: ComercialData | null; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Propiedades Vendidas por Mes" subtitle="Unidades cerradas" accent="green">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.ventas || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78A8D7" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#5C93C7" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number) => `Ventas: ${v}`} />} />
              <Bar dataKey="ventas" fill="url(#fillVentas)" radius={[8, 8, 0, 0]} name="Ventas" maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    
      <ChartCard title="Pipeline de Ventas" subtitle="Leads por etapa del embudo" accent="blue">
        {loading ? (
          <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.pipeline || []} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,176,203,0.28)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#8195A8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="etapa" type="category" tick={{ fontSize: 12, fill: '#8195A8' }} width={100} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
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
