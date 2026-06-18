'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassDatePicker from './GlassDatePicker';
import { ChevronDown, Plus, Trash2, Eye, Download, Database } from 'lucide-react';

// Mapeo de entidades disponibles y sus atributos
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

  // Agregar atributo
  const addAttribute = (entity: string, attr: any) => {
    const exists = selectedAttributes.some(
      (s) => s.entity === entity && s.key === attr.key
    );
    if (!exists) {
      setSelectedAttributes([
        ...selectedAttributes,
        { entity, key: attr.key, label: attr.label },
      ]);
    }
  };

  // Remover atributo
  const removeAttribute = (entity: string, key: string) => {
    setSelectedAttributes(
      selectedAttributes.filter(
        (s) => !(s.entity === entity && s.key === key)
      )
    );
  };

  // Agrupar atributos seleccionados por entidad
  const groupedByEntity = useMemo(() => {
    const grouped: Record<string, SelectedAttribute[]> = {};
    selectedAttributes.forEach((attr) => {
      if (!grouped[attr.entity]) grouped[attr.entity] = [];
      grouped[attr.entity].push(attr);
    });
    return grouped;
  }, [selectedAttributes]);

  // Generar datos de prueba basados en atributos seleccionados
  const handleGenerate = () => {
    if (selectedAttributes.length === 0) {
      alert('Selecciona al menos un atributo');
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      const mockData = Array.from({ length: 8 }).map((_, i) => {
        const row: Record<string, any> = {};
        selectedAttributes.forEach(({ entity, key, label }) => {
          if (entity === 'proyectos') {
            const values: Record<string, any> = {
              id: `P-${1000 + i}`,
              nombre: ['Bosques del Mar', 'Las Condes Park', 'Lo Barnechea Villas'][i % 3],
              ubicacion: ['Punta Arenas', 'Las Condes', 'Lo Barnechea'][i % 3],
              estado: ['activo', 'completado', 'inactivo'][i % 3],
            };
            row[label] = values[key];
          } else if (entity === 'transacciones') {
            const valores: Record<string, any> = {
              id: `T-${2000 + i}`,
              concepto: `Transacción #${i + 1}`,
              tipo: i % 2 === 0 ? 'Ingreso' : 'Egreso',
              monto: `$${(Math.random() * 500000).toFixed(0)}`,
              fecha: new Date(2026, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
            };
            row[label] = valores[key];
          } else if (entity === 'ventas') {
            const vals: Record<string, any> = {
              id: `V-${3000 + i}`,
              propiedad: `Propiedad #${i + 1}`,
              etapa: ['Negociación', 'Oferta', 'Cerrada'][i % 3],
              cantidad: i + 1,
              valor: `$${(Math.random() * 1000000).toFixed(0)}`,
              fecha: new Date(2026, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
            };
            row[label] = vals[key];
          } else if (entity === 'leads') {
            const lvals: Record<string, any> = {
              id: `L-${4000 + i}`,
              nombre: `Lead #${i + 1}`,
              canal: ['Web', 'Email', 'Redes Sociales', 'Referencia'][i % 4],
              costo: `$${Math.floor(Math.random() * 5000)}`,
              estado: ['Nuevo', 'En progreso', 'Convertido'][i % 3],
              fecha: new Date(2026, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
            };
            row[label] = lvals[key];
          } else if (entity === 'valuaciones') {
            const vvals: Record<string, any> = {
              id: `VA-${5000 + i}`,
              anio: 2020 + i,
              valor: `$${(Math.random() * 10000000).toFixed(0)}`,
              crecimiento: `${(Math.random() * 20).toFixed(1)}%`,
              fecha: new Date(2020 + i, 6, 1).toLocaleDateString(),
            };
            row[label] = vvals[key];
          }
        });
        return row;
      });
      setPreviewData(mockData);
      setGenerating(false);
      onGenerate?.({
        attributes: selectedAttributes,
        fechaInicio,
        fechaFin,
        data: mockData,
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Panel de Selección de Atributos */}
      <div className="rounded-[20px] p-6 overflow-hidden" style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: `rgba(${accentColor.rgb}, 0.18)`,
            border: `1px solid rgba(${accentColor.rgb}, 0.4)`,
          }}>
            <Database size={18} className={accentColor.text} />
          </div>
          <div>
            <h2 className="font-semibold text-white">Constructor de Reportes</h2>
            <p className="text-sm text-gray-400">Selecciona atributos de diferentes entidades</p>
          </div>
        </div>

        {/* Entidades expandibles */}
        <div className="space-y-2 mb-6">
          {Object.entries(ENTITIES).map(([entityKey, entity]) => (
            <div key={entityKey}>
              <motion.button
                onClick={() => setExpandedEntity(expandedEntity === entityKey ? null : entityKey)}
                className="w-full flex items-center justify-between p-3 rounded-lg transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                whileHover={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <span className="text-white font-medium">{entity.label}</span>
                <motion.div
                  animate={{ rotate: expandedEntity === entityKey ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-gray-400" />
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
                    <div className="p-3 space-y-2 bg-black/20 rounded-lg mt-2">
                      {entity.attributes.map((attr) => {
                        const isSelected = selectedAttributes.some(
                          (s) => s.entity === entityKey && s.key === attr.key
                        );
                        return (
                          <motion.button
                            key={attr.key}
                            onClick={() => !isSelected && addAttribute(entityKey, attr)}
                            disabled={isSelected}
                            whileHover={{ x: 2 }}
                            className={`w-full flex items-center justify-between p-2 rounded text-left transition-all ${
                              isSelected
                                ? 'bg-green-500/20 text-green-400 cursor-default'
                                : 'hover:bg-white/5 text-gray-300'
                            }`}
                          >
                            <span className="text-sm">{attr.label}</span>
                            {isSelected && <span className="text-xs font-bold">✓</span>}
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
      </div>

      {/* Atributos Seleccionados */}
      {selectedAttributes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[20px] p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(34,197,94,0.3)',
            boxShadow: '0 0 30px rgba(34,197,94,0.1)',
          }}
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Plus size={16} className={accentColor.text} />
            Columnas Seleccionadas ({selectedAttributes.length})
          </h3>
          <div className="space-y-3">
            {Object.entries(groupedByEntity).map(([entity, attrs]) => (
              <div key={entity}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  {ENTITIES[entity as keyof typeof ENTITIES]?.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {attrs.map((attr) => (
                    <motion.div
                      key={`${attr.entity}-${attr.key}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                      style={{
                        background: `rgba(${accentColor.rgb}, 0.2)`,
                        border: `1px solid rgba(${accentColor.rgb}, 0.4)`,
                      }}
                    >
                      <span className="text-white">{attr.label}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeAttribute(attr.entity, attr.key)}
                        className="p-0.5 rounded hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filtros de Fecha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Fecha inicio</label>
          <GlassDatePicker value={fechaInicio} onChange={setFechaInicio} placeholder="Seleccionar inicio" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Fecha fin</label>
          <GlassDatePicker value={fechaFin} onChange={setFechaFin} placeholder="Seleccionar fin" />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={generating || selectedAttributes.length === 0}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${accentColor.solid}, #15803d)`,
            boxShadow: `0 8px 24px rgba(${accentColor.rgb},0.35)`,
            opacity: generating || selectedAttributes.length === 0 ? 0.6 : 1,
          }}
        >
          <Eye size={15} />
          {generating ? 'Generando...' : 'Previsualizar'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={previewData.length === 0}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${accentColor.solid}, #15803d)`,
            boxShadow: `0 8px 24px rgba(${accentColor.rgb},0.35)`,
            opacity: previewData.length === 0 ? 0.5 : 1,
          }}
        >
          <Download size={15} />
          Descargar CSV
        </motion.button>
      </div>

      {/* Vista Previa */}
      {previewData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[20px] overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        >
          <div className="p-6">
            <h3 className="text-white font-semibold mb-4">Vista Previa</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {selectedAttributes.map((attr) => (
                      <th
                        key={`${attr.entity}-${attr.key}`}
                        className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                      >
                        {attr.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      {selectedAttributes.map((attr) => (
                        <td key={`${attr.entity}-${attr.key}-${i}`} className="px-4 py-3 text-gray-300">
                          {row[attr.label] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
