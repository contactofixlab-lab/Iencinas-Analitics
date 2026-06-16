'use client';

import { Filter, X } from 'lucide-react';
import { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({
    dateRange: { from: '2026-01-01', to: '2026-12-31' },
    search: '',
    status: '',
    type: '',
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    const newDateRange = { ...filters.dateRange, [field]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      dateRange: { from: '2026-01-01', to: '2026-12-31' },
      search: '',
      status: '',
      type: '',
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters =
    (filters.search && filters.search.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    (filters.type && filters.type.length > 0);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    }}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-blue-400" />
          <span className="font-semibold text-white">Filtros</span>
          {hasActiveFilters && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/30 text-blue-300">
              Activo
            </span>
          )}
        </div>
        <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="border-t border-white/10"></div>

          {/* Filter Controls */}
          <div className="p-5 space-y-4">
            {/* Search */}
            {showSearch && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Buscar</label>
                <input
                  type="text"
                  placeholder="Escribe para filtrar..."
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            )}

            {/* Date Range */}
            {showDateRange && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Desde</label>
                  <input
                    type="date"
                    value={filters.dateRange?.from || '2026-01-01'}
                    onChange={e => handleDateChange('from', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Hasta</label>
                  <input
                    type="date"
                    value={filters.dateRange?.to || '2026-12-31'}
                    onChange={e => handleDateChange('to', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Status */}
            {showStatus && statusOptions.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">{statusLabel}</label>
                <select
                  value={filters.status || ''}
                  onChange={e => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="">Todos</option>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-gray-800">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Type */}
            {showType && typeOptions.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">{typeLabel}</label>
                <select
                  value={filters.type || ''}
                  onChange={e => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="">Todos</option>
                  {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-gray-800">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                }}
              >
                <X size={16} />
                Limpiar filtros
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
