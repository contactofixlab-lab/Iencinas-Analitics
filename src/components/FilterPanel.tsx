'use client';

import { Filter, X, Search } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GlassSelect from './GlassSelect';

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
    const next = { ...filters, dateRange: { ...filters.dateRange, [field]: value } as { from: string; to: string } };
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
    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em]">{children}</label>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[20px] p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(22px) saturate(150%)',
        WebkitBackdropFilter: 'blur(22px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.13)',
        boxShadow: '0 16px 50px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl" style={{ background: 'rgba(74,222,128,0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}>
          <Filter size={16} className="text-green-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Filtros</h3>
        <AnimatePresence>
          {hasActive && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-3 py-1 rounded-full text-[11px] font-bold text-green-300"
              style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.35)' }}
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
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
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
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
            <input
              type="date"
              value={filters.dateRange?.from || '2026-01-01'}
              onChange={e => updateDate('from', e.target.value)}
              className="field w-full"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        )}

        {showDateRange && (
          <div className="flex flex-col gap-2">
            <Label>Hasta</Label>
            <input
              type="date"
              value={filters.dateRange?.to || '2026-12-31'}
              onChange={e => updateDate('to', e.target.value)}
              className="field w-full"
              style={{ colorScheme: 'dark' }}
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
