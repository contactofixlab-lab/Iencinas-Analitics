'use client';

import { useCallback, useEffect, useState } from 'react';
import { FILTRO_CATEGORIAS, type FiltroCategoriaDTO } from '@/lib/filtros';

export interface OpcionSelect {
  label: string;
  value: string;
}

/** Opciones predeterminadas: se usan mientras carga el catálogo o si la API no responde. */
const DEFAULTS: FiltroCategoriaDTO[] = FILTRO_CATEGORIAS.map(c => ({
  id: c.id,
  label: c.label,
  modulo: c.modulo,
  descripcion: c.descripcion,
  opciones: c.predeterminadas.map(valor => ({ valor, predeterminada: true, activa: true })),
}));

let cache: FiltroCategoriaDTO[] | null = null;
let inflight: Promise<FiltroCategoriaDTO[]> | null = null;
const listeners = new Set<(c: FiltroCategoriaDTO[]) => void>();

async function fetchCatalogo(): Promise<FiltroCategoriaDTO[]> {
  try {
    const res = await fetch('/api/filtros', { cache: 'no-store', credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json.data) ? (json.data as FiltroCategoriaDTO[]) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

/** Reemplaza el catálogo en memoria (por ejemplo, tras agregar o quitar una opción) y avisa a las pantallas abiertas. */
export function setCatalogoFiltros(data: FiltroCategoriaDTO[]) {
  cache = data;
  listeners.forEach(fn => fn(data));
}

/**
 * Catálogo de opciones de los filtros. `opciones('tipo_propiedad')` devuelve las opciones ACTIVAS listas para un select.
 * Se descarga una vez por sesión de navegación y se comparte entre pantallas.
 */
export function useFiltros() {
  const [categorias, setCategorias] = useState<FiltroCategoriaDTO[]>(cache ?? DEFAULTS);
  const [loading, setLoading] = useState(cache === null);

  const reload = useCallback(async () => {
    inflight = fetchCatalogo();
    const data = await inflight;
    inflight = null;
    setCatalogoFiltros(data);
  }, []);

  useEffect(() => {
    listeners.add(setCategorias);
    if (cache === null) {
      (inflight ??= fetchCatalogo()).then(data => {
        inflight = null;
        setCatalogoFiltros(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      listeners.delete(setCategorias);
    };
  }, []);

  const opciones = useCallback(
    (id: string): OpcionSelect[] =>
      (categorias.find(c => c.id === id)?.opciones ?? []).filter(o => o.activa).map(o => ({ label: o.valor, value: o.valor })),
    [categorias],
  );

  return { categorias, opciones, loading, reload };
}
