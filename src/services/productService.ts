import { api } from './api';
import type { Producto, ProductoForm } from '../types';

export const productService = {
  async getAll(): Promise<Producto[]> {
    const response = await api.get<Producto[]>('/productos');
    return response.data;
  },

  async getActive(): Promise<Producto[]> {
    const response = await api.get<Producto[]>('/productos/activos');
    return response.data;
  },

  async getById(id: number): Promise<Producto> {
    const response = await api.get<Producto>(`/productos/${id}`);
    return response.data;
  },

  async create(producto: ProductoForm): Promise<Producto> {
    const response = await api.post<Producto>('/productos', producto);
    return response.data;
  },

  async update(id: number, producto: Producto): Promise<Producto> {
    const response = await api.put<Producto>(`/productos/${id}`, producto);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/productos/${id}`);
  },
};