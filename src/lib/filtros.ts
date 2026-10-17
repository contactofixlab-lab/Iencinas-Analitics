/**
 * Catálogo de filtros de lista (los «select» de la aplicación).
 * Cada categoría trae sus opciones predeterminadas; el administrador puede agregar más desde
 * Administración › Filtros. Este archivo lo comparten el servidor y el navegador.
 */

export interface FiltroCategoria {
  id: string;
  label: string;
  /** Módulo donde se usa la lista (solo informativo en la pantalla de administración). */
  modulo: string;
  descripcion: string;
  predeterminadas: string[];
}

export const FILTRO_CATEGORIAS: FiltroCategoria[] = [
  {
    id: 'tipo_transaccion',
    label: 'Tipo de transacción',
    modulo: 'Finanzas',
    descripcion: 'Filtro de la tabla de transacciones.',
    predeterminadas: ['Ingreso', 'Egreso'],
  },
  {
    id: 'tipo_propiedad',
    label: 'Tipo de propiedad',
    modulo: 'Comercial',
    descripcion: 'Filtro de la cartera de propiedades.',
    predeterminadas: ['Departamento', 'Casa', 'Loft'],
  },
  {
    id: 'estado_propiedad',
    label: 'Estado de la propiedad',
    modulo: 'Comercial',
    descripcion: 'Filtro de la cartera de propiedades.',
    predeterminadas: ['Vendida', 'En proceso', 'Disponible'],
  },
  {
    id: 'area',
    label: 'Área de trabajo',
    modulo: 'Administración',
    descripcion: 'Área de las personas usuarias (formulario y filtro de usuarios).',
    predeterminadas: ['Finanzas', 'Comercial', 'Marketing', 'Operaciones', 'Tecnología'],
  },
  {
    id: 'estado_obra',
    label: 'Estado de la obra',
    modulo: 'Constructora',
    descripcion: 'Filtro del resumen de Constructora.',
    predeterminadas: ['En ejecución', 'Terminada', 'Detenida'],
  },
  {
    id: 'estado_oc',
    label: 'Estado de la orden de compra',
    modulo: 'Constructora',
    descripcion: 'Filtro del gráfico de órdenes de compra.',
    predeterminadas: ['Pendiente de aprobación', 'Aprobada', 'Enviada', 'Recibida parcial', 'Recibida', 'Facturada'],
  },
];

export const FILTRO_CATEGORIA_IDS = FILTRO_CATEGORIAS.map(c => c.id);

export function categoriaPorId(id: string): FiltroCategoria | undefined {
  return FILTRO_CATEGORIAS.find(c => c.id === id);
}

/** Nombre de una opción: 1 a 40 caracteres, letras, números y signos simples. */
export const FILTRO_NOMBRE_RE = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ſ0-9][A-Za-zÀ-ÖØ-öø-ÿĀ-ſ0-9 .,&()/_-]{0,39}$/;
export const FILTRO_MAX_OPCIONES = 40;

/** Forma que viaja entre la API y la pantalla. */
export interface FiltroOpcionDTO {
  valor: string;
  predeterminada: boolean;
  /** Si está inactiva no aparece en la lista desplegable, pero sigue en el listado de administración. */
  activa: boolean;
}
export interface FiltroCategoriaDTO {
  id: string;
  label: string;
  modulo: string;
  descripcion: string;
  opciones: FiltroOpcionDTO[];
}

/**
 * Listas desplegables de la aplicación que NO se administran desde el catálogo (sus valores los define el sistema
 * o vienen de los datos). Se muestran en el listado de Administración › Filtros solo para consulta.
 */
export interface FiltroSistema {
  id: string;
  label: string;
  modulo: string;
  opciones: string[];
}

export const FILTROS_SISTEMA: FiltroSistema[] = [
  { id: 'perfil', label: 'Perfil de acceso', modulo: 'Administración', opciones: ['Finanzas', 'Comercial', 'Marketing', 'Administrador'] },
  { id: 'cronograma', label: 'Cronograma de la obra', modulo: 'Constructora', opciones: ['En plazo (SPI ≥ 1)', 'Con atraso (SPI < 1)'] },
  { id: 'severidad', label: 'Severidad de incidencias', modulo: 'Constructora', opciones: ['Alta', 'Media', 'Baja'] },
  {
    id: 'mes',
    label: 'Mes (Desde / Hasta)',
    modulo: 'Constructora',
    opciones: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  },
];
