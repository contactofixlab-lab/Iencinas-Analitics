export type UserRole = 'finanzas' | 'comercial' | 'marketing' | 'administrador';

export interface User {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  password: string;
  role: UserRole;
  departamento: string;
  permissions?: string[];
  proyectos?: string[]; // IDs de proyectos asignados al usuario
  createdAt: string;
}

export interface Module {
  id: string;
  label: string;
  path: string;
  allowedRoles: UserRole[];
}
