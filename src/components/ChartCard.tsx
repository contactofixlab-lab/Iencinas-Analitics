'use client';

import { m as motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accent?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}

// Punto de color del título (pastel; la serie principal de los gráficos es siempre azul)
const accentDot = {
  green:  '#6DB899',
  blue:   '#78A8D7',
  purple: '#9D89D8',
  orange: '#E4A67C',
  red:    '#E08A94',
};

export default function ChartCard({ title, subtitle, children, accent = 'blue' }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden"
      style={{ padding: 'var(--pad-card)' }}
    >
      <div className="sheen" />
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: accentDot[accent], boxShadow: '0 0 0 3px rgb(255 255 255 / 0.8)' }} />
        <div>
          <h3 className="text-sm font-semibold text-ink tracking-wide">{title}</h3>
          {subtitle && <p className="text-xs text-soft mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ── Estilo común de los gráficos (recharts) ────────────────────────────── */
export const CHART = {
  primary: '#78A8D7',
  primaryDeep: '#5C93C7',
  secondary: '#A9C6E4',
  soft: '#B9D3EC',
  rose: '#E09AA3',
  axis: '#8195A8',
  grid: 'rgba(147,176,203,0.28)',
  tick: { fontSize: 12, fill: '#8195A8' },
};

/* ── Tooltip de vidrio para todos los gráficos ──────────────────────────── */
export function GlassTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="tooltip-glass">
      {label && <p style={{ color: '#8195A8', fontSize: 11, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>}
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: i > 0 ? 4 : 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: entry.color || entry.fill, boxShadow: '0 0 0 2px rgb(255 255 255 / 0.9)' }} />
          <span style={{ color: '#34495E', fontSize: 13, fontWeight: 600 }}>
            {formatter ? formatter(entry.value, entry.name) : `${entry.name}: ${entry.value}`}
          </span>
        </div>
      ))}
    </div>
  );
}
