import { User } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido1: 'Díaz',
    apellido2: 'Morales',
    email: 'juan@iencinas.cl',
    password: '123456',
    role: 'finanzas',
    departamento: 'Finanzas',
    permissions: ['finanzas', 'reportes'],
    proyectos: ['bosques-del-mar', 'alameda-central'],
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    nombre: 'María',
    apellido1: 'Rodríguez',
    apellido2: 'García',
    email: 'maria@iencinas.cl',
    password: '123456',
    role: 'comercial',
    departamento: 'Comercial',
    permissions: ['comercial', 'reportes'],
    proyectos: ['bosques-del-mar', 'lastarria-residencias'],
    createdAt: '2026-01-20',
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido1: 'Cortés',
    apellido2: 'Pérez',
    email: 'carlos@iencinas.cl',
    password: '123456',
    role: 'marketing',
    departamento: 'Marketing',
    permissions: ['marketing', 'reportes'],
    proyectos: ['bosques-del-mar', 'alameda-central', 'lastarria-residencias'],
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido1: 'Silva',
    apellido2: 'Torres',
    email: 'ana@iencinas.cl',
    password: '123456',
    role: 'administrador',
    departamento: 'Administración',
    permissions: ['finanzas', 'comercial', 'marketing', 'valor-empresa', 'admin', 'reportes'],
    proyectos: ['bosques-del-mar', 'alameda-central', 'lastarria-residencias'],
    createdAt: '2026-01-01',
  },
];

// Finanzas data
export const finanzasMetrics = [
  { label: 'Ingresos Totales', value: '$7.1M', trend: '+12.4%', up: true, color: 'green' },
  { label: 'Gastos Operativos', value: '$3.3M', trend: '-5.1%', up: false, color: 'red' },
  { label: 'Margen Neto', value: '53.5%', trend: '+8.2%', up: true, color: 'blue' },
  { label: 'Flujo de Caja', value: '$2.8M', trend: '+14.7%', up: true, color: 'purple' },
];

export const finanzasIngresos = [
  { mes: 'Ene', valor: 5200000 },
  { mes: 'Feb', valor: 5800000 },
  { mes: 'Mar', valor: 6100000 },
  { mes: 'Abr', valor: 5700000 },
  { mes: 'May', valor: 6400000 },
  { mes: 'Jun', valor: 6900000 },
  { mes: 'Jul', valor: 7100000 },
  { mes: 'Ago', valor: 6800000 },
  { mes: 'Sep', valor: 7300000 },
  { mes: 'Oct', valor: 7500000 },
  { mes: 'Nov', valor: 7800000 },
  { mes: 'Dic', valor: 8200000 },
];

export const finanzasGastos = [
  { mes: 'Ene', valor: 3800000 },
  { mes: 'Feb', valor: 3600000 },
  { mes: 'Mar', valor: 3900000 },
  { mes: 'Abr', valor: 3500000 },
  { mes: 'May', valor: 3700000 },
  { mes: 'Jun', valor: 3400000 },
  { mes: 'Jul', valor: 3300000 },
  { mes: 'Ago', valor: 3200000 },
  { mes: 'Sep', valor: 3100000 },
  { mes: 'Oct', valor: 3000000 },
  { mes: 'Nov', valor: 2900000 },
  { mes: 'Dic', valor: 2800000 },
];

// Comercial data
export const comercialMetrics = [
  { label: 'Propiedades Vendidas', value: '24', trend: '+8.0%', up: true, color: 'green' },
  { label: 'Valor Total Ventas', value: '$18.5M', trend: '+15.3%', up: true, color: 'blue' },
  { label: 'Cartera Activa', value: '142', trend: '-2.1%', up: false, color: 'orange' },
  { label: 'Ticket Promedio', value: '$770K', trend: '+6.8%', up: true, color: 'purple' },
];

