import { NextResponse } from 'next/server';
import { config, isCrmConfigured } from '@/lib/config';

export const dynamic = 'force-dynamic';

/** Quick diagnostics: which datasource is active and whether the CRM is wired up. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    dataSource: config.dataSource,
    crmConfigured: isCrmConfigured(),
    fallbackToMock: config.fallbackToMock,
    time: new Date().toISOString(),
  });
}
