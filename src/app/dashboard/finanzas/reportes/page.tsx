'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectSelector from '@/components/ProjectSelector';
import AdvancedReportBuilder from '@/components/AdvancedReportBuilder';
import { FileText, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const ACCENT = {
  rgb: '34, 197, 94',
  solid: '#22c55e',
  light: '#4ade80',
  text: 'text-green-400',
};

export default function FinanzasReportesPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('bosques-del-mar');
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  const handleProyectoChange = (newProyecto: string) => {
    setProyecto(newProyecto);
    window.history.replaceState({}, '', `?proyecto=${newProyecto}`);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes — Finanzas</h1>
          <p className="text-gray-400 text-sm mt-1">Crea reportes personalizados seleccionando los atributos que necesitas</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      {/* Generador Avanzado de Reportes */}
      <AdvancedReportBuilder
        accentColor={ACCENT}
        onGenerate={(config) => setPreviewData(config.data)}
      />

    </div>
  );
}
