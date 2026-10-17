import { NextRequest } from 'next/server';
import { fail } from '@/lib/api/server';
import { clientIp, requireDesigner } from '@/lib/server/guard';
import { audit } from '@/lib/server/audit';
import { eliminadosDelSistema, restoreSystem } from '@/lib/server/bi/store';
import { json } from '@/lib/server/bi/run';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Gráficos del sistema que se eliminaron y se pueden restaurar. */
export async function GET(req: NextRequest) {
  try {
    await requireDesigner(req);
    return json({ ok: true, data: eliminadosDelSistema() });
  } catch (err) {
    return fail(err);
  }
}

/** Restaura los gráficos del sistema eliminados (vuelven a su módulo con su definición original). */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireDesigner(req);
    const n = restoreSystem();
    audit({ type: 'bi.restore', outcome: 'ok', actor: admin.id, ip: clientIp(req), detail: `${n} gráfico${n === 1 ? '' : 's'} del sistema restaurado${n === 1 ? '' : 's'}` });
    return json({ ok: true, data: { restaurados: n } });
  } catch (err) {
    return fail(err);
  }
}
