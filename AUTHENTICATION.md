# Sistema de Autenticación - Softpan

## Implementación Completa

### Archivos Creados

**Context y Hooks:**
- `src/store/authContext.tsx` - Context global de autenticación
- `src/hooks/useLocalStorage.ts` - Hook para localStorage

**Páginas:**
- `src/pages/auth/Login.tsx` - Página de inicio de sesión
- `src/pages/auth/Register.tsx` - Página de registro
- `src/pages/dashboard/Dashboard.tsx` - Dashboard principal

**Componentes:**
- `src/components/layout/PrivateRoute.tsx` - Protección de rutas

**Configuración:**
- `src/App.tsx` - Router configurado con rutas públicas y privadas

## Funcionalidades Implementadas

### Login
- Validación de email y contraseña
- Manejo de errores de API
- Redirección automática al dashboard
- Persistencia de sesión con localStorage

### Registro
- Validación de nombre, email y contraseña
- Creación de cuenta
- Login automático después del registro
- Manejo de errores

### Protección de Rutas
- Rutas privadas requieren autenticación
- Redirección a login si no está autenticado
- Loading state mientras verifica autenticación
- Soporte para roles (preparado para futuro)

### Persistencia de Sesión
- Token JWT guardado en localStorage
- Usuario guardado en localStorage
- Sesión persiste al recargar página
- Logout limpia toda la información

## Rutas Disponibles

**Públicas:**
- `/login` - Inicio de sesión
- `/register` - Registro de usuario

**Privadas:**
- `/dashboard` - Panel principal (requiere autenticación)

**Redirecciones:**
- `/` - Redirige a `/login`
- Cualquier ruta no encontrada - Redirige a `/login`

## Uso del Hook useAuth

```typescript
import { useAuth } from './store/authContext';

function MiComponente() {
  const { user, isAuthenticated, login, logout, hasRole } = useAuth();
  
  // Verificar si está autenticado
  if (!isAuthenticated) {
    return <p>No autenticado</p>;
  }
  
  // Acceder a datos del usuario
  console.log(user.nombre);
  console.log(user.email);
  console.log(user.roles);
  
  // Verificar rol
  if (hasRole('Admin')) {
    // Mostrar opciones de admin
  }
  
  // Cerrar sesión
  const handleLogout = () => {
    logout();
  };
}
```

## Flujo de Autenticación

1. Usuario ingresa credenciales en Login
2. Se validan los campos localmente
3. Se envía request a API `/auth/login`
4. API retorna token JWT y datos del usuario
5. Se guarda en localStorage
6. Se actualiza el contexto global
7. Se redirige al dashboard
8. Usuario puede navegar por rutas privadas

## Próximos Pasos

- Implementar refresh token
- Agregar "Recordarme"
- Recuperación de contraseña
- Verificación de email
- Manejo de roles más granular