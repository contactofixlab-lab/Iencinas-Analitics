'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { m as motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Building2, FileText, Edit2, LogOut, Briefcase, KeyRound, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { changePassword } from '@/lib/auth';
import { ROLE_AVATAR, ROLE_CHIP, ROLE_LABELS } from '@/lib/ui';

function getInitials(nombre: string, apellido1: string) {
  return `${nombre[0]}${apellido1[0]}`.toUpperCase();
}

const MODULOS = [
  { name: 'Finanzas',      tint: 'rgb(var(--brand) / 0.28)', fg: 'rgb(var(--brand-deep))' },
  { name: 'Comercial',     tint: 'rgb(214 150 80 / 0.20)',   fg: 'rgb(150 90 24)' },
  { name: 'Marketing',     tint: 'rgb(150 128 214 / 0.20)',  fg: 'rgb(96 74 156)' },
  { name: 'Valor Empresa', tint: 'rgb(52 140 104 / 0.16)',   fg: 'rgb(34 106 76)' },
];

function SectionTitle({ icon: Icon, children, tint, fg }: { icon: typeof FileText; children: React.ReactNode; tint: string; fg: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-11 h-11 rounded-full grid place-items-center" style={{ background: tint, color: fg, border: '1px solid var(--glass-border)', boxShadow: 'var(--inner-sheen)' }}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <h3 className="text-xl font-semibold text-ink">{children}</h3>
    </div>
  );
}

function ChangePasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) {
      setMsg({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    setBusy(true);
    try {
      await changePassword(current, next);
      setMsg({ type: 'ok', text: 'Contraseña actualizada. Se cerraron tus sesiones abiertas en otros equipos.' });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'No se pudo cambiar la contraseña.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card"
      style={{ padding: 'calc(var(--pad-card) + 6px)' }}
    >
      <div className="sheen" />
      <SectionTitle icon={KeyRound} tint="rgb(214 150 80 / 0.20)" fg="rgb(150 90 24)">Seguridad de la cuenta</SectionTitle>
      <p className="text-soft text-sm -mt-2 mb-5">
        Cambia tu contraseña periódicamente. Mínimo 10 caracteres, combinando letras y números. No la compartas con nadie.
      </p>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="password" autoComplete="current-password" required placeholder="Contraseña actual" aria-label="Contraseña actual"
          value={current} onChange={e => setCurrent(e.target.value)} className="field" />
        <input type="password" autoComplete="new-password" required placeholder="Nueva contraseña" aria-label="Nueva contraseña"
          value={next} onChange={e => setNext(e.target.value)} className="field" />
        <input type="password" autoComplete="new-password" required placeholder="Repite la nueva contraseña" aria-label="Repite la nueva contraseña"
          value={confirm} onChange={e => setConfirm(e.target.value)} className="field" />
        <div className="md:col-span-3 flex items-center gap-4 flex-wrap">
          <button type="submit" disabled={busy} className="btn btn-primary">
            {busy ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
          {msg && (
            <span role="status" className={`chip ${msg.type === 'ok' ? 'chip-ok' : 'chip-danger'}`} style={{ fontSize: 13 }}>
              {msg.type === 'ok' && <CheckCircle2 size={15} strokeWidth={2} />}
              {msg.text}
            </span>
          )}
        </div>
      </form>
    </motion.div>
  );
}

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  const fullName = `${user.nombre} ${user.apellido1} ${user.apellido2}`;
  const initials = getInitials(user.nombre, user.apellido1);

  const profileData = {
    telefono: '+56 9 3456 7890',
    ubicacion: 'Santiago, Chile - Edificio Centro',
    fechaIngreso: '15 de Marzo, 2024',
    tiempoExperiencia: '5 años',
    bio: 'Especialista en gestión de proyectos inmobiliarios con más de 5 años de experiencia en el sector.',
    estadoDispositivo: 'En línea',
  };

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  const infoItems = [
    { icon: Mail,      tint: 'rgb(var(--brand) / 0.28)', fg: 'rgb(var(--brand-deep))', label: 'Email', value: user.email },
    { icon: Phone,     tint: 'rgb(52 140 104 / 0.16)',   fg: 'rgb(34 106 76)',         label: 'Teléfono', value: profileData.telefono },
    { icon: MapPin,    tint: 'rgb(214 150 80 / 0.20)',   fg: 'rgb(150 90 24)',         label: 'Ubicación', value: profileData.ubicacion },
    { icon: Building2, tint: 'rgb(150 128 214 / 0.20)',  fg: 'rgb(96 74 156)',         label: 'Departamento', value: user.departamento },
    { icon: Calendar,  tint: 'rgb(var(--brand) / 0.28)', fg: 'rgb(var(--brand-deep))', label: 'Ingreso', value: profileData.fechaIngreso },
    { icon: Briefcase, tint: 'rgb(224 138 150 / 0.20)',  fg: 'rgb(160 52 64)',         label: 'Experiencia', value: profileData.tiempoExperiencia },
  ];

  return (
    <div className="p-2 lg:p-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold t-title">Mi Perfil</h1>
            <p className="text-soft mt-1">Gestiona tu información personal y acceso</p>
          </div>
          <button type="button" onClick={() => router.push('/dashboard')} className="btn btn-secondary">
            <Edit2 size={17} strokeWidth={1.8} />
            Editar
          </button>
        </motion.div>

        {/* Tarjeta principal con avatar flotante fuera del cuadro */}
        <div className="relative pt-20">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="absolute top-0 left-6 sm:left-8 z-10"
          >
            <div
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-[2rem] flex items-center justify-center text-white font-bold text-5xl sm:text-6xl"
              style={{
                background: ROLE_AVATAR[user.role],
                border: '4px solid rgb(255 255 255 / 0.52)',
                boxShadow: '0 24px 50px -16px rgb(92 124 158 / 0.55), inset 0 1px 0 rgb(255 255 255 / 0.30)',
                textShadow: '0 2px 6px rgb(52 73 94 / 0.25)',
              }}
            >
              {initials}
            </div>
            <div className="chip chip-ok mt-4 ml-2" style={{ animation: 'bobSoft 3s ease-in-out infinite' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'rgb(var(--ok))' }} />
              {profileData.estadoDispositivo}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card glass-card--featured pt-24 sm:pt-12 sm:pl-64 pb-8 px-6 sm:pr-8"
          >
            <div className="sheen" />
            <div className="mb-7">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-3">{fullName}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={ROLE_CHIP[user.role]} style={{ fontSize: 13 }}>{ROLE_LABELS[user.role]}</span>
                <span className="text-xs text-mute font-medium">Nivel: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + idx * 0.05 }}
                    className="glass-card glass-card--compact flex items-center gap-4"
                    style={{ padding: '16px 18px', background: 'rgb(255 255 255 / 0.36)' }}
                  >
                    <div className="w-11 h-11 rounded-full grid place-items-center shrink-0" style={{ background: item.tint, color: item.fg, border: '1px solid var(--glass-border)', boxShadow: 'var(--inner-sheen)' }}>
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-mute font-semibold uppercase tracking-wider">{item.label}</p>
                      <p className="text-ink font-semibold text-sm mt-1 truncate" title={item.value}>{item.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sobre mí */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card"
          style={{ padding: 'calc(var(--pad-card) + 6px)' }}
        >
          <div className="sheen" />
          <SectionTitle icon={FileText} tint="rgb(150 128 214 / 0.20)" fg="rgb(96 74 156)">Sobre mí</SectionTitle>
          <p className="text-soft leading-relaxed text-lg -mt-1">{profileData.bio}</p>
        </motion.div>

        {/* Módulos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="glass-card"
          style={{ padding: 'calc(var(--pad-card) + 6px)' }}
        >
          <div className="sheen" />
          <SectionTitle icon={Briefcase} tint="rgb(52 140 104 / 0.16)" fg="rgb(34 106 76)">Módulos Disponibles</SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MODULOS.map(mod => (
              <div
                key={mod.name}
                className="glass-card glass-card--compact glass-card--interactive text-center"
                style={{ padding: '20px 14px', background: mod.tint }}
              >
                <p className="font-semibold" style={{ color: mod.fg }}>{mod.name}</p>
                <p className="text-xs font-semibold mt-2.5 inline-flex items-center justify-center gap-1.5 text-ok-ink">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'rgb(var(--ok))' }} />
                  Acceso
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <ChangePasswordCard />

        <div className="flex justify-center pt-2 pb-6">
          <button type="button" onClick={handleLogout} className="btn btn-danger">
            <LogOut size={18} strokeWidth={1.8} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
