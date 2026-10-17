'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChartEditor from '@/components/bi/ChartEditor';

export default function NuevoGraficoPage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && user.role !== 'administrador') router.replace('/dashboard/finanzas');
  }, [user, router]);

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-ink">Nuevo gráfico</h1>
        <p className="text-soft text-sm mt-0.5">Elige la fuente de datos, el tipo de gráfico y los campos; la vista previa se actualiza sola.</p>
      </div>
      <ChartEditor />
    </div>
  );
}
