import { api } from './api';
import type { Cliente } from '../types';

export interface ClienteForm {
  nombre: string;
  telefono: string;
  direccion: string;
  tipoCliente: number;
}

export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>('/clientes');
    return response.data;
  },

  async getById(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  async create(cliente: ClienteForm): Promise<Cliente> {
    console.log('Enviando cliente:', cliente);
    const response = await api.post<Cliente>('/clientes', cliente);
    return response.data;
  },

  async update(id: number, cliente: ClienteForm): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, { id, ...cliente });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};
