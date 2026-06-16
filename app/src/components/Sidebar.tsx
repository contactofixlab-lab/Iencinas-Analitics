'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart2,
  ShoppingBag,
  Megaphone,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Database,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  children: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: <BarChart2 size={20} />,
    roles: ['finanzas', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/finanzas' },
      { label: 'Reportes', path: '/dashboard/finanzas/reportes' },
    ],
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: <ShoppingBag size={20} />,
    roles: ['comercial', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/comercial' },
      { label: 'Reportes', path: '/dashboard/comercial/reportes' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Megaphone size={20} />,
    roles: ['marketing', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/marketing' },
      { label: 'Reportes', path: '/dashboard/marketing/reportes' },
    ],
  },
  {
    id: 'valor-empresa',
    label: 'Valor Empresa',
    icon: <TrendingUp size={20} />,
    roles: ['administrador'],
    children: [
      { label: 'General', path: '/dashboard/valor-empresa' },
      { label: 'Reportes', path: '/dashboard/valor-empresa/reportes' },
    ],
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: <Settings size={20} />,
    roles: ['administrador'],
    children: [
      { label: 'Usuarios', path: '/dashboard/admin' },
      { label: 'Permisos', path: '/dashboard/admin/permisos' },
      { label: 'BBDD', path: '/dashboard/admin/bbdd' },
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>(() => {
    const current = navItems.find(item =>
      item.children.some(c => pathname.startsWith(c.path))
    );
    return current ? [current.id] : [navItems[0]?.id];
  });

  const toggle = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const allowed = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="w-72 min-h-screen flex flex-col p-4" style={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      {/* Logo */}
      <div className="flex items-center justify-center py-2">
        <img src="/logo original color.png" alt="Iencinas" className="w-56 h-32 object-contain" />
      </div>

      {/* Modules label */}
      <div className="px-6 pt-5 pb-3">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Módulos</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-4 overflow-y-auto space-y-1.5">
        {allowed.map(item => {
          const isOpen = openItems.includes(item.id);
          const isActive = item.children.some(c => pathname === c.path || pathname.startsWith(c.path + '/'));

          return (
            <div key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  border: isActive
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#ffffff' : '#d1d5db',
                  boxShadow: isActive
                    ? '0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                }}
              >
                <span className="flex items-center gap-3">
                  <span style={{ color: isActive ? '#4ade80' : '#9ca3af' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {isOpen
                  ? <ChevronDown size={16} style={{ color: '#4ade80' }} />
                  : <ChevronRight size={16} style={{ color: '#6b7280' }} />
                }
              </button>

              {isOpen && (
                <div className="ml-4 mt-1.5 space-y-1 border-l border-gray-500/30 pl-3">
                  {item.children.map(child => {
                    const childActive = pathname === child.path;
                    return (
                      <Link
                        key={child.path}
                        href={child.path}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                        style={{
                          background: childActive
                            ? 'rgba(74, 222, 128, 0.15)'
                            : 'transparent',
                          color: childActive ? '#4ade80' : '#d1d5db',
                          fontWeight: childActive ? '600' : '400',
                        }}
                      >
                        <FileText size={14} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer glassmorphism */}
      <div className="px-4 py-4 rounded-xl mt-auto" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
      }}>
        <p className="text-gray-400 text-xs text-center">© 2026 Iencinas</p>
      </div>
    </aside>
  );
}
