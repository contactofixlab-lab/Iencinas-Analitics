'use client';

import { Filter, X } from 'lucide-react';
import { AnimatePresence, m as motion } from 'framer-motion';
import GlassSelect, { SelectOption } from './GlassSelect';

export interface SelectFilterField {
  key: string;
  label: string;
  options: SelectOption[];
  value: string;
  allLabel?: string;
}

interface SelectFilterPanelProps {
  title?: string;
  fields: SelectFilterField[];
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

/** Panel de filtros formado solo por listas desplegables (mismo estilo de vidrio que FilterPanel). */
export default function SelectFilterPanel({ title = 'Filtros', fields, onChange, onClear }: SelectFilterPanelProps) {
  const hasActive = fields.some(f => f.value !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative"
      style={{ padding: 'var(--pad-card)' }}
    >
      <div className="sheen" />
      <div className="flex items-center gap-3 mb-5">
        <div className="icon-orb !w-9 !h-9">
          <Filter size={16} strokeWidth={1.8} />
        </div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <AnimatePresence>
          {hasActive && (
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="chip chip-info">
              Activos
            </motion.span>
          )}
        </AnimatePresence>
        <div className="ml-auto">
          <AnimatePresence>
            {hasActive && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={onClear}
                className="btn btn-danger btn-sm"
              >
                <X size={14} /> Limpiar
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fields.map(f => (
          <div key={f.key} className="flex flex-col gap-2">
            <label className="label !mb-0">{f.label}</label>
            <GlassSelect value={f.value} options={f.options} onChange={v => onChange(f.key, v)} allLabel={f.allLabel} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
