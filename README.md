# 🥖 Softpan Frontend

**Sistema de gestión para panadería** - Progressive Web App (PWA) desarrollada con React + TypeScript

## 📱 Características

- ✅ **Mobile-First Design** - Optimizado para celulares y tablets
- ✅ **Progressive Web App** - Se instala como app nativa
- ✅ **Sistema de Autenticación** - Login con JWT
- ✅ **Gestión de Ventas** - Registro rápido de ventas
- ✅ **Control de Inventario** - Productos y precios
- ✅ **Gestión de Clientes** - Base de datos de clientes
- ✅ **Sistema de Pagos** - Control de deudas y pagos
- ✅ **Dashboard** - Estadísticas y reportes
- ✅ **Offline Ready** - Funciona sin conexión

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Routing**: React Router
- **Estado**: TanStack Query
- **Formularios**: React Hook Form
- **HTTP Client**: Axios
- **PWA**: Vite PWA Plugin
- **UI Components**: Headless UI + Heroicons

## 🚀 Instalación y Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/roldanValentin-dev/Softpan-Frontend.git
cd Softpan-Frontend/softpan-frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 API Backend

Este frontend consume la API de Softpan desarrollada en ASP.NET Core.

**Base URL**: `https://localhost:7097/api`

### Endpoints principales:
- `/auth/login` - Autenticación
- `/productos` - Gestión de productos
- `/clientes` - Gestión de clientes
- `/ventas` - Sistema de ventas
- `/pagos` - Registro de pagos
- `/estadisticas` - Dashboard y reportes

## 📱 Instalación como PWA

1. Abre la aplicación en tu navegador
2. En el menú del navegador, selecciona "Instalar app" o "Agregar a pantalla de inicio"
3. La app se instalará como una aplicación nativa

## 🎯 Usuarios del Sistema

- **👨‍💼 Administrador**: Acceso completo al sistema
- **👩‍💼 Vendedor**: Crear ventas, ver productos y clientes
- **👨‍💼 Cajero**: Registrar pagos, ver ventas

## 🚀 Deploy

La aplicación está configurada para deploy automático en Vercel:

```bash
# Deploy manual
npm run build
vercel --prod
```

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso interno de panaderías.

---

**Desarrollado con ❤️ para la gestión eficiente de panaderías**