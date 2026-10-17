'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ProjectSelector from '@/components/ProjectSelector';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import { useFiltros } from '@/lib/filtros-client';
import { FinanzasData, Metric } from '@/types/domain';
import { BarChart2, DollarSign, TrendingUp, Wallet } from 'lucide-react';

const FinanzasCharts = dynamic(() => import('@/components/charts/FinanzasCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-hidden="true">
      {[0, 1].map(i => (
        <div key={i} className="rounded-2xl h-[330px]" style={{ background: 'rgb(255 255 255 / 0.32)', border: '1px solid rgb(var(--line) / 0.30)' }} />
      ))}
    </div>
  ),
});
// Empieza a descargar los gráficos de inmediato, en paralelo con la carga de datos.
if (typeof window !== 'undefined') void import('@/components/charts/FinanzasCharts');

const icons = [
  <DollarSign size={22} key="dollar" />,
  <Wallet size={22} key="wallet" />,
  <TrendingUp size={22} key="trend" />,
  <BarChart2 size={22} key="bar" />,
];

const transacciones = [
  { id: 'T001', concepto: 'Venta Departamento Las Condes', tipo: 'Ingreso', monto: '$320,000', fecha: '2026-06-10' },
  { id: 'T002', concepto: 'Comisiones vendedores Q2', tipo: 'Egreso', monto: '$48,000', fecha: '2026-06-09' },
  { id: 'T003', concepto: 'Venta Casa Lo Barnechea', tipo: 'Ingreso', monto: '$480,000', fecha: '2026-06-08' },
  { id: 'T004', concepto: 'Marketing campaña digital', tipo: 'Egreso', monto: '$15,000', fecha: '2026-06-07' },
  { id: 'T005', concepto: 'Arriendo oficinas Providencia', tipo: 'Egreso', monto: '$8,500', fecha: '2026-06-06' },
  { id: 'T006', concepto: 'Venta Loft Vitacura', tipo: 'Ingreso', monto: '$210,000', fecha: '2026-06-05' },
];

export default function FinanzasPage() {
  const searchParams = useSearchParams();
  const { opciones } = useFiltros();
  const [proyecto, setProyecto] = useState('proj-001');
  const [data, setData] = useState<FinanzasData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [filteredTransacciones, setFilteredTransacciones] = useState(transacciones);

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/finanzas?proyecto=${proyecto}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(res => setData(res.data || null))
      .catch(err => {
        console.error('Error fetching finanzas:', err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [proyecto]);

  const handleProyectoChange = (newProyecto: string) => {
    setProyecto(newProyecto);
    window.history.replaceState({}, '', `?proyecto=${newProyecto}`);
  };

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
    let filtered = transacciones;

    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.concepto.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.status && newFilters.status !== '') {
      filtered = filtered.filter(t => t.tipo === newFilters.status);
    }

    if (newFilters.dateRange) {
      const dateRange = newFilters.dateRange;
      filtered = filtered.filter(t => {
        const fecha = new Date(t.fecha);
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);
        return fecha >= from && fecha <= to;
      });
    }

    setFilteredTransacciones(filtered);
  };

  if (!data && !loading) return null;

  const combined = (data?.ingresos || []).map((d, i) => {
    const gastoValue = (Array.isArray(data?.gastos) && data.gastos[i]) ? data.gastos[i].valor : 0;
    return {
      mes: d.mes,
      ingresos: d.valor / 1000000,
      gastos: gastoValue / 1000000,
    };
  });

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Finanzas</h1>
          <p className="text-soft text-sm mt-1">Resumen financiero del período actual</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      {/* Filters - Ahora arriba */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        showDateRange={true}
        showSearch={true}
        showStatus={true}
        statusOptions={opciones('tipo_transaccion')}
        statusLabel="Tipo de Transacción"
      />

      <div className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        {(data?.metrics || []).map((m, i) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            trend={m.trend}
            up={m.up}
            color={m.color}
            icon={icons[i]}
          />
        ))}
      </div>

      <FinanzasCharts data={data} loading={loading} combined={combined} />

      <div className="table-glass">
        <div className="px-6 py-4 border-b border-line/25">
          <h3 className="text-sm font-semibold text-ink">Últimas Transacciones ({filteredTransacciones.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['ID', 'Concepto', 'Tipo', 'Monto', 'Fecha'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-soft uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTransacciones.length > 0 ? filteredTransacciones.map(t => (
                <tr key={t.id} className="">
                  <td className="px-6 py-3 font-mono text-mute text-xs">{t.id}</td>
                  <td className="px-6 py-3 text-soft font-medium">{t.concepto}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${t.tipo === 'Ingreso' ? 'bg-ok/15 text-ok-ink' : 'bg-danger/15 text-danger-ink'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className={`px-6 py-3 font-semibold ${t.tipo === 'Ingreso' ? 'text-ok-ink' : 'text-danger-ink'}`}>{t.monto}</td>
                  <td className="px-6 py-3 text-mute">{t.fecha}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-mute">
                    No hay transacciones que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
