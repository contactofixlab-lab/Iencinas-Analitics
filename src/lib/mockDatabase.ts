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
