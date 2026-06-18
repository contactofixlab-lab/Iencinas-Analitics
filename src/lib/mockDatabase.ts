/**
 * Base de datos de prototipo con datos realistas
 * Simula estructura relacional: Proyectos → Transacciones, Ventas, Leads, Valuaciones
 */

export interface Project {
  id: string;
  nombre: string;
  ubicacion: string;
  estado: 'activo' | 'inactivo' | 'completado';
  fechaInicio: string;
  fechaFin?: string;
}

export interface Transaction {
  id: string;
  proyectoId: string;
  concepto: string;
  tipo: 'Ingreso' | 'Egreso';
  monto: number;
  montoFormato: string;
  fecha: string;
  categoria?: string;
}

export interface Sale {
  id: string;
  proyectoId: string;
  propiedad: string;
  etapa: 'Prospección' | 'Negociación' | 'Oferta' | 'Cerrada' | 'Cancelada';
  cantidad: number;
  valor: number;
  valorFormato: string;
  fecha: string;
  clienteNombre?: string;
  comision?: number;
}

export interface Lead {
  id: string;
  proyectoId: string;
  nombre: string;
  email?: string;
  telefono?: string;
  canal: 'Web' | 'Email' | 'Redes Sociales' | 'Referencia' | 'Llamada Directa' | 'Evento';
  costo: number;
  costoFormato: string;
  estado: 'Nuevo' | 'En progreso' | 'Convertido' | 'Rechazado';
  fecha: string;
}

export interface Valuation {
  id: string;
  proyectoId: string;
  anio: number;
  valor: number;
  valorFormato: string;
  crecimiento: number;
  crecimientoFormato: string;
  fecha: string;
  metodologia?: string;
}

// ─────────────────────────────────────────────────────────────
// PROYECTOS
// ─────────────────────────────────────────────────────────────

export const PROYECTOS: Project[] = [
  {
    id: 'proj-001',
    nombre: 'Bosques del Mar',
    ubicacion: 'Punta Arenas, Región de Magallanes',
    estado: 'activo',
    fechaInicio: '2024-01-15',
  },
  {
    id: 'proj-002',
    nombre: 'Las Condes Park',
    ubicacion: 'Las Condes, Región Metropolitana',
    estado: 'activo',
    fechaInicio: '2023-06-01',
  },
  {
    id: 'proj-003',
    nombre: 'Lo Barnechea Villas Premium',
    ubicacion: 'Lo Barnechea, Región Metropolitana',
    estado: 'activo',
    fechaInicio: '2024-03-20',
  },
  {
    id: 'proj-004',
    nombre: 'Vitacura Residencial',
    ubicacion: 'Vitacura, Región Metropolitana',
    estado: 'completado',
    fechaInicio: '2022-01-10',
    fechaFin: '2025-12-15',
  },
  {
    id: 'proj-005',
    nombre: 'Ñuñoa Green',
    ubicacion: 'Ñuñoa, Región Metropolitana',
    estado: 'inactivo',
    fechaInicio: '2023-09-01',
  },
  {
    id: 'proj-006',
    nombre: 'Providencia Central Offices',
    ubicacion: 'Providencia, Región Metropolitana',
    estado: 'activo',
    fechaInicio: '2024-02-01',
  },
  {
    id: 'proj-007',
    nombre: 'Macul Residencial Moderna',
    ubicacion: 'Macul, Región Metropolitana',
    estado: 'activo',
    fechaInicio: '2023-11-10',
  },
  {
    id: 'proj-008',
    nombre: 'Peñalolén District Mixed',
    ubicacion: 'Peñalolén, Región Metropolitana',
    estado: 'activo',
    fechaInicio: '2024-05-15',
  },
];

// ─────────────────────────────────────────────────────────────
// TRANSACCIONES (Finanzas)
// ─────────────────────────────────────────────────────────────

