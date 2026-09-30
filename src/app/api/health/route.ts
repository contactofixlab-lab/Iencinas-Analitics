import { NextRequest, NextResponse } from 'next/server';
import { config, isCrmConfigured } from '@/lib/config';
import { isAuthConfigured } from '@/lib/server/session';
import { requireAdmin } from '@/lib/server/guard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Público: solo indica que el servicio responde. El detalle de configuración es solo para administradores. */
export async function GET(req: NextRequest) {
  let detail: Record<string, unknown> = {};
  try {
    await requireAdmin(req);
    detail = {
      dataSource: config.dataSource,
      crmConfigured: isCrmConfigured(),
      fallbackToMock: config.fallbackToMock,
      authConfigured: isAuthConfigured(),
    };
  } catch {
    /* sin sesión de administrador: respuesta mínima */
  }
  const res = NextResponse.json({ ok: true, time: new Date().toISOString(), ...detail });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
