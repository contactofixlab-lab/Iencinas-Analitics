'use client';

import { Filter, X, Search } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import GlassSelect from './GlassSelect';
import GlassDatePicker from './GlassDatePicker';

export interface FilterConfig {
  dateRange?: { from: string; to: string };
  search?: string;
  status?: string;
  type?: string;
  [key: string]: any;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterConfig) => void;
  showDateRange?: boolean;
  showSearch?: boolean;
  showStatus?: boolean;
  showType?: boolean;
  statusOptions?: FilterOption[];
  typeOptions?: FilterOption[];
  typeLabel?: string;
  statusLabel?: string;
}

export default function FilterPanel({
  onFilterChange,
  showDateRange = true,
  showSearch = true,
  showStatus = false,
  showType = false,
  statusOptions = [],
  typeOptions = [],
  typeLabel = 'Tipo',
  statusLabel = 'Estado',
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterConfig>({
    dateRange: { from: '2026-01-01', to: '2026-12-31' },
    search: '',
    status: '',
    type: '',
  });

  const update = (key: string, value: any) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const updateDate = (field: 'from' | 'to', value: string) => {
    const dateRange = filters.dateRange ?? { from: '2026-01-01', to: '2026-12-31' };
    const next = { ...filters, dateRange: { ...dateRange, [field]: value } };
    setFilters(next);
    onFilterChange(next);
  };

  const clear = () => {
    const cleared = { dateRange: { from: '2026-01-01', to: '2026-12-31' }, search: '', status: '', type: '' };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActive =
    (filters.search && filters.search.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    (filters.type && filters.type.length > 0);

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="label !mb-0">{children}</label>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative"
      style={{ padding: 'var(--pad-card)' }}
    >
      <div className="sheen" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="icon-orb !w-9 !h-9">
          <Filter size={16} strokeWidth={1.8} />
        </div>
        <h3 className="text-sm font-semibold text-ink">Filtros</h3>
        <AnimatePresence>
          {hasActive && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="chip chip-info"
            >
              Activos
            </motion.span>
          )}
        </AnimatePresence>

        <div className="ml-auto">
          <AnimatePresence>
            {hasActive && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={clear}
                className="btn btn-danger btn-sm"
              >
                <X size={14} /> Limpiar
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls — horizontal grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {showSearch && (
          <div className="flex flex-col gap-2">
            <Label>Búsqueda</Label>
            <div className="relative">
              <Search size={15} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.search}
                onChange={e => update('search', e.target.value)}
                className="field w-full"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>
        )}

        {showDateRange && (
          <div className="flex flex-col gap-2">
            <Label>Desde</Label>
            <GlassDatePicker
              value={filters.dateRange?.from || '2026-01-01'}
              onChange={v => updateDate('from', v)}
              placeholder="Seleccionar fecha inicio"
            />
          </div>
        )}

        {showDateRange && (
          <div className="flex flex-col gap-2">
            <Label>Hasta</Label>
            <GlassDatePicker
              value={filters.dateRange?.to || '2026-12-31'}
              onChange={v => updateDate('to', v)}
              placeholder="Seleccionar fecha fin"
            />
          </div>
        )}

        {showStatus && statusOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label>{statusLabel}</Label>
            <GlassSelect
              value={filters.status || ''}
              options={statusOptions}
              onChange={v => update('status', v)}
            />
          </div>
        )}

        {showType && typeOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label>{typeLabel}</Label>
            <GlassSelect
              value={filters.type || ''}
              options={typeOptions}
              onChange={v => update('type', v)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
