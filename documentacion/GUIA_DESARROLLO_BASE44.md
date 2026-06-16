# 🎨 GUÍA DE DESARROLLO - Mockup Base44
**iencinas analytics - Proyecto Base44**

---

## 📊 INFORMACIÓN DEL PROYECTO

**App ID:** `6a2c63ee604977ddc81a589b`
**URL Preview:** https://app.base44.com/apps/6a2c63ee604977ddc81a589b/editor/preview
**Ubicación local:** `D:\Proyectos IT\Iencinas Analitics\mockup-base44\`

---

## 🚀 FLUJO DE TRABAJO

### 1. Desarrollo Local
```bash
cd "D:\Proyectos IT\Iencinas Analitics\mockup-base44"

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
# Abre: http://localhost:3000 (o puerto indicado)

# Ver cambios en tiempo real
# Los cambios se reflejan inmediatamente
```

### 2. Push a Base44 (Guardar cambios)
```bash
npx base44 deploy -y

# O si solo cambias componentes frontend
npm run build
npx base44 site deploy -y
```

### 3. Ver Preview en Base44
```
https://app.base44.com/apps/6a2c63ee604977ddc81a589b/editor/preview
```

---

## 🎯 COMPONENTES A CREAR

### FASE 1: Login & Autenticación ✨

**Componente: LoginPage**
```
Elementos:
├── Card glassmorphism (translúcido, blur)
├── Logo iencinas
├── Selector de usuario (dropdown con 4 opciones)
│   ├── juan@iencinas.com (Finanzas)
│   ├── maria@iencinas.com (Comercial)
│   ├── carlos@iencinas.com (Marketing)
│   └── ana@iencinas.com (Administrador)
├── Campo contraseña (123456 para demo)
├── Botón "Ingresar"
├── Fondo con gradiente azul
└── Validación: Email + Password requeridos

Seguridad aplicada:
✓ No guardar credenciales en localStorage
✓ Usar JWT token en cookie httpOnly
✓ Rate limiting: máx 5 intentos/15 min
✓ Log cada intento (exitoso y fallido)
```

**Flujo:**
```
Usuario selecciona rol → Ingresa contraseña → JWT generado → 
Redirige a dashboard según rol → Token guardado secure
```

---

### FASE 2: Layout Principal 🎨

**Componentes:**
```
App Layout
├── Navbar (Glassmorphism)
│   ├── Logo + Nombre app
│   ├── Notificaciones (icono)
│   └── Perfil usuario (dropdown)
│       ├── Mi perfil
│       ├── Cambiar contraseña
│       └── Logout
│
├── Sidebar (Glassmorphism)
│   ├── Finanzas
│   │   ├── General (dashboard)
│   │   └── Reportes
│   ├── Comercial
│   │   ├── General
│   │   └── Reportes
│   ├── Marketing
│   │   ├── General
│   │   └── Reportes
│   ├── Valor Empresa (solo Admin)
│   │   ├── General
│   │   └── Reportes
│   └── Administrador (solo Admin)
│       ├── Crear Usuario
│       ├── Listar Usuarios
│       ├── Editar Usuario
│       └── Ver Permisos
│
└── Main Content Area
    └── Componentes del módulo seleccionado
```

**Estilos Glassmorphism:**
```css
/* Navbar */
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);

/* Sidebar */
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(15px);

/* Cards */
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(15px);
border: 1px solid rgba(59, 130, 246, 0.2);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
```

---

### FASE 3: Módulos de Dashboard 📊

#### 3.1 Dashboard Finanzas

**Estructura:**
```
Dashboard Finanzas
├── Título + Fecha
├── Cards de Métricas (4)
│   ├── Ingresos: $2,400,000
│   ├── Gastos: $480,000
│   ├── Margen: 34.2%
│   └── Flujo caja: $1,230,000
├── Gráfico: Ingresos vs Gastos (últimos 6 meses)
│   └── LineChart (Recharts o Chart.js)
└── Tabla: Últimas transacciones (10 filas)
    ├── Concepto | Monto | Fecha | Tipo
    └── Scrolleable, pagination
