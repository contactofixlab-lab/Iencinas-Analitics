'use client';

import { useEffect, useState } from 'react';
import { ConstructoraData, ReportInfo } from '@/types/domain';
import { Download, FileText, Info } from 'lucide-react';

function toCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return '';
  const cols = Object.keys(rows[0]);
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [cols.map(esc).join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\r\n');
}

export default function ConstructoraReportesPage() {
  const [data, setData] = useState<ConstructoraData | null>(null);
  const [catalogo, setCatalogo] = useState<ReportInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/constructora', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch('/api/reportes/constructora', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
    ])
      .then(([d, c]) => { setData(d.data || null); setCatalogo(Array.isArray(c.data) ? c.data : []); })
      .catch(() => setError('No se pudieron cargar los reportes de la constructora.'))
      .finally(() => setLoading(false));
  }, []);

  function download() {
    const rows = (data?.obras ?? []).map(o => ({
      Obra: o.obra, Estado: o.estado, 'Avance real %': o.avanceReal, 'Avance plan %': o.avancePlan, SPI: o.spi, CPI: o.cpi,
      'Presupuesto MM$': o.presupuesto, 'Costo real MM$': o.costoReal, 'OC pendientes': o.ocPendientes, 'Incidencias abiertas': o.incidenciasAbiertas,
    }));
    const blob = new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `constructora-estado-por-obra-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Reportes — Constructora</h1>
          <p className="text-soft text-sm mt-1">Catálogo de reportes de obra y descarga del estado por obra</p>
        </div>
        <button type="button" onClick={download} disabled={loading || !data?.obras.length} className="btn btn-primary shrink-0">
          <Download size={17} strokeWidth={1.8} />
          Descargar estado por obra (CSV)
        </button>
      </div>

      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm">{error}</p>}

      <span className="chip chip-info"><Info size={14} strokeWidth={2} />Datos de demostración · se conectarán a Control de Obra</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? [0, 1, 2, 3].map(i => <div key={i} className="skeleton h-28" />)
          : catalogo.map(r => (
            <div key={r.id} className="glass-card glass-card--compact flex items-start gap-4" style={{ padding: 'var(--pad-card)' }}>
              <div className="icon-orb shrink-0"><FileText size={20} strokeWidth={1.7} /></div>
              <div className="min-w-0">
                <h3 className="font-semibold text-ink">{r.nombre}</h3>
                <p className="text-sm text-soft mt-1">{r.descripcion}</p>
                <p className="mt-3 flex items-center gap-2">
                  <span className="chip chip-neutral">{r.tipo}</span>
                  <span className="text-xs text-mute">Actualizado {r.fecha}</span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
