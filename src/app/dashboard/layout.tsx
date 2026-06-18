'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2942 25%, #1e3a5f 50%, #1a2942 75%, #0f172a 100%)'
      }}>
        <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-400 rounded-full animate-spin" />
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
