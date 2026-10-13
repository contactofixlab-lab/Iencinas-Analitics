'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { logout as authLogout } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Sin usuario válido: se borra la cookie en el servidor (evita bucles con sesiones inválidas) y se va al login.
      void authLogout().finally(() => router.replace('/login'));
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand/40 border-t-brand-hover rounded-full animate-spin" role="status" aria-label="Cargando" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full">
      {/* Top bar — full width, fixed across the screen, holds the logo */}
      <Navbar />

      {/* Floating sidebar bubble + scrolling content */}
      <div className="flex items-start">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="pr-4 sm:pr-6 lg:pr-8 pl-2 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
