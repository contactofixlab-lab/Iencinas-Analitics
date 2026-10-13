import { DataSource } from './types';
import {
  FinanzasData, ComercialData, MarketingData, GeneralData, ConstructoraData, ReportInfo, ModuleKey, Proyecto, QueryParams,
} from '@/types/domain';
import {
  finanzasMetrics, finanzasIngresos, finanzasGastos,
  comercialMetrics, comercialVentas, comercialPipeline,
  marketingMetrics, marketingLeads, marketingCanales,
  reportesFinanzas, reportesComercial, reportesMarketing, reportesGeneral, reportesConstructora,
  bdmFinanzasMetrics, bdmFinanzasIngresos, bdmFinanzasGastos,
  bdmComercialMetrics, bdmComercialVentas,
  bdmMarketingMetrics,
  alamedaFinanzasMetrics, alamedaFinanzasIngresos,
  alamedaComercialMetrics,
  lastarriaFinanzasMetrics,
  lastarriaComercialMetrics,
} from '@/lib/mockData';
import { PROYECTOS } from '@/lib/mockDatabase';
import { Metric } from '@/types/domain';
import { buildGeneral } from './general';
import { buildConstructora } from './constructora';

/** mockData uses loose `color: string`; assert it into the typed union. */
const m = (arr: { label: string; value: string; trend: string; up: boolean; color: string }[]): Metric[] =>
  arr.map(x => ({ ...x, color: x.color as Metric['color'] }));

/**
 * Mock datasource — serves static demo data with multi-proyecto support.
 */
export class MockDataSource implements DataSource {
  readonly name = 'mock';

  async getProyectos(): Promise<Proyecto[]> {
    return PROYECTOS;
  }

  async getFinanzas(params?: QueryParams): Promise<FinanzasData> {
    const proyecto = params?.proyecto || 'proj-001';

    if (proyecto === 'proj-002') {
      return {
        metrics: m(alamedaFinanzasMetrics),
        ingresos: alamedaFinanzasIngresos,
        gastos: alamedaFinanzasIngresos.map(x => ({ mes: x.mes, valor: x.valor * 0.45 })),
      };
    }

    if (proyecto === 'proj-009') {
      return {
        metrics: m(lastarriaFinanzasMetrics),
        ingresos: [
          { mes: 'Ene', valor: 700000 },
          { mes: 'Feb', valor: 750000 },
          { mes: 'Mar', valor: 780000 },
          { mes: 'Abr', valor: 800000 },
          { mes: 'May', valor: 820000 },
          { mes: 'Jun', valor: 850000 },
          { mes: 'Jul', valor: 840000 },
          { mes: 'Ago', valor: 860000 },
          { mes: 'Sep', valor: 880000 },
          { mes: 'Oct', valor: 900000 },
          { mes: 'Nov', valor: 920000 },
          { mes: 'Dic', valor: 950000 },
        ],
        gastos: [
          { mes: 'Ene', valor: 350000 },
          { mes: 'Feb', valor: 340000 },
          { mes: 'Mar', valor: 330000 },
          { mes: 'Abr', valor: 320000 },
          { mes: 'May', valor: 310000 },
          { mes: 'Jun', valor: 300000 },
          { mes: 'Jul', valor: 290000 },
          { mes: 'Ago', valor: 280000 },
          { mes: 'Sep', valor: 270000 },
          { mes: 'Oct', valor: 260000 },
          { mes: 'Nov', valor: 250000 },
          { mes: 'Dic', valor: 240000 },
        ],
      };
    }

    return {
      metrics: m(bdmFinanzasMetrics),
      ingresos: bdmFinanzasIngresos,
      gastos: bdmFinanzasGastos,
    };
  }

