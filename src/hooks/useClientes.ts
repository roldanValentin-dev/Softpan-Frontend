import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService, type ClienteForm } from '../services/clienteService';

export function useClientes() {
  const queryClient = useQueryClient();

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: clienteService.getAll,
  });

  const { mutateAsync: createCliente, isPending: isCreating } = useMutation({
    mutationFn: (cliente: ClienteForm) => clienteService.create(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const { mutateAsync: updateCliente, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, cliente }: { id: number; cliente: ClienteForm }) =>
      clienteService.update(id, cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const { mutateAsync: deleteCliente, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  return {
    clientes,
    isLoading,
    createCliente,
    updateCliente,
    deleteCliente,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
