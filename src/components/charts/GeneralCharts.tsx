'use client';

import ChartCard, { GlassTooltip, CHART } from '@/components/ChartCard';
import { GeneralData } from '@/types/domain';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';

const DONUT = ['#78A8D7', '#9BBFE3', '#BFD6EE', '#A9D8C4', '#F2C9A3', '#E7B3BC'];
const axis = { fontSize: 12, fill: CHART.axis };
const margin = { top: 10, right: 8, left: -12, bottom: 0 };
const legend = { fontSize: 12 };
const legendText = (v: string) => <span style={{ color: '#637B91', fontWeight: 500 }}>{v}</span>;
const money = (v: number) => (v === 0 ? '$0' : Math.abs(v) >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${Math.round(v / 1000)}K`);

function Skeleton() {
  return <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />;
}

function Donut({ rows, nameKey, valueKey }: { rows: Record<string, any>[]; nameKey: string; valueKey: string }) {
  return (
    <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
      <div className="w-full sm:w-1/2">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie data={rows} dataKey={valueKey} nameKey={nameKey} innerRadius={58} outerRadius={92} paddingAngle={3} stroke="#fff" strokeWidth={2}>
              {rows.map((_, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
            </Pie>
            <Tooltip content={<GlassTooltip formatter={(v: number, n: string) => `${n}: ${v}`} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full sm:w-1/2 space-y-2 text-sm">
        {rows.map((r, i) => (
          <li key={String(r[nameKey])} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-soft min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DONUT[i % DONUT.length] }} />
              <span className="truncate">{String(r[nameKey])}</span>
            </span>
            <span className="font-semibold text-ink">{String(r[valueKey])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GeneralCharts({ data, loading }: { data: GeneralData | null; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Ingresos vs egresos por proyecto" subtitle="USD · principales proyectos" accent="blue">
        {loading ? <Skeleton /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.ingresosEgresosPorProyecto ?? []} margin={margin} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="proyecto" tick={axis} axisLine={false} tickLine={false} tickFormatter={(v: string) => (v.length > 10 ? v.slice(0, 9) + '…' : v)} interval={0} />
              <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={money} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number, n: string) => `${n}: ${money(v)}`} />} />
              <Legend iconType="circle" wrapperStyle={legend} formatter={legendText} />
              <Bar dataKey="ingresos" name="Ingresos" fill={CHART.primary} radius={[8, 8, 0, 0]} maxBarSize={22} />
              <Bar dataKey="egresos" name="Egresos" fill="#E7B3BC" radius={[8, 8, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Ventas por etapa" subtitle="Embudo comercial consolidado" accent="blue">
        {loading ? <Skeleton /> : <Donut rows={data?.ventasPorEtapa ?? []} nameKey="etapa" valueKey="cantidad" />}
      </ChartCard>

      <ChartCard title="Leads por canal" subtitle="Toda la empresa" accent="blue">
        {loading ? <Skeleton /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.leadsPorCanal ?? []} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
              <XAxis type="number" tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="canal" tick={axis} axisLine={false} tickLine={false} width={104} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
              <Bar dataKey="leads" name="Leads" fill={CHART.primary} radius={[0, 8, 8, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Proyectos por estado" subtitle="Cartera de proyectos" accent="blue">
        {loading ? <Skeleton /> : <Donut rows={data?.proyectosPorEstado ?? []} nameKey="estado" valueKey="cantidad" />}
      </ChartCard>
    </div>
  );
}
