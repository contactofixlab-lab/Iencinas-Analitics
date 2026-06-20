'use client';

import { motion } from 'framer-motion';
import { FileText, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface PrebuiltReportsProps {
  accentColor?: { rgb: string; solid: string; text: string };
  onSelectReport?: (reportType: string) => void;
}

export default function PrebuiltReports({
  accentColor = { rgb: '34, 197, 94', solid: '#22c55e', text: 'text-green-400' },
  onSelectReport
}: PrebuiltReportsProps) {
  const reports = [
    {
      id: 'resumen',
      title: 'Resumen Ejecutivo',
      description: 'Vista general de métricas principales',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'detalles',
      title: 'Detalles Completos',
      description: 'Todos los atributos y relaciones',
      icon: FileText,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'tendencias',
      title: 'Tendencias Temporales',
      description: 'Análisis de evolución por período',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'comparativa',
      title: 'Análisis Comparativo',
      description: 'Comparación entre entidades',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'distribucion',
      title: 'Distribución & Proporciones',
      description: 'Desglose porcentual de datos',
      icon: PieChart,
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="rounded-[20px] p-6 overflow-hidden" style={{
      background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    }}>
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
        <FileText size={18} className={accentColor.text} />
        Reportes Prehechos del Sistema
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <motion.button
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectReport?.(report.id)}
              className="group rounded-[16px] p-4 transition-all text-left hover:border-white/30"
              style={{
                background: `linear-gradient(135deg, rgba(${accentColor.rgb}, 0.12) 0%, rgba(${accentColor.rgb}, 0.04) 100%)`,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center bg-gradient-to-br ${report.color}`}>
                <Icon size={20} className="text-white" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">{report.title}</h4>
              <p className="text-gray-400 text-xs">{report.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
