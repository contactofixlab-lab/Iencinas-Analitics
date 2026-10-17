import { NextRequest } from 'next/server';
import { fail, readJson } from '@/lib/api/server';
import { requireDesigner } from '@/lib/server/guard';
import { validateChartSpec } from '@/lib/server/bi/validate';
import { json, runSpec } from '@/lib/server/bi/run';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Vista previa del editor: valida la especificación y devuelve el resultado, sin guardar nada. */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireDesigner(req);
    const body = await readJson(req, 40_000);
    const { spec } = validateChartSpec(body.spec);
    return json({ ok: true, data: await runSpec(spec, admin) });
  } catch (err) {
    return fail(err);
  }
}
