import { api } from './api';
import type { Cliente, ClienteForm } from '../types';

export const clientService = {
  async getAll(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>('/clientes');
    return response.data;
  },

  async getById(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  async getWithDebts(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>('/clientes/con-deudas');
    return response.data;
  },

  async create(cliente: ClienteForm): Promise<Cliente> {
    const response = await api.post<Cliente>('/clientes', cliente);
    return response.data;
  },

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, cliente);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};