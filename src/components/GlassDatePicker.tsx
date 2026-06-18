'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface GlassDatePickerProps {
  value: string;                 // 'YYYY-MM-DD'
  onChange: (value: string) => void;
  placeholder?: string;
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function parseYMD(s: string): Date {
  const [y, m, d] = (s || '').split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}
function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function GlassDatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }: GlassDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties>({});
  const [view, setView] = useState(() => parseYMD(value));
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setView(value ? parseYMD(value) : new Date());
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const dd = document.getElementById('glass-datepicker-dd');
      if (btnRef.current && !btnRef.current.contains(e.target as Node) && dd && !dd.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  function toggle() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      // Open above if not enough space below
      const spaceBelow = window.innerHeight - r.bottom;
      const calcHeight = 360;
      const openUp = spaceBelow < calcHeight && r.top > calcHeight;
      setPos({
        position: 'fixed',
        top: openUp ? undefined : r.bottom + 8,
        bottom: openUp ? window.innerHeight - r.top + 8 : undefined,
        left: r.left,
        width: Math.max(r.width, 280),
        zIndex: 2147483647,
      });
    }
    setOpen(p => !p);
  }

  const selected = value ? parseYMD(value) : null;
  const today = new Date();

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const display = selected ? `${selected.getDate()} ${MESES_CORTO[selected.getMonth()]} ${selected.getFullYear()}` : '';

  const dd = open && mounted ? createPortal(
    <AnimatePresence>
      <motion.div
        id="glass-datepicker-dd"
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{
          ...pos,
          background: 'linear-gradient(160deg, rgba(10,18,35,0.97) 0%, rgba(16,28,48,0.95) 100%)',
          backdropFilter: 'blur(28px) saturate(150%)',
          WebkitBackdropFilter: 'blur(28px) saturate(150%)',
          border: '1px solid rgba(74,197,94,0.30)',
          borderRadius: '18px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px rgba(74,222,128,0.08)',
          padding: '14px',
        }}
      >
        {/* Header: month nav */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setView(new Date(year, month - 1, 1))}
            className="grid place-items-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-white tracking-wide">
            {MESES[month]} {year}
          </span>
          <button
            onClick={() => setView(new Date(year, month + 1, 1))}
            className="grid place-items-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {DIAS.map(d => (
            <span key={d} className="text-center text-[10px] font-bold uppercase tracking-wide" style={{ color: 'rgba(148,163,184,0.7)' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <span key={`b${i}`} />;
            const cellDate = new Date(year, month, day);
            const isSelected = selected && sameDay(cellDate, selected);
            const isToday = sameDay(cellDate, today);
            return (
              <button
                key={day}
                onClick={() => { onChange(toYMD(cellDate)); setOpen(false); }}
                className="h-9 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #22c55e, #15803d)'
                    : 'transparent',
                  color: isSelected ? '#fff' : isToday ? '#4ade80' : '#d1d5db',
                  border: isSelected
                    ? '1px solid rgba(74,222,128,0.6)'
                    : isToday ? '1px solid rgba(74,222,128,0.4)' : '1px solid transparent',
                  boxShadow: isSelected ? '0 6px 16px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.25)' : 'none',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Footer: quick today */}
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={() => { onChange(toYMD(new Date())); setOpen(false); }}
            className="text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
          >
            Hoy
          </button>
          <span className="text-[11px] text-gray-500">{display}</span>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        type="button"
        className="field w-full flex items-center justify-between"
        style={{ cursor: 'pointer' }}
      >
        <span style={{ color: display ? '#fff' : 'rgba(255,255,255,0.5)' }}>
          {display || placeholder}
        </span>
        <Calendar size={16} className="text-green-400 shrink-0" />
      </button>
      {dd}
    </>
  );
}
