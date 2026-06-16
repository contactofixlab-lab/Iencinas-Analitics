# Capa de API — Iencinas Analytics

Arquitectura preparada para conectar el **CRM de ventas** (y otras fuentes) sin tocar la UI.

```
  UI (componentes)
        │  usa  →  src/lib/api/client.ts   (api.finanzas(), api.comercial(), ...)
        ▼
  /api/* route handlers   (src/app/api/.../route.ts)   ← corren en el servidor
        │  llaman a →  getDataSource()
        ▼
  DataSource (contrato)   src/lib/datasource/types.ts
        ├── MockDataSource   → datos demo (hoy)
        └── CrmDataSource    → CRM real (mañana)   ← + fallback a mock si falla
```

**La regla de oro:** la UI solo conoce los tipos de `src/types/domain.ts`. El CRM se
"traduce" a esos tipos dentro de `crm.ts`. Cambiar de fuente = cambiar configuración,
no código de UI.

## Endpoints disponibles

| Método | Ruta                         | Devuelve            |
|--------|------------------------------|---------------------|
| GET    | `/api/finanzas`              | `FinanzasData`      |
| GET    | `/api/comercial`             | `ComercialData`     |
| GET    | `/api/marketing`             | `MarketingData`     |
| GET    | `/api/valor-empresa`         | `ValorEmpresaData`  |
| GET    | `/api/reportes/{modulo}`     | `ReportInfo[]`      |
| GET    | `/api/health`                | diagnóstico         |

Todos aceptan filtros opcionales por query string, p. ej. `?from=2026-01-01&to=2026-06-30`.

Respuesta estándar (envelope):
```json
{ "ok": true, "data": { ... }, "source": "mock", "generatedAt": "2026-06-13T..." }
```

## Conectar el CRM (mañana)

1. En `.env.local`:
   ```
   DATA_SOURCE=crm
   CRM_API_BASE_URL=https://api.tu-crm.com
   CRM_API_KEY=xxxxxxxx
   CRM_API_AUTH_SCHEME=bearer        # o "header"
   ```
2. En `src/lib/datasource/crm.ts`:
   - Ajusta las rutas reales en `ENDPOINTS`.
   - Implementa las funciones `map*()` para transformar la respuesta del CRM a los
     tipos de dominio.
3. Reinicia el servidor. Mientras un `map*()` no esté listo, el sistema usa mock
   automáticamente (`CRM_FALLBACK_TO_MOCK=true`), así nada se rompe.
4. Verifica en `/api/health` que `dataSource: "crm"` y `crmConfigured: true`.

## Otras fuentes ("y de otras partes también")

Si un módulo viene de otra API (no del CRM), crea otra clase que implemente
`DataSource` y combínala en `src/lib/datasource/index.ts` (composite): puedes tomar
`comercial` del CRM y `marketing` de otra fuente, por ejemplo.

## Conectar la UI al API (cuando se decida)

Hoy las páginas siguen leyendo `mockData` directo. Para pasarlas al API, reemplaza
esos imports por el cliente:

```ts
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { FinanzasData } from '@/types/domain';

const [data, setData] = useState<FinanzasData | null>(null);
useEffect(() => { api.$.finanzas().then(setData); }, []);
```
