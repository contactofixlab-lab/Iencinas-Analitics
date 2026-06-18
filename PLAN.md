# Plan de Trabajo — Iencinas Analytics

Dashboard de reportería inmobiliaria · Next.js 14 (App Router) + React 18 + Tailwind + Recharts + framer-motion.
Repo: https://github.com/contactofixlab-lab/Iencinas-Analitics

## Workflow obligatorio (cada cambio)
1. QA: compilar todas las rutas afectadas + verificar HTTP + revisar regresiones.
2. Commit + push automático a GitHub.
3. Actualizar este PLAN.md y la memoria.

## Estado actual

### ✅ Completado
- **Autenticación**: login (galaxy theme), AuthContext (localStorage), middleware redirect.
- **Asignación de proyectos por usuario**: integrada en crear/editar usuario (multi-select). API `/api/mis-proyectos` filtra por usuario.
- **Filtros**: panel horizontal arriba (después del título, antes de gráficas) en los 4 módulos.
- **Rediseño 3D Glass (completo)**:
  - Librería: `framer-motion`.
  - `globals.css`: fondo aurora animado, sistema glass (`glass-card`/`glass-strong`), perspectiva 3D (`scene-3d`/`card-3d`), clase `.field` para inputs, scrollbar refinada.
  - Componentes: `MetricCard` (tilt 3D + glare), `ChartCard` + `GlassTooltip` (nuevo), `GlassSelect` (nuevo, select custom animado), `FilterPanel`, `ProjectSelector`, `Sidebar`, `Navbar`.
  - Gráficos: áreas/barras con gradientes, tooltips glass, ejes limpios (los 4 módulos).
  - Módulo Admin: usuarios, permisos, bbdd, crear, editar — paneles, modales e inputs al nuevo glass.
  - Reportes (4): tarjetas y panel "Reporte a Medida" al nuevo glass, inputs con `.field`.

### 🔲 Pendiente
- Deploy a Vercel (conectar repo Iencinas-Analitics).
- Conexión real al CRM de ventas (datasource `crm.ts` ya preparado, hoy usa mock).
- Revisar ruta huérfana `src/app/admin/bbdd/page.tsx` (fuera del layout dashboard).
- Verificación visual con sesión real (login + navegar) — preview MCP no arranca en este entorno.

## Notas técnicas
- Servidor local: el binario `next` no está en PATH; arrancar con `node_modules\.bin\next.cmd` vía PowerShell, o `npm run dev` desde cmd.
- Si aparece 500 con "Cannot find module .next/server/app/login/page.js": borrar `.next` y reiniciar (caché stale).
- Datos: mock en `src/lib/mockData.ts` + `src/lib/datasource/`.
