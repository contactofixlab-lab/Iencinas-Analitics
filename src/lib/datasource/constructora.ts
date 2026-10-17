import { ConstructoraData, ConstructoraFiltros, Metric, ObraResumen, QueryParams } from '@/types/domain';

/**
 * Panel de la constructora: datos de DEMOSTRACIÓN con la forma de los indicadores de Control de Obra
 * (avance real vs plan, SPI/CPI, presupuesto vs costo, compras, stock crítico, incidencias).
 * Las obras son los proyectos de la constructora (NeoYungay, Boulevard Santa Rosa, NeoBrisas).
 * Cuando se conecte Control de Obra, `CrmDataSource.getConstructora()` devolverá esta misma forma
 * y recibirá los mismos filtros (obra, estado, cronograma, estado de OC, severidad y meses).
 */

const OBRAS: Omit<ObraResumen, 'spi' | 'cpi'>[] = [
  { obra: 'NeoYungay', estado: 'En ejecución', avanceReal: 58, avancePlan: 61, presupuesto: 1850, costoReal: 1180, ocPendientes: 3, incidenciasAbiertas: 8 },
  { obra: 'Boulevard Santa Rosa', estado: 'En ejecución', avanceReal: 74, avancePlan: 72, presupuesto: 2420, costoReal: 1890, ocPendientes: 2, incidenciasAbiertas: 7 },
  { obra: 'NeoBrisas', estado: 'En ejecución', avanceReal: 31, avancePlan: 36, presupuesto: 2110, costoReal: 760, ocPendientes: 2, incidenciasAbiertas: 7 },
];

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const INCIDENCIAS = [
  { obra: 'NeoYungay', alta: 1, media: 3, baja: 4 },
  { obra: 'Boulevard Santa Rosa', alta: 2, media: 2, baja: 3 },
  { obra: 'NeoBrisas', alta: 1, media: 4, baja: 2 },
];

const ocEstados = (ocPend: number) => [
  { estado: 'Pendiente de aprobación', cantidad: ocPend },
  { estado: 'Aprobada', cantidad: 12 },
  { estado: 'Enviada', cantidad: 9 },
  { estado: 'Recibida parcial', cantidad: 5 },
  { estado: 'Recibida', cantidad: 38 },
  { estado: 'Facturada', cantidad: 21 },
];

