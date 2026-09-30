'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuditEvent {
  ts: string;
  type: string;
  outcome: 'ok' | 'fail' | 'denied';
  actor?: string;
  target?: string;
  ip?: string;
  detail?: string;
}

const TYPE_LABELS: Record<string, string> = {
  'auth.login': 'Inicio de sesión',
  'auth.logout': 'Cierre de sesión',
  'auth.lockout': 'Bloqueo por intentos',
  'auth.password_change': 'Cambio de contraseña',
  'access.denied': 'Acceso denegado',
  'user.create': 'Usuario creado',
  'user.update': 'Usuario modificado',
  'user.delete': 'Usuario eliminado',
};

const OUTCOME_STYLE: Record<AuditEvent['outcome'], { label: string; cls: string }> = {
  ok: { label: 'Correcto', cls: 'bg-green-500/20 text-green-300 border-green-500/30' },
  fail: { label: 'Fallido', cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  denied: { label: 'Denegado', cls: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

export default function AuditoriaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    fetch('/api/auditoria', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => setEvents(Array.isArray(json.data) ? json.data : []))
      .catch(() => setError('No se pudo cargar el registro de auditoría.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && user.role !== 'administrador') {
      router.replace('/dashboard/finanzas');
      return;
    }
    if (user) load();
  }, [user, router, load]);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ClipboardList size={32} className="text-green-400" />
            Auditoría de seguridad
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Últimos eventos de acceso y administración. Nunca se registran contraseñas.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
          style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1px solid rgba(34,197,94,0.3)' }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {error && <p className="text-red-300 text-sm">{error}</p>}

      <div
        className="rounded-2xl border border-white/10 overflow-x-auto"
        style={{ background: 'linear-gradient(135deg, rgba(10,18,35,0.8), rgba(16,28,48,0.8))' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
              <th className="px-4 py-3">Fecha y hora</th>
              <th className="px-4 py-3">Evento</th>
              <th className="px-4 py-3">Resultado</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Objetivo</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Sin eventos registrados todavía.</td>
              </tr>
            )}
            {events.map((e, i) => (
              <tr key={`${e.ts}-${i}`} className="border-b border-white/5 text-gray-200">
                <td className="px-4 py-2.5 whitespace-nowrap">{new Date(e.ts).toLocaleString('es-CL')}</td>
                <td className="px-4 py-2.5">{TYPE_LABELS[e.type] || e.type}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${OUTCOME_STYLE[e.outcome].cls}`}>
                    {OUTCOME_STYLE[e.outcome].label}
                  </span>
                </td>
                <td className="px-4 py-2.5">{e.actor || '—'}</td>
                <td className="px-4 py-2.5">{e.target || '—'}</td>
                <td className="px-4 py-2.5">{e.ip || '—'}</td>
                <td className="px-4 py-2.5 text-gray-300">{e.detail || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
