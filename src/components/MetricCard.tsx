'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { m as motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  color: 'green' | 'blue' | 'red' | 'purple' | 'orange';
  icon?: React.ReactNode;
  caption?: string;
}

// Tinte suave del icono según la métrica (pastel, sin saturar)
const tintMap = {
  green:  { bg: 'rgb(52 140 104 / 0.14)',  fg: 'rgb(34 106 76)' },
  blue:   { bg: 'rgb(var(--brand) / 0.28)', fg: 'rgb(var(--brand-deep))' },
  red:    { bg: 'rgb(200 84 96 / 0.14)',   fg: 'rgb(160 52 64)' },
  purple: { bg: 'rgb(150 128 214 / 0.18)', fg: 'rgb(96 74 156)' },
  orange: { bg: 'rgb(214 150 80 / 0.18)',  fg: 'rgb(150 90 24)' },
};

export default function MetricCard({ label, value, trend, up, color, icon, caption }: MetricCardProps) {
  const c = tintMap[color];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="glass-card relative overflow-hidden"
      style={{ padding: 'var(--pad-card)' }}
    >
      <div className="sheen" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-soft text-sm font-medium">{label}</p>
          <p className="text-[1.9rem] leading-tight font-semibold text-ink mt-2 tracking-tight">{value}</p>
        </div>
        {icon && (
          <div
            className="shrink-0 grid place-items-center w-12 h-12 rounded-full"
            style={{ background: c.bg, color: c.fg, border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm), var(--inner-sheen)' }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-3 whitespace-nowrap">
        {trend ? (
          <>
            {up
              ? <TrendingUp size={14} strokeWidth={2} style={{ color: 'rgb(34 106 76)' }} />
              : <TrendingDown size={14} strokeWidth={2} style={{ color: 'rgb(160 52 64)' }} />}
            <span className="text-xs font-bold" style={{ color: up ? 'rgb(34 106 76)' : 'rgb(160 52 64)' }}>{trend}</span>
          </>
        ) : null}
        <span className={`text-xs text-mute ${trend ? 'ml-0.5' : ''}`}>{caption ?? 'vs mes anterior'}</span>
      </div>
    </motion.div>
  );
}
