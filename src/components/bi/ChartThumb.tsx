'use client';

import { useEffect, useRef, useState } from 'react';
import ChartRenderer from './ChartRenderer';
import type { ChartSpec, QueryResult } from '@/lib/bi/types';

/** Miniatura en vivo de un gráfico: calcula sus datos solo cuando la tarjeta aparece en pantalla. */
export default function ChartThumb({ spec }: { spec: ChartSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setVisible(true);
        io.disconnect();
      }
    }, { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const ctrl = new AbortController();
    fetch('/api/bi/query', {
      method: 'POST', cache: 'no-store', signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ spec }),
    })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(j => { if (j.ok) setResult(j.data as QueryResult); else setFailed(true); })
      .catch(err => { if (!(err instanceof DOMException && err.name === 'AbortError')) setFailed(true); });
    return () => ctrl.abort();
  }, [visible, spec]);

  return (
    <div ref={ref} className="h-[170px] pointer-events-none select-none" aria-hidden="true">
      {result ? <ChartRenderer spec={spec} result={result} /> : failed ? (
        <div className="h-full flex items-center justify-center text-xs text-mute text-center px-4">No se pudo calcular la miniatura</div>
      ) : <div className="skeleton h-full" />}
    </div>
  );
}
