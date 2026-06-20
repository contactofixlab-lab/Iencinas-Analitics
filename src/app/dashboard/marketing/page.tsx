'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ProjectSelector from '@/components/ProjectSelector';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import ChartCard, { GlassTooltip } from '@/components/ChartCard';
import { MarketingData } from '@/types/domain';
import { Users, Target, TrendingUp, DollarSign } from 'lucide-react';
import {
  Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

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
          <h1 className="text-3xl font-bold text-white">Marketing</h1>
          <p className="text-gray-400 text-sm mt-1">Métricas de leads, campañas y ROI</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Leads Generados por Mes" subtitle="Tendencia mensual" accent="purple">
          {loading ? (
            <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data?.leads || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
                <Area type="monotone" dataKey="leads" stroke="#c084fc" strokeWidth={3} fill="url(#fillLeads)" name="Leads"
                  dot={false} activeDot={{ r: 6, fill: '#c084fc', stroke: '#0a1322', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Leads por Canal de Marketing" subtitle="Distribución por origen" accent="purple">
          {loading ? (
            <div className="h-60 flex items-center justify-center text-gray-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.canales || []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillCanales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="canal" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<GlassTooltip formatter={(v: number) => `Leads: ${v}`} />} />
                <Bar dataKey="leads" fill="url(#fillCanales)" radius={[8, 8, 0, 0]} name="Leads" maxBarSize={48} />
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
          <h3 className="text-sm font-semibold text-white">Rendimiento por Canal ({filteredCanales.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {['Canal', 'Leads', 'Inversión', 'Costo/Lead', 'ROI'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCanales.length > 0 ? filteredCanales.map((c, i) => {
                const cpl = c.inversion > 0 ? `$${Math.round(c.inversion / c.leads)}` : 'Orgánico';
                const roi = c.inversion > 0 ? `${Math.round((c.leads * 1000 / c.inversion) * 100)}%` : 'N/A';
                return (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-300">{c.canal}</td>
                    <td className="px-6 py-3 text-gray-400">{c.leads}</td>
                    <td className="px-6 py-3 text-gray-400">{c.inversion > 0 ? `$${c.inversion.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-3 text-gray-400">{cpl}</td>
                    <td className="px-6 py-3">
                      <span className="text-green-400 font-semibold">{roi}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
