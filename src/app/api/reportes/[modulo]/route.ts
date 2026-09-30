import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ok, fail, parseParams } from '@/lib/api/server';
import { authorizeModule } from '@/lib/server/guard';
import { ModuleKey } from '@/types/domain';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VALID: ModuleKey[] = ['finanzas', 'comercial', 'marketing', 'valor-empresa'];

export async function GET(req: NextRequest, { params }: { params: { modulo: string } }) {
  try {
    const modulo = params.modulo as ModuleKey;
    if (!VALID.includes(modulo)) {
      return fail(new Error('Módulo inválido'), 400);
    }
    const { proyecto } = parseParams(req);
    await authorizeModule(req, modulo, proyecto);
    const ds = getDataSource();
    let data = await ds.getReportes(modulo, { proyecto });
    if (!Array.isArray(data)) {
      data = [];
    }
    return ok(data, ds.name);
  } catch (err) {
    return fail(err);
  }
}
