import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ok, fail } from '@/lib/api/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ds = getDataSource();
    const data = await ds.getProyectos();
    return ok(data, ds.name);
  } catch (err) {
    return fail(err);
  }
}
