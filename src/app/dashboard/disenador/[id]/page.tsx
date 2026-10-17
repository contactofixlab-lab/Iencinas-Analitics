'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChartEditor from '@/components/bi/ChartEditor';

export default function EditarGraficoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    if (user && user.role !== 'administrador') router.replace('/dashboard/finanzas');
  }, [user, router]);

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-ink">Editar gráfico</h1>
        <p className="text-soft text-sm mt-0.5">Los cambios se ven en los módulos donde está publicado en cuanto guardes.</p>
      </div>
      <ChartEditor key={params.id} chartId={params.id} />
    </div>
  );
}
