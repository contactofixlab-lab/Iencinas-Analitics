'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  color: 'green' | 'blue' | 'red' | 'purple' | 'orange';
  icon?: React.ReactNode;
}

const colorMap = {
  green:  { glow: 'rgba(74,222,128,0.35)',  tint: 'rgba(74,222,128,0.14)',  icon: 'text-green-400',  ring: 'rgba(74,222,128,0.5)' },
  blue:   { glow: 'rgba(59,130,246,0.35)',  tint: 'rgba(59,130,246,0.14)',  icon: 'text-blue-400',   ring: 'rgba(59,130,246,0.5)' },
  red:    { glow: 'rgba(239,68,68,0.35)',   tint: 'rgba(239,68,68,0.14)',   icon: 'text-red-400',    ring: 'rgba(239,68,68,0.5)' },
  purple: { glow: 'rgba(168,85,247,0.35)',  tint: 'rgba(168,85,247,0.14)',  icon: 'text-purple-400', ring: 'rgba(168,85,247,0.5)' },
  orange: { glow: 'rgba(249,115,22,0.35)',  tint: 'rgba(249,115,22,0.14)',  icon: 'text-orange-400', ring: 'rgba(249,115,22,0.5)' },
};

export default function MetricCard({ label, value, trend, up, color, icon }: MetricCardProps) {
  const c = colorMap[color];
  const ref = useRef<HTMLDivElement>(null);

  // Mouse-tracking tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 220, damping: 18 });
  // Glare position follows the cursor
  const glareX = useTransform(mx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(my, [0, 1], ['0%', '100%']);

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.045) 45%, rgba(255,255,255,0.025) 100%)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: `0 22px 60px rgba(0,0,0,0.42), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 10px rgba(0,0,0,0.28), 0 0 26px ${c.tint}`,
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="relative rounded-[20px] p-6 overflow-hidden group"
    >
      {/* Cursor glare */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, ${c.glow}, transparent 60%)`
          ),
        }}
      />

      {/* Top sheen */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-300 text-sm font-medium tracking-wide">{label}</p>
            <p className="text-[2rem] leading-tight font-bold text-white mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">{value}</p>
            <div className="flex items-center gap-1.5 mt-3">
              {up
                ? <TrendingUp size={14} className="text-green-400" />
                : <TrendingDown size={14} className="text-red-400" />
              }
              <span className={`text-xs font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>{trend}</span>
              <span className="text-xs text-gray-500 ml-0.5">vs mes anterior</span>
            </div>
          </div>
          {icon && (
            <div
              className={`p-3 rounded-2xl ${c.icon}`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))',
                boxShadow: `0 10px 28px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 18px ${c.tint}`,
                transform: 'translateZ(55px)',
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Bottom inner shadow for depth */}
      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />
    </motion.div>
  );
}
