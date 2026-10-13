import { ConstructoraData, Metric, ObraResumen } from '@/types/domain';

/**
 * Panel de la constructora: datos de DEMOSTRACIÓN con la forma de los indicadores de Control de Obra
 * (avance real vs plan, SPI/CPI, presupuesto vs costo, compras, stock crítico, incidencias).
 * Las obras son los proyectos de la constructora (NeoYungay, Boulevard Santa Rosa, NeoBrisas).
 * Cuando se conecte Control de Obra, `CrmDataSource.getConstructora()` devolverá esta misma forma.
 */

const OBRAS: Omit<ObraResumen, 'spi' | 'cpi'>[] = [
  { obra: 'NeoYungay', estado: 'En ejecución', avanceReal: 58, avancePlan: 61, presupuesto: 1850, costoReal: 1180, ocPendientes: 3, incidenciasAbiertas: 8 },
  { obra: 'Boulevard Santa Rosa', estado: 'En ejecución', avanceReal: 74, avancePlan: 72, presupuesto: 2420, costoReal: 1890, ocPendientes: 2, incidenciasAbiertas: 7 },
  { obra: 'NeoBrisas', estado: 'En ejecución', avanceReal: 31, avancePlan: 36, presupuesto: 2110, costoReal: 760, ocPendientes: 2, incidenciasAbiertas: 7 },
];

const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;
const es = (n: number, d = 1) => n.toFixed(d).replace('.', ',');
const mm = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}MM`;

export function buildConstructora(): ConstructoraData {
  const obras: ObraResumen[] = OBRAS.map(o => ({
    ...o,
    spi: r2(o.avancePlan > 0 ? o.avanceReal / o.avancePlan : 1),
    // CPI = valor ganado / costo real
    cpi: r2(o.costoReal > 0 ? (o.avanceReal / 100) * o.presupuesto / o.costoReal : 1),
  }));

  const presupuesto = obras.reduce((a, o) => a + o.presupuesto, 0);
  const costo = obras.reduce((a, o) => a + o.costoReal, 0);
  const valorGanado = obras.reduce((a, o) => a + (o.avanceReal / 100) * o.presupuesto, 0);
  const avanceReal = r1(obras.reduce((a, o) => a + o.avanceReal * o.presupuesto, 0) / presupuesto);
  const avancePlan = r1(obras.reduce((a, o) => a + o.avancePlan * o.presupuesto, 0) / presupuesto);
  const spi = r2(avanceReal / avancePlan);
  const cpi = r2(valorGanado / costo);
  const ocPend = obras.reduce((a, o) => a + o.ocPendientes, 0);
  const incAltas = 4;

  const metrics: Metric[] = [
    { label: 'Avance Físico', value: `${es(avanceReal)}%`, trend: `${avanceReal - avancePlan >= 0 ? '+' : ''}${es(avanceReal - avancePlan)} pts`, up: avanceReal >= avancePlan, color: 'green', caption: `vs plan (${es(avancePlan)}%)` },
    { label: 'SPI · Cronograma', value: es(spi, 2), trend: spi >= 1 ? 'En plazo' : 'Atraso', up: spi >= 1, color: 'blue', caption: '1,00 = según plan' },
    { label: 'CPI · Costos', value: es(cpi, 2), trend: cpi >= 1 ? 'Bajo presupuesto' : 'Sobrecosto', up: cpi >= 1, color: 'orange', caption: '1,00 = según presupuesto' },
    { label: 'Presupuesto Ejecutado', value: `${es((costo / presupuesto) * 100)}%`, trend: mm(costo), up: true, color: 'purple', caption: `de ${mm(presupuesto)}` },
    { label: 'Compras por Aprobar', value: `${ocPend} OC`, trend: '$182MM', up: false, color: 'orange', caption: 'monto pendiente' },
    { label: 'Facturas por Pagar', value: '$246MM', trend: '5 próximas a vencer', up: false, color: 'red', caption: 'plazo de reclamo 8 días' },
    { label: 'Stock Crítico', value: '9', trend: 'bajo el mínimo', up: false, color: 'red', caption: 'materiales' },
    { label: 'Incidencias Altas', value: String(incAltas), trend: `${obras.reduce((a, o) => a + o.incidenciasAbiertas, 0)} abiertas`, up: false, color: 'orange', caption: 'severidad alta' },
  ];

  return {
    metrics,
    obras,
    curvaS: [
      { mes: 'Ene', plan: 6, real: 5 },
      { mes: 'Feb', plan: 11, real: 10 },
      { mes: 'Mar', plan: 17, real: 15 },
      { mes: 'Abr', plan: 23, real: 21 },
      { mes: 'May', plan: 29, real: 27 },
      { mes: 'Jun', plan: 35, real: 32 },
      { mes: 'Jul', plan: 41, real: 38 },
      { mes: 'Ago', plan: 46, real: 43 },
      { mes: 'Sep', plan: 52, real: 49 },
      { mes: 'Oct', plan: 57, real: avanceReal },
      { mes: 'Nov', plan: 63, real: null },
      { mes: 'Dic', plan: 69, real: null },
    ],
    comprasMensuales: [
      { mes: 'Ene', monto: 120 }, { mes: 'Feb', monto: 95 }, { mes: 'Mar', monto: 140 }, { mes: 'Abr', monto: 170 },
      { mes: 'May', monto: 155 }, { mes: 'Jun', monto: 210 }, { mes: 'Jul', monto: 190 }, { mes: 'Ago', monto: 230 },
      { mes: 'Sep', monto: 205 }, { mes: 'Oct', monto: 182 },
    ],
    ordenesPorEstado: [
      { estado: 'Pendiente de aprobación', cantidad: ocPend },
      { estado: 'Aprobada', cantidad: 12 },
      { estado: 'Enviada', cantidad: 9 },
      { estado: 'Recibida parcial', cantidad: 5 },
      { estado: 'Recibida', cantidad: 38 },
      { estado: 'Facturada', cantidad: 21 },
    ],
    incidenciasPorObra: [
      { obra: 'NeoYungay', alta: 1, media: 3, baja: 4 },
      { obra: 'Boulevard Santa Rosa', alta: 2, media: 2, baja: 3 },
      { obra: 'NeoBrisas', alta: 1, media: 4, baja: 2 },
    ],
  };
}
