'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectSelector from '@/components/ProjectSelector';
import { FileText, Download, Eye, Calendar, Filter } from 'lucide-react';

const ACCENT = {
  rgb: '245, 158, 11',
  solid: '#f59e0b',
  light: '#fde68a',
  text: 'text-amber-300',
};

function ReportCard({ reporte }: { reporte: any }) {
  const [downloading, setDownloading] = useState('');
  function simulate(format: string) {
    setDownloading(format);
    setTimeout(() => setDownloading(''), 1200);
  }
  return (
    <div className="lift rounded-2xl p-5 overflow-hidden" style={{
      background: 'rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.10)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{
          background: `rgba(${ACCENT.rgb}, 0.18)`,
          border: `1px solid rgba(${ACCENT.rgb}, 0.4)`,
        }}>
          <FileText size={22} className={ACCENT.text} />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-white">{reporte.nombre}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{reporte.descripcion}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} />{reporte.fecha}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
              background: `rgba(${ACCENT.rgb}, 0.18)`, color: ACCENT.light, border: `1px solid rgba(${ACCENT.rgb}, 0.3)`,
            }}>{reporte.tipo}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 rounded-lg transition-colors hover:bg-white/10" style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Eye size={13} />Previsualizar
        </button>
        {['PDF', 'Excel', 'CSV'].map(fmt => (
          <button key={fmt} onClick={() => simulate(fmt)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={downloading === fmt
              ? { backgroundColor: ACCENT.solid, color: '#1a1206', border: `1px solid rgba(${ACCENT.rgb}, 0.5)` }
              : { backgroundColor: `rgba(${ACCENT.rgb}, 0.12)`, color: ACCENT.light, border: `1px solid rgba(${ACCENT.rgb}, 0.28)` }}>
            <Download size={13} />{downloading === fmt ? 'Descargando...' : fmt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ValorEmpresaReportesPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('bosques-del-mar');
  const [reportes, setReportes] = useState<any[]>([]);

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

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes — Valor Empresa</h1>
          <p className="text-gray-400 text-sm mt-1">Reportes ejecutivos para accionistas y directorio</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Reportes Predefinidos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 stagger-grid">
          {(reportes.length > 0 ? reportes : []).map(r => <ReportCard key={r.id} reporte={r} />)}
        </div>
      </div>

      <div className="rounded-2xl p-6 overflow-hidden" style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: `rgba(${ACCENT.rgb}, 0.18)`, border: `1px solid rgba(${ACCENT.rgb}, 0.4)`,
          }}>
            <Filter size={18} className={ACCENT.text} />
          </div>
          <div>
            <h2 className="font-semibold text-white">Reporte Ejecutivo a Medida</h2>
            <p className="text-sm text-gray-400">Genera reportes personalizados para el directorio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Año</label>
            <select className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Tipo de análisis</label>
            <select className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
              <option>Completo</option>
              <option>Solo EBITDA</option>
              <option>Solo Valuación</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Formato</label>
            <select className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
              <option>PDF Ejecutivo</option>
              <option>Excel</option>
              <option>Presentación</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-colors hover:bg-white/10" style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          }}>Previsualizar</button>
          <button className="shimmer-host px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-transform hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${ACCENT.solid}, #b45309)`, color: '#1a1206', boxShadow: `0 8px 24px rgba(${ACCENT.rgb},0.35)` }}>
            <Download size={15} />Generar y Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
