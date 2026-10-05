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
        <div key={i} className="rounded-2xl h-[330px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
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
          <h1 className="text-3xl font-bold text-white">Valor Empresa</h1>
          <p className="text-gray-400 text-sm mt-1">Valuación empresarial, EBITDA e indicadores para accionistas</p>
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

      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}>
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Indicadores Clave vs Benchmark</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {['Indicador', 'Valor Actual', 'Benchmark', 'Estado'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {indicadores.map((ind, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-300">{ind.indicador}</td>
                  <td className="px-6 py-3 font-semibold text-green-400">{ind.valor}</td>
                  <td className="px-6 py-3 text-gray-400">{ind.benchmark}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      ind.estado === 'Óptimo' || ind.estado === 'Superior' ? 'bg-green-500/20 text-green-400' :
                      ind.estado === 'Favorable' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
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
