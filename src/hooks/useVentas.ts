import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ventaService } from '../services/ventaService';
import type { VentaForm } from '../types';

export function useVentas() {
  const queryClient = useQueryClient();

  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: ventaService.getAll,
  });

  const { data: ventasPendientes = [], isLoading: isLoadingPendientes } = useQuery({
    queryKey: ['ventas', 'pendientes'],
    queryFn: ventaService.getPendientes,
  });

  const { mutateAsync: createVenta, isPending: isCreating } = useMutation({
    mutationFn: (venta: VentaForm) => ventaService.create(venta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['ventas', 'pendientes'] });
    },
  });

  const { mutateAsync: deleteVenta, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => ventaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['ventas', 'pendientes'] });
    },
  });

  return {
    ventas,
    ventasPendientes,
    isLoading,
    isLoadingPendientes,
    createVenta,
    deleteVenta,
    isCreating,
    isDeleting,
  };
}
