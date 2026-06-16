# ⚙️ CONFIGURACIÓN BASE44 - iencinas analytics
**Configuración e inicialización del proyecto**

---

## 📋 DESPUÉS DE CREAR EL PROYECTO

Una vez que `npx base44 create` termine, ejecuta:

```bash
cd "D:\Proyectos IT\Iencinas Analitics\mockup-base44"

# 1. Instalar dependencias
npm install

# 2. Generar tipos TypeScript
npx base44 types generate

# 3. Ejecutar en desarrollo
npm run dev

# Abrirá en: http://localhost:5173 (o el puerto que indique)
```

---

## 🛠️ ENTIDADES A CREAR

Después de que se complete el scaffold, necesitaremos crear estas entidades en `base44/entities/`:

### 1. Usuario (`usuario.jsonc`)
```jsonc
{
  "name": "Usuario",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "nombre": {
      "type": "string",
      "description": "Nombre completo del usuario"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email único"
    },
    "rol": {
      "type": "string",
      "enum": ["finanzas", "comercial", "marketing", "administrador"],
      "description": "Rol/Perfil del usuario"
    },
    "departamento": {
      "type": "string",
      "description": "Departamento del usuario"
    },
    "activo": {
      "type": "boolean",
      "default": true
    },
    "fechaCreacion": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["nombre", "email", "rol"]
}
```

### 2. Dashboard (`dashboard.jsonc`)
```jsonc
{
  "name": "Dashboard",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "modulo": {
      "type": "string",
      "enum": ["finanzas", "comercial", "marketing", "valor_empresa"],
      "description": "Módulo del dashboard"
    },
    "titulo": {
      "type": "string"
    },
    "descripcion": {
      "type": "string"
    },
    "rolesAcceso": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Roles que pueden acceder"
    }
  },
  "required": ["modulo", "titulo", "rolesAcceso"]
}
```

### 3. Reporte (`reporte.jsonc`)
```jsonc
{
  "name": "Reporte",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "nombre": {
      "type": "string"
    },
    "modulo": {
      "type": "string",
      "enum": ["finanzas", "comercial", "marketing", "valor_empresa"]
    },
    "descripcion": {
      "type": "string"
    },
    "datos": {
      "type": "object",
      "description": "Datos del reporte en JSON"
    },
    "creadoPor": {
      "type": "string",
      "format": "uuid",
      "description": "ID del usuario que creó"
    },
    "fechaCreacion": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["nombre", "modulo"]
}
```

### 4. LogAuditoria (`log_auditoria.jsonc`)
```jsonc
{
  "name": "LogAuditoria",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "usuarioId": {
      "type": "string",
      "format": "uuid"
    },
    "usuarioNombre": {
      "type": "string"
    },
    "rol": {
      "type": "string"
    },
    "accion": {
      "type": "string",
      "description": "login, logout, descargar_reporte, crear_usuario, etc"
    },
    "modulo": {
      "type": "string"
    },
    "recurso": {
      "type": "string",
      "description": "Qué recurso se accedió (reporte-id, usuario-id, etc)"
    },
    "estado": {
      "type": "string",
      "enum": ["exitoso", "fallido", "denegado"],
      "default": "exitoso"
    },
    "ip": {
      "type": "string"
    },
    "detalles": {
      "type": "object"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["usuarioId", "accion", "timestamp"]
}
```

---

## 📊 DATOS INICIALES (Mock Data)

Una vez creadas las entidades, agregar datos de prueba:

### Usuarios
```javascript
[
  {
    id: "user-001",
    nombre: "Juan Díaz",
    email: "juan@iencinas.com",
    rol: "finanzas",
    departamento: "Finanzas",
    activo: true
  },
  {
    id: "user-002",
    nombre: "María Rodríguez",
    email: "maria@iencinas.com",
    rol: "comercial",
    departamento: "Comercial",
    activo: true
  },
  {
    id: "user-003",
    nombre: "Carlos Cortés",
    email: "carlos@iencinas.com",
    rol: "marketing",
    departamento: "Marketing",
    activo: true
  },
  {
    id: "user-004",
    nombre: "Ana Silva",
    email: "ana@iencinas.com",
    rol: "administrador",
    departamento: "Administración",
    activo: true
  }
]
```

