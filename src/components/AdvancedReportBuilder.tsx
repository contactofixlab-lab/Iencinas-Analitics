'use client';

import { useState, useMemo } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import GlassDatePicker from './GlassDatePicker';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Trash2, Download, Database, CheckCircle2, Play } from 'lucide-react';
import {
  PROYECTOS,
  TRANSACCIONES,
  VENTAS,
  LEADS,
  VALUACIONES,
  getProjectData,
} from '@/lib/mockDatabase';

const ENTITIES = {
  proyectos: {
    label: 'Proyectos',
    attributes: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'nombre', label: 'Nombre', type: 'text' },
      { key: 'ubicacion', label: 'Ubicación', type: 'text' },
      { key: 'estado', label: 'Estado', type: 'select' },
    ],
  },
  transacciones: {
    label: 'Transacciones',
    attributes: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'concepto', label: 'Concepto', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'select' },
      { key: 'monto', label: 'Monto', type: 'number' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
    ],
  },
  ventas: {
    label: 'Ventas',
    attributes: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'propiedad', label: 'Propiedad', type: 'text' },
      { key: 'etapa', label: 'Etapa', type: 'select' },
      { key: 'cantidad', label: 'Cantidad', type: 'number' },
      { key: 'valor', label: 'Valor', type: 'number' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
    ],
  },
  leads: {
    label: 'Leads',
    attributes: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'nombre', label: 'Nombre', type: 'text' },
      { key: 'canal', label: 'Canal', type: 'select' },
      { key: 'costo', label: 'Costo', type: 'number' },
      { key: 'estado', label: 'Estado', type: 'select' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
    ],
  },
  valuaciones: {
    label: 'Valuaciones',
    attributes: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'anio', label: 'Año', type: 'number' },
      { key: 'valor', label: 'Valor', type: 'number' },
      { key: 'crecimiento', label: 'Crecimiento %', type: 'number' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
    ],
  },
};

interface SelectedAttribute {
  entity: string;
  key: string;
  label: string;
}

interface AdvancedReportBuilderProps {
  accentColor?: { rgb: string; solid: string; text: string };
  onGenerate?: (config: any) => void;
}

