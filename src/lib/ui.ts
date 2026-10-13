import { UserRole } from '@/types';

/** Estilos de rol compartidos (colores pastel, coherentes con el sistema de vidrio). */
export const ROLE_LABELS: Record<UserRole, string> = {
  finanzas: 'Gerente de Finanzas',
  comercial: 'Director Comercial',
  marketing: 'Jefe de Marketing',
  administrador: 'Administrador',
};

export const ROLE_SHORT: Record<UserRole, string> = {
  finanzas: 'Finanzas',
  comercial: 'Comercial',
  marketing: 'Marketing',
  administrador: 'Administrador',
};

export const ROLE_AVATAR: Record<UserRole, string> = {
  finanzas: 'linear-gradient(135deg, #9CC4E8 0%, #6FA0D2 100%)',
  comercial: 'linear-gradient(135deg, #F5C9A3 0%, #E4A67C 100%)',
  marketing: 'linear-gradient(135deg, #C3B3EA 0%, #9D89D8 100%)',
  administrador: 'linear-gradient(135deg, #98D3BA 0%, #6DB899 100%)',
};

export const ROLE_CHIP: Record<UserRole, string> = {
  finanzas: 'chip chip-info',
  comercial: 'chip chip-warn',
  marketing: 'chip chip-violet',
  administrador: 'chip chip-ok',
};
