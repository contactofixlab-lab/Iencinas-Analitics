'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { Bell, LogOut, Menu, User as UserIcon, ChevronDown } from 'lucide-react';
import { ROLE_AVATAR, ROLE_CHIP, ROLE_LABELS } from '@/lib/ui';

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

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  if (!user) return null;

  const initials = getInitials(user.nombre, user.apellido1);
  const fullName = `${user.nombre} ${user.apellido1} ${user.apellido2}`;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-nav sticky z-40 flex items-center justify-between"
      style={{ top: 16, margin: 16, marginBottom: 0, padding: '10px 16px', borderRadius: 'var(--r-panel)' }}
    >
      <button
        type="button"
        aria-label="Abrir menú"
        className="btn btn-secondary btn-icon lg:hidden mr-2"
        onClick={() => window.dispatchEvent(new Event('iencinas:toggle-menu'))}
      >
        <Menu size={20} strokeWidth={1.8} />
      </button>

      {/* Logo */}
      <div
        className="flex items-center px-4 py-2 rounded-2xl"
        style={{ background: 'rgb(255 255 255 / 0.65)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm), var(--inner-sheen)' }}
      >
        <img src="/logo.svg" alt="Iencinas Analytics" className="h-9 w-auto object-contain" />
      </div>
      {title && <h1 className="text-xl font-bold t-title">{title}</h1>}

      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button
          type="button"
          aria-label="Notificaciones"
          className="btn btn-secondary btn-icon relative"
        >
          <Bell size={19} strokeWidth={1.8} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full" style={{ background: 'rgb(var(--brand-hover))', boxShadow: '0 0 0 3px rgb(255 255 255 / 0.9)' }} />
        </button>

        {/* Menú de usuario */}
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl transition-all"
            style={{
              background: open ? 'rgb(var(--brand-soft) / 0.85)' : 'rgb(255 255 255 / 0.65)',
              border: open ? '1px solid rgb(var(--brand))' : '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-sm), var(--inner-sheen)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: ROLE_AVATAR[user.role], boxShadow: '0 4px 12px -4px rgb(92 124 158 / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.5)', textShadow: '0 1px 2px rgb(52 73 94 / 0.25)' }}
            >
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-ink leading-tight">{fullName}</p>
              <p className="text-xs text-soft">{ROLE_LABELS[user.role]}</p>
            </div>
            <ChevronDown size={16} className={`text-soft transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="glass-strong absolute right-0 top-full mt-3 w-72 z-50 overflow-hidden"
                style={{ background: 'rgb(255 255 255 / 0.97)' }}
              >
                <div className="px-5 py-4 border-b border-line/25">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: ROLE_AVATAR[user.role], boxShadow: '0 6px 16px -6px rgb(92 124 158 / 0.55), inset 0 1px 0 rgb(255 255 255 / 0.5)', textShadow: '0 1px 2px rgb(52 73 94 / 0.25)' }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink truncate">{fullName}</p>
                      <p className="text-xs text-soft truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={ROLE_CHIP[user.role]}>{ROLE_LABELS[user.role]}</span>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => { router.push('/dashboard/perfil'); setOpen(false); }}
                    className="menu-item"
                  >
                    <span className="flex items-center gap-3"><UserIcon size={18} strokeWidth={1.8} className="text-brand-deep" />Mi Perfil</span>
                  </button>
                  <button type="button" onClick={handleLogout} className="menu-item" style={{ color: 'rgb(160 52 64)' }}>
                    <span className="flex items-center gap-3"><LogOut size={18} strokeWidth={1.8} />Cerrar Sesión</span>
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
