import { api } from './api';
import type { Producto, ProductoForm } from '../types';

export const productService = {
  async getAll(): Promise<Producto[]> {
    const response = await api.get<any[]>('/productos');
    return response.data.map((p: any) => ({
      ...p,
      precioUnitario: p.precioBase || p.precioUnitario || 0
    }));
  },

  async getActive(): Promise<Producto[]> {
    const response = await api.get<any[]>('/productos/activos');
    return response.data.map((p: any) => ({
      ...p,
      precioUnitario: p.precioBase || p.precioUnitario || 0
    }));
  },

  async getById(id: number): Promise<Producto> {
    const response = await api.get<any>(`/productos/${id}`);
    return {
      ...response.data,
      precioUnitario: response.data.precioBase || response.data.precioUnitario || 0
    };
  },

  async create(producto: ProductoForm): Promise<Producto> {
    const payload = {
      ...producto,
      precioUnitario: parseFloat(producto.precioUnitario.toString()),
      precioBase: parseFloat(producto.precioUnitario.toString())
    };
    console.log('Enviando producto:', payload);
    const response = await api.post<Producto>('/productos', payload);
    return response.data;
  },

  async update(id: number, producto: Producto): Promise<Producto> {
    const payload = {
      ...producto,
      precioBase: producto.precioUnitario,
      precioUnitario: producto.precioUnitario
    };
    console.log('Actualizando producto:', payload);
    const response = await api.put<Producto>(`/productos/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/productos/${id}`);
  },
};