```

**Datos mock:**
```javascript
const datosFinanzas = {
  ingresos: 2400000,
  gastos: 480000,
  margenNeto: 34.2,
  flujoCaja: 1230000,
  
  grafico: [
    { mes: 'Ene', ingresos: 2000000, gastos: 420000 },
    { mes: 'Feb', ingresos: 2150000, gastos: 450000 },
    // ... 6 meses
  ],
  
  transacciones: [
    { concepto: 'Comisión venta', monto: 75000, fecha: '2026-06-10', tipo: 'ingreso' },
    // ... 10 transacciones
  ]
}
```

#### 3.2 Dashboard Comercial

**Estructura:**
```
Dashboard Comercial
├── Cards de Métricas (4)
│   ├── Vendidas: 24
│   ├── Valor total: $18,500,000
│   ├── Cartera: 142
│   └── Ticket promedio: $770,833
├── Gráfico: Pipeline (Funnel chart)
│   ├── Prospectación: 45
│   ├── Negociación: 32
│   ├── Pre-cierre: 15
│   └── Cierre: 8
└── Tabla: Top propiedades (10)
    ├── Dirección | Tipo | Precio | Estado
```

#### 3.3 Dashboard Marketing

**Estructura:**
```
Dashboard Marketing
├── Cards de Métricas (4)
│   ├── Leads: 847
│   ├── Conversión: 8.7%
│   ├── ROI: 320%
│   └── Costo/Lead: $145
├── Gráfico: Leads por canal (Pie chart)
│   ├── Google Ads: 29%
│   ├── Facebook: 37%
│   ├── Email: 18%
│   ├── Referidos: 11%
│   └── Otros: 5%
└── Tabla: Campañas activas (5)
    ├── Nombre | Leads | Conversión | ROI
```

#### 3.4 Dashboard Valor Empresa (Admin only)

**Estructura:**
```
Dashboard Valor Empresa
├── Cards de Métricas (4)
│   ├── Valuación: $125,000,000
│   ├── EBITDA: $28,500,000
│   ├── ROE: 22.7%
│   └── EV/EBITDA: 4.4x
├── Gráfico: Histórico 5 años (Line chart)
└── Tabla: Ratios clave
```

---

### FASE 4: Sistema de Reportes 📄

#### 4.1 Página de Reportes

**Estructura:**
```
Reportes [Módulo]
├── Filtros
│   ├── Rango de fechas
│   ├── Categoría
│   └── Formato (PDF/Excel/CSV)
│
├── Reportes Predefinidos (listado)
│   └── Para cada reporte:
│       ├── Nombre
│       ├── Descripción breve
│       ├── Fecha última actualización
│       ├── Botón "Previsualizar"
│       └── Botón "Descargar"
│
└── Opción: Crear reporte a medida
    ├── Selector de métricas (checkboxes)
    ├── Rango de fechas
    ├── Formato salida
    └── Botón "Generar"
```

**Reportes (3 por módulo):**

**Finanzas:**
1. Resumen Mensual de Ingresos
2. Análisis de Gastos
3. Flujo de Caja

**Comercial:**
1. Propiedades Vendidas
2. Pipeline de Ventas
3. Análisis de Cartera

**Marketing:**
1. Generación de Leads
2. ROI de Campañas
3. Análisis de Audiencia

**Valor Empresa (Admin):**
1. Valuación Empresarial
2. EBITDA y Rentabilidad
3. Indicadores Accionistas

---

### FASE 5: Panel Administrativo 🎛️

**Solo visible para Admin (ana@iencinas.com)**

#### 5.1 Crear Usuario

```
Formulario:
├── Nombre completo (requerido)
├── Email (requerido, único)
├── Departamento (dropdown)
│   ├── Finanzas
│   ├── Comercial
│   ├── Marketing
│   └── Administración
├── Perfil (dropdown)
│   ├── Finanzas
│   ├── Comercial
│   ├── Marketing
│   └── Administrador
├── Contraseña (generada o ingresada)
└── Botón "Crear usuario"

