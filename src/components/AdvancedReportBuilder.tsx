'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassDatePicker from './GlassDatePicker';
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
  accentColor = { rgb: '34, 197, 94', solid: '#22c55e', text: 'text-green-400' },
  onGenerate,
}: AdvancedReportBuilderProps) {
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
      const projects = PROYECTOS;

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
          {/* Previsualizador - Tabla */}
          {previewData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[20px] p-6 overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.03) 100%)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(34,197,94,0.25)',
              }}
            >
              <h3 className="text-white font-semibold mb-4 text-sm">Previsualizador ({previewData.length} registros)</h3>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 sticky top-0 bg-black/20">
                      {columns.map((col) => (
                        <th key={col} className="px-4 py-2 text-left text-gray-300 font-medium whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        {columns.map((col) => (
                          <td key={`${idx}-${col}`} className="px-4 py-2 text-gray-300 whitespace-nowrap">
                            {String(row[col] || '-').slice(0, 30)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Botón Generar Reporte - Debajo del Previsualizador */}
          <motion.button
            onClick={handleGenerate}
            disabled={selectedAttributes.length === 0 || generating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${accentColor.solid}, rgb(${accentColor.rgb}))`,
              color: 'white',
            }}
          >
            <Play size={18} />
            {generating ? 'Generando...' : 'Generar Reporte'}
          </motion.button>
        </div>

        {/* COLUMNA DERECHA: Selector de Atributos PEQUEÑO */}
        <div className="rounded-[20px] p-6 overflow-hidden h-fit" style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
        }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: `rgba(${accentColor.rgb}, 0.18)`,
              border: `1px solid rgba(${accentColor.rgb}, 0.4)`,
            }}>
              <Database size={16} className={accentColor.text} />
            </div>
            <h2 className="font-semibold text-white text-sm">Atributos</h2>
          </div>

          {/* Entidades Expandibles */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(ENTITIES).map(([entityKey, entity]) => (
              <div key={entityKey}>
                <motion.button
                  onClick={() => setExpandedEntity(expandedEntity === entityKey ? null : entityKey)}
                  className="w-full flex items-center justify-between p-2 rounded-lg transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <span className="text-white font-medium text-xs">{entity.label}</span>
                  <motion.div animate={{ rotate: expandedEntity === entityKey ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} className="text-gray-400" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedEntity === entityKey && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 space-y-1 bg-black/20 rounded-lg mt-1">
                        {entity.attributes.map((attr) => {
                          const isSelected = selectedAttributes.some((s) => s.entity === entityKey && s.key === attr.key);
                          return (
                            <motion.button
                              key={attr.key}
                              onClick={() => !isSelected && addAttribute(entityKey, attr)}
                              disabled={isSelected}
                              className={`w-full flex items-center gap-2 p-1.5 rounded text-left text-xs transition-all ${
                                isSelected
                                  ? 'bg-green-500/20 cursor-default'
                                  : 'hover:bg-white/5'
                              }`}
                            >
                              <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                                isSelected
                                  ? 'bg-green-500 border-green-400'
                                  : 'border-gray-400'
                              }`}>
                                {isSelected && <CheckCircle2 size={8} className="text-white" />}
                              </div>
                              <span className={isSelected ? 'text-green-400' : 'text-gray-300'}>
                                {attr.label}
                              </span>
                            </motion.button>
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
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
            <label className="text-xs font-medium text-gray-300">Fechas</label>
            <GlassDatePicker value={fechaInicio} onChange={setFechaInicio} />
            <GlassDatePicker value={fechaFin} onChange={setFechaFin} />
          </div>

          {/* Atributos Seleccionados */}
          {selectedAttributes.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-medium text-gray-300 mb-2">Seleccionados ({selectedAttributes.length})</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedAttributes.map((attr) => (
                  <motion.div
                    key={`${attr.entity}-${attr.key}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-between gap-1 p-1 rounded-lg text-xs"
                    style={{
                      background: `rgba(${accentColor.rgb}, 0.15)`,
                      border: `1px solid rgba(${accentColor.rgb}, 0.3)`,
                    }}
                  >
                    <span className="text-gray-300 truncate">{attr.label}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeAttribute(attr.entity, attr.key)}
                      className="p-0.5 rounded hover:bg-red-500/30 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={10} className="text-red-400" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Botón Descargar */}
          {previewData.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-4"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
              }}
            >
              <Download size={14} />
              Descargar
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
