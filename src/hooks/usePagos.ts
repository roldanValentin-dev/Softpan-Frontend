import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pagoService, type PagoForm } from '../services/pagoService';

export function usePagos(clienteId?: number) {
  const queryClient = useQueryClient();

  const { data: pagos = [], isLoading } = useQuery({
    queryKey: ['pagos', clienteId],
    queryFn: () => clienteId ? pagoService.getByCliente(clienteId) : Promise.resolve([]),
    enabled: !!clienteId,
  });

  const { mutateAsync: createPago, isPending: isCreating } = useMutation({
    mutationFn: (pago: PagoForm) => pagoService.create(pago),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['ventas', 'pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['pagos'] });
    },
  });

  return {
    pagos,
    isLoading,
    createPago,
    isCreating,
  };
}

export function usePago(id: number) {
  const { data: pago, isLoading } = useQuery({
    queryKey: ['pagos', id],
    queryFn: () => pagoService.getById(id),
    enabled: !!id,
  });

  return {
    pago,
    isLoading,
  };
}
