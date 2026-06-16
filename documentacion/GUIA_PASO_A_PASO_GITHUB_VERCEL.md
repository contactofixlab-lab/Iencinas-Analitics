# 🚀 Guía Simplificada: GitHub + Vercel

## PASO 1: Preparar tu máquina (Si es primera vez con Git)

### 1.1 Descarga e instala Git
- Ve a: https://git-scm.com/downloads
- Descarga la versión para tu sistema (Windows/Mac/Linux)
- Instala con los valores por defecto

### 1.2 Configura Git (primera vez)
Abre Terminal/CMD y ejecuta:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@gmail.com"
```

---

## PASO 2: Crear repositorio en GitHub

### 2.1 Crea una cuenta en GitHub (si no tienes)
- Ve a: https://github.com
- Haz clic en "Sign up"
- Completa los datos
- Verifica tu email

### 2.2 Crea un nuevo repositorio
1. En GitHub, haz clic en el **"+"** arriba a la derecha
2. Selecciona **"New repository"**
3. Nombre del repositorio: `propdash-analytics`
4. Descripción (opcional): "Dashboard analytics para inmobiliaria"
5. Selecciona **"Public"** (para que Vercel pueda acceder)
6. **NO** marques "Initialize with README" (ya tenemos uno)
7. Haz clic en **"Create repository"**

### 2.3 Copia la URL
Después de crear, verás una URL como:
```
https://github.com/TU_USUARIO/propdash-analytics.git
```
**Cópiala, la necesitarás en el siguiente paso**

---

## PASO 3: Subir el código a GitHub desde tu computadora

### 3.1 Abre Terminal/CMD
- **Windows**: Presiona `Win + R`, escribe `cmd`, Enter
- **Mac**: Abre "Terminal" desde Aplicaciones
- **Linux**: Abre Terminal (Ctrl + Alt + T)

### 3.2 Navega a la carpeta del proyecto
```bash
cd C:\Users\TuNombre\Descargas\propdash-analytics
```
*(Cambia la ruta según dónde descargaste la carpeta)*

### 3.3 Inicializa Git
```bash
git init
```

### 3.4 Configura el repositorio remoto
Reemplaza `TU_USUARIO` con tu nombre de usuario en GitHub:
```bash
git remote add origin https://github.com/TU_USUARIO/propdash-analytics.git
```

### 3.5 Agrega todos los archivos
```bash
git add .
```

### 3.6 Crea el primer commit
```bash
git commit -m "Initial commit: PropDash Analytics"
```

### 3.7 Sube el código a GitHub
```bash
git branch -M main
git push -u origin main
```

**Verás algo como:**
```
Enumerating objects: 15, done.
...
To https://github.com/TU_USUARIO/propdash-analytics.git
 * [new branch]      main -> main
```

✅ **¡El código está en GitHub!**

---

## PASO 4: Desplegar en Vercel

### 4.1 Ve a Vercel
1. Abre: https://vercel.com
2. Haz clic en **"Sign Up"**
3. Haz clic en **"Continue with GitHub"**
4. Autoriza Vercel a acceder a GitHub

### 4.2 Crea un nuevo proyecto
1. Una vez logueado en Vercel, haz clic en **"New Project"**
2. Haz clic en **"Import Git Repository"**
3. En "GitHub Account", selecciona tu cuenta
4. Busca y selecciona **"propdash-analytics"**
5. Haz clic en **"Import"**

### 4.3 Configura el proyecto
- Framework Preset: **Next.js** (debe detectarse automáticamente)
- Root Directory: `.` (por defecto)
- Environment Variables: Deja en blanco
- Haz clic en **"Deploy"**

### 4.4 Espera el despliegue
Vercel está creando y desplegando tu app. Espera 2-3 minutos.

Verás algo como:
```
✓ Production deployment ready to go live
```

---

## PASO 5: ¡Tu app está VIVA! 🎉

### 5.1 Obtén tu URL
Vercel te dará una URL como:
```
https://propdash-analytics.vercel.app
```

### 5.2 Prueba la app
1. Haz clic en el link
2. Selecciona un usuario (por ejemplo, "Juan Díaz")
3. Haz clic en "Ingresar"
4. ¡Navega por los módulos!

### 5.3 Comparte el link
Envía la URL a tu socia para que la vea

---

## ✅ Usuarios para probar

| Usuario | Departamento | Módulos visibles |
|---------|--------------|------------------|
| Juan Díaz | Finanzas | Solo Finanzas |
| María Rodríguez | Comercial | Solo Comercial |
| Carlos Cortés | Marketing | Solo Marketing |
| Ana Silva | Accionista | Todos los módulos |

---

## 📝 Ahora, cada vez que hagas cambios:

1. Edita los archivos localmente
2. Abre Terminal en la carpeta
3. Ejecuta:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```
4. Vercel redeplegará automáticamente

---

## ❓ Si algo falla:

### Error: "fatal: not a git repository"
- Asegúrate de estar en la carpeta `propdash-analytics`
- Ejecuta `git init` nuevamente

### Error: "fatal: 'origin' does not appear to be a 'git' repository"
- Revisa que copiaste correctamente la URL de GitHub

### Error en Vercel: "Build failed"
- Verifica que todos los archivos están en la carpeta
- Recarga la página de Vercel

### Más ayuda:
- Copia el error exacto y envíamelo

---

**¡Listo! Cuando tengas el link de Vercel, cuéntame y vamos haciendo los ajustes! 🚀**