export const TRANSACCIONES: Transaction[] = [
  // Bosques del Mar
  {
    id: 'trx-001',
    proyectoId: 'proj-001',
    concepto: 'Venta Departamento B-301',
    tipo: 'Ingreso',
    monto: 450000,
    montoFormato: '$450,000',
    fecha: '2026-06-15',
    categoria: 'Ventas',
  },
  {
    id: 'trx-002',
    proyectoId: 'proj-001',
    concepto: 'Comisión vendedores - Junio',
    tipo: 'Egreso',
    monto: 67500,
    montoFormato: '$67,500',
    fecha: '2026-06-20',
    categoria: 'Comisiones',
  },
  {
    id: 'trx-003',
    proyectoId: 'proj-001',
    concepto: 'Venta Casa A-102',
    tipo: 'Ingreso',
    monto: 850000,
    montoFormato: '$850,000',
    fecha: '2026-06-08',
    categoria: 'Ventas',
  },
  {
    id: 'trx-004',
    proyectoId: 'proj-001',
    concepto: 'Gastos operacionales - Junio',
    tipo: 'Egreso',
    monto: 125000,
    montoFormato: '$125,000',
    fecha: '2026-06-05',
    categoria: 'Operación',
  },

  // Las Condes Park
  {
    id: 'trx-005',
    proyectoId: 'proj-002',
    concepto: 'Venta Penthouse P-401',
    tipo: 'Ingreso',
    monto: 1200000,
    montoFormato: '$1,200,000',
    fecha: '2026-06-18',
    categoria: 'Ventas',
  },
  {
    id: 'trx-006',
    proyectoId: 'proj-002',
    concepto: 'Publicidad digital - Junio',
    tipo: 'Egreso',
    monto: 45000,
    montoFormato: '$45,000',
    fecha: '2026-06-10',
    categoria: 'Marketing',
  },
  {
    id: 'trx-007',
    proyectoId: 'proj-002',
    concepto: 'Venta Departamento C-205',
    tipo: 'Ingreso',
    monto: 580000,
    montoFormato: '$580,000',
    fecha: '2026-06-03',
    categoria: 'Ventas',
  },

  // Lo Barnechea Villas Premium
  {
    id: 'trx-008',
    proyectoId: 'proj-003',
    concepto: 'Venta Villa Ejecutiva V-01',
    tipo: 'Ingreso',
    monto: 2100000,
    montoFormato: '$2,100,000',
    fecha: '2026-06-12',
    categoria: 'Ventas',
  },
  {
    id: 'trx-009',
    proyectoId: 'proj-003',
    concepto: 'Comisión arquitecto',
    tipo: 'Egreso',
    monto: 95000,
    montoFormato: '$95,000',
    fecha: '2026-06-15',
    categoria: 'Servicios',
  },
  {
    id: 'trx-010',
    proyectoId: 'proj-003',
    concepto: 'Venta Villa Ejecutiva V-02',
    tipo: 'Ingreso',
    monto: 2050000,
    montoFormato: '$2,050,000',
    fecha: '2026-05-28',
    categoria: 'Ventas',
  },

  // Vitacura Residencial
  {
    id: 'trx-011',
    proyectoId: 'proj-004',
    concepto: 'Pago final - Cierre proyecto',
    tipo: 'Ingreso',
    monto: 350000,
    montoFormato: '$350,000',
    fecha: '2026-06-01',
    categoria: 'Cierre',
  },

  // Ñuñoa Green
  {
    id: 'trx-012',
    proyectoId: 'proj-005',
    concepto: 'Estudio de viabilidad',
    tipo: 'Egreso',
    monto: 25000,
    montoFormato: '$25,000',
    fecha: '2026-06-10',
    categoria: 'Estudios',
  },

  // Providencia Central Offices (Proyecto Comercial)
  {
    id: 'trx-013',
    proyectoId: 'proj-006',
    concepto: 'Alquiler Oficina 401',
    tipo: 'Ingreso',
    monto: 380000,
    montoFormato: '$380,000',
    fecha: '2026-06-15',
    categoria: 'Ingresos Operacionales',
  },
  {
    id: 'trx-014',
    proyectoId: 'proj-006',
    concepto: 'Alquiler Oficina 205',
    tipo: 'Ingreso',
    monto: 320000,
    montoFormato: '$320,000',
    fecha: '2026-06-15',
    categoria: 'Ingresos Operacionales',
  },
  {
    id: 'trx-015',
    proyectoId: 'proj-006',
    concepto: 'Mantenimiento y servicios',
    tipo: 'Egreso',
    monto: 85000,
    montoFormato: '$85,000',
    fecha: '2026-06-05',
    categoria: 'Operación',
  },
  {
    id: 'trx-016',
    proyectoId: 'proj-006',
    concepto: 'Servicios profesionales - Contabilidad',
    tipo: 'Egreso',
    monto: 45000,
    montoFormato: '$45,000',
    fecha: '2026-06-20',
    categoria: 'Servicios',
  },
  {
    id: 'trx-017',
    proyectoId: 'proj-006',
    concepto: 'Venta Estacionamientos 5 unidades',
    tipo: 'Ingreso',
    monto: 150000,
    montoFormato: '$150,000',
    fecha: '2026-06-08',
    categoria: 'Ventas Complementarias',
  },

  // Macul Residencial Moderna
  {
    id: 'trx-018',
    proyectoId: 'proj-007',
    concepto: 'Venta Departamento Tipo A-101',
    tipo: 'Ingreso',
    monto: 280000,
    montoFormato: '$280,000',
    fecha: '2026-06-12',
    categoria: 'Ventas',
  },
  {
    id: 'trx-019',
    proyectoId: 'proj-007',
    concepto: 'Venta Departamento Tipo B-205',
    tipo: 'Ingreso',
    monto: 320000,
    montoFormato: '$320,000',
    fecha: '2026-06-10',
    categoria: 'Ventas',
  },
  {
    id: 'trx-020',
    proyectoId: 'proj-007',
    concepto: 'Comisión inmobiliaria - 2 ventas',
    tipo: 'Egreso',
    monto: 84000,
    montoFormato: '$84,000',
    fecha: '2026-06-15',
    categoria: 'Comisiones',
  },
  {
    id: 'trx-021',
    proyectoId: 'proj-007',
    concepto: 'Construcción - Fase 2',
    tipo: 'Egreso',
    monto: 500000,
    montoFormato: '$500,000',
    fecha: '2026-06-01',
    categoria: 'Construcción',
  },
  {
    id: 'trx-022',
    proyectoId: 'proj-007',
    concepto: 'Publicidad - Redes Sociales',
    tipo: 'Egreso',
    monto: 35000,
    montoFormato: '$35,000',
    fecha: '2026-06-18',
    categoria: 'Marketing',
  },

  // Peñalolén District Mixed (Proyecto Mixto)
  {
    id: 'trx-023',
    proyectoId: 'proj-008',
    concepto: 'Venta Lote Comercial C-01',
    tipo: 'Ingreso',
    monto: 650000,
    montoFormato: '$650,000',
    fecha: '2026-06-18',
    categoria: 'Ventas',
  },
  {
    id: 'trx-024',
    proyectoId: 'proj-008',
    concepto: 'Venta Casa Premium H-03',
    tipo: 'Ingreso',
    monto: 980000,
    montoFormato: '$980,000',
    fecha: '2026-06-14',
    categoria: 'Ventas',
  },
  {
    id: 'trx-025',
    proyectoId: 'proj-008',
    concepto: 'Comisiones vendedores',
    tipo: 'Egreso',
    monto: 81900,
    montoFormato: '$81,900',
    fecha: '2026-06-20',
    categoria: 'Comisiones',
  },
  {
    id: 'trx-026',
    proyectoId: 'proj-008',
    concepto: 'Gastos de administración',
    tipo: 'Egreso',
    monto: 125000,
    montoFormato: '$125,000',
    fecha: '2026-06-05',
    categoria: 'Administración',
  },
  {
    id: 'trx-027',
    proyectoId: 'proj-008',
    concepto: 'Servicios de diseño y arquitectura',
    tipo: 'Egreso',
    monto: 95000,
    montoFormato: '$95,000',
    fecha: '2026-06-22',
    categoria: 'Servicios Profesionales',
  },
];

