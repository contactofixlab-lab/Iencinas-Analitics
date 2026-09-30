import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ok, fail, parseParams } from '@/lib/api/server';
import { authorizeModule } from '@/lib/server/guard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const params = parseParams(req);
    await authorizeModule(req, 'comercial', params.proyecto);
    const ds = getDataSource();
    const data = await ds.getComercial(params);
    return ok(data, ds.name);
  } catch (err) {
    return fail(err);
  }
}
