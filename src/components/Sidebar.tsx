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
  Database,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  children: { label: string; path: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: <BarChart2 size={20} />,
    roles: ['finanzas', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/finanzas', icon: <FileText size={14} /> },
      { label: 'Reportes', path: '/dashboard/finanzas/reportes', icon: <FileText size={14} /> },
    ],
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: <ShoppingBag size={20} />,
    roles: ['comercial', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/comercial', icon: <FileText size={14} /> },
      { label: 'Reportes', path: '/dashboard/comercial/reportes', icon: <FileText size={14} /> },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Megaphone size={20} />,
    roles: ['marketing', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/marketing', icon: <FileText size={14} /> },
      { label: 'Reportes', path: '/dashboard/marketing/reportes', icon: <FileText size={14} /> },
    ],
  },
  {
    id: 'valor-empresa',
    label: 'Valor Empresa',
    icon: <TrendingUp size={20} />,
    roles: ['administrador'],
    children: [
      { label: 'General', path: '/dashboard/valor-empresa', icon: <FileText size={14} /> },
      { label: 'Reportes', path: '/dashboard/valor-empresa/reportes', icon: <FileText size={14} /> },
    ],
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: <Settings size={20} />,
    roles: ['administrador'],
    children: [
      { label: 'Usuarios', path: '/dashboard/admin', icon: <Users size={14} /> },
      { label: 'Permisos', path: '/dashboard/admin/permisos', icon: <ShieldCheck size={14} /> },
      { label: 'BBDD', path: '/dashboard/admin/bbdd', icon: <Database size={14} /> },
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>(() => {
    const current = navItems.find(item => item.children.some(c => pathname.startsWith(c.path)));
    return current ? [current.id] : [navItems[0]?.id];
  });

  const toggle = (id: string) => {
    setOpenItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const allowed = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-64 flex flex-col p-4 sticky self-start shrink-0 overflow-y-auto"
      style={{
        top: 96,
        margin: 16,
        maxHeight: 'calc(100vh - 112px)',
        borderRadius: 26,
        background: 'linear-gradient(180deg, rgba(13,24,40,0.82) 0%, rgba(10,18,32,0.86) 100%)',
        backdropFilter: 'blur(28px) saturate(150%)',
        WebkitBackdropFilter: 'blur(28px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 28px 70px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.14), 0 0 30px rgba(74,222,128,0.06)',
      }}
    >
      {/* Modules label */}
      <div className="px-3 pt-1 pb-3">
        <span className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.18em]">Módulos</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-1 pb-4 overflow-y-auto space-y-2">
        {allowed.map((item, idx) => {
          const isOpen = openItems.includes(item.id);
          const isActive = item.children.some(c => pathname === c.path || pathname.startsWith(c.path + '/'));

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(74,222,128,0.18), rgba(74,222,128,0.06))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  backdropFilter: 'blur(12px)',
                  border: isActive ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  boxShadow: isActive
                    ? '0 8px 24px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.15)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid place-items-center w-8 h-8 rounded-xl transition-all"
                    style={{
                      background: isActive ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#4ade80' : '#9ca3af',
                      boxShadow: isActive ? '0 0 16px rgba(74,222,128,0.3)' : 'none',
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                <motion.span animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} style={{ color: isActive ? '#4ade80' : '#6b7280' }} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden ml-5 mt-1.5"
                  >
                    <div className="space-y-1 border-l-2 pl-3" style={{ borderColor: 'rgba(74,222,128,0.25)' }}>
                      {item.children.map(child => {
                        const childActive = pathname === child.path;
                        return (
                          <Link
                            key={child.path}
                            href={child.path}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                            style={{
                              background: childActive ? 'rgba(74, 222, 128, 0.15)' : 'transparent',
                              color: childActive ? '#4ade80' : '#cbd5e1',
                              fontWeight: childActive ? 600 : 400,
                              border: childActive ? '1px solid rgba(74,222,128,0.25)' : '1px solid transparent',
                            }}
                            onMouseEnter={e => { if (!childActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { if (!childActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                          >
                            {child.icon}
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3.5 rounded-2xl mt-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <p className="text-gray-400 text-xs text-center font-medium">© 2026 Iencinas Analytics</p>
      </div>
    </motion.aside>
  );
}
