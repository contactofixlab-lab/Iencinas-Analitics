'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  finanzas: 'Gerente de Finanzas',
  comercial: 'Director Comercial',
  marketing: 'Jefe de Marketing',
  administrador: 'Administrador',
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  finanzas: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-300' },
  comercial: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-300' },
  marketing: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-300' },
  administrador: { bg: 'from-green-500 to-green-600', text: 'text-green-300' },
};

function getInitials(nombre: string, apellido1: string) {
  return `${nombre[0]}${apellido1[0]}`.toUpperCase();
}

export default function Navbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  if (!user) return null;

  const initials = getInitials(user.nombre, user.apellido1);
  const fullName = `${user.nombre} ${user.apellido1} ${user.apellido2}`;
  const roleColor = ROLE_COLORS[user.role];

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky z-40 flex items-center justify-between"
      style={{
        top: 16,
        margin: 16,
        marginBottom: 0,
        padding: '12px 18px',
        borderRadius: 26,
        background: 'linear-gradient(180deg, rgba(13,24,40,0.82) 0%, rgba(10,18,32,0.86) 100%)',
        backdropFilter: 'blur(28px) saturate(150%)',
        WebkitBackdropFilter: 'blur(28px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 28px 70px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.14), 0 0 30px rgba(74,222,128,0.06)',
      }}
    >
      {/* Logo sobre píldora clara para contraste y énfasis de marca */}
      <div
        className="flex items-center px-4 py-2 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eaf2fb 100%)',
          boxShadow: '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        <img
          src="/logo original color.png"
          alt="Iencinas Analytics"
          className="h-11 w-auto object-contain"
        />
      </div>
      {title && <h1 className="text-xl font-bold text-white">{title}</h1>}

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full"
            style={{ boxShadow: '0 0 8px rgba(74,222,128,0.8)' }} />
        </motion.button>

        {/* User menu */}
        <div className="relative" ref={ref}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-xl transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              border: open ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: open ? '0 0 18px rgba(74,222,128,0.2)' : 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColor.bg} flex items-center justify-center text-white font-bold text-sm`}
              style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{fullName}</p>
              <p className="text-xs text-gray-400">{ROLE_LABELS[user.role]}</p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl z-50 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,18,35,0.96), rgba(16,28,48,0.94))',
                  backdropFilter: 'blur(28px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(150%)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(74, 222, 128, 0.2)',
                }}
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleColor.bg} flex items-center justify-center text-white font-bold text-lg`}
                      style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{fullName}</p>
                      <p className="text-xs text-gray-300 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${roleColor.text} inline-block`}
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="px-4 py-3 space-y-2">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white rounded-xl transition-all duration-200 font-medium"
                    style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1px solid rgba(34,197,94,0.3)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(34, 197, 94, 0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(34, 197, 94, 0.18)'; }}
                  >
                    <UserIcon size={18} className="text-green-300" />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 rounded-xl transition-all duration-200 font-medium"
                    style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239,68,68,0.3)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.18)'; }}
                  >
                    <LogOut size={18} className="text-red-400" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
