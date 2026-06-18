'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectSelector from '@/components/ProjectSelector';
import GlassDatePicker from '@/components/GlassDatePicker';
import { FileText, Download, Eye, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ACCENT = {
  rgb: '245, 158, 11',
  solid: '#f59e0b',
  light: '#fbbf24',
  text: 'text-amber-400',
};

function ReportCard({ reporte }: { reporte: any; onClick?: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg transition-all hover:scale-105 active:scale-95"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.15)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
    >
      <div className="flex items-start gap-2">
        <FileText size={16} className={ACCENT.text} style={{ marginTop: '2px', flexShrink: 0 }} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{reporte.nombre}</p>
          <p className="text-xs text-gray-500 mt-0.5">{reporte.fecha}</p>
        </div>
      </div>
    </motion.button>
  );
}

export default function ValorEmpresaReportesPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('bosques-del-mar');
  const [reportes, setReportes] = useState<any[]>([]);
  const [fechaInicio, setFechaInicio] = useState('2026-01-01');
  const [fechaFin, setFechaFin] = useState('2026-12-31');
  const [metricas, setMetricas] = useState('todas');
  const [formato, setFormato] = useState('PDF');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  useEffect(() => {
    fetch(`/api/reportes/valor-empresa?proyecto=${proyecto}`)
      .then(res => res.json())
      .then(res => setReportes(res.data || []))
      .catch(() => setReportes([]));
  }, [proyecto]);

  const handleProyectoChange = (newProyecto: string) => {
    setProyecto(newProyecto);
    window.history.replaceState({}, '', `?proyecto=${newProyecto}`);
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setPreviewData([
        { anio: 2024, valuacion: '$45M', crecimiento: '12%', fecha: '2026-01-15' },
        { anio: 2025, valuacion: '$50M', crecimiento: '11%', fecha: '2026-01-15' },
        { anio: 2026, valuacion: '$56M', crecimiento: '12%', fecha: '2026-06-15' },
      ]);
      setGenerating(false);
    }, 1200);
  };

  const handleDownload = () => {
    alert(`Descargando reporte en ${formato}...`);
  };

  const inputStyle: React.CSSProperties = {};

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes — Valor Empresa</h1>
          <p className="text-gray-400 text-sm mt-1">Reportes ejecutivos para accionistas y directorio</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: `rgba(${ACCENT.rgb}, 0.18)`, border: `1px solid rgba(${ACCENT.rgb}, 0.4)`,
            }}>
              <Eye size={18} className={ACCENT.text} />
            </div>
            <div>
              <h2 className="font-semibold text-white">Previsualizador — Reporte a Medida</h2>
              <p className="text-sm text-gray-400">{previewData.length > 0 ? `${previewData.length} registros` : 'Genera un reporte personalizado'}</p>
            </div>
          </div>

          {previewData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Año', 'Valuación', 'Crecimiento', 'Fecha'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-gray-300">{row.anio}</td>
                      <td className="px-4 py-3 text-amber-400 font-semibold">{row.valuacion}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-400">
                          {row.crecimiento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{row.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">
              <p>Selecciona los filtros y genera un reporte para verlo aquí</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[20px] p-5 overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
            height: 'fit-content',
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={16} className={ACCENT.text} />
            Reportes Predefinidos
          </h3>
          <div className="space-y-2">
            {(reportes.length > 0 ? reportes : []).slice(0, 5).map(r => (
              <ReportCard key={r.id} reporte={r} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 rounded-[20px] p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: `rgba(${ACCENT.rgb}, 0.18)`, border: `1px solid rgba(${ACCENT.rgb}, 0.4)`,
            }}>
              <Filter size={18} className={ACCENT.text} />
            </div>
            <div>
              <h2 className="font-semibold text-white">Generador de Reporte</h2>
              <p className="text-sm text-gray-400">Personaliza los parámetros de tu reporte</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Fecha inicio</label>
              <GlassDatePicker value={fechaInicio} onChange={setFechaInicio} placeholder="Seleccionar inicio" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Fecha fin</label>
              <GlassDatePicker value={fechaFin} onChange={setFechaFin} placeholder="Seleccionar fin" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Métricas</label>
              <select value={metricas} onChange={e => setMetricas(e.target.value)} className="field w-full" style={inputStyle}>
                <option value="todas">Todas las métricas</option>
                <option value="valuacion">Solo valuación</option>
                <option value="crecimiento">Crecimiento anual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Formato</label>
              <select value={formato} onChange={e => setFormato(e.target.value)} className="field w-full" style={inputStyle}>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              disabled={generating}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${ACCENT.solid}, #d97706)`,
                boxShadow: `0 8px 24px rgba(${ACCENT.rgb},0.35)`,
                opacity: generating ? 0.7 : 1,
              }}
            >
              <Eye size={15} />
              {generating ? 'Generando...' : 'Previsualizar'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              disabled={previewData.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${ACCENT.solid}, #d97706)`,
                boxShadow: `0 8px 24px rgba(${ACCENT.rgb},0.35)`,
                opacity: previewData.length === 0 ? 0.5 : 1,
              }}
            >
              <Download size={15} />
              Descargar {formato}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
