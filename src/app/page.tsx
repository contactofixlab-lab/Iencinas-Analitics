'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const defaultRoutes: Record<string, string> = {
        finanzas: '/dashboard/finanzas',
        comercial: '/dashboard/comercial',
        marketing: '/dashboard/marketing',
        administrador: '/dashboard/finanzas',
      };
      router.replace(defaultRoutes[user.role] || '/dashboard/finanzas');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
