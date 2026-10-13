'use client';

import ChartCard, { GlassTooltip, CHART } from '@/components/ChartCard';
import { ConstructoraData } from '@/types/domain';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, Line, ComposedChart, PieChart, Pie, Cell,
} from 'recharts';

const DONUT = ['#78A8D7', '#9BBFE3', '#BFD6EE', '#A9D8C4', '#F2C9A3', '#E7B3BC'];
const axis = { fontSize: 12, fill: CHART.axis };
const margin = { top: 10, right: 8, left: -12, bottom: 0 };
const legend = { fontSize: 12 };
const legendText = (v: string) => <span style={{ color: '#637B91', fontWeight: 500 }}>{v}</span>;

function Skeleton() {
  return <div className="skeleton h-60" role="status" aria-label="Cargando gráfico" />;
}

export default function ConstructoraCharts({ data, loading }: { data: ConstructoraData | null; loading: boolean }) {
  const obras = data?.obras ?? [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Avance físico por obra" subtitle="% real vs planificado" accent="blue">
        {loading ? <Skeleton /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={obras} margin={margin} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="obra" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number, n: string) => `${n}: ${v}%`} />} />
              <Legend iconType="circle" wrapperStyle={legend} formatter={legendText} />
              <Bar dataKey="avancePlan" name="Plan" fill={CHART.soft} radius={[8, 8, 0, 0]} maxBarSize={34} />
              <Bar dataKey="avanceReal" name="Real" fill={CHART.primary} radius={[8, 8, 0, 0]} maxBarSize={34} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Curva S de la cartera" subtitle="Avance acumulado % · plan vs real" accent="blue">
        {loading ? <Skeleton /> : (
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={data?.curvaS ?? []} margin={margin}>
              <defs>
                <linearGradient id="fillCurvaReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={CHART.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="mes" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<GlassTooltip formatter={(v: number, n: string) => `${n}: ${v}%`} />} />
              <Legend iconType="circle" wrapperStyle={legend} formatter={legendText} />
              <Line type="monotone" dataKey="plan" name="Plan" stroke="#A9C6E4" strokeWidth={2.5} strokeDasharray="6 5" dot={false} />
              <Area type="monotone" dataKey="real" name="Real" stroke={CHART.primary} strokeWidth={2.5} fill="url(#fillCurvaReal)" connectNulls={false}
                dot={false} activeDot={{ r: 5, fill: CHART.primary, stroke: '#FFFFFF', strokeWidth: 2.5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Presupuesto vs costo real" subtitle="Millones de pesos por obra" accent="blue">
        {loading ? <Skeleton /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={obras} margin={margin} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="obra" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={v => `$${Number(v).toLocaleString('es-CL')}`} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number, n: string) => `${n}: $${v.toLocaleString('es-CL')}MM`} />} />
              <Legend iconType="circle" wrapperStyle={legend} formatter={legendText} />
              <Bar dataKey="presupuesto" name="Presupuesto" fill={CHART.soft} radius={[8, 8, 0, 0]} maxBarSize={34} />
              <Bar dataKey="costoReal" name="Costo real" fill={CHART.primaryDeep} radius={[8, 8, 0, 0]} maxBarSize={34} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Compras por mes" subtitle="Monto de órdenes de compra · MM$" accent="blue">
        {loading ? <Skeleton /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.comprasMensuales ?? []} margin={margin}>
              <defs>
                <linearGradient id="fillCompras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={CHART.primary} stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="mes" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={v => `$${Number(v).toLocaleString('es-CL')}`} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number) => `Compras: $${v}MM`} />} />
              <Bar dataKey="monto" name="Compras" fill="url(#fillCompras)" radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Órdenes de compra por estado" subtitle="Cantidad de OC" accent="blue">
        {loading ? <Skeleton /> : (
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={data?.ordenesPorEstado ?? []} dataKey="cantidad" nameKey="estado" innerRadius={58} outerRadius={92} paddingAngle={3} stroke="#fff" strokeWidth={2}>
                    {(data?.ordenesPorEstado ?? []).map((_, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
                  </Pie>
                  <Tooltip content={<GlassTooltip formatter={(v: number, n: string) => `${n}: ${v}`} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full sm:w-1/2 space-y-2 text-sm">
              {(data?.ordenesPorEstado ?? []).map((o, i) => (
                <li key={o.estado} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-soft min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DONUT[i % DONUT.length] }} />
                    <span className="truncate">{o.estado}</span>
                  </span>
                  <span className="font-semibold text-ink">{o.cantidad}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Incidencias abiertas por obra" subtitle="Por severidad" accent="blue">
        {loading ? <Skeleton /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.incidenciasPorObra ?? []} margin={margin}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="obra" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={<GlassTooltip formatter={(v: number, n: string) => `${n}: ${v}`} />} />
              <Legend iconType="circle" wrapperStyle={legend} formatter={legendText} />
              <Bar dataKey="alta" name="Alta" stackId="s" fill="#E7B3BC" maxBarSize={44} />
              <Bar dataKey="media" name="Media" stackId="s" fill="#F2D3A8" maxBarSize={44} />
              <Bar dataKey="baja" name="Baja" stackId="s" fill="#BFD6EE" radius={[8, 8, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
