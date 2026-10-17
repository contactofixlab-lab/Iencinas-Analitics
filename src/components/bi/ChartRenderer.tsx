'use client';

import { useMemo } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart, LabelList, Legend, Line, LineChart,
  Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, Treemap, XAxis, YAxis, ZAxis,
} from 'recharts';
import { CHART, GlassTooltip } from '@/components/ChartCard';
import { formatAxisValue, formatDimLabel, formatValue, paletteColors } from '@/lib/bi/catalog';
import type { ChartSpec, NumberFormat, QueryResult } from '@/lib/bi/types';

interface Key {
  key: string;
  label: string;
  color: string;
  format?: NumberFormat;
}

const axisTick = { fontSize: 12, fill: CHART.axis };
const legendText = (v: string) => <span style={{ color: '#637B91', fontWeight: 500, fontSize: 12 }}>{v}</span>;
const POS = '#6DB899';
const NEG = '#E09AA3';

function Empty({ text = 'Sin datos para mostrar' }: { text?: string }) {
  return <div className="h-full min-h-[100px] flex items-center justify-center text-sm text-mute text-center px-4">{text}</div>;
}

export default function ChartRenderer({ spec, result }: { spec: ChartSpec; result: QueryResult }) {
  const opts = spec.options;
  const palette = paletteColors(opts.palette);
  const dimCol = result.columns.find(c => c.kind === 'dimension');
  const serCol = result.columns.find(c => c.kind === 'series');
  const measureCols = result.columns.filter(c => c.kind === 'measure');

  const { data, keys } = useMemo(() => {
    const nameOf = (v: unknown) => (dimCol ? formatDimLabel(v as string, dimCol.bucket) : '');
    if (serCol && measureCols.length >= 1) {
      const sers: string[] = [];
      result.rows.forEach(r => {
        const s = String(r.ser ?? '');
        if (!sers.includes(s)) sers.push(s);
      });
      const map = new Map<string, Record<string, any>>();
      result.rows.forEach(r => {
        const d = String(r.dim ?? '');
        const obj = map.get(d) ?? { name: nameOf(r.dim), _dim: d };
        obj[`s${sers.indexOf(String(r.ser ?? ''))}`] = r[measureCols[0].key];
        map.set(d, obj);
      });
      const ks: Key[] = sers.map((s, i) => ({
        key: `s${i}`,
        label: formatDimLabel(s, serCol.bucket),
        color: palette[i % palette.length],
        format: measureCols[0].format,
      }));
      return { data: Array.from(map.values()), keys: ks };
    }
    const ks: Key[] = measureCols.map((c, i) => ({
      key: c.key,
      label: c.label,
      color: spec.measures[i]?.color || palette[i % palette.length],
      format: c.format,
    }));
    const rows = result.rows.map(r => ({ ...r, name: nameOf(r.dim), _dim: String(r.dim ?? '') }));
    return { data: rows as Record<string, any>[], keys: ks };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, spec.measures, opts.palette]);

  const fmtOf = (name: string) => keys.find(k => k.label === name)?.format ?? keys[0]?.format;
  const tipFormatter = (v: any, name: string) => `${name}: ${formatValue(typeof v === 'number' ? v : Number(v), fmtOf(name))}`;
  const axisFmt = (v: any) => formatAxisValue(Number(v), keys[0]?.format ?? 'auto');
  const showLegend = opts.legend !== false && keys.length > 1;
  const grid = opts.grid !== false;
  const curve = opts.smooth ? 'monotone' : 'linear';
  const labelFmt = (v: any) => formatValue(Number(v), keys[0]?.format);
  const type = spec.type;

  const hasData = result.rows.length > 0;
  if (!hasData && type !== 'kpi' && type !== 'gauge') return <Empty />;

  /* ── Tarjeta (KPI) ── */
  if (type === 'kpi') {
    const col = measureCols[0];
    const v = result.rows[0]?.[col?.key ?? ''] as number | null | undefined;
    const kpiText = formatValue(v ?? null, col?.format);
    return (
      <div className="h-full flex flex-col justify-center min-w-0" style={{ containerType: 'inline-size' }}>
        <p className="font-bold text-ink leading-none tracking-tight whitespace-nowrap" style={{ fontSize: `min(2.75rem, ${(100 / (Math.max(kpiText.length, 3) * 0.64)).toFixed(1)}cqw)` }}>
          {kpiText}
        </p>
        <p className="text-sm text-soft mt-2">{col?.label}</p>
      </div>
    );
  }

  /* ── Medidor ── */
  if (type === 'gauge') {
    const col = measureCols[0];
    const v = (result.rows[0]?.[col?.key ?? ''] as number | null | undefined) ?? 0;
    const max = opts.gaugeMax && opts.gaugeMax > 0 ? opts.gaugeMax : col?.format === 'percent' ? 100 : Math.max(v * 1.25, 1);
    const pct = Math.min(Math.max(v / max, 0), 1);
    const R = 80;
    const arc = (p: number) => {
      const a = Math.PI * (1 - p);
      return `M ${100 - R} 100 A ${R} ${R} 0 0 1 ${100 + R * Math.cos(a)} ${100 - R * Math.sin(a)}`;
    };
    const color = spec.measures[0]?.color || palette[0];
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <svg viewBox="0 0 200 118" className="w-full max-h-[78%]" role="img" aria-label={`${col?.label}: ${formatValue(v, col?.format)}`}>
          <path d={`M ${100 - R} 100 A ${R} ${R} 0 0 1 ${100 + R} 100`} fill="none" stroke="rgb(147 176 203 / 0.28)" strokeWidth="16" strokeLinecap="round" />
          {pct > 0 && <path d={arc(pct)} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />}
          <text x="100" y="92" textAnchor="middle" fontSize="24" fontWeight="700" fill="#34495E">{formatValue(v, col?.format)}</text>
        </svg>
        <p className="text-xs text-soft -mt-1 text-center">{col?.label} · {Math.round(pct * 100)} % de {formatValue(max, col?.format)}</p>
      </div>
    );
  }

  /* ── Tabla ── */
  if (type === 'table') {
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {result.columns.map(c => (
                <th key={c.key} className={`px-3 py-2 text-xs font-semibold text-soft uppercase tracking-wider whitespace-nowrap ${c.kind === 'measure' ? 'text-right' : 'text-left'}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r, i) => (
              <tr key={i} className="border-t border-line/20">
                {result.columns.map(c => (
                  <td key={c.key} className={`px-3 py-2 ${c.kind === 'measure' ? 'text-right tabular-nums text-ink' : 'text-soft'}`}>
                    {c.kind === 'measure' ? formatValue(r[c.key] as number | null, c.format) : formatDimLabel(r[c.key], c.bucket)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ── Mapa de calor ── */
  if (type === 'heatmap') {
    const cols = keys;
    const vals = data.flatMap(d => cols.map(k => d[k.key]).filter((x): x is number => typeof x === 'number'));
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const base = palette[0];
    const rgb = [1, 3, 5].map(i => parseInt(base.slice(i, i + 2), 16)).join(' ');
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-xs border-separate" style={{ borderSpacing: 3 }}>
          <thead>
            <tr>
              <th />
              {cols.map(c => <th key={c.key} className="px-2 py-1 text-soft font-semibold whitespace-nowrap">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <th className="pr-2 text-right text-soft font-semibold whitespace-nowrap">{d.name}</th>
                {cols.map(c => {
                  const v = d[c.key] as number | undefined;
                  const a = v === undefined || max === min ? 0.15 : 0.12 + 0.8 * ((v - min) / (max - min));
                  return (
                    <td key={c.key} title={`${d.name} · ${c.label}: ${formatValue(v ?? null, c.format)}`} className="text-center rounded-lg px-2 py-2 text-ink font-medium" style={{ background: `rgb(${rgb} / ${a})` }}>
                      {v === undefined ? '' : formatValue(v, c.format)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ── Gráficos de Recharts ── */
  const tooltip = <Tooltip content={<GlassTooltip formatter={tipFormatter} />} cursor={{ fill: 'rgba(143,185,224,0.16)' }} />;
  const legend = showLegend ? <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={legendText} /> : null;
  const cartesianGrid = grid ? <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} /> : null;
  const margin = { top: 10, right: 12, left: 0, bottom: 0 };

  let chart: JSX.Element;

  if (type === 'bar' || type === 'barStacked' || type === 'barStacked100' || type === 'barH' || type === 'barHStacked') {
    const horizontal = type === 'barH' || type === 'barHStacked';
    const stacked = type === 'barStacked' || type === 'barStacked100' || type === 'barHStacked';
    const full = type === 'barStacked100';
    chart = (
      <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={horizontal ? { top: 6, right: 24, left: 8, bottom: 0 } : margin} stackOffset={full ? 'expand' : undefined}>
        {grid && <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={!horizontal} vertical={horizontal} />}
        {horizontal ? (
          <>
            <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={full ? (v: number) => `${Math.round(v * 100)}%` : axisFmt} />
            <YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={110} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis width={full ? 48 : 72} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={full ? (v: number) => `${Math.round(v * 100)}%` : axisFmt} />
          </>
        )}
        {tooltip}
        {legend}
        {keys.map((k, i) => (
          <Bar key={k.key} dataKey={k.key} name={k.label} fill={k.color} stackId={stacked ? 'a' : undefined} maxBarSize={44}
            radius={stacked ? (i === keys.length - 1 ? (horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]) : 0) : horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}>
            {opts.labels && !full && <LabelList dataKey={k.key} position={horizontal ? 'right' : stacked ? 'center' : 'top'} formatter={labelFmt} style={{ fontSize: 11, fill: '#34495E' }} />}
          </Bar>
        ))}
      </BarChart>
    );
  } else if (type === 'line') {
    chart = (
      <LineChart data={data} margin={margin}>
        {cartesianGrid}
        <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis width={72} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={axisFmt} />
        {tooltip}
        {legend}
        {keys.map(k => (
          <Line key={k.key} dataKey={k.key} name={k.label} stroke={k.color} strokeWidth={2.5} type={curve} dot={data.length <= 24} activeDot={{ r: 5 }}>
            {opts.labels && <LabelList dataKey={k.key} position="top" formatter={labelFmt} style={{ fontSize: 11, fill: '#34495E' }} />}
          </Line>
        ))}
      </LineChart>
    );
  } else if (type === 'area' || type === 'areaStacked') {
    chart = (
      <AreaChart data={data} margin={margin}>
        {cartesianGrid}
        <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis width={72} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={axisFmt} />
        {tooltip}
        {legend}
        {keys.map(k => (
          <Area key={k.key} dataKey={k.key} name={k.label} stroke={k.color} fill={k.color} fillOpacity={0.28} strokeWidth={2.5} type={curve} stackId={type === 'areaStacked' ? 'a' : undefined} />
        ))}
      </AreaChart>
    );
  } else if (type === 'combo') {
    const rightUsed = spec.measures.some(m => m.axis === 'right');
    const sideFormat = (side: 'left' | 'right') => keys.find((_, i) => (spec.measures[i]?.axis === 'right' ? 'right' : 'left') === side)?.format ?? 'auto';
    chart = (
      <ComposedChart data={data} margin={{ ...margin, right: rightUsed ? 0 : 12 }}>
        {cartesianGrid}
        <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis yAxisId="left" width={72} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: any) => formatAxisValue(Number(v), sideFormat('left'))} />
        {rightUsed && <YAxis yAxisId="right" width={72} orientation="right" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: any) => formatAxisValue(Number(v), sideFormat('right'))} />}
        {tooltip}
        {legend}
        {keys.map((k, i) => {
          const m = spec.measures[i];
          const kind = m?.kind ?? (i === 0 ? 'bar' : 'line');
          const axis = m?.axis === 'right' ? 'right' : 'left';
          return kind === 'bar'
            ? <Bar key={k.key} yAxisId={axis} dataKey={k.key} name={k.label} fill={k.color} radius={[8, 8, 0, 0]} maxBarSize={40} />
            : <Line key={k.key} yAxisId={axis} dataKey={k.key} name={k.label} stroke={k.color} strokeWidth={2.5} type={curve} dot={data.length <= 24} />;
        })}
      </ComposedChart>
    );
  } else if (type === 'pie' || type === 'donut') {
    const k = keys[0];
    const total = data.reduce((a, d) => a + (Number(d[k.key]) || 0), 0);
    chart = (
      <PieChart>
        <Pie data={data} dataKey={k.key} nameKey="name" innerRadius={type === 'donut' ? '58%' : 0} outerRadius="82%" paddingAngle={type === 'donut' ? 3 : 1} stroke="#fff" strokeWidth={2}
          label={opts.labels ? (e: any) => {
            const a = (-e.midAngle * Math.PI) / 180;
            const r = e.outerRadius + 14;
            return <text x={e.cx + r * Math.cos(a)} y={e.cy + r * Math.sin(a)} textAnchor={Math.cos(a) >= 0 ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={600} fill="#34495E" stroke="none">{formatValue(Number(e.value), k.format)}</text>;
          } : false} labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
        </Pie>
        <Tooltip content={<GlassTooltip formatter={(v: any, n: string) => `${n}: ${formatValue(Number(v), k.format)}${total ? ` (${Math.round((Number(v) / total) * 100)} %)` : ''}`} />} />
        {opts.legend !== false && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={legendText} />}
      </PieChart>
    );
  } else if (type === 'treemap') {
    const k = keys[0];
    const tdata = data.map(d => ({ name: d.name, size: Math.max(Number(d[k.key]) || 0, 0) }));
    chart = (
      <Treemap data={tdata} dataKey="size" stroke="#fff" isAnimationActive={false}
        content={<TreeCell colors={palette} format={k.format} />}>
        <Tooltip content={<GlassTooltip formatter={(v: any, n: string) => `${n}: ${formatValue(Number(v), k.format)}`} />} />
      </Treemap>
    );
  } else if (type === 'funnel') {
    const k = keys[0];
    const fdata = data.map((d, i) => ({ name: d.name, value: Number(d[k.key]) || 0, fill: palette[i % palette.length] }));
    chart = (
      <FunnelChart>
        <Tooltip content={<GlassTooltip formatter={(v: any, n: string) => `${n}: ${formatValue(Number(v), k.format)}`} />} />
        <Funnel dataKey="value" data={fdata} isAnimationActive={false}>
          <LabelList position="right" dataKey="name" fill="#34495E" stroke="none" style={{ fontSize: 12 }} />
          {opts.labels && <LabelList position="center" dataKey="value" formatter={(v: any) => formatValue(Number(v), k.format)} fill="#fff" stroke="none" style={{ fontSize: 12, fontWeight: 600 }} />}
        </Funnel>
      </FunnelChart>
    );
  } else if (type === 'waterfall') {
    const k = keys[0];
    let cum = 0;
    const steps: Record<string, any>[] = data.map(d => {
      const v = Number(d[k.key]) || 0;
      const start = cum;
      cum += v;
      return { name: d.name, base: Math.min(start, cum), up: v >= 0 ? v : 0, down: v < 0 ? -v : 0, delta: v };
    });
    steps.push({ name: 'Total', base: Math.min(0, cum), up: cum >= 0 ? cum : 0, down: cum < 0 ? -cum : 0, delta: cum, total: true });
    chart = (
      <BarChart data={steps} margin={margin}>
        {cartesianGrid}
        <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis width={72} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={axisFmt} />
        <Tooltip cursor={{ fill: 'rgba(143,185,224,0.16)' }} content={({ active, payload }: any) => {
          if (!active || !payload?.length) return null;
          const p = payload[0].payload;
          return <div className="tooltip-glass"><p style={{ color: '#34495E', fontSize: 13, fontWeight: 600 }}>{p.name}: {formatValue(p.delta, k.format)}</p></div>;
        }} />
        <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="up" stackId="w" name="Aumento" maxBarSize={44}>
          {steps.map((s, i) => <Cell key={i} fill={s.total ? palette[0] : POS} />)}
        </Bar>
        <Bar dataKey="down" stackId="w" name="Disminución" fill={NEG} maxBarSize={44} radius={[8, 8, 0, 0]} />
      </BarChart>
    );
  } else if (type === 'scatter' || type === 'bubble') {
    const [kx, ky, kz] = keys;
    const pts = data.map(d => ({ name: d.name, x: Number(d[kx.key]) || 0, y: Number(d[ky.key]) || 0, z: kz ? Number(d[kz.key]) || 0 : 1 }));
    chart = (
      <ScatterChart margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />}
        <XAxis type="number" dataKey="x" name={kx.label} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: any) => formatValue(Number(v), kx.format)} />
        <YAxis type="number" dataKey="y" name={ky.label} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: any) => formatValue(Number(v), ky.format)} />
        {type === 'bubble' && <ZAxis type="number" dataKey="z" range={[60, 700]} name={kz?.label} />}
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }: any) => {
          if (!active || !payload?.length) return null;
          const p = payload[0].payload;
          return (
            <div className="tooltip-glass">
              <p style={{ color: '#8195A8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.name}</p>
              <p style={{ color: '#34495E', fontSize: 13, fontWeight: 600 }}>{kx.label}: {formatValue(p.x, kx.format)}</p>
              <p style={{ color: '#34495E', fontSize: 13, fontWeight: 600 }}>{ky.label}: {formatValue(p.y, ky.format)}</p>
              {type === 'bubble' && kz && <p style={{ color: '#34495E', fontSize: 13, fontWeight: 600 }}>{kz.label}: {formatValue(p.z, kz.format)}</p>}
            </div>
          );
        }} />
        <Scatter data={pts} fillOpacity={0.8}>
          {pts.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
          {opts.labels && <LabelList dataKey="name" position="top" style={{ fontSize: 11, fill: '#34495E' }} />}
        </Scatter>
      </ScatterChart>
    );
  } else if (type === 'radialBar') {
    const k = keys[0];
    const rdata = data.map((d, i) => ({ name: d.name, value: Number(d[k.key]) || 0, fill: palette[i % palette.length] }));
    chart = (
      <RadialBarChart data={rdata} innerRadius="22%" outerRadius="92%" startAngle={90} endAngle={-270}>
        <RadialBar dataKey="value" background={{ fill: 'rgb(147 176 203 / 0.18)' }} cornerRadius={8}>
          {opts.labels && <LabelList dataKey="value" position="insideStart" formatter={(v: any) => formatValue(Number(v), k.format)} fill="#fff" style={{ fontSize: 11, fontWeight: 600 }} />}
        </RadialBar>
        <Tooltip content={<GlassTooltip formatter={(v: any, n: string) => `${n}: ${formatValue(Number(v), k.format)}`} />} />
        {opts.legend !== false && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={legendText} />}
      </RadialBarChart>
    );
  } else {
    // radar
    chart = (
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={CHART.grid} />
        <PolarAngleAxis dataKey="name" tick={axisTick} />
        <PolarRadiusAxis angle={90} tick={{ fontSize: 10, fill: CHART.axis }} tickFormatter={axisFmt} axisLine={false} />
        {keys.map(k => <Radar key={k.key} dataKey={k.key} name={k.label} stroke={k.color} fill={k.color} fillOpacity={0.25} strokeWidth={2} />)}
        <Tooltip content={<GlassTooltip formatter={tipFormatter} />} />
        {showLegend && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={legendText} />}
      </RadarChart>
    );
  }

  return (
    <div className="w-full h-full min-h-[120px]">
      <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>
    </div>
  );
}

/** Celda del mapa de árbol: rectángulo de color con el nombre y el valor. */
function TreeCell(props: any) {
  const { x, y, width, height, index, name, value, colors, format } = props;
  if (width < 4 || height < 4) return null;
  const fill = colors[(index ?? 0) % colors.length];
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6} fill={fill} stroke="#fff" strokeWidth={2} />
      {width > 60 && height > 34 && (
        <>
          <text x={x + 8} y={y + 18} fontSize={12} fontWeight={600} fill="#34495E" stroke="none">{String(name).slice(0, Math.floor(width / 7))}</text>
          <text x={x + 8} y={y + 34} fontSize={11} fill="#4A6275" stroke="none">{formatValue(Number(value), format)}</text>
        </>
      )}
    </g>
  );
}
