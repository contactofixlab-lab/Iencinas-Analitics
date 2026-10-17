import type { UserRole } from '@/types';

/**
 * Quién puede usar el Diseñador (crear, editar, publicar, desactivar y eliminar gráficos, y reorganizar la vista de los módulos).
 * Los gráficos publicados los ve cualquier persona con acceso al módulo donde se publican.
 * Para dar acceso a otro perfil basta con agregarlo aquí: el menú, las páginas y la API lo respetan.
 */
export const DESIGNER_ROLES: UserRole[] = ['administrador'];

export const canDesign = (role: UserRole | undefined): boolean => !!role && DESIGNER_ROLES.includes(role);
