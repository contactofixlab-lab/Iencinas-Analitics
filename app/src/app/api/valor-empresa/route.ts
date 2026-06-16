import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ok, fail, parseParams } from '@/lib/api/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ds = getDataSource();
    const params = parseParams(req);
    const proyecto = req.nextUrl.searchParams.get('proyecto') || undefined;
    const data = await ds.getValorEmpresa({ ...params, proyecto });
    return ok(data, ds.name);
  } catch (err) {
    return fail(err);
  }
}
