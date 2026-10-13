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
  ok: { label: 'Correcto', cls: 'chip chip-ok' },
  fail: { label: 'Fallido', cls: 'chip chip-warn' },
  denied: { label: 'Denegado', cls: 'chip chip-danger' },
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
        <div className="flex items-center gap-3">
          <div className="icon-orb">
            <ClipboardList size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">Auditoría de seguridad</h1>
            <p className="text-soft text-sm mt-0.5">
              Últimos eventos de acceso y administración. Nunca se registran contraseñas.
            </p>
          </div>
        </div>
        <button type="button" onClick={load} disabled={loading} className="btn btn-secondary">
          <RefreshCw size={16} strokeWidth={1.8} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm">{error}</p>}

      <div className="table-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Fecha y hora', 'Evento', 'Resultado', 'Usuario', 'Objetivo', 'IP', 'Detalle'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && events.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-4">
                    <div className="skeleton h-6 w-full" role="status" aria-label="Cargando eventos" />
                  </td>
                </tr>
              )}
              {events.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-soft">Sin eventos registrados todavía.</td>
                </tr>
              )}
              {events.map((e, i) => (
                <tr key={`${e.ts}-${i}`}>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(e.ts).toLocaleString('es-CL')}</td>
                  <td className="px-4 py-3">{TYPE_LABELS[e.type] || e.type}</td>
                  <td className="px-4 py-3"><span className={OUTCOME_STYLE[e.outcome].cls}>{OUTCOME_STYLE[e.outcome].label}</span></td>
                  <td className="px-4 py-3">{e.actor || '—'}</td>
                  <td className="px-4 py-3 text-soft">{e.target || '—'}</td>
                  <td className="px-4 py-3 text-soft">{e.ip || '—'}</td>
                  <td className="px-4 py-3 text-soft">{e.detail || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
