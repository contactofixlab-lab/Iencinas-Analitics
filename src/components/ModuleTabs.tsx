'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moduleForPath, sectionForPath } from '@/lib/nav';
import { useAuth } from '@/context/AuthContext';

/** Pestañas de sección dentro de un módulo (Resumen · Reportes, o Usuarios · Permisos · BBDD · Auditoría). */
export default function ModuleTabs() {
  const pathname = usePathname();
  const { user } = useAuth();
  const mod = moduleForPath(pathname);
  if (!mod || !user || !mod.roles.includes(user.role) || mod.sections.length < 2) return null;
  const active = sectionForPath(mod, pathname);

  return (
    <nav aria-label={`Secciones de ${mod.label}`} className="mb-6">
      <div
        className="inline-flex max-w-full overflow-x-auto gap-1 p-1.5 rounded-full"
        style={{
          background: 'rgb(255 255 255 / 0.34)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm), var(--inner-sheen)',
          WebkitBackdropFilter: 'blur(var(--blur-sm))',
          backdropFilter: 'blur(var(--blur-sm))',
        }}
      >
        {mod.sections.map(s => {
          const isActive = active?.path === s.path;
          const Icon = s.icon;
          return (
            <Link
              key={s.path}
              href={s.path}
              aria-current={isActive ? 'page' : undefined}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap"
              style={{
                background: isActive ? 'rgb(255 255 255 / 0.85)' : 'transparent',
                color: isActive ? 'rgb(var(--brand-deep))' : 'rgb(var(--ink-2))',
                fontWeight: isActive ? 600 : 500,
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                transition: 'background var(--t), color var(--t)',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgb(var(--brand-soft) / 0.55)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Icon size={15} strokeWidth={1.8} />
              {s.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