Validaciones:
✓ Email único
✓ Nombre no vacío
✓ Perfil seleccionado
✓ Contraseña mínimo 12 caracteres
✓ Log: "Usuario creado: [nombre] por [admin]"
```

#### 5.2 Listar Usuarios

```
Tabla:
├── Nombre
├── Email
├── Departamento
├── Perfil
├── Estado (Activo/Inactivo)
├── Fecha creación
└── Acciones (Editar, Eliminar)

Búsqueda: Por nombre o email
Filtros: Por perfil, departamento
```

#### 5.3 Editar Usuario

```
Modal con form:
├── Nombre
├── Email
├── Departamento
├── Perfil
├── Estado
└── Botones: Guardar, Cancelar

Log: "Usuario editado: [cambios] por [admin]"
```

#### 5.4 Eliminar Usuario

```
Confirmación:
├── Mensaje: "¿Eliminar usuario [nombre]?"
├── Advertencia: "Esta acción es irreversible"
├── Botones: Confirmar, Cancelar
└── Log: "Usuario eliminado: [nombre] por [admin]"
```

#### 5.5 Ver Permisos

```
Tabla de matriz:
Rol → Módulos accesibles

│ Rol | Finanzas | Comercial | Marketing | Valor Empresa | Admin |
├─────┼──────────┼───────────┼───────────┼───────────────┼───────┤
│ F   │    ✅    │     ❌    │     ❌    │      ❌       │  ❌   │
│ C   │    ❌    │     ✅    │     ❌    │      ❌       │  ❌   │
│ M   │    ❌    │     ❌    │     ✅    │      ❌       │  ❌   │
│ A   │    ✅    │     ✅    │     ✅    │      ✅       │  ✅   │
```

---

## 🔐 IMPLEMENTACIÓN DE SEGURIDAD EN MOCKUP

### Login & Autenticación
```javascript
// ✅ Implementar en mockup
- Validación de email/contraseña
- Generar JWT token
- Guardar en cookie httpOnly
- Logout limpia sesión
- Redirect según rol

// Datos de prueba (mockup)
usuarios = [
  { email: 'juan@iencinas.com', password: '123456', rol: 'finanzas' },
  { email: 'maria@iencinas.com', password: '123456', rol: 'comercial' },
  { email: 'carlos@iencinas.com', password: '123456', rol: 'marketing' },
  { email: 'ana@iencinas.com', password: '123456', rol: 'admin' }
]
```

### Control de Acceso (RBAC)
```javascript
// ✅ Middleware para proteger rutas
const rolePermissions = {
  finanzas: ['finanzas.general', 'finanzas.reportes'],
  comercial: ['comercial.general', 'comercial.reportes'],
  marketing: ['marketing.general', 'marketing.reportes'],
  admin: ['finanzas.*', 'comercial.*', 'marketing.*', 'valor_empresa.*', 'admin.*']
}