// ─────────────────────────────────────────────────────────────
// VENTAS (Comercial)
// ─────────────────────────────────────────────────────────────

export const VENTAS: Sale[] = [
  // Bosques del Mar
  {
    id: 'sale-001',
    proyectoId: 'proj-001',
    propiedad: 'Departamento B-301',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 450000,
    valorFormato: '$450,000',
    fecha: '2026-06-15',
    clienteNombre: 'Juan Pérez',
    comision: 22500,
  },
  {
    id: 'sale-002',
    proyectoId: 'proj-001',
    propiedad: 'Casa A-102',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 850000,
    valorFormato: '$850,000',
    fecha: '2026-06-08',
    clienteNombre: 'María González',
    comision: 42500,
  },
  {
    id: 'sale-003',
    proyectoId: 'proj-001',
    propiedad: 'Departamento B-205',
    etapa: 'Negociación',
    cantidad: 1,
    valor: 420000,
    valorFormato: '$420,000',
    fecha: '2026-06-20',
    clienteNombre: 'Carlos López',
  },
  {
    id: 'sale-004',
    proyectoId: 'proj-001',
    propiedad: 'Casa A-304',
    etapa: 'Oferta',
    cantidad: 1,
    valor: 900000,
    valorFormato: '$900,000',
    fecha: '2026-06-18',
    clienteNombre: 'Patricia Silva',
  },

  // Las Condes Park
  {
    id: 'sale-005',
    proyectoId: 'proj-002',
    propiedad: 'Penthouse P-401',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 1200000,
    valorFormato: '$1,200,000',
    fecha: '2026-06-18',
    clienteNombre: 'Roberto Martínez',
    comision: 60000,
  },
  {
    id: 'sale-006',
    proyectoId: 'proj-002',
    propiedad: 'Departamento C-205',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 580000,
    valorFormato: '$580,000',
    fecha: '2026-06-03',
    clienteNombre: 'Andrea Castro',
    comision: 29000,
  },
  {
    id: 'sale-007',
    proyectoId: 'proj-002',
    propiedad: 'Penthouse P-501',
    etapa: 'Negociación',
    cantidad: 1,
    valor: 1350000,
    valorFormato: '$1,350,000',
    fecha: '2026-06-19',
    clienteNombre: 'Fernando Rojas',
  },

  // Lo Barnechea Villas Premium
  {
    id: 'sale-008',
    proyectoId: 'proj-003',
    propiedad: 'Villa Ejecutiva V-01',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 2100000,
    valorFormato: '$2,100,000',
    fecha: '2026-06-12',
    clienteNombre: 'Alejandro Núñez',
    comision: 105000,
  },
  {
    id: 'sale-009',
    proyectoId: 'proj-003',
    propiedad: 'Villa Ejecutiva V-02',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 2050000,
    valorFormato: '$2,050,000',
    fecha: '2026-05-28',
    clienteNombre: 'Constanza Flores',
    comision: 102500,
  },
  {
    id: 'sale-010',
    proyectoId: 'proj-003',
    propiedad: 'Villa Ejecutiva V-03',
    etapa: 'Prospección',
    cantidad: 1,
    valor: 2000000,
    valorFormato: '$2,000,000',
    fecha: '2026-06-25',
    clienteNombre: 'Diego Sánchez',
  },

  // Providencia Central Offices
  {
    id: 'sale-011',
    proyectoId: 'proj-006',
    propiedad: 'Oficina Ejecutiva 401',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 380000,
    valorFormato: '$380,000',
    fecha: '2026-06-15',
    clienteNombre: 'Corporación ABC S.A.',
    comision: 19000,
  },
  {
    id: 'sale-012',
    proyectoId: 'proj-006',
    propiedad: 'Oficina Estándar 205',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 320000,
    valorFormato: '$320,000',
    fecha: '2026-06-15',
    clienteNombre: 'Consultoría XYZ',
    comision: 16000,
  },
  {
    id: 'sale-013',
    proyectoId: 'proj-006',
    propiedad: 'Estacionamientos',
    etapa: 'Cerrada',
    cantidad: 5,
    valor: 150000,
    valorFormato: '$150,000',
    fecha: '2026-06-08',
    clienteNombre: 'Inversionistas Varios',
    comision: 7500,
  },
  {
    id: 'sale-014',
    proyectoId: 'proj-006',
    propiedad: 'Oficina Premium 501',
    etapa: 'Negociación',
    cantidad: 1,
    valor: 420000,
    valorFormato: '$420,000',
    fecha: '2026-06-20',
    clienteNombre: 'Firma Legal Premium',
  },

  // Macul Residencial Moderna
  {
    id: 'sale-015',
    proyectoId: 'proj-007',
    propiedad: 'Departamento Tipo A-101',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 280000,
    valorFormato: '$280,000',
    fecha: '2026-06-12',
    clienteNombre: 'Javier Morales',
    comision: 14000,
  },
  {
    id: 'sale-016',
    proyectoId: 'proj-007',
    propiedad: 'Departamento Tipo B-205',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 320000,
    valorFormato: '$320,000',
    fecha: '2026-06-10',
    clienteNombre: 'Verónica Acuña',
    comision: 16000,
  },
  {
    id: 'sale-017',
    proyectoId: 'proj-007',
    propiedad: 'Departamento Tipo A-205',
    etapa: 'Oferta',
    cantidad: 1,
    valor: 275000,
    valorFormato: '$275,000',
    fecha: '2026-06-19',
    clienteNombre: 'Pablo Rivera',
  },
  {
    id: 'sale-018',
    proyectoId: 'proj-007',
    propiedad: 'Departamento Tipo C-110',
    etapa: 'Negociación',
    cantidad: 1,
    valor: 350000,
    valorFormato: '$350,000',
    fecha: '2026-06-21',
    clienteNombre: 'Carolina López',
  },

  // Peñalolén District Mixed
  {
    id: 'sale-019',
    proyectoId: 'proj-008',
    propiedad: 'Lote Comercial C-01',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 650000,
    valorFormato: '$650,000',
    fecha: '2026-06-18',
    clienteNombre: 'Corporación Retail',
    comision: 32500,
  },
  {
    id: 'sale-020',
    proyectoId: 'proj-008',
    propiedad: 'Casa Premium H-03',
    etapa: 'Cerrada',
    cantidad: 1,
    valor: 980000,
    valorFormato: '$980,000',
    fecha: '2026-06-14',
    clienteNombre: 'Familia Rodríguez Rojas',
    comision: 49000,
  },
  {
    id: 'sale-021',
    proyectoId: 'proj-008',
    propiedad: 'Casa Standard H-01',
    etapa: 'Oferta',
    cantidad: 1,
    valor: 720000,
    valorFormato: '$720,000',
    fecha: '2026-06-20',
    clienteNombre: 'Miguel Fuentes',
  },
  {
    id: 'sale-022',
    proyectoId: 'proj-008',
    propiedad: 'Lote Residencial R-05',
    etapa: 'Prospección',
    cantidad: 1,
    valor: 580000,
    valorFormato: '$580,000',
    fecha: '2026-06-25',
    clienteNombre: 'Inversionista Independiente',
  },
];

