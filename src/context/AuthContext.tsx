'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { fetchCurrentUser, login as authLogin, logout as authLogout } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  /** Registra una sesión ya creada en el servidor (acceso rápido de desarrollo). */
  setSessionUser: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => { throw new Error('AuthProvider no disponible'); },
  setSessionUser: () => {},
  logout: async () => {},
});

const RECHECK_MS = 5 * 60 * 1000;
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    // Versiones anteriores guardaban usuarios con contraseña y la sesión en localStorage: se borran.
    try {
      localStorage.removeItem('iencinas_users');
      localStorage.removeItem('iencinas_session');
    } catch {
      /* almacenamiento no disponible */
    }

    fetchCurrentUser()
      .then(u => { if (alive) setUser(u); })
      .catch(() => { if (alive) setUser(null); })
      .finally(() => { if (alive) setLoading(false); });

    // Revalida la sesión cada 5 min y al volver a la pestaña: si expiró o el usuario fue
    // eliminado/cambiado de rol, la interfaz lo refleja sin esperar a recargar.
    const recheck = () => {
      fetchCurrentUser()
        .then(u => {
          if (!alive) return;
          setUser(prev => {
            if (!u) return null;
            return prev && JSON.stringify(prev) === JSON.stringify(u) ? prev : u;
          });
        })
        .catch(() => { /* error de red: se mantiene el estado actual */ });
    };
    const timer = setInterval(recheck, RECHECK_MS);
    window.addEventListener('focus', recheck);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener('focus', recheck);
    };
  }, []);

  // Cierre automático tras 30 minutos sin actividad (ISO/IEC 27002 8.1/8.5: sesiones desatendidas).
  useEffect(() => {
    if (!user) return;
    let last = Date.now();
    const touch = () => { last = Date.now(); };
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach(e => window.addEventListener(e, touch, { passive: true }));
    const timer = setInterval(() => {
      if (Date.now() - last > IDLE_TIMEOUT_MS) {
        authLogout().finally(() => setUser(null));
      }
    }, 30 * 1000);
    return () => {
      events.forEach(e => window.removeEventListener(e, touch));
      clearInterval(timer);
    };
  }, [user]);

  async function login(email: string, password: string): Promise<User> {
    const u = await authLogin(email, password);
    setUser(u);
    return u;
  }

  async function logout() {
    await authLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, setSessionUser: setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
