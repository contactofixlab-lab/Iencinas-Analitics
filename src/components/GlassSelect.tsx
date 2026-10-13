'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m as motion } from 'framer-motion';
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
        className="menu-panel"
        style={{ ...pos, overflow: 'hidden' }}
      >
        {allOptions.map(opt => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value || '__all'}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`menu-item ${active ? 'menu-item--active' : ''}`}
            >
              {opt.label}
              {active && <Check size={15} strokeWidth={2} />}
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
        type="button"
        onClick={toggle}
        className="field w-full flex items-center justify-between"
        style={{ cursor: 'pointer' }}
      >
        <span style={{ color: selected && selected.value ? 'rgb(var(--ink))' : 'rgb(var(--ink-3))' }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} strokeWidth={1.8} className={`text-soft transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {dd}
    </>
  );
}