export const comercialVentas = [
  { mes: 'Ene', ventas: 18 },
  { mes: 'Feb', ventas: 20 },
  { mes: 'Mar', ventas: 15 },
  { mes: 'Abr', ventas: 22 },
  { mes: 'May', ventas: 19 },
  { mes: 'Jun', ventas: 25 },
  { mes: 'Jul', ventas: 24 },
  { mes: 'Ago', ventas: 21 },
  { mes: 'Sep', ventas: 27 },
  { mes: 'Oct', ventas: 23 },
  { mes: 'Nov', ventas: 28 },
  { mes: 'Dic', ventas: 30 },
];

export const comercialPipeline = [
  { etapa: 'Contacto', cantidad: 85 },
  { etapa: 'Visita', cantidad: 62 },
  { etapa: 'Propuesta', cantidad: 41 },
  { etapa: 'Negociación', cantidad: 28 },
  { etapa: 'Cierre', cantidad: 14 },
];

// Marketing data
export const marketingMetrics = [
  { label: 'Leads Generados', value: '847', trend: '+22.1%', up: true, color: 'green' },
  { label: 'Tasa de Conversión', value: '8.7%', trend: '+1.2%', up: true, color: 'blue' },
  { label: 'ROI Campañas', value: '320%', trend: '+45.0%', up: true, color: 'purple' },
  { label: 'Costo por Lead', value: '$145', trend: '-8.5%', up: true, color: 'green' },
];

export const marketingLeads = [
  { mes: 'Ene', leads: 580 },
  { mes: 'Feb', leads: 620 },
  { mes: 'Mar', leads: 590 },
  { mes: 'Abr', leads: 710 },
  { mes: 'May', leads: 680 },
  { mes: 'Jun', leads: 750 },
  { mes: 'Jul', leads: 847 },
  { mes: 'Ago', leads: 790 },
  { mes: 'Sep', leads: 870 },
  { mes: 'Oct', leads: 920 },
  { mes: 'Nov', leads: 880 },
  { mes: 'Dic', leads: 960 },
];

export const marketingCanales = [
  { canal: 'Google Ads', leads: 320, inversion: 15000 },
  { canal: 'Facebook', leads: 210, inversion: 9000 },
  { canal: 'Instagram', leads: 180, inversion: 7500 },
  { canal: 'Email', leads: 95, inversion: 2000 },
  { canal: 'Orgánico', leads: 42, inversion: 0 },
];

// Valor Empresa data
export const valorEmpresaMetrics = [
  { label: 'Valuación Total', value: '$125M', trend: '+18.2%', up: true, color: 'green' },
  { label: 'EBITDA', value: '$28.5M', trend: '+12.6%', up: true, color: 'blue' },
  { label: 'Margen EBITDA', value: '22.1%', trend: '+2.3%', up: true, color: 'purple' },
  { label: 'ROE', value: '22.7%', trend: '+4.1%', up: true, color: 'green' },
];

export const valorHistorico = [
  { year: '2021', valor: 72 },
  { year: '2022', valor: 85 },
  { year: '2023', valor: 98 },
  { year: '2024', valor: 108 },
  { year: '2025', valor: 118 },
  { year: '2026', valor: 125 },
];

