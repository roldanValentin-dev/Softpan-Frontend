import { api } from './api';

export interface Pago {
  id: number;
  clienteId: number;
  clienteNombre: string;
  monto: number;
  tipoPago: number;
  tipoPagoNombre: string;
  fechaPago: string;
  observaciones: string;
  pagosAplicados?: PagoAplicado[];
}

export interface PagoAplicado {
  id: number;
  ventaId: number;
  montoAplicado: number;
}

export interface PagoForm {
  clienteId: number;
  monto: number;
  tipoPago: number;
  observaciones: string;
  ventasAAplicar: VentaAAplicar[];
}

export interface VentaAAplicar {
  ventaId: number;
  montoAplicado: number;
}

export const pagoService = {
  async getByCliente(clienteId: number): Promise<Pago[]> {
    const response = await api.get<Pago[]>(`/pagos/cliente/${clienteId}`);
    return response.data;
  },

  async getById(id: number): Promise<Pago> {
    const response = await api.get<Pago>(`/pagos/${id}`);
    return response.data;
  },

  async create(pago: PagoForm): Promise<Pago> {
    console.log('Enviando pago:', pago);
    const response = await api.post<Pago>('/pagos', pago);
    return response.data;
  },
};
