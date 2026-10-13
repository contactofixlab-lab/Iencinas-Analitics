'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m as motion } from 'framer-motion';
import { Proyecto } from '@/types/domain';
import { Building2, ChevronDown, Check } from 'lucide-react';

interface ProjectSelectorProps {
  value: string;
  onChange: (proyectoId: string) => void;
}

export default function ProjectSelector({ value, onChange }: ProjectSelectorProps) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/mis-proyectos')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setProyectos(data.data || []))
      .catch(err => {
        console.error('Error fetching proyectos:', err);
        setProyectos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        const dropdown = document.getElementById('project-selector-dropdown');
        if (dropdown && !dropdown.contains(e.target as Node)) setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({ position: 'fixed', top: rect.bottom + 8, left: rect.left, width: rect.width, zIndex: 2147483647 });
    }
    setOpen(prev => !prev);
  };

  const proyecto = proyectos.find(p => p.id === value);

  const dropdown = open && mounted ? createPortal(
    <AnimatePresence>
      <motion.div
        id="project-selector-dropdown"
        initial={{ opacity: 0, y: -10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="menu-panel"
        style={{ ...dropdownStyle, overflow: 'hidden' }}
      >
        {proyectos.map((p) => {
          const active = value === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => { onChange(p.id); setOpen(false); }}
              className={`menu-item ${active ? 'menu-item--active' : ''}`}
            >
              <span>
                <span style={{ fontWeight: 600, fontSize: '14px', display: 'block' }}>{p.nombre}</span>
                <span style={{ fontSize: '11px', color: 'rgb(var(--ink-3))', fontWeight: 400 }}>{p.ubicacion}</span>
              </span>
              {active && <Check size={15} strokeWidth={2} />}
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <div className="relative w-full sm:w-72">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className="w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all"
        style={{
          background: open ? 'rgb(var(--brand-soft) / 0.9)' : 'var(--glass-3)',
          border: open ? '1px solid rgb(var(--brand-hover))' : '1px solid var(--glass-border)',
          boxShadow: open ? '0 0 0 4px rgb(var(--brand) / 0.22), var(--shadow-sm)' : 'var(--shadow-sm), var(--inner-sheen)',
          WebkitBackdropFilter: 'blur(var(--blur-sm))',
          backdropFilter: 'blur(var(--blur-sm))',
        }}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <Building2 size={17} strokeWidth={1.8} className="text-brand-deep shrink-0" />
          <span className="text-ink text-sm font-semibold truncate">
            {loading ? 'Cargando...' : proyecto?.nombre || 'Seleccionar proyecto'}
          </span>
        </span>
        <ChevronDown size={16} strokeWidth={1.8} className={`text-soft transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {dropdown}
    </div>
  );
}