const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;
const es = (n: number, d = 1) => n.toFixed(d).replace('.', ',');
const mm = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}MM`;
const norm = (s: string) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Convierte los parámetros de la consulta (ya validados por la API) en filtros tipados. */
export function filtrosDesdeParams(p?: QueryParams): ConstructoraFiltros {
  const f: ConstructoraFiltros = {};
  if (!p) return f;
  if (p.obra) f.obra = p.obra;
  if (p.estado) f.estado = p.estado;
  if (p.cronograma === 'en_plazo' || p.cronograma === 'atraso') f.cronograma = p.cronograma;
  if (p.oc) f.oc = p.oc;
  if (p.severidad === 'alta' || p.severidad === 'media' || p.severidad === 'baja') f.severidad = p.severidad;
  const d = Number(p.mesDesde);
  const h = Number(p.mesHasta);
  if (p.mesDesde && Number.isInteger(d) && d >= 1 && d <= 12) f.mesDesde = d;
  if (p.mesHasta && Number.isInteger(h) && h >= 1 && h <= 12) f.mesHasta = h;
  return f;
}

export function buildConstructora(f: ConstructoraFiltros = {}): ConstructoraData {
  const todas: ObraResumen[] = OBRAS.map(o => ({
    ...o,
    spi: r2(o.avancePlan > 0 ? o.avanceReal / o.avancePlan : 1),
    // CPI = valor ganado / costo real
    cpi: r2(o.costoReal > 0 ? (o.avanceReal / 100) * o.presupuesto / o.costoReal : 1),
  }));

  const obras = todas.filter(o =>
    (!f.obra || norm(o.obra) === norm(f.obra)) &&
    (!f.estado || norm(o.estado) === norm(f.estado)) &&
    (!f.cronograma || (f.cronograma === 'en_plazo' ? o.spi >= 1 : o.spi < 1)),
  );
  const hay = obras.length > 0;

  const ponderado = (list: ObraResumen[], k: 'avanceReal' | 'avancePlan') => {
    const pres = list.reduce((a, o) => a + o.presupuesto, 0);
    return pres > 0 ? r1(list.reduce((a, o) => a + o[k] * o.presupuesto, 0) / pres) : 0;
  };

  const presupuesto = obras.reduce((a, o) => a + o.presupuesto, 0);
  const costo = obras.reduce((a, o) => a + o.costoReal, 0);
  const valorGanado = obras.reduce((a, o) => a + (o.avanceReal / 100) * o.presupuesto, 0);
  const avanceReal = ponderado(obras, 'avanceReal');
  const avancePlan = ponderado(obras, 'avancePlan');
  const spi = r2(avancePlan > 0 ? avanceReal / avancePlan : 1);
  const cpi = r2(costo > 0 ? valorGanado / costo : 1);
  const ocPend = obras.reduce((a, o) => a + o.ocPendientes, 0);
  const incAltas = INCIDENCIAS.filter(i => obras.some(o => o.obra === i.obra)).reduce((a, i) => a + i.alta, 0);
  const incAbiertas = obras.reduce((a, o) => a + o.incidenciasAbiertas, 0);
  const sinObras = 'sin obras con estos filtros';

  const metrics: Metric[] = [
    hay
      ? { label: 'Avance Físico', value: `${es(avanceReal)}%`, trend: `${avanceReal - avancePlan >= 0 ? '+' : ''}${es(avanceReal - avancePlan)} pts`, up: avanceReal >= avancePlan, color: 'green', caption: `vs plan (${es(avancePlan)}%)` }
      : { label: 'Avance Físico', value: '—', trend: '', up: true, color: 'green', caption: sinObras },
    hay
      ? { label: 'SPI · Cronograma', value: es(spi, 2), trend: spi >= 1 ? 'En plazo' : 'Atraso', up: spi >= 1, color: 'blue', caption: '1,00 = según plan' }
      : { label: 'SPI · Cronograma', value: '—', trend: '', up: true, color: 'blue', caption: sinObras },
    hay
      ? { label: 'CPI · Costos', value: es(cpi, 2), trend: cpi >= 1 ? 'Bajo presupuesto' : 'Sobrecosto', up: cpi >= 1, color: 'orange', caption: '1,00 = según presupuesto' }
      : { label: 'CPI · Costos', value: '—', trend: '', up: true, color: 'orange', caption: sinObras },
    hay
      ? { label: 'Presupuesto Ejecutado', value: `${es((costo / presupuesto) * 100)}%`, trend: mm(costo), up: true, color: 'purple', caption: `de ${mm(presupuesto)}` }
      : { label: 'Presupuesto Ejecutado', value: '—', trend: '', up: true, color: 'purple', caption: sinObras },
    { label: 'Compras por Aprobar', value: `${ocPend} OC`, trend: hay ? '$182MM' : '', up: false, color: 'orange', caption: 'monto pendiente' },
    { label: 'Facturas por Pagar', value: '$246MM', trend: '5 próximas a vencer', up: false, color: 'red', caption: 'plazo de reclamo 8 días' },
    { label: 'Stock Crítico', value: '9', trend: 'bajo el mínimo', up: false, color: 'red', caption: 'materiales' },
    { label: 'Incidencias Altas', value: String(incAltas), trend: `${incAbiertas} abiertas`, up: false, color: 'orange', caption: 'severidad alta' },
  ];

  // La curva S y las compras no se desglosan por obra: son de la cartera completa.
  const avanceCartera = ponderado(todas, 'avanceReal');
  const desde = Math.min(f.mesDesde ?? 1, f.mesHasta ?? 12);
  const hasta = Math.max(f.mesDesde ?? 1, f.mesHasta ?? 12);
  const enRango = (mes: string) => {
    const i = MESES.indexOf(mes) + 1;
    return i >= desde && i <= hasta;
  };

  const curvaS: ConstructoraData['curvaS'] = [
    { mes: 'Ene', plan: 6, real: 5 }, { mes: 'Feb', plan: 11, real: 10 }, { mes: 'Mar', plan: 17, real: 15 },
    { mes: 'Abr', plan: 23, real: 21 }, { mes: 'May', plan: 29, real: 27 }, { mes: 'Jun', plan: 35, real: 32 },
    { mes: 'Jul', plan: 41, real: 38 }, { mes: 'Ago', plan: 46, real: 43 }, { mes: 'Sep', plan: 52, real: 49 },
    { mes: 'Oct', plan: 57, real: avanceCartera }, { mes: 'Nov', plan: 63, real: null }, { mes: 'Dic', plan: 69, real: null },
  ].filter(d => enRango(d.mes));

  const comprasMensuales = [
    { mes: 'Ene', monto: 120 }, { mes: 'Feb', monto: 95 }, { mes: 'Mar', monto: 140 }, { mes: 'Abr', monto: 170 },
    { mes: 'May', monto: 155 }, { mes: 'Jun', monto: 210 }, { mes: 'Jul', monto: 190 }, { mes: 'Ago', monto: 230 },
    { mes: 'Sep', monto: 205 }, { mes: 'Oct', monto: 182 },
  ].filter(d => enRango(d.mes));

  const ocTotalPend = todas.reduce((a, o) => a + o.ocPendientes, 0);
  const ordenesPorEstado = ocEstados(ocTotalPend).filter(o => !f.oc || norm(o.estado) === norm(f.oc));

  const incidenciasPorObra = INCIDENCIAS
    .filter(i => obras.some(o => o.obra === i.obra))
    .map(i => ({
      obra: i.obra,
      alta: !f.severidad || f.severidad === 'alta' ? i.alta : 0,
      media: !f.severidad || f.severidad === 'media' ? i.media : 0,
      baja: !f.severidad || f.severidad === 'baja' ? i.baja : 0,
    }));

  const avisos: string[] = [];
  if (obras.length < todas.length) {
    avisos.push('La curva S, las compras, las órdenes por estado, las facturas y el stock no se desglosan por obra: muestran toda la cartera.');
  }

  return {
    metrics,
    obrasDisponibles: todas.map(o => o.obra),
    avisos,
    obras,
    curvaS,
    comprasMensuales,
    ordenesPorEstado,
    incidenciasPorObra,
  };
}
