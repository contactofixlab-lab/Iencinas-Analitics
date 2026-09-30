export type UserRole = 'finanzas' | 'comercial' | 'marketing' | 'administrador';

/** Usuario tal como lo ve el navegador. Nunca incluye contraseña ni hash. */
export interface User {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  role: UserRole;
  departamento: string;
  permissions?: string[];
  proyectos?: string[]; // IDs de proyectos asignados al usuario
  createdAt: string;
}

/** Datos que el administrador envía para crear un usuario. */
export type NewUserInput = Omit<User, 'id' | 'createdAt' | 'permissions'> & {
  password: string;
};

export interface Module {
  id: string;
  label: string;
  path: string;
  allowedRoles: UserRole[];
}
