'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accent?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}

const accentGlow = {
  green:  'rgba(74,222,128,0.16)',
  blue:   'rgba(59,130,246,0.16)',
  purple: 'rgba(168,85,247,0.16)',
  orange: 'rgba(249,115,22,0.16)',
  red:    'rgba(239,68,68,0.16)',
};

const accentDot = {
  green:  '#4ade80',
  blue:   '#60a5fa',
  purple: '#c084fc',
  orange: '#fb923c',
  red:    '#f87171',
};

export default function ChartCard({ title, subtitle, children, accent = 'green' }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative rounded-[20px] p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: `0 20px 60px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -2px 10px rgba(0,0,0,0.25), 0 0 30px ${accentGlow[accent]}`,
      }}
    >
      {/* Top sheen */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: accentDot[accent], boxShadow: `0 0 12px ${accentDot[accent]}` }}
        />
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ── Shared polished tooltip for all recharts ───────────────────────────── */
export function GlassTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(10,18,35,0.95), rgba(16,28,48,0.92))',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(74,222,128,0.35)',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {label && <p style={{ color: '#9ca3af', fontSize: 11, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>}
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: i > 0 ? 4 : 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: entry.color || entry.fill, boxShadow: `0 0 8px ${entry.color || entry.fill}` }} />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
            {formatter ? formatter(entry.value, entry.name) : `${entry.name}: ${entry.value}`}
          </span>
        </div>
      ))}
    </div>
  );
}
