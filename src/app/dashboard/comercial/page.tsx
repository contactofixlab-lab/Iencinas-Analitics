'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ProjectSelector from '@/components/ProjectSelector';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { ComercialData } from '@/types/domain';
import { Home, TrendingUp, Package, Star } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

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

const COLORS = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac'];

export default function ComercialPage() {
  const searchParams = useSearchParams();
  const [proyecto, setProyecto] = useState('bosques-del-mar');
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
      .then(res => res.json())
      .then(res => setData(res.data))
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
          <h1 className="text-3xl font-bold text-white">Comercial</h1>
          <p className="text-gray-400 text-sm mt-1">Métricas de ventas y cartera de propiedades</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Propiedades Vendidas por Mes" subtitle="Unidades cerradas" accent="green">
          {loading ? (
            <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.ventas || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#15803d" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Ventas: ${v}`} />} />
                <Bar dataKey="ventas" fill="url(#fillVentas)" radius={[8, 8, 0, 0]} name="Ventas" maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Pipeline de Ventas" subtitle="Leads por etapa del embudo" accent="blue">
          {loading ? (
            <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.pipeline || []} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="etapa" type="category" tick={{ fontSize: 12, fill: '#9ca3af' }} width={100} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
                <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} name="Leads" maxBarSize={28}>
                  {(data?.pipeline || []).map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}>
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Propiedades ({filteredPropiedades.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {['Dirección', 'Tipo', 'Valor', 'Estado', 'Vendedor'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPropiedades.length > 0 ? filteredPropiedades.map((p, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3 text-gray-300 font-medium">{p.direccion}</td>
                  <td className="px-6 py-3 text-gray-400">{p.tipo}</td>
                  <td className="px-6 py-3 font-semibold text-green-400">{p.valor}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      p.estado === 'Vendida' ? 'bg-green-500/20 text-green-400' :
                      p.estado === 'En proceso' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{p.vendedor}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
