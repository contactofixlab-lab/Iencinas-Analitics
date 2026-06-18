import { DataSource } from './types';
import {
  FinanzasData, ComercialData, MarketingData, ValorEmpresaData, ReportInfo, ModuleKey, Proyecto, QueryParams,
} from '@/types/domain';
import {
  finanzasMetrics, finanzasIngresos, finanzasGastos,
  comercialMetrics, comercialVentas, comercialPipeline,
  marketingMetrics, marketingLeads, marketingCanales,
  valorEmpresaMetrics, valorHistorico,
  reportesFinanzas, reportesComercial, reportesMarketing, reportesValorEmpresa,
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
    const proyecto = params?.proyecto || 'bosques-del-mar';

    if (proyecto === 'alameda-central') {
      return {
        metrics: m(alamedaFinanzasMetrics),
        ingresos: alamedaFinanzasIngresos,
        gastos: alamedaFinanzasIngresos.map(x => ({ mes: x.mes, valor: x.valor * 0.45 })),
      };
    }

    if (proyecto === 'lastarria-residencias') {
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
    const proyecto = params?.proyecto || 'bosques-del-mar';

    if (proyecto === 'alameda-central') {
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

    if (proyecto === 'lastarria-residencias') {
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
    const proyecto = params?.proyecto || 'bosques-del-mar';

    if (proyecto === 'alameda-central' || proyecto === 'lastarria-residencias') {
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

  async getValorEmpresa(params?: QueryParams): Promise<ValorEmpresaData> {
    const proyecto = params?.proyecto || 'bosques-del-mar';

    if (proyecto === 'alameda-central') {
      return {
        metrics: m([
          { label: 'Valuación Total', value: '$85M', trend: '+16.5%', up: true, color: 'green' },
          { label: 'EBITDA', value: '$19.2M', trend: '+10.8%', up: true, color: 'blue' },
          { label: 'Margen EBITDA', value: '22.6%', trend: '+1.9%', up: true, color: 'purple' },
          { label: 'ROE', value: '20.5%', trend: '+3.2%', up: true, color: 'green' },
        ]),
        historico: [
          { year: '2021', valor: 50 },
          { year: '2022', valor: 58 },
          { year: '2023', valor: 68 },
          { year: '2024', valor: 76 },
          { year: '2025', valor: 82 },
          { year: '2026', valor: 85 },
        ],
      };
    }

    if (proyecto === 'lastarria-residencias') {
      return {
        metrics: m([
          { label: 'Valuación Total', value: '$42M', trend: '+22.1%', up: true, color: 'green' },
          { label: 'EBITDA', value: '$9.8M', trend: '+18.4%', up: true, color: 'blue' },
          { label: 'Margen EBITDA', value: '23.3%', trend: '+3.1%', up: true, color: 'purple' },
          { label: 'ROE', value: '25.2%', trend: '+5.6%', up: true, color: 'green' },
        ]),
        historico: [
          { year: '2021', valor: 22 },
          { year: '2022', valor: 26 },
          { year: '2023', valor: 30 },
          { year: '2024', valor: 34 },
          { year: '2025', valor: 38 },
          { year: '2026', valor: 42 },
        ],
      };
    }

    return {
      metrics: m(valorEmpresaMetrics),
      historico: valorHistorico,
    };
  }

  async getReportes(modulo: ModuleKey, params?: QueryParams): Promise<ReportInfo[]> {
    switch (modulo) {
      case 'finanzas': return reportesFinanzas;
      case 'comercial': return reportesComercial;
      case 'marketing': return reportesMarketing;
      case 'valor-empresa': return reportesValorEmpresa;
      default: return [];
    }
  }
}
