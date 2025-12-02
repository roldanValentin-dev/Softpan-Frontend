import { api } from './api';
import type { Pago, PagoForm } from '../types';

export const paymentService = {
  async getByVentaId(ventaId: number): Promise<Pago[]> {
    const response = await api.get<Pago[]>(`/pagos/venta/${ventaId}`);
    return response.data;
  },

  async create(pago: PagoForm): Promise<Pago> {
    const response = await api.post<Pago>('/pagos', pago);
    return response.data;
  },
};