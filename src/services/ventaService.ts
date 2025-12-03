import { api } from './api';
import type { Venta, VentaForm } from '../types';

export const ventaService = {
  async getAll(): Promise<Venta[]> {
    const response = await api.get<Venta[]>('/ventas');
    return response.data;
  },

  async getById(id: number): Promise<Venta> {
    const response = await api.get<Venta>(`/ventas/${id}`);
    return response.data;
  },

  async getPendientes(): Promise<Venta[]> {
    const response = await api.get<Venta[]>('/ventas/pendientes');
    return response.data;
  },

  async create(venta: VentaForm): Promise<Venta> {
    console.log('Enviando venta:', venta);
    const response = await api.post<Venta>('/ventas', venta);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/ventas/${id}`);
  },
};
