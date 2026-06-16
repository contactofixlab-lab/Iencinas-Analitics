# Arquitectura de API — Iencinas Analytics

## ✅ Lo que está construido HOY

### 1. **Tipos de Dominio** (`src/types/domain.ts`)
   - Contrato estable que la UI entiende
   - `Metric`, `MonthValue`, `ReportInfo`, `ModuleKey`
   - `FinanzasData`, `ComercialData`, `MarketingData`, `ValorEmpresaData`
   - Estos tipos **NUNCA cambian** aunque la fuente de datos sí

### 2. **Configuración** (`src/lib/config.ts`)
   - Lee variables de entorno (`.env.local`)
   - `DATA_SOURCE`: elige entre "mock" (hoy) o "crm" (mañana)
   - Credenciales y timeouts del CRM
   - Fallback automático a mock si falla

### 3. **Capa de Datasource** (`src/lib/datasource/`)
   - **types.ts**: Interfaz `DataSource` (el contrato)
   - **mock.ts**: `MockDataSource` — devuelve datos demo (funciona hoy)
   - **crm.ts**: `CrmDataSource` — estructura lista, mapeos TODO para mañana
   - **http.ts**: Cliente HTTP genérico con autenticación, reutilizable
   - **index.ts**: Selector inteligente + fallback automático a mock

### 4. **Rutas de API** (`src/app/api/`)
   ```
   /api/finanzas              → FinanzasData
   /api/comercial             → ComercialData
   /api/marketing             → MarketingData
   /api/valor-empresa         → ValorEmpresaData
   /api/reportes/[modulo]     → ReportInfo[]
   /api/health                → diagnóstico (fuente activa + estado CRM)
   ```
   - Todas devuelven envelope estándar: `{ ok, data, source, generatedAt }`
   - Aceptan filtros por query string (opcionales)
   - Manejo uniforme de errores

### 5. **Cliente de API** (`src/lib/api/client.ts`)
   - Tipado: `api.finanzas()`, `api.comercial()`, etc.
   - Versión de envelope (leo la fuente): `api.finanzas()` → `ApiResponse<T>`
   - Versión directa (throwing): `api.$.finanzas()` → `T` (útil con React Query)
   - Nunca expone API keys (solo llama a nuestros propios `/api/*`)

### 6. **Documentación**
   - **API.md**: Resumen técnico y uso del cliente
   - **INTEGRATION_CRM.md**: Paso a paso para conectar el CRM mañana