// ─────────────────────────────────────────────────────────────
// LEADS (Marketing)
// ─────────────────────────────────────────────────────────────

export const LEADS: Lead[] = [
  // Bosques del Mar
  {
    id: 'lead-001',
    proyectoId: 'proj-001',
    nombre: 'Pedro Hidalgo',
    email: 'pedro.hidalgo@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'Convertido',
    fecha: '2026-06-15',
  },
  {
    id: 'lead-002',
    proyectoId: 'proj-001',
    nombre: 'Sofía Bravo',
    email: 'sofia.bravo@email.com',
    canal: 'Redes Sociales',
    costo: 180,
    costoFormato: '$180',
    estado: 'En progreso',
    fecha: '2026-06-18',
  },
  {
    id: 'lead-003',
    proyectoId: 'proj-001',
    nombre: 'Ignacio Vega',
    email: 'ignacio.v@email.com',
    canal: 'Email',
    costo: 150,
    costoFormato: '$150',
    estado: 'Nuevo',
    fecha: '2026-06-20',
  },
  {
    id: 'lead-004',
    proyectoId: 'proj-001',
    nombre: 'Laura Mendez',
    telefono: '+56912345678',
    canal: 'Llamada Directa',
    costo: 0,
    costoFormato: '$0',
    estado: 'En progreso',
    fecha: '2026-06-14',
  },

  // Las Condes Park
  {
    id: 'lead-005',
    proyectoId: 'proj-002',
    nombre: 'Valeria Gómez',
    email: 'valeria.g@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'Convertido',
    fecha: '2026-06-18',
  },
  {
    id: 'lead-006',
    proyectoId: 'proj-002',
    nombre: 'Rodrigo Espinoza',
    email: 'rodrigo.esp@email.com',
    canal: 'Referencia',
    costo: 500,
    costoFormato: '$500',
    estado: 'En progreso',
    fecha: '2026-06-10',
  },
  {
    id: 'lead-007',
    proyectoId: 'proj-002',
    nombre: 'Marcela Olivares',
    email: 'marcela.o@email.com',
    canal: 'Email',
    costo: 150,
    costoFormato: '$150',
    estado: 'Nuevo',
    fecha: '2026-06-19',
  },
  {
    id: 'lead-008',
    proyectoId: 'proj-002',
    nombre: 'Felipe Torres',
    email: 'felipe.t@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'Rechazado',
    fecha: '2026-06-05',
  },

  // Lo Barnechea Villas Premium
  {
    id: 'lead-009',
    proyectoId: 'proj-003',
    nombre: 'Gabriela Ramírez',
    email: 'gabriela.r@email.com',
    canal: 'Evento',
    costo: 1200,
    costoFormato: '$1,200',
    estado: 'Convertido',
    fecha: '2026-06-12',
  },
  {
    id: 'lead-010',
    proyectoId: 'proj-003',
    nombre: 'Hernán Díaz',
    email: 'hernan.d@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'En progreso',
    fecha: '2026-06-20',
  },
  {
    id: 'lead-011',
    proyectoId: 'proj-003',
    nombre: 'Natalia Valdés',
    email: 'natalia.v@email.com',
    canal: 'Redes Sociales',
    costo: 180,
    costoFormato: '$180',
    estado: 'En progreso',
    fecha: '2026-06-17',
  },

  // Providencia Central Offices
  {
    id: 'lead-012',
    proyectoId: 'proj-006',
    nombre: 'Raúl Menéndez',
    email: 'raul.menendez@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'Convertido',
    fecha: '2026-06-15',
  },
  {
    id: 'lead-013',
    proyectoId: 'proj-006',
    nombre: 'Beatriz Ortiz',
    email: 'beatriz.ortiz@email.com',
    canal: 'Email',
    costo: 150,
    costoFormato: '$150',
    estado: 'En progreso',
    fecha: '2026-06-18',
  },
  {
    id: 'lead-014',
    proyectoId: 'proj-006',
    nombre: 'Sergio Pino',
    email: 'sergio.p@email.com',
    canal: 'Referencia',
    costo: 500,
    costoFormato: '$500',
    estado: 'Convertido',
    fecha: '2026-06-10',
  },
  {
    id: 'lead-015',
    proyectoId: 'proj-006',
    nombre: 'Ximena Riquelme',
    email: 'ximena.r@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'Nuevo',
    fecha: '2026-06-20',
  },

  // Macul Residencial Moderna
  {
    id: 'lead-016',
    proyectoId: 'proj-007',
    nombre: 'Guillermo Núñez',
    email: 'guillermo.n@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'Convertido',
    fecha: '2026-06-12',
  },
  {
    id: 'lead-017',
    proyectoId: 'proj-007',
    nombre: 'Isabel Medina',
    email: 'isabel.medina@email.com',
    canal: 'Redes Sociales',
    costo: 180,
    costoFormato: '$180',
    estado: 'Convertido',
    fecha: '2026-06-10',
  },
  {
    id: 'lead-018',
    proyectoId: 'proj-007',
    nombre: 'José Fuentes',
    email: 'jose.f@email.com',
    canal: 'Email',
    costo: 150,
    costoFormato: '$150',
    estado: 'En progreso',
    fecha: '2026-06-19',
  },
  {
    id: 'lead-019',
    proyectoId: 'proj-007',
    nombre: 'Catalina Aguilera',
    email: 'catalina.a@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'En progreso',
    fecha: '2026-06-21',
  },

  // Peñalolén District Mixed
  {
    id: 'lead-020',
    proyectoId: 'proj-008',
    nombre: 'Edmundo Rojas',
    email: 'edmundo.r@email.com',
    canal: 'Evento',
    costo: 1200,
    costoFormato: '$1,200',
    estado: 'Convertido',
    fecha: '2026-06-18',
  },
  {
    id: 'lead-021',
    proyectoId: 'proj-008',
    nombre: 'Francesca Vidal',
    email: 'francesca.v@email.com',
    canal: 'Web',
    costo: 250,
    costoFormato: '$250',
    estado: 'En progreso',
    fecha: '2026-06-20',
  },
  {
    id: 'lead-022',
    proyectoId: 'proj-008',
    nombre: 'Gonzalo Carrera',
    email: 'gonzalo.c@email.com',
    canal: 'Referencia',
    costo: 500,
    costoFormato: '$500',
    estado: 'En progreso',
    fecha: '2026-06-15',
  },
  {
    id: 'lead-023',
    proyectoId: 'proj-008',
    nombre: 'Hortensia Barrera',
    email: 'hortensia.b@email.com',
    canal: 'Redes Sociales',
    costo: 180,
    costoFormato: '$180',
    estado: 'Nuevo',
    fecha: '2026-06-22',
  },
];

