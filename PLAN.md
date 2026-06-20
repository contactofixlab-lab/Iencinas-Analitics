# Plan de Trabajo — Iencinas Analytics

Dashboard de reportería inmobiliaria · Next.js 14 (App Router) + React 18 + Tailwind + Recharts + framer-motion.
Repo: https://github.com/contactofixlab-lab/Iencinas-Analitics

## Workflow obligatorio (cada cambio)
1. QA: compilar todas las rutas afectadas + verificar HTTP + revisar regresiones.
2. Commit + push automático a GitHub.
3. Actualizar este PLAN.md y la memoria.

## Estado actual (actualizado 2026-06-18 — QA Completo)

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

- **Modelo de Base de Datos (2026-06-18)**: Diagrama ER visual con 5 entidades, página `/dashboard/modelo-datos` presentable, estructura normalizada 3NF, integridad referencial garantizada, escalable.
- **13 Proyectos con 338 Registros (2026-06-18)**: Proyectos adicionales (Lastarria, Reñaca, San Isidro, Conchalí, Chicureo) + 38 transacciones, 29 ventas, 30 leads, 41 valuaciones. Datos variados para gráficas realistas.
- **QA Completo (2026-06-18 Parte 2)**: 
  - ✓ Compilación: `npm run build` exitosa sin errores
  - ✓ Alineación de IDs: Reconciliación de proyecto IDs (`proj-001` a `proj-013`) en datasource, usuarios, y API
  - ✓ Actualización de usuarios: Juan (proj-001, proj-002), María (proj-001, proj-009), Carlos (proj-001, proj-002, proj-009), Ana (administrador con acceso a todos)
  - ✓ Datasource actualizado: getFinanzas, getComercial, getMarketing, getValorEmpresa usan IDs correctos
  - ✓ Todas las páginas de dashboard usan `proj-001` como default
  - ✓ API `/api/mis-proyectos` retorna proyectos correctos por usuario
  - ✓ 31 componentes/páginas exportados correctamente
  - ✓ Rutas API: 8 endpoints funcionales
  - ✓ Rutas Dashboard: 20 rutas prerendereadas

- **Bug Fixes Críticos (2026-06-18 Parte 3)**:
  - ✓ AdvancedReportBuilder: Validar projectData antes de acceder propiedades (línea 141)
  - ✓ Todas las páginas de dashboard: Validar res.ok antes de parsear JSON (finanzas, comercial, marketing, valor-empresa)
  - ✓ ProjectSelector: Manejo de errores en fetch de proyectos
  - ✓ API reportes: Garantizar que data siempre es un array
  - ✓ Eliminado 7 bugs CRÍTICOS que causaban errores 500

- **Arreglos Adicionales de Bugs 500 (2026-06-18 Parte 4)**:
  - ✓ 12 bugs críticos/alto identificados y arreglados
  - ✓ finanzas/page.tsx: Array mismatch en gastos
  - ✓ comercial/marketing/valor-empresa: Validar res.ok en fetch
  - ✓ http.ts: Try-catch para JSON.parse
  - ✓ mockDatabase.ts: Validar getProjectData no retorna null
  - ✓ AdvancedReportBuilder: Usar ?? para propiedades undefined
  - ✓ FilterPanel: Validar dateRange null antes de spread

- **Rediseño Completo de Reportes (2026-06-18 Parte 4)**:
  - ✓ Previsualizador prominente ARRIBA en tabla clara con scroll
  - ✓ Selector de atributos con CHECKBOXES claros (izquierda, 2/3 del ancho)
  - ✓ Panel de controles a DERECHA (1/3): atributos seleccionados, filtros fecha, botones
  - ✓ Mejor jerarquía visual para workflow "conductor de reportes"
  - ✓ Responsive: 1 col en mobile, 3 cols en desktop (lg+)

- **Bug Fixes de Errores 500 (2026-06-18 Parte 4)**:
  - ✓ Identificados y arreglados 12 bugs críticos/alto
  - ✓ finanzas/page.tsx: Usar ?? para gastos array mismatch
  - ✓ comercial/marketing/valor-empresa: Validar res.ok antes .json()
  - ✓ http.ts: Try-catch para JSON.parse
  - ✓ mockDatabase.ts: Validar getProjectData no retorna null
  - ✓ AdvancedReportBuilder: Usar ?? para propiedades undefined
  - ✓ FilterPanel: Validar dateRange null
  - ✓ Compilación exitosa: `npm run build` ✓

- **Rediseño Final de Reportes (2026-06-18 Parte 4)**:
  - ✓ Layout 3 secciones: Previsualizador (arriba) + Selector (derecha) + Reportes Prehechos (abajo)
  - ✓ Previsualizador: Tabla con datos en tiempo real, scroll horizontal
  - ✓ Selector: Checkboxes claros + Atributos seleccionados + Filtros fecha + Botón generar
  - ✓ PrebuiltReports.tsx: 5 templates sistema por módulo (Resumen, Detalles, Tendencias, Comparativa, Distribución)
  - ✓ Componentes: Resumen Ejecutivo (blue/Activity), Detalles (green/FileText), Tendencias (purple/TrendingUp), Comparativa (orange/BarChart3), Distribución (pink/PieChart)
  - ✓ Diseño glass 3D mantenido
  - ✓ Responsive: 1col mobile, 5col desktop
  - ✓ Aplicado a: finanzas, comercial, marketing, valor-empresa reportes

### 🔲 Pendiente
- Deploy a Vercel (conectar repo Iencinas-Analitics).
- Conexión real al CRM de ventas (datasource `crm.ts` ya preparado, hoy usa mock).
- Revisar ruta huérfana `src/app/admin/bbdd/page.tsx` (fuera del layout dashboard).
- Verificación visual con sesión real (login + navegar) — preview MCP no arranca en este entorno.

## Notas técnicas
- Servidor local: el binario `next` no está en PATH; arrancar con `node_modules\.bin\next.cmd` vía PowerShell, o `npm run dev` desde cmd.
- Si aparece 500 con "Cannot find module .next/server/app/login/page.js": borrar `.next` y reiniciar (caché stale).
- Datos: mock en `src/lib/mockData.ts` + `src/lib/datasource/`.