  async getComercial(params?: QueryParams): Promise<ComercialData> {
    const proyecto = params?.proyecto || 'proj-001';

    if (proyecto === 'proj-002') {
      return {
        metrics: m(alamedaComercialMetrics),
        ventas: [
          { mes: 'Ene', ventas: 5 },
          { mes: 'Feb', ventas: 6 },
          { mes: 'Mar', ventas: 5 },
          { mes: 'Abr', ventas: 7 },
          { mes: 'May', ventas: 6 },
          { mes: 'Jun', ventas: 8 },
          { mes: 'Jul', ventas: 7 },
          { mes: 'Ago', ventas: 7 },
          { mes: 'Sep', ventas: 8 },
          { mes: 'Oct', ventas: 8 },
          { mes: 'Nov', ventas: 9 },
          { mes: 'Dic', ventas: 9 },
        ],
        pipeline: [
          { etapa: 'Contacto', cantidad: 45 },
          { etapa: 'Visita', cantidad: 32 },
          { etapa: 'Propuesta', cantidad: 20 },
          { etapa: 'Negociación', cantidad: 14 },
          { etapa: 'Cierre', cantidad: 7 },
        ],
      };
    }

    if (proyecto === 'proj-009') {
      return {
        metrics: m(lastarriaComercialMetrics),
        ventas: [
          { mes: 'Ene', ventas: 2 },
          { mes: 'Feb', ventas: 3 },
          { mes: 'Mar', ventas: 3 },
          { mes: 'Abr', ventas: 4 },
          { mes: 'May', ventas: 3 },
          { mes: 'Jun', ventas: 4 },
          { mes: 'Jul', ventas: 4 },
          { mes: 'Ago', ventas: 4 },
          { mes: 'Sep', ventas: 4 },
          { mes: 'Oct', ventas: 4 },
          { mes: 'Nov', ventas: 5 },
          { mes: 'Dic', ventas: 5 },
        ],
        pipeline: [
          { etapa: 'Contacto', cantidad: 15 },
          { etapa: 'Visita', cantidad: 10 },
          { etapa: 'Propuesta', cantidad: 8 },
          { etapa: 'Negociación', cantidad: 5 },
          { etapa: 'Cierre', cantidad: 2 },
        ],
      };
    }

    return {
      metrics: m(bdmComercialMetrics),
      ventas: bdmComercialVentas,
      pipeline: [
        { etapa: 'Contacto', cantidad: 85 },
        { etapa: 'Visita', cantidad: 62 },
        { etapa: 'Propuesta', cantidad: 41 },
        { etapa: 'Negociación', cantidad: 28 },
        { etapa: 'Cierre', cantidad: 14 },
      ],
    };
  }

  async getMarketing(params?: QueryParams): Promise<MarketingData> {
    const proyecto = params?.proyecto || 'proj-001';

    if (proyecto === 'proj-002' || proyecto === 'proj-009') {
      return {
        metrics: m(marketingMetrics.map(m => ({ ...m, value: String(parseInt(m.value) * 0.6) }))),
        leads: [
          { mes: 'Ene', leads: 350 },
          { mes: 'Feb', leads: 370 },
          { mes: 'Mar', leads: 355 },
          { mes: 'Abr', leads: 425 },
          { mes: 'May', leads: 408 },
          { mes: 'Jun', leads: 450 },
          { mes: 'Jul', leads: 508 },
          { mes: 'Ago', leads: 474 },
          { mes: 'Sep', leads: 522 },
          { mes: 'Oct', leads: 552 },
          { mes: 'Nov', leads: 528 },
          { mes: 'Dic', leads: 576 },
        ],
        canales: [
          { canal: 'Google Ads', leads: 192, inversion: 9000 },
          { canal: 'Facebook', leads: 126, inversion: 5400 },
          { canal: 'Instagram', leads: 108, inversion: 4500 },
          { canal: 'Email', leads: 57, inversion: 1200 },
          { canal: 'Orgánico', leads: 25, inversion: 0 },
        ],
      };
    }

    return {
      metrics: m(bdmMarketingMetrics),
      leads: [
        { mes: 'Ene', leads: 348 },
        { mes: 'Feb', leads: 372 },
        { mes: 'Mar', leads: 354 },
        { mes: 'Abr', leads: 426 },
        { mes: 'May', leads: 408 },
        { mes: 'Jun', leads: 450 },
        { mes: 'Jul', leads: 508 },
        { mes: 'Ago', leads: 474 },
        { mes: 'Sep', leads: 522 },
        { mes: 'Oct', leads: 552 },
        { mes: 'Nov', leads: 528 },
        { mes: 'Dic', leads: 576 },
      ],
      canales: [
        { canal: 'Google Ads', leads: 192, inversion: 9000 },
        { canal: 'Facebook', leads: 126, inversion: 5400 },
        { canal: 'Instagram', leads: 108, inversion: 4500 },
        { canal: 'Email', leads: 57, inversion: 1200 },
        { canal: 'Orgánico', leads: 25, inversion: 0 },
      ],
    };
  }

  async getGeneral(_params?: QueryParams): Promise<GeneralData> {
    return buildGeneral();
  }

  async getConstructora(_params?: QueryParams): Promise<ConstructoraData> {
    return buildConstructora();
  }

  async getReportes(modulo: ModuleKey, params?: QueryParams): Promise<ReportInfo[]> {
    switch (modulo) {
      case 'finanzas': return reportesFinanzas;
      case 'comercial': return reportesComercial;
      case 'marketing': return reportesMarketing;
      case 'general': return reportesGeneral;
      case 'constructora': return reportesConstructora;
      default: return [];
    }
  }
}
