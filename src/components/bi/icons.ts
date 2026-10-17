import {
  Activity, AreaChart, BarChart3, BarChart4, BarChartBig, BarChartHorizontal, Blocks, CircleDot, Donut, Filter, Gauge, Grid3x3,
  Hash, Layers, LineChart, PieChart, Radar, Rows3, ScatterChart, Table, Target, Waves, type LucideIcon,
} from 'lucide-react';
import type { ChartType } from '@/lib/bi/types';

export const CHART_ICONS: Record<ChartType, LucideIcon> = {
  bar: BarChart3,
  barH: BarChartHorizontal,
  barStacked: BarChartBig,
  barStacked100: BarChart4,
  barHStacked: Rows3,
  line: LineChart,
  area: AreaChart,
  areaStacked: Layers,
  combo: Activity,
  pie: PieChart,
  donut: Donut,
  treemap: Blocks,
  funnel: Filter,
  waterfall: Waves,
  scatter: ScatterChart,
  bubble: CircleDot,
  heatmap: Grid3x3,
  kpi: Hash,
  gauge: Gauge,
  radialBar: Target,
  radar: Radar,
  table: Table,
};
