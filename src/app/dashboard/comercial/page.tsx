'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ProjectSelector from '@/components/ProjectSelector';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import { ComercialData } from '@/types/domain';
import { Home, TrendingUp, Package, Star } from 'lucide-react';

const ComercialCharts = dynamic(() => import('@/components/charts/ComercialCharts'), {
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
if (typeof window !== 'undefined') void import('@/components/charts/ComercialCharts');

const icons = [
  <Home size={22} key="home" />,
  <TrendingUp size={22} key="trend" />,
  <Package size={22} key="pkg" />,
  <Star size={22} key="star" />,
];

const propiedades = [
  { direccion: 'Av. Las Condes 4520, Dpto 12B', tipo: 'Departamento', valor: '$320,000', estado: 'Vendida', vendedor: 'Pedro Muñoz' },
  { direccion: 'Los Militares 6040, Casa 3', tipo: 'Casa', valor: '$580,000', estado: 'En proceso', vendedor: 'Carla Ruiz' },
  { direccion: 'Vitacura 3200, Loft 8A', tipo: 'Loft', valor: '$210,000', estado: 'Vendida', vendedor: 'José Arenas' },
  { direccion: 'Lo Barnechea Sur 1140', tipo: 'Casa', valor: '$480,000', estado: 'Vendida', vendedor: 'Pedro Muñoz' },
  { direccion: 'Nueva Costanera 3700, Dpto 5', tipo: 'Departamento', valor: '$290,000', estado: 'Disponible', vendedor: 'Carla Ruiz' },
];


export default function ComercialPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('proj-001');
  const [data, setData] = useState<ComercialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [filteredPropiedades, setFilteredPropiedades] = useState(propiedades);

  useEffect(() => {
    const urlProyecto = searchParams.get('proyecto');
    if (urlProyecto) setProyecto(urlProyecto);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comercial?proyecto=${proyecto}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(res => setData(res.data || null))
      .catch(err => {
        console.error('Error fetching comercial:', err);
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
    let filtered = propiedades;

    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.direccion.toLowerCase().includes(searchLower) ||
        p.vendedor.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.status && newFilters.status !== '') {
      filtered = filtered.filter(p => p.estado === newFilters.status);
    }

    if (newFilters.type && newFilters.type !== '') {
      filtered = filtered.filter(p => p.tipo === newFilters.type);
    }

    setFilteredPropiedades(filtered);
  };

  if (!data && !loading) return null;

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Comercial</h1>
          <p className="text-soft text-sm mt-1">Métricas de ventas y cartera de propiedades</p>
        </div>
        <ProjectSelector value={proyecto} onChange={handleProyectoChange} />
      </div>

      {/* Filters - Ahora arriba */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        showDateRange={false}
        showSearch={true}
        showStatus={true}
        showType={true}
        statusOptions={[
          { label: 'Vendida', value: 'Vendida' },
          { label: 'En proceso', value: 'En proceso' },
          { label: 'Disponible', value: 'Disponible' },
        ]}
        typeOptions={[
          { label: 'Departamento', value: 'Departamento' },
          { label: 'Casa', value: 'Casa' },
          { label: 'Loft', value: 'Loft' },
        ]}
        statusLabel="Estado"
        typeLabel="Tipo de Propiedad"
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

      <ComercialCharts data={data} loading={loading} />

      <div className="table-glass">
        <div className="px-6 py-4 border-b border-line/25">
          <h3 className="text-sm font-semibold text-ink">Propiedades ({filteredPropiedades.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Dirección', 'Tipo', 'Valor', 'Estado', 'Vendedor'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-soft uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPropiedades.length > 0 ? filteredPropiedades.map((p, i) => (
                <tr key={i} className="">
                  <td className="px-6 py-3 text-soft font-medium">{p.direccion}</td>
                  <td className="px-6 py-3 text-soft">{p.tipo}</td>
                  <td className="px-6 py-3 font-semibold text-ok-ink">{p.valor}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      p.estado === 'Vendida' ? 'bg-ok/15 text-ok-ink' :
                      p.estado === 'En proceso' ? 'bg-warn/15 text-warn-ink' :
                      'bg-line/20 text-soft'
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-soft">{p.vendedor}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-mute">
                    No hay propiedades que coincidan con los filtros
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
