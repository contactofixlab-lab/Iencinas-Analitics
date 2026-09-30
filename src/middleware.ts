import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/server/session';

const DEFAULT_ROUTES: Record<string, string> = {
  finanzas: '/dashboard/finanzas',
  comercial: '/dashboard/comercial',
  marketing: '/dashboard/marketing',
  administrador: '/dashboard/finanzas',
};

/** Prefijos de página restringidos por rol (el resto de /dashboard solo exige sesión). */
const PAGE_RULES: { prefix: string; roles: string[] }[] = [
  { prefix: '/dashboard/admin', roles: ['administrador'] },
  { prefix: '/admin', roles: ['administrador'] },
  { prefix: '/dashboard/valor-empresa', roles: ['administrador'] },
  { prefix: '/dashboard/finanzas', roles: ['finanzas', 'administrador'] },
  { prefix: '/dashboard/comercial', roles: ['comercial', 'administrador'] },
  { prefix: '/dashboard/marketing', roles: ['marketing', 'administrador'] },
];

function startsWithSegment(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + '/');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  // API: /api/auth/* y /api/health se resuelven solos; todo lo demás exige sesión válida.
  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/auth/') || pathname === '/api/health') return NextResponse.next();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'No autenticado.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }
    return NextResponse.next();
  }

  // Página de login: si ya hay sesión, enviar a su inicio.
  if (pathname === '/login') {
    if (session) return NextResponse.redirect(new URL(DEFAULT_ROUTES[session.role] || '/dashboard/finanzas', request.url));
    return NextResponse.next();
  }

  if (pathname === '/') {
    const target = session ? DEFAULT_ROUTES[session.role] || '/dashboard/finanzas' : '/login';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // /dashboard/* y /admin/*
  if (!session) return NextResponse.redirect(new URL('/login', request.url));
  const rule = PAGE_RULES.find(r => startsWithSegment(pathname, r.prefix));
  if (rule && !rule.roles.includes(session.role)) {
    return NextResponse.redirect(new URL(DEFAULT_ROUTES[session.role] || '/dashboard/finanzas', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/admin/:path*', '/api/:path*'],
};
