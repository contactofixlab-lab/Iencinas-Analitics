import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ok, fail } from '@/lib/api/server';
import { ModuleKey } from '@/types/domain';

export const dynamic = 'force-dynamic';

const VALID: ModuleKey[] = ['finanzas', 'comercial', 'marketing', 'valor-empresa'];

export async function GET(req: NextRequest, { params }: { params: { modulo: string } }) {
  try {
    const modulo = params.modulo as ModuleKey;
    if (!VALID.includes(modulo)) {
      return fail(new Error(`Módulo inválido: "${params.modulo}"`), 400);
    }
    const proyecto = req.nextUrl.searchParams.get('proyecto') || undefined;
    const ds = getDataSource();
    const data = await ds.getReportes(modulo, { proyecto });
    return ok(data, ds.name);
  } catch (err) {
    return fail(err);
  }
}