export default function AdvancedReportBuilder({
  accentColor = { rgb: '34, 197, 94', solid: 'rgb(var(--brand-deep))', text: 'text-ok-ink' },
  onGenerate,
}: AdvancedReportBuilderProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrador';
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState('2026-01-01');
  const [fechaFin, setFechaFin] = useState('2026-12-31');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  const addAttribute = (entity: string, attr: any) => {
    const exists = selectedAttributes.some((s) => s.entity === entity && s.key === attr.key);
    if (!exists) {
      setSelectedAttributes([...selectedAttributes, { entity, key: attr.key, label: attr.label }]);
    }
  };

  const removeAttribute = (entity: string, key: string) => {
    setSelectedAttributes(selectedAttributes.filter((s) => !(s.entity === entity && s.key === key)));
  };

  const groupedByEntity = useMemo(() => {
    const grouped: Record<string, SelectedAttribute[]> = {};
    selectedAttributes.forEach((attr) => {
      if (!grouped[attr.entity]) grouped[attr.entity] = [];
      grouped[attr.entity].push(attr);
    });
    return grouped;
  }, [selectedAttributes]);

  const handleGenerate = () => {
    if (selectedAttributes.length === 0) {
      alert('Selecciona al menos un atributo');
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      const resultData: Record<string, any>[] = [];
      // Solo los proyectos asignados al usuario (los administradores ven todos).
      const projects = PROYECTOS.filter(p => isAdmin || (user?.proyectos ?? []).includes(p.id));

      projects.forEach((proyecto) => {
        const projectData = getProjectData(proyecto.id);
        if (!projectData) return;

        const needsProyectos = selectedAttributes.some((a) => a.entity === 'proyectos');
        const needsTransacciones = selectedAttributes.some((a) => a.entity === 'transacciones');
        const needsVentas = selectedAttributes.some((a) => a.entity === 'ventas');
        const needsLeads = selectedAttributes.some((a) => a.entity === 'leads');
        const needsValuaciones = selectedAttributes.some((a) => a.entity === 'valuaciones');

        if (needsProyectos && !needsTransacciones && !needsVentas && !needsLeads && !needsValuaciones) {
          const row: Record<string, any> = {};
          selectedAttributes.forEach(({ key, label }) => {
            row[label] = (proyecto as any)?.[key] ?? '-';
          });
          resultData.push(row);
        } else {
          const maxRows = Math.max(
            needsTransacciones && projectData.transactions ? projectData.transactions.length : 0,
            needsVentas && projectData.sales ? projectData.sales.length : 0,
            needsLeads && projectData.leads ? projectData.leads.length : 0,
            needsValuaciones && projectData.valuations ? projectData.valuations.length : 0,
            1
          );

          for (let i = 0; i < maxRows; i++) {
            const row: Record<string, any> = {};

            selectedAttributes.forEach(({ entity, key, label }) => {
              if (entity === 'proyectos') {
                row[label] = (proyecto as any)?.[key] ?? '-';
              } else if (entity === 'transacciones' && projectData.transactions?.[i]) {
                row[label] = (projectData.transactions[i] as any)?.[key] ?? '-';
              } else if (entity === 'ventas' && projectData.sales?.[i]) {
                row[label] = (projectData.sales[i] as any)?.[key] ?? '-';
              } else if (entity === 'leads' && projectData.leads?.[i]) {
                row[label] = (projectData.leads[i] as any)?.[key] ?? '-';
              } else if (entity === 'valuaciones' && projectData.valuations?.[i]) {
                row[label] = (projectData.valuations[i] as any)?.[key] ?? '-';
              } else {
                row[label] = '-';
              }
            });

            if (Object.values(row).some((v) => v !== '-')) {
              resultData.push(row);
            }
          }
        }
      });

      const filtered = resultData.filter((row) => {
        const hasDateField = selectedAttributes.some((a) => ['fecha'].includes(a.key));
        if (!hasDateField) return true;
        const dateField = selectedAttributes.find((a) => a.key === 'fecha');
        if (!dateField) return true;
        const rowDate = row[dateField.label];
        if (!rowDate) return true;
        try {
          const date = new Date(rowDate);
          const from = new Date(fechaInicio);
          const to = new Date(fechaFin);
          return date >= from && date <= to;
        } catch {
          return true;
        }
      });

      setPreviewData(filtered.slice(0, 50));
      setGenerating(false);
      onGenerate?.({
        attributes: selectedAttributes,
        fechaInicio,
        fechaFin,
        data: filtered,
      });
    }, 1200);
  };

  const columns = selectedAttributes.map((a) => a.label);

  return (
    <div className="space-y-6">
      {/* Dos Columnas: Previsualizador (Izq 70%) + Selector (Der 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: Previsualizador GRANDE */}
        <div className="lg:col-span-2 space-y-4">
          {previewData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="table-glass"
            >
              <div className="px-6 py-4 border-b border-line/25">
                <h3 className="text-ink font-semibold text-sm">Previsualizador ({previewData.length} registros)</h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="sticky top-0">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="px-4 py-3 text-left whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx}>
                        {columns.map((col) => (
                          <td key={`${idx}-${col}`} className="px-4 py-2.5 whitespace-nowrap">
                            {String(row[col] || '-').slice(0, 30)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card glass-card--muted empty-state" style={{ minHeight: 260 }}>
              <div className="icon-orb !w-14 !h-14">
                <Database size={24} strokeWidth={1.6} />
              </div>
              <p className="font-semibold text-ink">Tu previsualización aparecerá aquí</p>
              <p className="text-sm text-soft max-w-sm">
                Elige atributos en el panel de la derecha o usa uno de los reportes prehechos del sistema.
              </p>
            </div>
          )}

          {/* Botón Generar Reporte - Debajo del Previsualizador */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={selectedAttributes.length === 0 || generating}
            className="btn btn-primary w-full !h-14 !text-base"
          >
            <Play size={18} strokeWidth={1.8} />
            {generating ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>

        {/* COLUMNA DERECHA: Selector de Atributos */}
        <div className="glass-card h-fit" style={{ padding: 'var(--pad-card)' }}>
          <div className="sheen" />
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-orb !w-9 !h-9">
              <Database size={16} strokeWidth={1.8} />
            </div>
            <h2 className="font-semibold text-ink text-sm">Atributos</h2>
          </div>

          {/* Entidades Expandibles */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {Object.entries(ENTITIES).filter(([entityKey]) => isAdmin || entityKey !== 'valuaciones').map(([entityKey, entity]) => (
              <div key={entityKey}>
                <button
                  type="button"
                  onClick={() => setExpandedEntity(expandedEntity === entityKey ? null : entityKey)}
                  aria-expanded={expandedEntity === entityKey}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                  style={{
                    background: expandedEntity === entityKey ? 'rgb(var(--brand-soft) / 0.85)' : 'rgb(255 255 255 / 0.36)',
                    border: '1px solid rgb(var(--line) / 0.30)',
                  }}
                >
                  <span className="text-ink font-medium text-xs">{entity.label}</span>
                  <motion.div animate={{ rotate: expandedEntity === entityKey ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} strokeWidth={1.8} className="text-soft" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedEntity === entityKey && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-1.5 space-y-0.5 mt-1">
                        {entity.attributes.map((attr) => {
                          const isSelected = selectedAttributes.some((s) => s.entity === entityKey && s.key === attr.key);
                          return (
                            <button
                              type="button"
                              key={attr.key}
                              onClick={() => !isSelected && addAttribute(entityKey, attr)}
                              disabled={isSelected}
                              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                                isSelected ? 'cursor-default' : 'hover:bg-brand-soft/60'
                              }`}
                              style={isSelected ? { background: 'rgb(var(--brand-soft) / 0.7)' } : undefined}
                            >
                              <div
                                className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
                                style={{
                                  background: isSelected ? 'rgb(var(--brand-hover))' : '#fff',
                                  border: isSelected ? '1px solid rgb(var(--brand-hover))' : '1px solid rgb(var(--line) / 0.55)',
                                }}
                              >
                                {isSelected && <CheckCircle2 size={10} strokeWidth={3} className="text-white" />}
                              </div>
                              <span className={isSelected ? 'text-brand-deep font-medium' : 'text-soft'}>
                                {attr.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Filtros de Fecha */}
          <div className="mt-4 space-y-2 border-t border-line/25 pt-4">
            <label className="label">Fechas</label>
            <GlassDatePicker value={fechaInicio} onChange={setFechaInicio} />
            <GlassDatePicker value={fechaFin} onChange={setFechaFin} />
          </div>

          {/* Atributos Seleccionados */}
          {selectedAttributes.length > 0 && (
            <div className="mt-4 border-t border-line/25 pt-4">
              <p className="label">Seleccionados ({selectedAttributes.length})</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {selectedAttributes.map((attr) => (
                  <motion.span
                    key={`${attr.entity}-${attr.key}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="chip chip-info !pr-1.5"
                  >
                    <span className="truncate max-w-[120px]">{attr.label}</span>
                    <button
                      type="button"
                      onClick={() => removeAttribute(attr.entity, attr.key)}
                      aria-label={`Quitar ${attr.label}`}
                      className="p-0.5 rounded-full hover:bg-white/40 transition-colors shrink-0"
                    >
                      <Trash2 size={11} strokeWidth={1.8} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Botón Descargar */}
          {previewData.length > 0 && (
            <button type="button" className="btn btn-secondary btn-sm w-full mt-4">
              <Download size={14} strokeWidth={1.8} />
              Descargar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
