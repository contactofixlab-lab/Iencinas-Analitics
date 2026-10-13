'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';
import { modulesForRole, moduleForPath, sectionForPath } from '@/lib/nav';

/**
 * Menú lateral:
 *  · Escritorio (lg+): columna alta y angosta, solo íconos. Cada ícono lleva al módulo; las
 *    subsecciones (Resumen, Reportes, …) se eligen con las pestañas dentro del módulo.
 *  · Móvil: cajón con los módulos y sus secciones (se abre con el botón de la barra superior).
 */
export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const toggleMenu = () => setMobileOpen(o => !o);
    window.addEventListener('iencinas:toggle-menu', toggleMenu);
    return () => window.removeEventListener('iencinas:toggle-menu', toggleMenu);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const modules = modulesForRole(user?.role);
  const current = moduleForPath(pathname);

  return (
    <>
      {/* ───────── Escritorio: columna de íconos ───────── */}
      <aside
        aria-label="Menú principal"
        className="glass-nav hidden lg:flex fixed left-4 top-4 bottom-4 z-[45] w-[76px] flex-col items-center py-4"
        style={{ borderRadius: 'var(--r-panel)' }}
      >
        <Link
          href={modules[0]?.sections[0].path ?? '/dashboard'}
          aria-label="Inicio"
          className="grid place-items-center w-12 h-12 rounded-2xl shrink-0"
          style={{ background: 'rgb(255 255 255 / 0.55)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm), var(--inner-sheen)' }}
        >
          <img src="/logo.svg" alt="Iencinas Analytics" className="w-8 h-8" />
        </Link>

        <span aria-hidden="true" className="w-8 h-px my-4" style={{ background: 'rgb(var(--line) / 0.40)' }} />

        <nav className="flex flex-col items-center gap-2.5">
          {modules.map(mod => {
            const active = current?.id === mod.id;
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="relative group">
                <Link
                  href={mod.sections[0].path}
                  aria-label={mod.label}
                  aria-current={active ? 'page' : undefined}
                  className="grid place-items-center w-12 h-12 rounded-2xl"
                  style={{
                    background: active ? 'rgb(var(--brand-soft) / 0.95)' : 'transparent',
                    color: active ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink-2))',
                    border: active ? '1px solid rgb(255 255 255 / 0.9)' : '1px solid transparent',
                    boxShadow: active ? 'var(--shadow-sm), var(--inner-sheen)' : 'none',
                    transition: 'background var(--t), color var(--t), box-shadow var(--t)',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgb(var(--brand-soft) / 0.55)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon size={22} strokeWidth={1.7} />
                </Link>
                {/* Etiqueta emergente */}
                <span
                  role="tooltip"
                  className="tooltip-glass pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-4 whitespace-nowrap text-xs font-semibold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-150"
                  style={{ padding: '7px 12px', borderRadius: 12 }}
                >
                  {mod.label}
                </span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ───────── Móvil: cajón ───────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] modal-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}
      <aside
        aria-label="Menú móvil"
        aria-hidden={!mobileOpen}
        className={`glass-nav lg:hidden fixed left-3 top-3 bottom-3 z-[60] w-72 flex flex-col p-4 overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
        style={{ borderRadius: 'var(--r-panel)', background: 'rgb(255 255 255 / 0.9)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-mute text-[11px] font-bold uppercase tracking-[0.18em] px-2">Módulos</span>
          <button type="button" aria-label="Cerrar menú" className="btn btn-ghost btn-icon !w-9 !h-9" onClick={() => setMobileOpen(false)}>
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>
        <nav className="space-y-4">
          {modules.map(mod => {
            const Icon = mod.icon;
            const active = current?.id === mod.id;
            const activeSection = sectionForPath(mod, pathname);
            return (
              <div key={mod.id}>
                <div className="flex items-center gap-3 px-2 mb-1.5" style={{ color: active ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink))' }}>
                  <Icon size={19} strokeWidth={1.7} />
                  <span className="text-sm font-semibold">{mod.label}</span>
                </div>
                <div className="ml-4 pl-4 space-y-0.5" style={{ borderLeft: '2px solid rgb(var(--line) / 0.35)' }}>
                  {mod.sections.map(s => {
                    const sActive = active && activeSection?.path === s.path;
                    const SIcon = s.icon;
                    return (
                      <Link
                        key={s.path}
                        href={s.path}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm"
                        style={{
                          background: sActive ? 'rgb(var(--brand) / 0.28)' : 'transparent',
                          color: sActive ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink-2))',
                          fontWeight: sActive ? 600 : 400,
                        }}
                      >
                        <SIcon size={15} strokeWidth={1.8} />
                        {s.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