### Dashboards
```javascript
[
  {
    id: "dash-001",
    modulo: "finanzas",
    titulo: "Dashboard Finanzas",
    rolesAcceso: ["finanzas", "administrador"]
  },
  {
    id: "dash-002",
    modulo: "comercial",
    titulo: "Dashboard Comercial",
    rolesAcceso: ["comercial", "administrador"]
  },
  {
    id: "dash-003",
    modulo: "marketing",
    titulo: "Dashboard Marketing",
    rolesAcceso: ["marketing", "administrador"]
  },
  {
    id: "dash-004",
    modulo: "valor_empresa",
    titulo: "Dashboard Valor Empresa",
    rolesAcceso: ["administrador"]
  }
]
```

---

## 🎨 ESTRUCTURA FRONTEND INICIAL

Una vez que `npm run dev` esté ejecutándose, crear estas páginas en `src/`:

### Estructura de carpetas sugerida
```
src/
├── pages/
│   ├── login.jsx              ← Landing page
│   ├── dashboard.jsx          ← Dashboard principal
│   ├── finanzas/
│   │   ├── index.jsx
│   │   └── reportes.jsx
│   ├── comercial/
│   │   ├── index.jsx
│   │   └── reportes.jsx
│   ├── marketing/
│   │   ├── index.jsx
│   │   └── reportes.jsx
│   ├── valor-empresa/
│   │   ├── index.jsx
│   │   └── reportes.jsx
│   └── admin/
│       ├── usuarios.jsx
│       └── permisos.jsx
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── MetricCard.jsx
│   ├── Chart.jsx
│   └── DataTable.jsx
├── App.jsx
└── main.jsx
```

---

## 🚀 PRÓXIMOS COMANDOS

Una vez completado todo:

### Generar tipos TypeScript
```bash
npx base44 types generate
```

### Deployar a Base44
```bash
npm run build
npx base44 deploy -y
```

### Ver preview
```bash
npx base44 site open
```

---

## 🔐 SEGURIDAD EN MOCKUP

Implementar en componentes:

### Login Component
```jsx
// src/components/Login.jsx
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const usuarios = [
    { email: 'juan@iencinas.com', rol: 'finanzas' },
    { email: 'maria@iencinas.com', rol: 'comercial' },
    { email: 'carlos@iencinas.com', rol: 'marketing' },
    { email: 'ana@iencinas.com', rol: 'administrador' }
  ]
  
  const handleLogin = (e) => {
    e.preventDefault()
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.email === email)
    
    if (!usuario) {
      alert('Usuario no encontrado')
      return
    }
    
    // Log de intento
    console.log(`[LOG] Login intento: ${email} - ${new Date()}`)
    
    // Guardar en sessionStorage (no localStorage por seguridad)
    sessionStorage.setItem('user', JSON.stringify({
      email: usuario.email,
      rol: usuario.rol
    }))
    
    // Redirigir
    window.location.href = `/dashboard?rol=${usuario.rol}`
  }
  
  return (
    <div className="glass-card login-container">
      <h1>iencinas analytics</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}
```

### Protected Route Component
```jsx
// src/components/ProtectedRoute.jsx
import { useEffect } from 'react'

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}) {
  useEffect(() => {
    const user = JSON.parse(
      sessionStorage.getItem('user') || 'null'
    )
    
    if (!user) {
      window.location.href = '/login'
      return
    }
    
    if (requiredRole && !requiredRole.includes(user.rol)) {
      alert('No tienes permisos para acceder')
      window.location.href = '/403'
    }
  }, [requiredRole])
  
  return children
}
```

---

## 📋 CHECKLIST DE SETUP

- [ ] `npx base44 create` completado
- [ ] `npm install` finalizado
- [ ] `npx base44 types generate` ejecutado
- [ ] `npm run dev` funcionando en localhost
- [ ] Carpeta `base44/entities/` con 4 entidades
- [ ] Componente Login creado
- [ ] Navbar + Sidebar creados
- [ ] 4 dashboards básicos listos
- [ ] Datos mock cargados
- [ ] RBAC implementado
- [ ] Deploy a Base44 completado
- [ ] Preview URL funciona

---

**Guía de configuración Base44 - iencinas analytics**
**Actualizado: Junio 2026**
