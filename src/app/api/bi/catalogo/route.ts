import { NextRequest } from 'next/server';
import { fail } from '@/lib/api/server';
import { requireDesigner } from '@/lib/server/guard';
import { catalogo } from '@/lib/server/bi/sources';
import { json } from '@/lib/server/bi/run';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Fuentes de datos con sus conjuntos de datos y campos (solo administradores: es el catálogo del Diseñador). */
export async function GET(req: NextRequest) {
  try {
    await requireDesigner(req);
    return json({ ok: true, data: await catalogo(true) });
  } catch (err) {
    return fail(err);
  }
}
