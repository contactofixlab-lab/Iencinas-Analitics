'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
        style={{
          ...dropdownStyle,
          background: 'linear-gradient(135deg, rgba(10,18,35,0.97), rgba(16,28,48,0.95))',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          borderRadius: '14px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.10)',
          overflow: 'hidden',
          padding: '6px',
        }}
      >
        {proyectos.map((p) => {
          const active = value === p.id;
          return (
            <button
              key={p.id}
              onClick={() => { onChange(p.id); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '11px 14px', textAlign: 'left',
                borderRadius: '10px',
                background: active ? 'rgba(34,197,94,0.18)' : 'transparent',
                color: active ? '#4ade80' : '#d1d5db',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span>
                <span style={{ fontWeight: 600, fontSize: '14px', display: 'block' }}>{p.nombre}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{p.ubicacion}</span>
              </span>
              {active && <Check size={15} />}
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <div className="relative w-full sm:w-72">
      <motion.button
        ref={buttonRef}
        onClick={handleToggle}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.16), rgba(34,197,94,0.06))',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: open ? '1px solid rgba(34, 197, 94, 0.55)' : '1px solid rgba(34, 197, 94, 0.3)',
          boxShadow: open ? '0 0 22px rgba(34,197,94,0.25), inset 0 1px 0 rgba(255,255,255,0.12)' : 'inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <Building2 size={16} className="text-green-400 shrink-0" />
          <span className="text-white text-sm font-semibold truncate">
            {loading ? 'Cargando...' : proyecto?.nombre || 'Seleccionar proyecto'}
          </span>
        </span>
        <ChevronDown size={16} className={`text-green-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </motion.button>
      {dropdown}
    </div>
  );
}
