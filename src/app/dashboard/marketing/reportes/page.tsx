'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectSelector from '@/components/ProjectSelector';
import { FileText, Download, Eye, Calendar, Filter } from 'lucide-react';

function ReportCard({ reporte }: { reporte: any }) {
  const [downloading, setDownloading] = useState('');
  function simulate(format: string) { setDownloading(format); setTimeout(() => setDownloading(''), 1200); }
  return (
    <div className="lift rounded-2xl p-5 overflow-hidden" style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{
          background: 'rgba(168, 85, 247, 0.2)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
        }}>
          <FileText size={22} className="text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{reporte.nombre}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{reporte.descripcion}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} />{reporte.fecha}</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium border border-purple-500/30">{reporte.tipo}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 rounded-lg transition-colors" style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Eye size={13} />Previsualizar
        </button>
        {['PDF', 'Excel', 'CSV'].map(fmt => (
          <button key={fmt} onClick={() => simulate(fmt)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={downloading === fmt
              ? { backgroundColor: '#8b5cf6', color: 'white', border: '1px solid rgba(139, 92, 246, 0.5)' }
              : { backgroundColor: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
            <Download size={13} />{downloading === fmt ? 'Descargando...' : fmt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MarketingReportesPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('bosques-del-mar');
  const [reportes, setReportes] = useState<any[]>([]);

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  useEffect(() => {
    fetch(`/api/reportes/marketing?proyecto=${proyecto}`)
      .then(res => res.json())
      .then(res => setReportes(res.data || []))
      .catch(() => setReportes([]));
  }, [proyecto]);

  const handleProyectoChange = (newProyecto: string) => {
    setProyecto(newProyecto);
    window.history.replaceState({}, '', `?proyecto=${newProyecto}`);
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes — Marketing</h1>
          <p className="text-gray-400 text-sm mt-0.5">Descarga y previsualiza los reportes del área de marketing</p>
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
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'rgba(168, 85, 247, 0.2)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
          }}>
            <Filter size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Reporte a Medida</h2>
            <p className="text-sm text-gray-400">Personaliza el período y métricas del reporte</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><label className="block text-xs font-medium text-gray-300 mb-1.5">Fecha inicio</label>
            <input type="date" defaultValue="2026-01-01" className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
            }} /></div>
          <div><label className="block text-xs font-medium text-gray-300 mb-1.5">Fecha fin</label>
            <input type="date" defaultValue="2026-06-30" className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
            }} /></div>
          <div><label className="block text-xs font-medium text-gray-300 mb-1.5">Canal</label>
            <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
            }}>
              <option>Todos los canales</option><option>Google Ads</option><option>Facebook</option><option>Instagram</option>
            </select></div>
          <div><label className="block text-xs font-medium text-gray-300 mb-1.5">Formato</label>
            <select className="w-full px-3 py-2.5 rounded-xl text-sm text-white" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
            }}>
              <option>PDF</option><option>Excel</option><option>CSV</option>
            </select></div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-colors" style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>Previsualizar</button>
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2" style={{ backgroundColor: '#8b5cf6', boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}>
            <Download size={15} />Generar y Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