// ─────────────────────────────────────────────────────────────
// VALUACIONES (Valor Empresa)
// ─────────────────────────────────────────────────────────────

export const VALUACIONES: Valuation[] = [
  // Bosques del Mar
  {
    id: 'val-001',
    proyectoId: 'proj-001',
    anio: 2022,
    valor: 5000000,
    valorFormato: '$5,000,000',
    crecimiento: 0,
    crecimientoFormato: '0%',
    fecha: '2022-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-002',
    proyectoId: 'proj-001',
    anio: 2023,
    valor: 5750000,
    valorFormato: '$5,750,000',
    crecimiento: 15,
    crecimientoFormato: '15%',
    fecha: '2023-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-003',
    proyectoId: 'proj-001',
    anio: 2024,
    valor: 6612500,
    valorFormato: '$6,612,500',
    crecimiento: 15,
    crecimientoFormato: '15%',
    fecha: '2024-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-004',
    proyectoId: 'proj-001',
    anio: 2025,
    valor: 7604375,
    valorFormato: '$7,604,375',
    crecimiento: 15,
    crecimientoFormato: '15%',
    fecha: '2025-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-005',
    proyectoId: 'proj-001',
    anio: 2026,
    valor: 8745031,
    valorFormato: '$8,745,031',
    crecimiento: 15,
    crecimientoFormato: '15%',
    fecha: '2026-06-18',
    metodologia: 'DCF Actualizada',
  },

  // Las Condes Park
  {
    id: 'val-006',
    proyectoId: 'proj-002',
    anio: 2021,
    valor: 8000000,
    valorFormato: '$8,000,000',
    crecimiento: 0,
    crecimientoFormato: '0%',
    fecha: '2021-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-007',
    proyectoId: 'proj-002',
    anio: 2022,
    valor: 8960000,
    valorFormato: '$8,960,000',
    crecimiento: 12,
    crecimientoFormato: '12%',
    fecha: '2022-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-008',
    proyectoId: 'proj-002',
    anio: 2023,
    valor: 10035200,
    valorFormato: '$10,035,200',
    crecimiento: 12,
    crecimientoFormato: '12%',
    fecha: '2023-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-009',
    proyectoId: 'proj-002',
    anio: 2024,
    valor: 11239424,
    valorFormato: '$11,239,424',
    crecimiento: 12,
    crecimientoFormato: '12%',
    fecha: '2024-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-010',
    proyectoId: 'proj-002',
    anio: 2025,
    valor: 12588155,
    valorFormato: '$12,588,155',
    crecimiento: 12,
    crecimientoFormato: '12%',
    fecha: '2025-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-011',
    proyectoId: 'proj-002',
    anio: 2026,
    valor: 14098734,
    valorFormato: '$14,098,734',
    crecimiento: 12,
    crecimientoFormato: '12%',
    fecha: '2026-06-18',
    metodologia: 'DCF Actualizada',
  },

  // Lo Barnechea Villas Premium
  {
    id: 'val-012',
    proyectoId: 'proj-003',
    anio: 2024,
    valor: 12000000,
    valorFormato: '$12,000,000',
    crecimiento: 0,
    crecimientoFormato: '0%',
    fecha: '2024-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-013',
    proyectoId: 'proj-003',
    anio: 2025,
    valor: 13560000,
    valorFormato: '$13,560,000',
    crecimiento: 13,
    crecimientoFormato: '13%',
    fecha: '2025-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-014',
    proyectoId: 'proj-003',
    anio: 2026,
    valor: 15322800,
    valorFormato: '$15,322,800',
    crecimiento: 13,
    crecimientoFormato: '13%',
    fecha: '2026-06-18',
    metodologia: 'DCF Actualizada',
  },

  // Vitacura Residencial
  {
    id: 'val-015',
    proyectoId: 'proj-004',
    anio: 2022,
    valor: 6500000,
    valorFormato: '$6,500,000',
    crecimiento: 0,
    crecimientoFormato: '0%',
    fecha: '2022-12-31',
    metodologia: 'Comparables',
  },
  {
    id: 'val-016',
    proyectoId: 'proj-004',
    anio: 2023,
    valor: 7150000,
    valorFormato: '$7,150,000',
    crecimiento: 10,
    crecimientoFormato: '10%',
    fecha: '2023-12-31',
    metodologia: 'Comparables',
  },
  {
    id: 'val-017',
    proyectoId: 'proj-004',
    anio: 2024,
    valor: 7865000,
    valorFormato: '$7,865,000',
    crecimiento: 10,
    crecimientoFormato: '10%',
    fecha: '2024-12-31',
    metodologia: 'Comparables',
  },
  {
    id: 'val-018',
    proyectoId: 'proj-004',
    anio: 2025,
    valor: 8651500,
    valorFormato: '$8,651,500',
    crecimiento: 10,
    crecimientoFormato: '10%',
    fecha: '2025-12-31',
    metodologia: 'Cierre',
  },

  // Providencia Central Offices
  {
    id: 'val-019',
    proyectoId: 'proj-006',
    anio: 2023,
    valor: 8500000,
    valorFormato: '$8,500,000',
    crecimiento: 0,
    crecimientoFormato: '0%',
    fecha: '2023-12-31',
    metodologia: 'Comparables',
  },
  {
    id: 'val-020',
    proyectoId: 'proj-006',
    anio: 2024,
    valor: 9350000,
    valorFormato: '$9,350,000',
    crecimiento: 10,
    crecimientoFormato: '10%',
    fecha: '2024-12-31',
    metodologia: 'Comparables',
  },
  {
    id: 'val-021',
    proyectoId: 'proj-006',
    anio: 2025,
    valor: 10285000,
    valorFormato: '$10,285,000',
    crecimiento: 10,
    crecimientoFormato: '10%',
    fecha: '2025-12-31',
    metodologia: 'Comparables',
  },
  {
    id: 'val-022',
    proyectoId: 'proj-006',
    anio: 2026,
    valor: 11313500,
    valorFormato: '$11,313,500',
    crecimiento: 10,
    crecimientoFormato: '10%',
    fecha: '2026-06-18',
    metodologia: 'DCF',
  },

  // Macul Residencial Moderna
  {
    id: 'val-023',
    proyectoId: 'proj-007',
    anio: 2023,
    valor: 6000000,
    valorFormato: '$6,000,000',
    crecimiento: 0,
    crecimientoFormato: '0%',
    fecha: '2023-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-024',
    proyectoId: 'proj-007',
    anio: 2024,
    valor: 6840000,
    valorFormato: '$6,840,000',
    crecimiento: 14,
    crecimientoFormato: '14%',
    fecha: '2024-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-025',
    proyectoId: 'proj-007',
    anio: 2025,
    valor: 7797600,
    valorFormato: '$7,797,600',
    crecimiento: 14,
    crecimientoFormato: '14%',
    fecha: '2025-12-31',
    metodologia: 'DCF',
  },
  {
    id: 'val-026',
    proyectoId: 'proj-007',
    anio: 2026,
    valor: 8889264,
    valorFormato: '$8,889,264',
    crecimiento: 14,
    crecimientoFormato: '14%',
    fecha: '2026-06-18',
    metodologia: 'DCF Actualizada',
  },

  // Peñalolén District Mixed
  {
    id: 'val-027',
    proyectoId: 'proj-008',
    anio: 2024,
    valor: 9000000,
    valorFormato: '$9,000,000',
    crecimiento: 0,
    crecimientoFormato: '0%',
    fecha: '2024-12-31',
    metodologia: 'Comparables + DCF',
  },
  {
    id: 'val-028',
    proyectoId: 'proj-008',
    anio: 2025,
    valor: 10170000,
    valorFormato: '$10,170,000',
    crecimiento: 13,
    crecimientoFormato: '13%',
    fecha: '2025-12-31',
    metodologia: 'Comparables + DCF',
  },
  {
    id: 'val-029',
    proyectoId: 'proj-008',
    anio: 2026,
    valor: 11492100,
    valorFormato: '$11,492,100',
    crecimiento: 13,
    crecimientoFormato: '13%',
    fecha: '2026-06-18',
    metodologia: 'DCF Actualizada',
  },
];

// ─────────────────────────────────────────────────────────────
// FUNCIONES DE BÚSQUEDA
// ─────────────────────────────────────────────────────────────

export function getProjectById(id: string): Project | undefined {
  return PROYECTOS.find((p) => p.id === id);
}

export function getTransactionsByProject(proyectoId: string): Transaction[] {
  return TRANSACCIONES.filter((t) => t.proyectoId === proyectoId);
}

export function getSalesByProject(proyectoId: string): Sale[] {
  return VENTAS.filter((s) => s.proyectoId === proyectoId);
}

export function getLeadsByProject(proyectoId: string): Lead[] {
  return LEADS.filter((l) => l.proyectoId === proyectoId);
}

export function getValuationsByProject(proyectoId: string): Valuation[] {
  return VALUACIONES.filter((v) => v.proyectoId === proyectoId);
}

// Obtener datos combinados con relaciones
export function getProjectData(proyectoId: string) {
  const project = getProjectById(proyectoId);
  const transactions = getTransactionsByProject(proyectoId);
  const sales = getSalesByProject(proyectoId);
  const leads = getLeadsByProject(proyectoId);
  const valuations = getValuationsByProject(proyectoId);

  return {
    project,
    transactions,
    sales,
    leads,
    valuations,
  };
}