// ✅ En cada ruta
if (!hasPermission(userRole, routeName)) {
  redirect('/403-forbidden')
}
```

### Logging de Auditoría
```javascript
// ✅ Registrar acciones críticas
logAction({
  timestamp: new Date(),
  usuario: currentUser.email,
  rol: currentUser.rol,
  accion: 'login_exitoso',
  ip: req.ip,
  detalles: { navegador, sistema }
})
```

---

## 📁 ESTRUCTURA DE CARPETAS (Base44)

```
mockup-base44/
├── base44/
│   ├── config.jsonc
│   ├── entities/
│   │   ├── usuario.jsonc
│   │   ├── dashboard.jsonc
│   │   └── reporte.jsonc
│   ├── functions/
│   │   ├── login/
│   │   ├── crearUsuario/
│   │   └── descargarReporte/
│   └── .types/
│       └── types.d.ts (auto-generado)
│
├── src/
│   ├── pages/
│   │   ├── login.jsx
│   │   ├── dashboard/
│   │   │   ├── finanzas.jsx
│   │   │   ├── comercial.jsx
│   │   │   └── marketing.jsx
│   │   ├── reportes/
│   │   │   ├── finanzas-reportes.jsx
│   │   │   └── ...
│   │   └── admin/
│   │       ├── usuarios.jsx
│   │       └── permisos.jsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── dashboard/
│   │   │   ├── MetricCard.jsx
│   │   │   ├── ChartComponent.jsx
│   │   │   └── DataTable.jsx
│   │   ├── forms/
│   │   │   ├── LoginForm.jsx
│   │   │   └── UserForm.jsx
│   │   └── shared/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│   │
│   ├── styles/
│   │   ├── globals.css (glassmorphism)
│   │   ├── components.css
│   │   └── colors.css (paleta azul)
│   │
│   └── main.jsx (entry point)
│
├── package.json
└── vite.config.js (o next.config.js)
```

---

## 🎨 ESTILOS PREDEFINIDOS

### Colores (Paleta iencinas)
```css
:root {
  --primary-blue: #3B82F6;
  --primary-dark: #2563EB;
  --primary-darker: #1E40AF;
  --neutral-white: #FFFFFF;
  --neutral-gray-50: #F9FAFB;
  --neutral-gray-100: #F3F4F6;
  --neutral-gray-200: #E5E7EB;
  --neutral-gray-300: #D1D5DB;
  --neutral-gray-600: #4B5563;
  --neutral-gray-900: #111827;
  
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.16);
}
```

### Glassmorphism Base
```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

.glass:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}
```

---

## 🧪 TESTING EN MOCKUP

```
Usuarios de prueba:
1. juan@iencinas.com (Finanzas)
   └── Debe ver: Solo módulo Finanzas
   └── No debe ver: Comercial, Marketing, Valor Empresa, Admin

2. maria@iencinas.com (Comercial)
   └── Debe ver: Solo módulo Comercial
   └── No debe ver: Finanzas, Marketing, Valor Empresa, Admin

3. carlos@iencinas.com (Marketing)
   └── Debe ver: Solo módulo Marketing
   └── No debe ver: Finanzas, Comercial, Valor Empresa, Admin

4. ana@iencinas.com (Administrador)
   └── Debe ver: TODO (Finanzas, Comercial, Marketing, Valor Empresa, Panel Admin)
```

**Checklist de validación:**
- [ ] Login con cada usuario funciona
- [ ] Cada usuario redirige a su dashboard
- [ ] Sidebar muestra solo módulos permitidos
- [ ] Click en módulo no permitido → error 403
- [ ] Admin ve panel administrativo
- [ ] Logout funciona
- [ ] Glassmorphism se ve en navbar/sidebar/cards
- [ ] Gráficos cargan correctamente
- [ ] Botones de descarga funcionan (al menos UI)
- [ ] Responsive en desktop (mobile es bonus)

---

## 📞 PRÓXIMOS PASOS

1. **Scaffold completado** → Estructura local lista
2. **npm install** → Instalar dependencias
3. **npm run dev** → Ejecutar en localhost
4. **Crear componentes** → Login, Layout, Dashboards
5. **Agregar datos mock** → Finanzas, Comercial, Marketing
6. **Implementar RBAC** → Control de acceso por rol
7. **Testing manual** → Validar con cada usuario
8. **Deploy a Base44** → npx base44 deploy
9. **Screenshot preview** → Para documentación
10. **Feedback y ajustes** → Iteraciones de diseño

---

**Proyecto Base44:** Mockup interactivo de iencinas analytics
**Fecha inicio:** Junio 2026
**Status:** En desarrollo
**Próxima fase:** Next.js + Supabase producción
