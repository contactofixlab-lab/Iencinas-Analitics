import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  color: 'green' | 'blue' | 'red' | 'purple' | 'orange';
  icon?: React.ReactNode;
}

const colorMap = {
  green: { gradient: 'from-green-400/20 to-green-500/10', icon: 'bg-green-500/20 text-green-400', border: 'border-green-400/20' },
  blue: { gradient: 'from-blue-400/20 to-blue-500/10', icon: 'bg-blue-500/20 text-blue-400', border: 'border-blue-400/20' },
  red: { gradient: 'from-red-400/20 to-red-500/10', icon: 'bg-red-500/20 text-red-400', border: 'border-red-400/20' },
  purple: { gradient: 'from-purple-400/20 to-purple-500/10', icon: 'bg-purple-500/20 text-purple-400', border: 'border-purple-400/20' },
  orange: { gradient: 'from-orange-400/20 to-orange-500/10', icon: 'bg-orange-500/20 text-orange-400', border: 'border-orange-400/20' },
};

export default function MetricCard({ label, value, trend, up, color, icon }: MetricCardProps) {
  const c = colorMap[color];
  return (
    <div className={`relative rounded-2xl p-6 overflow-hidden group transition-all duration-300 transform hover:scale-105`}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(74,222,128,0.05)',
      }}>
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Inner highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            <div className="flex items-center gap-1.5 mt-3">
              {up
                ? <TrendingUp size={14} className="text-green-400" />
                : <TrendingDown size={14} className="text-red-400" />
              }
              <span className={`text-xs font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>
                {trend}
              </span>
              <span className="text-xs text-gray-500 ml-0.5">vs mes anterior</span>
            </div>
          </div>
          {icon && (
            <div className={`p-3 rounded-xl ${c.icon} backdrop-blur-md`}
              style={{
                background: `rgba(255,255,255,0.08)`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}>
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* 3D effect border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(74,222,128,0.1), transparent 70%)`,
        }} />
    </div>
  );
}
