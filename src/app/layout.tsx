import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/context/AuthContext';
import MotionProvider from '@/components/MotionProvider';
import { SESSION_COOKIE, verifySession } from '@/lib/server/session';
import { findById, toPublic } from '@/lib/server/users';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Iencinas Analytics',
  description: 'Dashboard de reportería para Iencinas',
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
  },
};

/** Usuario de la sesión resuelto en el servidor: la página llega ya con la sesión, sin esperar una petición extra. */
async function getInitialUser() {
  const session = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = findById(session.uid);
  return user && user.tokenVersion === session.tv ? toPublic(user) : null;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getInitialUser();
  return (
    <html lang="es">
      <body className={inter.className}>
        <MotionProvider>
          <AuthProvider initialUser={initialUser}>
            {children}
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
