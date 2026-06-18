# Plan de Trabajo — Iencinas Analytics

Dashboard de reportería inmobiliaria · Next.js 14 (App Router) + React 18 + Tailwind + Recharts + framer-motion.
Repo: https://github.com/contactofixlab-lab/Iencinas-Analitics

## Workflow obligatorio (cada cambio)
1. QA: compilar todas las rutas afectadas + verificar HTTP + revisar regresiones.
2. Commit + push automático a GitHub.
3. Actualizar este PLAN.md y la memoria.

## Estado actual (actualizado 2026-06-18)

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
- **Layout flotante**: Navbar full-width fija arriba con el logo; Sidebar convertido en burbuja flotante (sticky, redondeada, con margen) que sigue el scroll; scroll de página natural.
- **GlassDatePicker**: calendario personalizado en glass 3D (nuevo componente) integrado en FilterPanel y todas las páginas de Reportes con fechas. Portal-based, animado, con mes/día/navegación y botón "Hoy".
- **Reportes rediseñados (4 módulos)**: Nuevo layout con previsualizador prominente arriba (tabla vacía, se llena al generar), sidebar chico izquierda (5 reportes prehechos en lista vertical), panel grande derecha (filtros + botones generar/descargar). Colores por módulo: verde/naranja/púrpura/ámbar. Framer-motion entrance animations.
- **Errores de compilación resueltos (2026-06-18)**: ReportCard onClick, MetricCard onMouseLeaveCapture, finanzas dateRange, CrmDataSource getProyectos, datasource types — npm run build ✓ OK.
- **Generador de Reportes Avanzado (2026-06-18)**: Nuevo componente AdvancedReportBuilder que permite seleccionar atributos de múltiples entidades (Proyectos, Transacciones, Ventas, Leads, Valuaciones) con UI tree-based expandible, vista previa dinámica en tabla, generación de datos mock automática. Todas las 4 páginas de reportes actualizadas para usar este generador. Navbar mejorado: logo SVG con vidrio oscuro y glow verde.

### 🔲 Pendiente
- Deploy a Vercel (conectar repo Iencinas-Analitics).
- Conexión real al CRM de ventas (datasource `crm.ts` ya preparado, hoy usa mock).
- Revisar ruta huérfana `src/app/admin/bbdd/page.tsx` (fuera del layout dashboard).
- Verificación visual con sesión real (login + navegar) — preview MCP no arranca en este entorno.

## Notas técnicas
- Servidor local: el binario `next` no está en PATH; arrancar con `node_modules\.bin\next.cmd` vía PowerShell, o `npm run dev` desde cmd.
- Si aparece 500 con "Cannot find module .next/server/app/login/page.js": borrar `.next` y reiniciar (caché stale).
- Datos: mock en `src/lib/mockData.ts` + `src/lib/datasource/`.
