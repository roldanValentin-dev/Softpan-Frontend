// Constantes de la aplicación

export const API_BASE_URL = 'http://localhost:7097/api';

export const ROUTES = {
  // Públicas
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Privadas
  DASHBOARD: '/dashboard',
  PRODUCTOS: '/productos',
  PRODUCTOS_NUEVO: '/productos/nuevo',
  PRODUCTOS_EDITAR: '/productos/:id/editar',
  CLIENTES: '/clientes',
  CLIENTES_NUEVO: '/clientes/nuevo',
  CLIENTES_DETALLE: '/clientes/:id',
  VENTAS: '/ventas',
  VENTAS_NUEVA: '/ventas/nueva',
  VENTAS_DETALLE: '/ventas/:id',
  PAGOS: '/pagos',
  REPORTES: '/reportes',
  PERFIL: '/perfil',
} as const;

export const ROLES = {
  ADMIN: 'Admin',
  VENDEDOR: 'Vendedor',
  CAJERO: 'Cajero',
} as const;

export const ESTADOS_VENTA = {
  PENDIENTE: 0,
  PARCIALMENTE_PAGADA: 1,
  PAGADA: 2,
} as const;

export const METODOS_PAGO = [
  'Efectivo',
  'Tarjeta',
  'Transferencia',
] as const;

export const MENSAJES = {
  ERROR_GENERICO: 'Ha ocurrido un error inesperado',
  ERROR_CONEXION: 'Error de conexión con el servidor',
  ERROR_AUTENTICACION: 'Credenciales inválidas',
  EXITO_GUARDADO: 'Guardado exitosamente',
  EXITO_ELIMINADO: 'Eliminado exitosamente',
} as const;

export const VALIDACIONES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO_REGEX: /^[0-9\-\+\s\(\)]+$/,
  MIN_PASSWORD_LENGTH: 6,
} as const;