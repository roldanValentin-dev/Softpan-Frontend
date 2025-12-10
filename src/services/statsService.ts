import { api } from './api';
import type { DashboardStats, VentasResumen, ProductoTop, ClienteDeuda, DeudasResumen } from '../types';

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

  async getVentasPeriodo(fechaInicio: string, fechaFin: string): Promise<VentasResumen> {
    const response = await api.get<VentasResumen>(`/estadisticas/ventas/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return response.data;
  },

  async getTopProductos(top: number = 5): Promise<ProductoTop[]> {
    const response = await api.get<ProductoTop[]>(`/estadisticas/productos/top?top=${top}`);
    return response.data;
  },

  async getTopProductosPeriodo(top: number, fechaInicio: string, fechaFin: string): Promise<ProductoTop[]> {
    const response = await api.get<ProductoTop[]>(`/estadisticas/productos/top/periodo?top=${top}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return response.data;
  },

  async getResumenDeudas(): Promise<DeudasResumen> {
    const response = await api.get<DeudasResumen>('/estadisticas/deudas/resumen');
    return response.data;
  },

  async getClientesConMayorDeuda(top: number = 5): Promise<ClienteDeuda[]> {
    const response = await api.get<ClienteDeuda[]>(`/estadisticas/deudas/clientes?top=${top}`);
    return response.data;
  },

  async getComparativaMensual(): Promise<any> {
    const response = await api.get('/estadisticas/comparativa/mensual');
    return response.data;
  },

  async getComparativaSemanal(): Promise<any> {
    const response = await api.get('/estadisticas/comparativa/semanal');
    return response.data;
  },

  async getVentasPorDiaSemana(): Promise<any> {
    const response = await api.get('/estadisticas/ventas/por-dia-semana');
    return response.data;
  },

  async getVentasPorTipoCliente(): Promise<any> {
    const response = await api.get('/estadisticas/ventas/por-tipo-cliente');
    return response.data;
  },

  async getMetodosPago(): Promise<any> {
    const response = await api.get('/estadisticas/pagos/metodos');
    return response.data;
  },

  async getProductosSinMovimiento(dias: number = 30): Promise<any> {
    const response = await api.get(`/estadisticas/productos/sin-movimiento?dias=${dias}`);
    return response.data;
  },

  async getPrediccionDemanda(diaSemana?: number): Promise<any> {
    const url = diaSemana !== undefined 
      ? `/estadisticas/prediccion/demanda?diaSemana=${diaSemana}`
      : '/estadisticas/prediccion/demanda';
    const response = await api.get(url);
    return response.data;
  },
};