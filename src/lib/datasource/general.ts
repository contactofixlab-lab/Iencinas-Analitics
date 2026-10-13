import { GeneralData, Metric } from '@/types/domain';
import { PROYECTOS, TRANSACCIONES, VENTAS, LEADS } from '@/lib/mockDatabase';

/** Formatea dólares en millones/miles: 4_200_000 → "$4.2M". */
function usd(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

const pct = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);

/**
 * Resumen de toda la empresa, calculado sobre la base de datos de demostración (todos los proyectos).
 * Cuando exista el CRM, esta misma forma de datos llegará de `CrmDataSource.getGeneral()`.
 */
export function buildGeneral(): GeneralData {
  const ingresos = TRANSACCIONES.filter(t => t.tipo === 'Ingreso').reduce((a, t) => a + t.monto, 0);
  const egresos = TRANSACCIONES.filter(t => t.tipo === 'Egreso').reduce((a, t) => a + t.monto, 0);
  const margen = pct(ingresos - egresos, ingresos);

  const cerradas = VENTAS.filter(v => v.etapa === 'Cerrada');
  const valorCerradas = cerradas.reduce((a, v) => a + v.valor, 0);
  const abiertas = VENTAS.filter(v => v.etapa !== 'Cerrada' && v.etapa !== 'Cancelada');
  const valorAbiertas = abiertas.reduce((a, v) => a + v.valor, 0);

  const convertidos = LEADS.filter(l => l.estado === 'Convertido').length;
  const activos = PROYECTOS.filter(p => p.estado === 'activo').length;

  const metrics: Metric[] = [
    { label: 'Ingresos Totales', value: usd(ingresos), trend: '', up: true, color: 'green', caption: `${TRANSACCIONES.filter(t => t.tipo === 'Ingreso').length} transacciones` },
    { label: 'Egresos Totales', value: usd(egresos), trend: '', up: false, color: 'red', caption: `${TRANSACCIONES.filter(t => t.tipo === 'Egreso').length} transacciones` },
    { label: 'Margen Neto', value: `${margen.toFixed(1)}%`, trend: '', up: margen >= 0, color: 'blue', caption: 'sobre ingresos' },
    { label: 'Ventas Cerradas', value: String(cerradas.length), trend: '', up: true, color: 'green', caption: `valor ${usd(valorCerradas)}` },
    { label: 'Pipeline Abierto', value: usd(valorAbiertas), trend: '', up: true, color: 'purple', caption: `${abiertas.length} negociaciones` },
    { label: 'Leads Generados', value: String(LEADS.length), trend: '', up: true, color: 'orange', caption: `${convertidos} convertidos` },
    { label: 'Tasa de Conversión', value: `${pct(convertidos, LEADS.length).toFixed(1)}%`, trend: '', up: true, color: 'blue', caption: 'leads → clientes' },
    { label: 'Proyectos Activos', value: String(activos), trend: '', up: true, color: 'green', caption: `de ${PROYECTOS.length} proyectos` },
  ];

  const resumenProyectos = PROYECTOS.map(p => {
    const trx = TRANSACCIONES.filter(t => t.proyectoId === p.id);
    return {
      proyecto: p.nombre,
      ubicacion: p.ubicacion,
      estado: p.estado,
      ingresos: trx.filter(t => t.tipo === 'Ingreso').reduce((a, t) => a + t.monto, 0),
      egresos: trx.filter(t => t.tipo === 'Egreso').reduce((a, t) => a + t.monto, 0),
      ventasCerradas: VENTAS.filter(v => v.proyectoId === p.id && v.etapa === 'Cerrada').length,
      leads: LEADS.filter(l => l.proyectoId === p.id).length,
    };
  }).sort((a, b) => b.ingresos - a.ingresos);

  const count = <T,>(arr: T[], key: (x: T) => string) => {
    const m = new Map<string, number>();
    arr.forEach(x => m.set(key(x), (m.get(key(x)) ?? 0) + 1));
    return Array.from(m.entries());
  };

  return {
    metrics,
    ingresosEgresosPorProyecto: resumenProyectos
      .filter(r => r.ingresos > 0 || r.egresos > 0)
      .slice(0, 8)
      .map(r => ({ proyecto: r.proyecto, ingresos: r.ingresos, egresos: r.egresos })),
    ventasPorEtapa: count(VENTAS, v => v.etapa).map(([etapa, cantidad]) => ({ etapa, cantidad })),
    leadsPorCanal: count(LEADS, l => l.canal).map(([canal, leads]) => ({ canal, leads })).sort((a, b) => b.leads - a.leads),
    proyectosPorEstado: count(PROYECTOS, p => p.estado[0].toUpperCase() + p.estado.slice(1)).map(([estado, cantidad]) => ({ estado, cantidad })),
    resumenProyectos,
  };
}
