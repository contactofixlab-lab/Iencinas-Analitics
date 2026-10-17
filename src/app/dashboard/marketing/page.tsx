'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import DashboardCanvas from '@/components/bi/DashboardCanvas';
import ProjectSelector from '@/components/ProjectSelector';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import { MarketingData } from '@/types/domain';
import { Users, Target, TrendingUp, DollarSign } from 'lucide-react';

const icons = [
  <Users size={22} key="users" />,
  <Target size={22} key="target" />,
  <TrendingUp size={22} key="trend" />,
  <DollarSign size={22} key="dollar" />,
];

export default function MarketingPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('proj-001');
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [filteredCanales, setFilteredCanales] = useState<any[]>([]);

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/marketing?proyecto=${proyecto}`)
      .then(res => res.json())
      .then(res => setData(res.data || null))
      .finally(() => setLoading(false));
  }, [proyecto]);

  const handleProyectoChange = (newProyecto: string) => {
    setProyecto(newProyecto);
    window.history.replaceState({}, '', `?proyecto=${newProyecto}`);
  };

  useEffect(() => {
    if (data?.canales) {
      let filtered = data.canales;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(c => c.canal.toLowerCase().includes(searchLower));
      }
      setFilteredCanales(filtered);
    }
  }, [data, filters]);

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
  };

  if (!data && !loading) return null;

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Marketing</h1>
          <p className="text-soft text-sm mt-1">Métricas de leads, campañas y ROI</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      {/* Filters - Ahora arriba */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        showDateRange={false}
        showSearch={true}
        showStatus={false}
        showType={false}
      />

      <div className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        {(data?.metrics || []).map((m, i) => (
          <MetricCard key={m.label} label={m.label} value={m.value} trend={m.trend} up={m.up}
            color={m.color} icon={icons[i]} />
        ))}
      </div>

      <DashboardCanvas modulo="marketing" ctx={{ proyecto }}/>

      <div className="table-glass">
        <div className="px-6 py-4 border-b border-line/25">
          <h3 className="text-sm font-semibold text-ink">Rendimiento por Canal ({filteredCanales.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Canal', 'Leads', 'Inversión', 'Costo/Lead', 'ROI'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-soft uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCanales.length > 0 ? filteredCanales.map((c, i) => {
                const cpl = c.inversion > 0 ? `$${Math.round(c.inversion / c.leads)}` : 'Orgánico';
                const roi = c.inversion > 0 ? `${Math.round((c.leads * 1000 / c.inversion) * 100)}%` : 'N/A';
                return (
                  <tr key={i} className="">
                    <td className="px-6 py-3 font-medium text-soft">{c.canal}</td>
                    <td className="px-6 py-3 text-soft">{c.leads}</td>
                    <td className="px-6 py-3 text-soft">{c.inversion > 0 ? `$${c.inversion.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-3 text-soft">{cpl}</td>
                    <td className="px-6 py-3">
                      <span className="text-ok-ink font-semibold">{roi}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-mute">
                    No hay canales que coincidan con la búsqueda
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
