'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { devLogin } from '@/lib/auth';
import { Eye, EyeOff, Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { ROLE_AVATAR } from '@/lib/ui';
import { UserRole } from '@/types';

const DEFAULT_ROUTES: Record<string, string> = {
  finanzas: '/dashboard/finanzas',
  comercial: '/dashboard/comercial',
  marketing: '/dashboard/marketing',
  administrador: '/dashboard/general',
};

// Acceso rápido solo en desarrollo local (no contiene contraseñas; en producción no se muestra ni el servidor lo acepta).
const SHOW_QUICK_ACCESS = process.env.NODE_ENV !== 'production';
const DEMO_USERS: { label: string; role: string; roleKey: UserRole; email: string }[] = [
  { label: 'Juan Díaz',       role: 'Finanzas',  roleKey: 'finanzas',      email: 'juan@iencinas.cl' },
  { label: 'María Rodríguez', role: 'Comercial', roleKey: 'comercial',     email: 'maria@iencinas.cl' },
  { label: 'Carlos Cortés',   role: 'Marketing', roleKey: 'marketing',     email: 'carlos@iencinas.cl' },
  { label: 'Ana Silva',       role: 'Admin',     roleKey: 'administrador', email: 'ana@iencinas.cl' },
];

export default function LoginPage() {
  const { login, setSessionUser } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(DEFAULT_ROUTES[user.role] || '/dashboard/finanzas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión. Intenta nuevamente.');
      setLoading(false);
    }
  }

  async function handleQuickAccess(demoEmail: string) {
    setError('');
    setLoading(true);
    try {
      const user = await devLogin(demoEmail);
      setSessionUser(user);
      router.push(DEFAULT_ROUTES[user.role] || '/dashboard/finanzas');
    } catch {
      setError('El acceso rápido no está disponible en este entorno.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10">
      {/* Luces de fondo (degradados estáticos: sin filtros pesados) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ width: 640, height: 640, left: '-10%', top: '-14%', background: 'radial-gradient(circle, rgb(var(--brand) / 0.42), transparent 66%)' }} />
        <div className="absolute" style={{ width: 720, height: 720, right: '-12%', bottom: '-22%', background: 'radial-gradient(circle, rgb(var(--brand-soft) / 0.95), transparent 66%)' }} />
        <div className="absolute" style={{ width: 460, height: 460, right: '14%', top: '6%', background: 'radial-gradient(circle, rgb(255 255 255 / 0.49), transparent 68%)' }} />
      </div>

      <div className="glass-strong relative w-full max-w-md" style={{ borderRadius: 28, zIndex: 10 }}>
        <div className="sheen" />
        <div className="p-8 sm:p-10">
          {/* Logotipo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="" width={56} height={56} className="w-14 h-14" style={{ filter: 'drop-shadow(0 8px 14px rgb(92 124 158 / 0.35))' }} />
              <span aria-hidden="true" className="h-12 w-px" style={{ background: 'rgb(var(--line) / 0.55)' }} />
              <div className="leading-none">
                <p className="text-[1.7rem] font-bold tracking-tight text-brand-deep">Iencinas</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-soft mt-1.5">Analytics</p>
              </div>
            </div>
            <p className="text-sm text-soft mt-6">Ingresa para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={17} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
              <input
                type="email" value={email} required autoComplete="username"
                onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                aria-label="Correo electrónico"
                className="field w-full !pl-11"
              />
            </div>

            <div className="relative">
              <Lock size={17} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'} value={password} required autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                aria-label="Contraseña"
                className="field w-full !pl-11 !pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-mute hover:text-ink transition-colors"
              >
                {showPass ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
              </button>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 px-4 py-3 rounded-2xl text-sm"
                style={{ background: 'rgb(var(--danger) / 0.10)', border: '1px solid rgb(var(--danger) / 0.28)', color: 'rgb(var(--danger-ink))' }}>
                <AlertCircle size={17} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full !h-12">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Ingresando...</>
                : <>Ingresar <ChevronRight size={17} strokeWidth={2} /></>}
            </button>
          </form>

          {SHOW_QUICK_ACCESS && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: 'rgb(var(--line) / 0.35)' }} />
                <span className="text-[11px] uppercase tracking-[0.14em] text-mute font-semibold">Acceso rápido</span>
                <div className="flex-1 h-px" style={{ background: 'rgb(var(--line) / 0.35)' }} />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {DEMO_USERS.map(u => (
                  <button
                    key={u.email}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickAccess(u.email)}
                    className="glass-sm glass-card--interactive flex items-center gap-2.5 px-3 py-2.5 text-left disabled:opacity-60"
                  >
                    <span
                      className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white shrink-0"
                      style={{ background: ROLE_AVATAR[u.roleKey], textShadow: '0 1px 2px rgb(52 73 94 / 0.25)' }}
                    >
                      {u.label[0]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-ink text-xs font-semibold leading-tight truncate">{u.label.split(' ')[0]}</span>
                      <span className="block text-mute text-xs leading-tight">{u.role}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="text-center text-xs text-mute mt-6">
            © 2026 Iencinas Analytics · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
