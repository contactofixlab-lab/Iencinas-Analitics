'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/** Carga solo las funciones de animación que usa la app (más liviano que el paquete completo de framer-motion). */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
