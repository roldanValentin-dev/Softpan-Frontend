import { api } from './api';
import type { DashboardStats, VentasResumen, ProductoTop, ClienteDeuda } from '../types';

export const statsService = {
  async getDashboard(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/estadisticas/dashboard');
    return response.data;
  },

  async getVentasHoy(): Promise<VentasResumen> {
    const response = await api.get<VentasResumen>('/estadisticas/ventas/hoy');
    return response.data;
  },

  async getVentasSemana(): Promise<VentasResumen> {
    const response = await api.get<VentasResumen>('/estadisticas/ventas/semana');
    return response.data;
  },

  async getVentasMes(): Promise<VentasResumen> {
    const response = await api.get<VentasResumen>('/estadisticas/ventas/mes');
    return response.data;
  },

  async getTopProductos(top: number = 5): Promise<ProductoTop[]> {
    const response = await api.get<ProductoTop[]>(`/estadisticas/productos/top?top=${top}`);
    return response.data;
  },

  async getClientesConMayorDeuda(top: number = 5): Promise<ClienteDeuda[]> {
    const response = await api.get<ClienteDeuda[]>(`/estadisticas/deudas/clientes?top=${top}`);
    return response.data;
  },
};