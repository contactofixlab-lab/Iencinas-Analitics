'use client';

import AdvancedReportBuilder from '@/components/AdvancedReportBuilder';
import PrebuiltReports from '@/components/PrebuiltReports';

export default function GeneralReportesPage() {
  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-ink">Reportes — General</h1>
        <p className="text-soft text-sm mt-1">Reportes de toda la empresa: combina atributos de proyectos, transacciones, ventas y leads</p>
      </div>

      <AdvancedReportBuilder />

      <PrebuiltReports onSelectReport={() => { /* los reportes prehechos se conectarán con el CRM */ }} />
    </div>
  );
}