---

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────┐
│    React Components (login, dashboard)  │
│        seguir leyendo mockData hoy      │
│  (o: await api.$.comercial() mañana)   │
└────────────────┬────────────────────────┘
                 │
         (mañana: fetch /api/*)
                 │
        ┌────────▼────────┐
        │  /api/* routes  │
        │ (GET sólo)      │
        └────────┬────────┘
                 │
        ┌────────▼──────────────────────┐
        │  getDataSource()              │
        │  ├─ if DATA_SOURCE == 'crm'   │
        │  │  └─ CrmDataSource (+ wrap) │
        │  └─ else MockDataSource       │
        └────────┬──────────────────────┘
                 │
         ┌───────┴────────┐
         ▼                ▼
    ┌─────────┐     ┌──────────────┐
    │ MockDS  │     │  CrmDataSource│
    │ hoy     │     │  mañana      │
    └─────────┘     │              │
                    │ + mapeos:    │
                    │ - mapFinanzas│
                    │ - mapComercial
                    │ - mapMarketing
                    │ - etc        │
                    └──────────────┘
         │                │
         └────────┬───────┘
                  ▼
        Tipos de dominio
        (FinanzasData, etc)
                  │
         ┌────────▼──────────┐
         │ Envelope ApiResp  │
         │ { ok, data, ... } │
         └───────────────────┘
```

---

## 🔄 Cambio de fuente: cero cambios en UI

**HOY** (línea en `.env.local`):
```env
DATA_SOURCE=mock
```
→ Todos los `/api/*` sirven datos demo. Los componentes leen `mockData` directo.

**MAÑANA** (una línea cambia):
```env
DATA_SOURCE=crm
CRM_API_BASE_URL=https://api.tu-crm.com
CRM_API_KEY=xxxxx
```
→ Los `/api/*` empiezan a servir datos del CRM. Si un mapeo no está listo, cae a
mock automáticamente. **Nada en la UI cambia.**

---

## 🛠️ Para la integración del CRM (mañana)

### Archivos a modificar:
1. **`.env.local`** — variables del CRM
2. **`src/lib/datasource/crm.ts`** — implementar los 5 `map*()` funciones
3. **Opcional:** cambiar la UI para que use `/api/*` en lugar de leer `mockData` directo

### Archivos que NO tocas:
- Cualquier componente React (seguirán viendo el mismo contrato)
- Los tipos en `src/types/domain.ts` (son estables)
- Las rutas `/api/*` (ya están listas)

---

## ✨ Ventajas de esta arquitectura

| Aspecto | Beneficio |
|---------|-----------|
| **Desacoplamiento** | La UI no sabe ni le importa de dónde vienen los datos |
| **Resiliencia** | Si el CRM falla, el dashboard sigue funcionando con mock (si `CRM_FALLBACK_TO_MOCK=true`) |
| **Testabilidad** | Cada datasource se testea aislado; reemplázalo por un mock de test |
| **Multi-fuente** | Un módulo del CRM, otro de un ERP, otro de una API de marketing — sin problema |
| **Escalabilidad** | Agregar un nuevo módulo = crear `MapiNew` + ruta `/api/new`, listo |
| **Cero breaking changes** | Los tipos de dominio son el contrato; mientras se respeten, todo encaja |

---

## 📁 Estructura de carpetas

```
src/
├── lib/
│   ├── config.ts                    ← vars de entorno
│   ├── datasource/
│   │   ├── types.ts                 ← DataSource interface
│   │   ├── mock.ts                  ← impl. HOY
│   │   ├── crm.ts                   ← impl. MAÑANA (stubs listos)
│   │   ├── http.ts                  ← cliente HTTP genérico
│   │   └── index.ts                 ← selector + fallback
│   ├── api/
│   │   ├── types.ts                 ← ApiResponse envelope
│   │   ├── server.ts                ← ok(), fail(), parseParams()
│   │   └── client.ts                ← tipado para UI
│   └── API.md                        ← documentación técnica
├── types/
│   ├── index.ts                     ← tipos Auth + Module
│   └── domain.ts                    ← tipos de dominio (ESTABLES)
├── app/
│   └── api/
│       ├── finanzas/route.ts        ← GET /api/finanzas
│       ├── comercial/route.ts       ← GET /api/comercial
│       ├── marketing/route.ts       ← GET /api/marketing
│       ├── valor-empresa/route.ts   ← GET /api/valor-empresa
│       ├── reportes/[modulo]/route.ts ← GET /api/reportes/:modulo
│       └── health/route.ts          ← GET /api/health
└── ...
.env.example                         ← plantilla de configuración
.env.local                           ← HOY: DATA_SOURCE=mock
INTEGRATION_CRM.md                   ← paso a paso para mañana
```

---

## 🚀 Próximos pasos (cuando conectes el CRM)

1. Leer `INTEGRATION_CRM.md` (paso a paso).
2. Descubrir endpoints reales del CRM.
3. Implementar las 5 funciones `map*()` en `crm.ts`.
4. Actualizar `.env.local` con credenciales.
5. Verificar `/api/health` → `crmConfigured: true`.
6. Opcional: cambiar la UI para que use el API.

**Tiempo estimado:** 2-4 horas (incluye testing con el CRM real).

---

## 📞 Preguntas comunes

**P: ¿Qué pasa si el CRM tiene campos distintos?**
R: Los mapeos en `crm.ts` transforman cualquier forma a los tipos de dominio.
Si el CRM llama "deals_closed" y nosotros usamos "propiedades_vendidas", eso se
resuelve en el mapeo. La UI siempre ve lo mismo.

**P: ¿Y si necesito datos en tiempo real?**
R: Los `/api/*` endpoints están configurados con `force-dynamic` (sin caché).
Las llamadas son HTTP GET puro, trivial de reemplazar con WebSocket si necesitas
streaming después.

**P: ¿Puedo probar el CRM en paralelo con mock?**
R: Sí. Implementa los mapeos, deja un fallback a mock, y tira `/api/comercial`
en un navegador mientras trabaja. Si algo falla, cae a mock automáticamente.

---

## 🎓 Referencias

- Tipos de dominio: `src/types/domain.ts`
- Capa de datasource: `src/lib/datasource/`
- Cliente de API: `src/lib/api/client.ts`
- Documentación de integración: `INTEGRATION_CRM.md`
