# Integración del CRM de Ventas — Guía paso a paso

## 🎯 Objetivo
Conectar el CRM de ventas (y otras fuentes) al dashboard sin tocar la UI. Hoy el sistema sirve datos **mock**; mañana cambiará automáticamente al CRM.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│        React UI (componentes)           │
│  (sigue leyendo mockData directo hoy)  │
└────────────────┬────────────────────────┘
                 │
         (mañana: fetch /api/*)
                 │
        ┌────────▼────────┐
        │   /api/* routes │
        │  (src/app/api/) │
        └────────┬────────┘
                 │
        ┌────────▼────────────────────┐
        │  getDataSource()            │
        │  (src/lib/datasource/)      │
        └────────┬────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
    ┌────▼────┐     ┌───▼──────┐
    │  Mock   │     │   CRM    │
    │ (hoy)   │     │(mañana)  │
    └─────────┘     └──────────┘
         ↓               ↓
    Tipos de         Mapear a tipos
    dominio           de dominio
```

**La clave:** Los tipos en `src/types/domain.ts` son el contrato estable. El CRM se
"traduce" a esos tipos internamente; la UI nunca cambia.

## 📋 Pasos para conectar el CRM

### 1. Actualizar `.env.local`

```bash
DATA_SOURCE=crm
CRM_API_BASE_URL=https://api.tu-crm.com
CRM_API_KEY=tu_api_key_aqui
CRM_API_AUTH_SCHEME=bearer        # si usa "Authorization: Bearer"
# O si usa un header custom:
# CRM_API_AUTH_SCHEME=header
# CRM_API_KEY_HEADER=x-custom-key
```

Verifica en `/api/health`:
```bash
curl http://localhost:3000/api/health
# Esperado: { "crmConfigured": true, "dataSource": "crm" }
```

### 2. Descubrir los endpoints del CRM

Tu CRM expone (ejemplos):
- `GET /api/finance/summary` → financiero
- `GET /api/sales/summary` → ventas/comercial
- `GET /api/marketing/summary` → leads/marketing
- `GET /api/valuation/summary` → valor de empresa
- `GET /api/reports?module=comercial` → reportes

Anota las rutas reales y los campos que devuelven.

### 3. Completar las funciones `map*()` en `src/lib/datasource/crm.ts`

El archivo tiene stubs listos. Ejemplo (reemplaza `mapComercial`):

```typescript
function mapComercial(raw: any): ComercialData {
  return {
    metrics: [
      {
        label: 'Propiedades Vendidas',
        value: String(raw.properties_sold),
        trend: `${raw.properties_sold_pct_change > 0 ? '+' : ''}${raw.properties_sold_pct_change}%`,
        up: raw.properties_sold_pct_change >= 0,
        color: 'green',
      },
      {
        label: 'Valor Total Ventas',
        value: `$${(raw.sales_total_usd / 1e6).toFixed(1)}M`,
        trend: `${raw.sales_total_pct_change > 0 ? '+' : ''}${raw.sales_total_pct_change}%`,
        up: raw.sales_total_pct_change >= 0,
        color: 'blue',
      },
      // ... más métricas
    ],
    ventas: raw.monthly_sales.map(m => ({ mes: m.month_short, ventas: m.count })),
    pipeline: raw.pipeline_stages.map(s => ({ etapa: s.name, cantidad: s.deals_count })),
  };
}
```

Las funciones que mapees correctamente devolverán datos del CRM. Las que dejes con
`throw new NotImplemented(...)` caerán automáticamente a mock si `CRM_FALLBACK_TO_MOCK=true`.

### 4. Ajustar los `ENDPOINTS` si es necesario

En `crm.ts`, cambia las rutas:
```typescript
const ENDPOINTS = {
  finanzas: '/api/your-finance-path',
  comercial: '/api/your-sales-path',
  // ...
};
```

### 5. Reiniciar y verificar

```bash
npm run dev
```

Visita `/api/comercial` → si está implementado, verá datos del CRM; si no, volverá a
mock automáticamente.

### 6. (Opcional) Conectar la UI al API

Hoy la UI aún lee `mockData` directo. Cuando esté listo el CRM completo, puedes
switchear la UI para que use el API:

```typescript
// Reemplaza en cualquier página:
import { mockData } from '@/lib/mockData';

// Por:
import { api } from '@/lib/api/client';
const data = await api.$.comercial();  // tipado + trae del API
```

## 🔧 Comandos útiles mientras integras

```bash
# Ver configuración actual
curl http://localhost:3000/api/health | jq '.'

# Probar un endpoint individual
curl http://localhost:3000/api/comercial | jq '.data.metrics'

# Ver logs del servidor (si está corriendo en foreground)
npm run dev

# Desactivar fallback a mock para ver errores reales (debug)
# En .env.local:
CRM_FALLBACK_TO_MOCK=false
```

## ⚠️ Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `CRM_FALLBACK_TO_MOCK=true` pero ves mock | CRM no está configurado | Verifica `CRM_API_BASE_URL` y `CRM_API_KEY` en `.env.local` |
| `NotImplemented: mapComercial` | Función no completada | Implementa la función en `crm.ts` |
| HTTP 500 en `/api/comercial` | Mapeo retorna forma incorrecta | Verifica que devuelva `ComercialData` (revisa tipo en `src/types/domain.ts`) |
| `403 Unauthorized` | API key inválida | Verifica `CRM_API_KEY` y `CRM_API_AUTH_SCHEME` |

## 📚 Referencia rápida de tipos

Todos los tipos están en `src/types/domain.ts`. Ejemplos:

```typescript
interface Metric {
  label: string;     // "Propiedades Vendidas"
  value: string;     // "$24" o "8.7%" (ya formateado)
  trend: string;     // "+8.0%" o "-2.1%"
  up: boolean;       // true = positivo (verde)
  color: 'green' | 'blue' | 'red' | 'purple' | 'orange';
}

interface MonthValue {
  mes: string;       // "Ene", "Feb", ...
  valor: number;     // número crudo (se formatea en UI si es necesario)
}
```

## 🚀 Cuando todo esté listo

1. Todos los `map*()` devuelven datos del CRM (sin `NotImplemented`).
2. `/api/health` muestra `crmConfigured: true` y `dataSource: "crm"`.
3. Las páginas del dashboard muestran números reales del CRM.
4. *Opcional:* conecta la UI al API para que sea totalmente dinámico.

**El dashboard nunca se queda en blanco porque el fallback a mock es automático.**
