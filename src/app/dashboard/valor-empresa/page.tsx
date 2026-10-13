'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ProjectSelector from '@/components/ProjectSelector';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import { ValorEmpresaData } from '@/types/domain';
import { Building2, TrendingUp, BarChart2, Award } from 'lucide-react';

const ValorEmpresaCharts = dynamic(() => import('@/components/charts/ValorEmpresaCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-hidden="true">
      {[0, 1].map(i => (
        <div key={i} className="rounded-2xl h-[330px]" style={{ background: 'rgb(255 255 255 / 0.56)', border: '1px solid rgb(var(--line) / 0.30)' }} />
      ))}
    </div>
  ),
});
// Empieza a descargar los gráficos de inmediato, en paralelo con la carga de datos.
if (typeof window !== 'undefined') void import('@/components/charts/ValorEmpresaCharts');

const icons = [
  <Building2 size={22} key="b" />,
  <BarChart2 size={22} key="bc" />,
  <TrendingUp size={22} key="t" />,
  <Award size={22} key="a" />,
];

const indicadores = [
  { indicador: 'EV/EBITDA', valor: '4.4x', benchmark: '5.2x', estado: 'Óptimo' },
  { indicador: 'P/E Ratio', valor: '12.3x', benchmark: '14.1x', estado: 'Favorable' },
  { indicador: 'Deuda/EBITDA', valor: '1.8x', benchmark: '2.5x', estado: 'Saludable' },
  { indicador: 'ROE', valor: '22.7%', benchmark: '18.0%', estado: 'Superior' },
  { indicador: 'ROCE', valor: '19.4%', benchmark: '15.5%', estado: 'Superior' },
];

export default function ValorEmpresaPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('proj-001');
  const [data, setData] = useState<ValorEmpresaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/valor-empresa?proyecto=${proyecto}`)
      .then(res => res.json())
      .then(res => setData(res.data || null))
      .finally(() => setLoading(false));
  }, [proyecto]);

  const handleProyectoChange = (newProyecto: string) => {
    setProyecto(newProyecto);
    window.history.replaceState({}, '', `?proyecto=${newProyecto}`);
  };

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
  };

  if (!data && !loading) return null;

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Valor Empresa</h1>
          <p className="text-soft text-sm mt-1">Valuación empresarial, EBITDA e indicadores para accionistas</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      {/* Filters - Ahora arriba */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        showDateRange={false}
        showSearch={false}
        showStatus={false}
        showType={false}
      />

      <div className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        {(data?.metrics || []).map((m, i) => (
          <MetricCard key={m.label} label={m.label} value={m.value} trend={m.trend} up={m.up}
            color={m.color} icon={icons[i]} />
        ))}
      </div>

      <ValorEmpresaCharts data={data} loading={loading} />

      <div className="table-glass">
        <div className="px-6 py-4 border-b border-line/25">
          <h3 className="text-sm font-semibold text-ink">Indicadores Clave vs Benchmark</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Indicador', 'Valor Actual', 'Benchmark', 'Estado'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-soft uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indicadores.map((ind, i) => (
                <tr key={i} className="">
                  <td className="px-6 py-3 font-medium text-soft">{ind.indicador}</td>
                  <td className="px-6 py-3 font-semibold text-ok-ink">{ind.valor}</td>
                  <td className="px-6 py-3 text-soft">{ind.benchmark}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      ind.estado === 'Óptimo' || ind.estado === 'Superior' ? 'bg-ok/15 text-ok-ink' :
                      ind.estado === 'Favorable' ? 'bg-brand/15 text-brand-deep' :
                      'bg-warn/15 text-warn-ink'
                    }`}>{ind.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
