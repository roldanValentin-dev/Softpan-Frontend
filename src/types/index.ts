// Tipos principales de la aplicación Softpan

// ===== AUTENTICACIÓN =====
export interface User {
  id?: number;
  email: string;
  nombre: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
}

// ===== PRODUCTOS =====
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  precioBase?: number;
  activo: boolean;
}

export interface ProductoForm {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
}

// ===== CLIENTES =====
export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  activo: boolean;
}

export interface ClienteForm {
  nombre: string;
  telefono: string;
  direccion: string;
}

// ===== VENTAS =====
export interface Venta {
  id: number;
  clienteId: number;
  nombreCliente: string;
  fechaCreacion: string;
  montoTotal: number;
  montoPagado: number;
  estado: EstadoVenta;
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaForm {
  clienteId: number;
  detalles: DetalleVentaForm[];
}

export interface DetalleVentaForm {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

// ===== PAGOS =====
export interface Pago {
  id: number;
  ventaId: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
}

export interface PagoForm {
  ventaId: number;
  monto: number;
  metodoPago: string;
}

// ===== ESTADÍSTICAS =====
export interface DashboardStats {
  ventasHoy: VentasResumen;
  ventasMes: VentasResumen;
  deudas: DeudasResumen;
  topProductos: ProductoTop[];
  clientesConMayorDeuda: ClienteDeuda[];
}

export interface VentasResumen {
  totalVentas: number;
  cantidadTransacciones: number;
  ticketPromedio: number;
  totalCobrado: number;
}

export interface DeudasResumen {
  totalDeudas: number;
  cantidadClientesConDeuda: number;
  promedioDeudaPorCliente: number;
}

export interface ProductoTop {
  productoId: number;
  nombreProducto: string;
  cantidadVendida: number;
  totalVendido: number;
}

export interface ClienteDeuda {
  clienteId: number;
  nombreCliente: string;
  montoDeuda: number;
  cantidadVentasPendientes: number;
}

// ===== ENUMS COMO TIPOS =====
export type EstadoVenta = 0 | 1 | 2; // Pendiente | ParcialmentePagada | Pagada

export type RolUsuario = 'Admin' | 'Vendedor' | 'Cajero';

// ===== TIPOS UTILITARIOS =====
export type ID = string | number;

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';