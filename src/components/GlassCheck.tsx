'use client';

import { Check } from 'lucide-react';

interface GlassCheckProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Texto de ayuda bajo la etiqueta (solo variante «row»). */
  description?: string;
  /** «row»: fila con fondo, como la selección de proyectos de un usuario. «inline»: casilla con texto, para tablas. */
  variant?: 'row' | 'inline';
  disabled?: boolean;
  id?: string;
}

/** Casilla de verificación con el diseño de vidrio del sistema (misma que usan los proyectos asignados). */
export default function GlassCheck({ checked, onChange, label, description, variant = 'row', disabled, id }: GlassCheckProps) {
  const box = (
    <span
      aria-hidden="true"
      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors"
      style={{
        background: checked ? 'rgb(var(--brand-hover))' : '#fff',
        border: checked ? '1px solid rgb(var(--brand-hover))' : '1px solid rgb(var(--line) / 0.55)',
      }}
    >
      {checked && <Check size={14} strokeWidth={3} className="text-white" />}
    </span>
  );

  if (variant === 'inline') {
    return (
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="inline-flex items-center gap-2.5 rounded-xl px-1.5 py-1 -mx-1.5 transition-colors hover:bg-white/50 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {box}
        <span className={`text-sm ${checked ? 'text-ink font-medium' : 'text-mute'}`}>{label}</span>
      </button>
    );
  }

  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      style={{
        background: checked ? 'rgb(var(--brand-soft) / 0.85)' : 'rgb(255 255 255 / 0.35)',
        border: checked ? '1px solid rgb(var(--brand))' : '1px solid rgb(var(--line) / 0.30)',
      }}
    >
      {box}
      <span className="flex-1">
        <span className="block text-sm text-ink font-medium">{label}</span>
        {description && <span className="block text-xs text-soft mt-0.5">{description}</span>}
      </span>
    </button>
  );
}
