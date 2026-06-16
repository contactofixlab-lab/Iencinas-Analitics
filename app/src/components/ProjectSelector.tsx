'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Proyecto } from '@/types/domain';
import { ChevronDown } from 'lucide-react';

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
      .then(res => res.json())
      .then(data => setProyectos(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        const dropdown = document.getElementById('project-selector-dropdown');
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 2147483647,
      });
    }
    setOpen(prev => !prev);
  };

  const proyecto = proyectos.find(p => p.id === value);

  const dropdown = open && mounted ? createPortal(
    <div
      id="project-selector-dropdown"
      style={{
        ...dropdownStyle,
        background: 'rgba(10, 18, 35, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(34, 197, 94, 0.35)',
        borderRadius: '12px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}
    >
      {proyectos.map((p, idx) => (
        <button
          key={p.id}
          onClick={() => { onChange(p.id); setOpen(false); }}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            textAlign: 'left',
            background: value === p.id ? 'rgba(34,197,94,0.2)' : 'transparent',
            color: value === p.id ? '#4ade80' : '#d1d5db',
            borderBottom: idx < proyectos.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            if (value !== p.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
          }}
          onMouseLeave={e => {
            if (value !== p.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.nombre}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{p.ubicacion}</div>
        </button>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative w-full sm:w-72">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="w-full px-4 py-2.5 rounded-xl flex items-center justify-between transition-all"
        style={{
          background: 'rgba(34, 197, 94, 0.1)',
          backdropFilter: 'blur(16px)',
          border: open ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(34, 197, 94, 0.3)',
        }}
      >
        <span className="text-white text-sm font-semibold">
          {loading ? 'Cargando...' : proyecto?.nombre || 'Seleccionar proyecto'}
        </span>
        <ChevronDown size={16} className={`text-green-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {dropdown}
    </div>
  );
}
