'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectSelector from '@/components/ProjectSelector';
import AdvancedReportBuilder from '@/components/AdvancedReportBuilder';
import { motion } from 'framer-motion';

const ACCENT = {
  rgb: '168, 85, 247',
  solid: '#a855f7',
  light: '#c084fc',
  text: 'text-purple-400',
};

export default function MarketingReportesPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('proj-001');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes — Marketing</h1>
          <p className="text-gray-400 text-sm mt-1">Crea reportes personalizados seleccionando los atributos que necesitas</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      <AdvancedReportBuilder
        accentColor={ACCENT}
        onGenerate={(config) => setPreviewData(config.data)}
      />
    </div>
  );
}
