import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/server';
import { getDataSource } from '@/lib/datasource';
import { requireUser } from '@/lib/server/guard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Proyectos del usuario con sesión iniciada. La identidad sale de la sesión firmada, nunca de un parámetro. */
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const ds = getDataSource();
    const all = await ds.getProyectos();
    const mine =
      user.role === 'administrador' ? all : all.filter(p => (user.proyectos || []).includes(p.id));
    return ok(mine, ds.name);
  } catch (err) {
    return fail(err);
  }
}
