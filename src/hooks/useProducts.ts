import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { Producto, ProductoForm } from '../types';

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: productos = [], isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: () => productService.getAll(),
  });

  const { data: productosActivos = [] } = useQuery({
    queryKey: ['productos', 'activos'],
    queryFn: () => productService.getActive(),
  });

  const createMutation = useMutation({
    mutationFn: (producto: ProductoForm) => productService.create(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, producto }: { id: number; producto: Producto }) =>
      productService.update(id, producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  return {
    productos,
    productosActivos,
    isLoading,
    error,
    createProducto: createMutation.mutateAsync,
    updateProducto: updateMutation.mutateAsync,
    deleteProducto: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}