export const reportesFinanzas = [
  {
    id: 'f1',
    nombre: 'Resumen Mensual de Ingresos',
    descripcion: 'Ingresos por categoría, totales y comparativa con mes anterior',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
  {
    id: 'f2',
    nombre: 'Análisis de Gastos',
    descripcion: 'Desglose de gastos, porcentajes y tendencias por categoría',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
  {
    id: 'f3',
    nombre: 'Flujo de Caja',
    descripcion: 'Entradas, salidas y saldo neto del período',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
];

export const reportesComercial = [
  {
    id: 'c1',
    nombre: 'Propiedades Vendidas',
    descripcion: 'Cantidad, valor total, precio promedio y vendedores top',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
  {
    id: 'c2',
    nombre: 'Pipeline de Ventas',
    descripcion: 'Estado de negociaciones, etapas y tasa de conversión',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
  {
    id: 'c3',
    nombre: 'Análisis de Cartera',
    descripcion: 'Propiedades activas clasificadas por zona y tipo',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
];

export const reportesMarketing = [
  {
    id: 'm1',
    nombre: 'Generación de Leads',
    descripcion: 'Leads por canal, fuente y tasa de conversión',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
  {
    id: 'm2',
    nombre: 'ROI de Campañas',
    descripcion: 'Inversión, retorno, costo por lead y eficiencia por canal',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
  {
    id: 'm3',
    nombre: 'Análisis de Audiencia',
    descripcion: 'Segmentación, comportamiento y engagement por segmento',
    fecha: '2026-06-01',
    tipo: 'Mensual',
  },
];

export const reportesValorEmpresa = [
  {
    id: 'v1',
    nombre: 'Valuación Empresarial',
    descripcion: 'Valor actual, proyecciones y benchmarks del mercado',
    fecha: '2026-06-01',
    tipo: 'Trimestral',
  },
  {
    id: 'v2',
    nombre: 'EBITDA y Rentabilidad',
    descripcion: 'Márgenes, ratios e histórico de 5 años',
    fecha: '2026-06-01',
    tipo: 'Trimestral',
  },
  {
    id: 'v3',
    nombre: 'Indicadores Accionistas',
    descripcion: 'Dividendos, ROE y múltiplos de valuación',
    fecha: '2026-06-01',
    tipo: 'Trimestral',
  },
];

/* ── Multi-Proyecto Data ────────────────────────────────────────────────── */

export const PROYECTOS = [
  {
    id: 'bosques-del-mar',
    nombre: 'Bosques del Mar',
    ubicacion: 'Limache, V Región',
    estado: 'activo' as const,
  },
  {
    id: 'alameda-central',
    nombre: 'Proyecto Alameda',
    ubicacion: 'Santiago Centro',
    estado: 'activo' as const,
  },
  {
    id: 'lastarria-residencias',
    nombre: 'Residencias Lastarria',
    ubicacion: 'Ñuñoa, Santiago',
    estado: 'activo' as const,
  },
];

// Bosques del Mar - Proyecto grande
export const bdmFinanzasMetrics = [
  { label: 'Ingresos Totales', value: '$4.2M', trend: '+18.5%', up: true, color: 'green' },
  { label: 'Gastos Operativos', value: '$1.8M', trend: '-3.2%', up: false, color: 'red' },
  { label: 'Margen Neto', value: '57.1%', trend: '+9.1%', up: true, color: 'blue' },
  { label: 'Flujo de Caja', value: '$1.6M', trend: '+21.4%', up: true, color: 'purple' },
];

export const bdmFinanzasIngresos = [
  { mes: 'Ene', valor: 3200000 },
  { mes: 'Feb', valor: 3400000 },
  { mes: 'Mar', valor: 3600000 },
  { mes: 'Abr', valor: 3800000 },
  { mes: 'May', valor: 4000000 },
  { mes: 'Jun', valor: 4200000 },
  { mes: 'Jul', valor: 4100000 },
  { mes: 'Ago', valor: 4300000 },
  { mes: 'Sep', valor: 4400000 },
  { mes: 'Oct', valor: 4500000 },
  { mes: 'Nov', valor: 4600000 },
  { mes: 'Dic', valor: 4700000 },
];

export const bdmFinanzasGastos = [
  { mes: 'Ene', valor: 1900000 },
  { mes: 'Feb', valor: 1850000 },
  { mes: 'Mar', valor: 1800000 },
  { mes: 'Abr', valor: 1750000 },
  { mes: 'May', valor: 1700000 },
  { mes: 'Jun', valor: 1650000 },
  { mes: 'Jul', valor: 1600000 },
  { mes: 'Ago', valor: 1550000 },
  { mes: 'Sep', valor: 1500000 },
  { mes: 'Oct', valor: 1450000 },
  { mes: 'Nov', valor: 1400000 },
  { mes: 'Dic', valor: 1350000 },
];

export const bdmComercialMetrics = [
  { label: 'Propiedades Vendidas', value: '16', trend: '+11.2%', up: true, color: 'green' },
  { label: 'Valor Total Ventas', value: '$12.4M', trend: '+18.9%', up: true, color: 'blue' },
  { label: 'Cartera Activa', value: '58', trend: '+5.3%', up: true, color: 'orange' },
  { label: 'Ticket Promedio', value: '$775K', trend: '+7.2%', up: true, color: 'purple' },
];

export const bdmComercialVentas = [
  { mes: 'Ene', ventas: 10 },
  { mes: 'Feb', ventas: 12 },
  { mes: 'Mar', ventas: 11 },
  { mes: 'Abr', ventas: 14 },
  { mes: 'May', ventas: 13 },
  { mes: 'Jun', ventas: 16 },
  { mes: 'Jul', ventas: 15 },
  { mes: 'Ago', ventas: 14 },
  { mes: 'Sep', ventas: 16 },
  { mes: 'Oct', ventas: 15 },
  { mes: 'Nov', ventas: 17 },
  { mes: 'Dic', ventas: 18 },
];

export const bdmMarketingMetrics = [
  { label: 'Leads Generados', value: '524', trend: '+25.3%', up: true, color: 'green' },
  { label: 'Tasa de Conversión', value: '9.2%', trend: '+1.5%', up: true, color: 'blue' },
  { label: 'ROI Campañas', value: '385%', trend: '+52.1%', up: true, color: 'purple' },
  { label: 'Costo por Lead', value: '$128', trend: '-12.3%', up: true, color: 'green' },
];

// Proyecto Alameda - Proyecto mediano
export const alamedaFinanzasMetrics = [
  { label: 'Ingresos Totales', value: '$2.1M', trend: '+8.3%', up: true, color: 'green' },
  { label: 'Gastos Operativos', value: '$0.9M', trend: '-1.5%', up: false, color: 'red' },
  { label: 'Margen Neto', value: '57.1%', trend: '+6.2%', up: true, color: 'blue' },
  { label: 'Flujo de Caja', value: '$0.8M', trend: '+10.5%', up: true, color: 'purple' },
];

export const alamedaFinanzasIngresos = [
  { mes: 'Ene', valor: 1600000 },
  { mes: 'Feb', valor: 1700000 },
  { mes: 'Mar', valor: 1750000 },
  { mes: 'Abr', valor: 1800000 },
  { mes: 'May', valor: 1900000 },
  { mes: 'Jun', valor: 2000000 },
  { mes: 'Jul', valor: 2050000 },
  { mes: 'Ago', valor: 2100000 },
  { mes: 'Sep', valor: 2150000 },
  { mes: 'Oct', valor: 2200000 },
  { mes: 'Nov', valor: 2250000 },
  { mes: 'Dic', valor: 2300000 },
];

export const alamedaComercialMetrics = [
  { label: 'Propiedades Vendidas', value: '8', trend: '+5.1%', up: true, color: 'green' },
  { label: 'Valor Total Ventas', value: '$6.2M', trend: '+9.4%', up: true, color: 'blue' },
  { label: 'Cartera Activa', value: '32', trend: '+2.1%', up: true, color: 'orange' },
  { label: 'Ticket Promedio', value: '$775K', trend: '+4.1%', up: true, color: 'purple' },
];

// Residencias Lastarria - Proyecto pequeño
export const lastarriaFinanzasMetrics = [
  { label: 'Ingresos Totales', value: '$0.8M', trend: '+5.2%', up: true, color: 'green' },
  { label: 'Gastos Operativos', value: '$0.4M', trend: '-0.8%', up: false, color: 'red' },
  { label: 'Margen Neto', value: '50.0%', trend: '+4.3%', up: true, color: 'blue' },
  { label: 'Flujo de Caja', value: '$0.3M', trend: '+8.2%', up: true, color: 'purple' },
];

export const lastarriaComercialMetrics = [
  { label: 'Propiedades Vendidas', value: '4', trend: '+3.2%', up: true, color: 'green' },
  { label: 'Valor Total Ventas', value: '$3.1M', trend: '+4.8%', up: true, color: 'blue' },
  { label: 'Cartera Activa', value: '12', trend: '-1.2%', up: false, color: 'orange' },
  { label: 'Ticket Promedio', value: '$775K', trend: '+2.1%', up: true, color: 'purple' },
];
