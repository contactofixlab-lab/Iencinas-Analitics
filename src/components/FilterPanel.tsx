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

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div className="rounded-2xl p-6 overflow-hidden" style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Filter size={20} className="text-green-400" />
        <h3 className="text-sm font-semibold text-white">Filtros</h3>
        {hasActiveFilters && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/30 text-green-300">
            Filtros Activos
          </span>
        )}
      </div>

      {/* Filter Controls - Horizontal Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        {showSearch && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Búsqueda</label>
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="w-full transition-all hover:border-green-500/40 focus:border-green-400"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)';
                e.target.style.boxShadow = '0 0 12px rgba(74, 222, 128, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        {/* Date From */}
        {showDateRange && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Desde</label>
            <input
              type="date"
              value={filters.dateRange?.from || '2026-01-01'}
              onChange={e => handleDateChange('from', e.target.value)}
              className="w-full transition-all hover:border-green-500/40 focus:border-green-400"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)';
                e.target.style.boxShadow = '0 0 12px rgba(74, 222, 128, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        {/* Date To */}
        {showDateRange && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Hasta</label>
            <input
              type="date"
              value={filters.dateRange?.to || '2026-12-31'}
              onChange={e => handleDateChange('to', e.target.value)}
              className="w-full transition-all hover:border-green-500/40 focus:border-green-400"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)';
                e.target.style.boxShadow = '0 0 12px rgba(74, 222, 128, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        {/* Status */}
        {showStatus && statusOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">{statusLabel}</label>
            <select
              value={filters.status || ''}
              onChange={e => handleFilterChange('status', e.target.value)}
              className="w-full transition-all hover:border-green-500/40 focus:border-green-400"
              style={selectStyle}
              onFocus={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = 'rgba(74, 222, 128, 0.5)';
                (e.target as HTMLSelectElement).style.boxShadow = '0 0 12px rgba(74, 222, 128, 0.2)';
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value="" style={{ background: '#1a1a1a', color: '#999' }}>Todos</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a', color: '#fff' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Type */}
        {showType && typeOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">{typeLabel}</label>
            <select
              value={filters.type || ''}
              onChange={e => handleFilterChange('type', e.target.value)}
              className="w-full transition-all hover:border-green-500/40 focus:border-green-400"
              style={selectStyle}
              onFocus={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = 'rgba(74, 222, 128, 0.5)';
                (e.target as HTMLSelectElement).style.boxShadow = '0 0 12px rgba(74, 222, 128, 0.2)';
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value="" style={{ background: '#1a1a1a', color: '#999' }}>Todos</option>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a', color: '#fff' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-5 pt-5 border-t border-white/10">
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
            }}
          >
            <X size={16} />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
