'use client';

import { m as motion } from 'framer-motion';
import { FileText, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface PrebuiltReportsProps {
  accentColor?: { rgb: string; solid: string; text: string };
  onSelectReport?: (reportType: string) => void;
}

// Los acentos por tarjeta son pasteles: el color distingue el tipo de reporte sin competir con los datos
const reports = [
  { id: 'resumen',      title: 'Resumen Ejecutivo',            description: 'Vista general de métricas principales', icon: Activity,   tint: 'rgb(var(--brand) / 0.30)', fg: 'rgb(var(--brand-deep))' },
  { id: 'detalles',     title: 'Detalles Completos',           description: 'Todos los atributos y relaciones',     icon: FileText,   tint: 'rgb(52 140 104 / 0.16)',   fg: 'rgb(34 106 76)' },
  { id: 'tendencias',   title: 'Tendencias Temporales',        description: 'Análisis de evolución por período',    icon: TrendingUp, tint: 'rgb(150 128 214 / 0.20)',  fg: 'rgb(96 74 156)' },
  { id: 'comparativa',  title: 'Análisis Comparativo',         description: 'Comparación entre entidades',          icon: BarChart3,  tint: 'rgb(214 150 80 / 0.20)',   fg: 'rgb(150 90 24)' },
  { id: 'distribucion', title: 'Distribución & Proporciones',  description: 'Desglose porcentual de datos',         icon: PieChart,   tint: 'rgb(224 138 150 / 0.20)',  fg: 'rgb(160 52 64)' },
];

export default function PrebuiltReports({ onSelectReport }: PrebuiltReportsProps) {
  return (
    <div className="glass-card relative" style={{ padding: 'var(--pad-card)' }}>
      <div className="sheen" />
      <h3 className="text-ink font-semibold mb-6 flex items-center gap-2.5">
        <FileText size={18} strokeWidth={1.8} className="text-brand-deep" />
        Reportes Prehechos del Sistema
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <motion.button
              key={report.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectReport?.(report.id)}
              className="group glass-card glass-card--compact glass-card--interactive text-left"
              style={{ padding: 'var(--pad-card)' }}
            >
              <div
                className="w-11 h-11 rounded-full mb-3 flex items-center justify-center"
                style={{ background: report.tint, color: report.fg, border: '1px solid var(--glass-border)', boxShadow: 'var(--inner-sheen)' }}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h4 className="font-semibold text-ink text-sm mb-1">{report.title}</h4>
              <p className="text-soft text-xs">{report.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
