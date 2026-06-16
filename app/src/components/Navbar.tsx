'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  finanzas: 'Gerente de Finanzas',
  comercial: 'Director Comercial',
  marketing: 'Jefe de Marketing',
  administrador: 'Administrador',
};

const ROLE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  finanzas: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-400', icon: 'bg-blue-500' },
  comercial: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-400', icon: 'bg-orange-500' },
  marketing: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-400', icon: 'bg-purple-500' },
  administrador: { bg: 'from-green-500 to-green-600', text: 'text-green-400', icon: 'bg-green-600' },
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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
    <header className="h-20 sticky top-0 z-30 px-6 py-4 flex items-center justify-between" style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
    }}>
      <div>
        {title && (
          <h1 className="text-xl font-bold text-white">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#9ca3af',
          }}>
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 pl-2 pr-2.5 py-2 rounded-xl transition-all duration-200 group"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${roleColor.bg} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{fullName}</p>
              <p className="text-xs text-gray-400">{ROLE_LABELS[user.role]}</p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.58), rgba(20, 35, 60, 0.58))',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(74, 222, 128, 0.2)',
              }}>
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${roleColor.bg} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{fullName}</p>
                    <p className="text-xs text-gray-300">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${roleColor.text} bg-white/15 inline-block`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="px-4 py-3 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white rounded-xl transition-all duration-200 font-medium border border-green-500/40"
                  style={{
                    background: 'rgba(34, 197, 94, 0.32)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(34, 197, 94, 0.45)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34, 197, 94, 0.6)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(34, 197, 94, 0.32)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34, 197, 94, 0.4)';
                  }}
                >
                  <UserIcon size={18} className="text-green-300" />
                  <span>Mi Perfil</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 rounded-xl transition-all duration-200 font-medium border border-red-500/40"
                  style={{
                    background: 'rgba(239, 68, 68, 0.32)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.45)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239, 68, 68, 0.6)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.32)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239, 68, 68, 0.4)';
                  }}
                >
                  <LogOut size={18} className="text-red-400" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
