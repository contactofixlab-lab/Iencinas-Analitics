import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ok, fail } from '@/lib/api/server';
import { requireAdmin } from '@/lib/server/guard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Catálogo completo de proyectos: solo para administración (asignar proyectos a usuarios). */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const ds = getDataSource();
    const data = await ds.getProyectos();
    return ok(data, ds.name);
  } catch (err) {
    return fail(err);
  }
}
