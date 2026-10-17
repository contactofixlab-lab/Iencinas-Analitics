import {
  LayoutDashboard,
  BarChart2,
  ShoppingBag,
  Megaphone,
  HardHat,
  Settings,
  FileText,
  PieChart,
  Users,
  ShieldCheck,
  Database,
  ClipboardList,
  SlidersHorizontal,
  PencilRuler,
  LayoutGrid,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '@/types';
import { DESIGNER_ROLES } from '@/lib/bi/permissions';

/**
 * Fuente única de la navegación: la leen el menú lateral (solo íconos),
 * las pestañas de sección dentro de cada módulo y el título de la barra superior.
 */
export interface NavSection {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavModule {
  id: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  sections: NavSection[];
}

export const NAV_MODULES: NavModule[] = [
  {
    id: 'general',
    label: 'General',
    icon: LayoutDashboard,
    roles: ['administrador'],
    sections: [
      { label: 'Resumen', path: '/dashboard/general', icon: PieChart },
      { label: 'Reportes', path: '/dashboard/general/reportes', icon: FileText },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: BarChart2,
    roles: ['finanzas', 'administrador'],
    sections: [
      { label: 'Resumen', path: '/dashboard/finanzas', icon: PieChart },
      { label: 'Reportes', path: '/dashboard/finanzas/reportes', icon: FileText },
    ],
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: ShoppingBag,
    roles: ['comercial', 'administrador'],
    sections: [
      { label: 'Resumen', path: '/dashboard/comercial', icon: PieChart },
      { label: 'Reportes', path: '/dashboard/comercial/reportes', icon: FileText },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    roles: ['marketing', 'administrador'],
    sections: [
      { label: 'Resumen', path: '/dashboard/marketing', icon: PieChart },
      { label: 'Reportes', path: '/dashboard/marketing/reportes', icon: FileText },
    ],
  },
  {
    id: 'constructora',
    label: 'Constructora',
    icon: HardHat,
    roles: ['administrador'],
    sections: [
      { label: 'Resumen', path: '/dashboard/constructora', icon: PieChart },
      { label: 'Reportes', path: '/dashboard/constructora/reportes', icon: FileText },
    ],
  },
  {
    id: 'disenador',
    label: 'Diseñador',
    icon: PencilRuler,
    roles: DESIGNER_ROLES,
    sections: [
      { label: 'Gráficos', path: '/dashboard/disenador', icon: LayoutGrid },
      { label: 'Nuevo gráfico', path: '/dashboard/disenador/nuevo', icon: Plus },
      { label: 'Fuentes de datos', path: '/dashboard/disenador/fuentes', icon: Database },
    ],
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: Settings,
    roles: ['administrador'],
    sections: [
      { label: 'Usuarios', path: '/dashboard/admin', icon: Users },
      { label: 'Permisos', path: '/dashboard/admin/permisos', icon: ShieldCheck },
      { label: 'Filtros', path: '/dashboard/admin/filtros', icon: SlidersHorizontal },
      { label: 'BBDD', path: '/dashboard/admin/bbdd', icon: Database },
      { label: 'Auditoría', path: '/dashboard/admin/auditoria', icon: ClipboardList },
    ],
  },
];

export function modulesForRole(role: UserRole | undefined): NavModule[] {
  if (!role) return [];
  return NAV_MODULES.filter(m => m.roles.includes(role));
}

/** Módulo al que pertenece la ruta (por prefijo de sus secciones; gana el más específico). */
export function moduleForPath(pathname: string): NavModule | null {
  let best: { mod: NavModule; len: number } | null = null;
  for (const mod of NAV_MODULES) {
    for (const s of mod.sections) {
      if ((pathname === s.path || pathname.startsWith(s.path + '/')) && (!best || s.path.length > best.len)) {
        best = { mod, len: s.path.length };
      }
    }
  }
  return best ? best.mod : null;
}

/** Sección activa dentro de un módulo (la ruta más específica que coincide). */
export function sectionForPath(mod: NavModule, pathname: string): NavSection | null {
  let best: NavSection | null = null;
  for (const s of mod.sections) {
    if ((pathname === s.path || pathname.startsWith(s.path + '/')) && (!best || s.path.length > best.path.length)) best = s;
  }
  return best;
}
