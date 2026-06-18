'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface GlassSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  allLabel?: string;
}

export default function GlassSelect({
  value,
  options,
  onChange,
  placeholder = 'Seleccionar',
  allLabel = 'Todos',
}: GlassSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const dd = document.getElementById('glass-select-dd');
      if (btnRef.current && !btnRef.current.contains(e.target as Node) && dd && !dd.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const allOptions: SelectOption[] = [{ label: allLabel, value: '' }, ...options];
  const selected = allOptions.find(o => o.value === value);

  function toggle() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ position: 'fixed', top: r.bottom + 6, left: r.left, width: r.width, zIndex: 2147483647 });
    }
    setOpen(p => !p);
  }

  const dd = open && mounted ? createPortal(
    <AnimatePresence>
      <motion.div
        id="glass-select-dd"
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        style={{
          ...pos,
          background: 'linear-gradient(135deg, rgba(10,18,35,0.97), rgba(16,28,48,0.95))',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(74,197,94,0.32)',
          borderRadius: '14px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.10)',
          overflow: 'hidden',
          padding: '6px',
        }}
      >
        {allOptions.map(opt => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value || '__all'}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 12px', textAlign: 'left',
                borderRadius: '10px',
                background: active ? 'rgba(74,222,128,0.18)' : 'transparent',
                color: active ? '#4ade80' : '#d1d5db',
                fontSize: '14px', fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {opt.label}
              {active && <Check size={15} />}
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="field w-full flex items-center justify-between"
        style={{ cursor: 'pointer' }}
      >
        <span style={{ color: selected && selected.value ? '#fff' : 'rgba(255,255,255,0.55)' }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-green-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {dd}
    </>
  );
}
