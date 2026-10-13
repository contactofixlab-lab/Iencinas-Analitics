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
  FileText,
  Database,
  Users,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  children: { label: string; path: string; icon: React.ReactNode }[];
}

const ic = { strokeWidth: 1.8 };

const navItems: NavItem[] = [
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: <BarChart2 size={19} {...ic} />,
    roles: ['finanzas', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/finanzas', icon: <FileText size={15} {...ic} /> },
      { label: 'Reportes', path: '/dashboard/finanzas/reportes', icon: <FileText size={15} {...ic} /> },
    ],
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: <ShoppingBag size={19} {...ic} />,
    roles: ['comercial', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/comercial', icon: <FileText size={15} {...ic} /> },
      { label: 'Reportes', path: '/dashboard/comercial/reportes', icon: <FileText size={15} {...ic} /> },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Megaphone size={19} {...ic} />,
    roles: ['marketing', 'administrador'],
    children: [
      { label: 'General', path: '/dashboard/marketing', icon: <FileText size={15} {...ic} /> },
      { label: 'Reportes', path: '/dashboard/marketing/reportes', icon: <FileText size={15} {...ic} /> },
    ],
  },
  {
    id: 'valor-empresa',
    label: 'Valor Empresa',
    icon: <TrendingUp size={19} {...ic} />,
    roles: ['administrador'],
    children: [
      { label: 'General', path: '/dashboard/valor-empresa', icon: <FileText size={15} {...ic} /> },
      { label: 'Reportes', path: '/dashboard/valor-empresa/reportes', icon: <FileText size={15} {...ic} /> },
    ],
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: <Settings size={19} {...ic} />,
    roles: ['administrador'],
    children: [
      { label: 'Usuarios', path: '/dashboard/admin', icon: <Users size={15} {...ic} /> },
      { label: 'Permisos', path: '/dashboard/admin/permisos', icon: <ShieldCheck size={15} {...ic} /> },
      { label: 'BBDD', path: '/dashboard/admin/bbdd', icon: <Database size={15} {...ic} /> },
      { label: 'Auditoría', path: '/dashboard/admin/auditoria', icon: <ClipboardList size={15} {...ic} /> },
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

  const [mobileOpen, setMobileOpen] = useState(false);

  // El botón de menú de la barra superior abre/cierra el cajón en pantallas pequeñas.
  useEffect(() => {
    const toggleMenu = () => setMobileOpen(o => !o);
    window.addEventListener('iencinas:toggle-menu', toggleMenu);
    return () => window.removeEventListener('iencinas:toggle-menu', toggleMenu);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const allowed = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
    {mobileOpen && (
      <div className="lg:hidden fixed inset-0 z-[55] modal-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
    )}
    <aside
      aria-label="Menú principal"
      className={`glass-nav w-64 flex flex-col p-4 sticky self-start shrink-0 overflow-y-auto
        max-lg:fixed max-lg:!top-3 max-lg:!left-3 max-lg:!bottom-3 max-lg:z-[60] max-lg:!m-0 max-lg:!max-h-none max-lg:w-72
        max-lg:transition-transform max-lg:duration-300
        ${mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-[120%]'}`}
      style={{ top: 96, margin: 16, maxHeight: 'calc(100vh - 112px)', borderRadius: 'var(--r-panel)', animation: 'fadeIn 0.5s ease both' }}
    >
      <div className="px-3 pt-1 pb-3">
        <span className="text-mute text-[11px] font-bold uppercase tracking-[0.18em]">Módulos</span>
      </div>

      <nav className="flex-1 px-1 pb-4 overflow-y-auto space-y-1.5">
        {allowed.map((item, idx) => {
          const isOpen = openItems.includes(item.id);
          const isActive = item.children.some(c => pathname === c.path || pathname.startsWith(c.path + '/'));

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 + idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium cursor-pointer"
                style={{
                  background: isActive ? 'rgb(var(--brand-soft) / 0.85)' : 'transparent',
                  color: isActive ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink-2))',
                  border: isActive ? '1px solid rgb(255 255 255 / 0.9)' : '1px solid transparent',
                  boxShadow: isActive ? 'var(--shadow-sm), var(--inner-sheen)' : 'none',
                  transition: 'background var(--t), color var(--t), box-shadow var(--t)',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgb(var(--brand-soft) / 0.5)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid place-items-center w-9 h-9 rounded-xl"
                    style={{
                      background: isActive ? 'rgb(255 255 255 / 0.85)' : 'rgb(255 255 255 / 0.5)',
                      color: isActive ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink-2))',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                <motion.span animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} strokeWidth={1.8} style={{ color: isActive ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink-3))' }} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden ml-5 mt-1"
                  >
                    <div className="space-y-0.5 border-l-2 pl-3" style={{ borderColor: 'rgb(var(--line) / 0.35)' }}>
                      {item.children.map(child => {
                        const childActive = pathname === child.path;
                        return (
                          <Link
                            key={child.path}
                            href={child.path}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm"
                            style={{
                              background: childActive ? 'rgb(var(--brand) / 0.28)' : 'transparent',
                              color: childActive ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink-2))',
                              fontWeight: childActive ? 600 : 400,
                              transition: 'background var(--t), color var(--t)',
                            }}
                            onMouseEnter={e => { if (!childActive) (e.currentTarget as HTMLElement).style.background = 'rgb(var(--brand-soft) / 0.6)'; }}
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

      <div
        className="px-4 py-3 rounded-2xl mt-auto"
        style={{ background: 'rgb(255 255 255 / 0.55)', border: '1px solid rgb(255 255 255 / 0.85)' }}
      >
        <p className="text-mute text-xs text-center font-medium">© 2026 Iencinas Analytics</p>
      </div>
    </aside>
    </>
  );
}
