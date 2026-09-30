'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Building2, FileText, Edit2, LogOut, Briefcase, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { changePassword } from '@/lib/auth';

const ROLE_LABELS: Record<string, string> = {
  finanzas: 'Gerente de Finanzas',
  comercial: 'Director Comercial',
  marketing: 'Jefe de Marketing',
  administrador: 'Administrador del Sistema',
};

const ROLE_COLORS: Record<string, { gradient: string; badge: string }> = {
  finanzas: { gradient: 'from-blue-500 to-blue-600', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  comercial: { gradient: 'from-orange-500 to-orange-600', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  marketing: { gradient: 'from-purple-500 to-purple-600', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  administrador: { gradient: 'from-green-500 to-green-600', badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
};

function getInitials(nombre: string, apellido1: string) {
  return `${nombre[0]}${apellido1[0]}`.toUpperCase();
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

  const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none border border-white/15 focus:border-green-400/60';
  const inputStyle = { background: 'rgba(255, 255, 255, 0.08)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="rounded-3xl p-8 backdrop-blur-xl border border-white/10"
      style={{
        background: 'linear-gradient(135deg, rgba(10,18,35,0.8), rgba(16,28,48,0.8))',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(74, 222, 128, 0.1)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
          <KeyRound size={24} className="text-yellow-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Seguridad de la cuenta</h3>
      </div>
      <p className="text-gray-400 text-sm mb-5">
        Cambia tu contraseña periódicamente. Mínimo 10 caracteres, combinando letras y números. No la compartas con nadie.
      </p>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="password" autoComplete="current-password" required placeholder="Contraseña actual"
          value={current} onChange={e => setCurrent(e.target.value)} className={inputCls} style={inputStyle} />
        <input type="password" autoComplete="new-password" required placeholder="Nueva contraseña"
          value={next} onChange={e => setNext(e.target.value)} className={inputCls} style={inputStyle} />
        <input type="password" autoComplete="new-password" required placeholder="Repite la nueva contraseña"
          value={confirm} onChange={e => setConfirm(e.target.value)} className={inputCls} style={inputStyle} />
        <div className="md:col-span-3 flex items-center gap-4 flex-wrap">
          <button type="submit" disabled={busy}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
            style={{ background: 'rgba(34,197,94,0.25)', border: '1px solid rgba(34,197,94,0.4)' }}>
            {busy ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
          {msg && (
            <span className={`text-sm ${msg.type === 'ok' ? 'text-green-300' : 'text-red-300'}`} role="status">{msg.text}</span>
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
  const roleColor = ROLE_COLORS[user.role];
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
    { icon: Mail, color: 'text-cyan-400', label: 'Email', value: user.email },
    { icon: Phone, color: 'text-emerald-400', label: 'Teléfono', value: profileData.telefono },
    { icon: MapPin, color: 'text-orange-400', label: 'Ubicación', value: profileData.ubicacion },
    { icon: Building2, color: 'text-purple-400', label: 'Departamento', value: user.departamento },
    { icon: Calendar, color: 'text-blue-400', label: 'Ingreso', value: profileData.fechaIngreso },
    { icon: Briefcase, color: 'text-yellow-400', label: 'Experiencia', value: profileData.tiempoExperiencia },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent">Mi Perfil</h1>
            <p className="text-gray-400 mt-1">Gestiona tu información personal y acceso</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition-all duration-200"
            style={{
              background: 'rgba(34, 197, 94, 0.18)',
              border: '1px solid rgba(34,197,94,0.3)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(34, 197, 94, 0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(34, 197, 94, 0.18)'; }}
          >
            <Edit2 size={18} className="text-green-300" />
            <span>Editar</span>
          </motion.button>
        </motion.div>

        {/* Main Section con Avatar Flotante */}
        <div className="relative">
          {/* Avatar Flotante - Fuera del cuadro */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute -top-20 left-0 z-10"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${roleColor.gradient} flex items-center justify-center text-white font-bold text-6xl`}
              style={{
                boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
            >
              {initials}
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold border border-green-500/30 mt-4 ml-2"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
              {profileData.estadoDispositivo}
            </motion.div>
          </motion.div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl p-8 backdrop-blur-xl border border-white/10 pt-24 lg:pl-56"
            style={{
              background: 'linear-gradient(135deg, rgba(10,18,35,0.8), rgba(16,28,48,0.8))',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(74, 222, 128, 0.1)',
            }}
          >
            {/* Name & Title */}
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-white mb-3">{fullName}</h2>
              <div className="inline-flex items-center gap-2">
                <span className={`text-sm px-4 py-2 rounded-xl font-semibold border ${roleColor.badge}`}>
                  {ROLE_LABELS[user.role]}
                </span>
                <span className="text-xs text-gray-400 font-medium">Nivel: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
            </div>

            {/* Info Grid - Moderno */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group p-5 rounded-2xl backdrop-blur-lg border border-white/10 transition-all duration-300 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                        <Icon size={24} className={`${item.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{item.label}</p>
                        <p className="text-white font-semibold text-sm mt-2 truncate group-hover:text-green-300 transition-colors">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-3xl p-8 backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(10,18,35,0.8), rgba(16,28,48,0.8))',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(74, 222, 128, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <FileText size={24} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Sobre mí</h3>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg">{profileData.bio}</p>
        </motion.div>

        {/* Modules & Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-3xl p-8 backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(10,18,35,0.8), rgba(16,28,48,0.8))',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(74, 222, 128, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Briefcase size={24} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Módulos Disponibles</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Finanzas', color: 'from-blue-500 to-cyan-500' },
              { name: 'Comercial', color: 'from-orange-500 to-red-500' },
              { name: 'Marketing', color: 'from-purple-500 to-pink-500' },
              { name: 'Valor Empresa', color: 'from-green-500 to-emerald-500' },
            ].map((modulo) => (
              <motion.div
                key={modulo.name}
                whileHover={{ y: -6 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${modulo.color} bg-opacity-10 border border-white/20 text-center backdrop-blur-lg`}
              >
                <p className="text-white font-semibold">{modulo.name}</p>
                <p className="text-xs text-green-300 font-bold mt-3 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Acceso
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <ChangePasswordCard />

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-red-300 transition-all duration-200"
            style={{
              background: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.18)'; }}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
