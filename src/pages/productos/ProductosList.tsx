import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import Swal from 'sweetalert2';

export default function ProductosList() {
  const { productos, isLoading, deleteProducto, isDeleting } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActivo === 'todos' ||
                         (filterActivo === 'activos' && producto.activo) ||
                         (filterActivo === 'inactivos' && !producto.activo);
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se desactivará el producto "${nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteProducto(id);
        Swal.fire({
          title: 'Desactivado',
          text: 'El producto ha sido desactivado',
          icon: 'success',
          confirmButtonColor: '#f97316'
        });
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo desactivar el producto',
          icon: 'error',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Productos</h1>
            <p className="text-gray-600">Gestiona tu catálogo de productos</p>
          </div>
          <Link to={ROUTES.PRODUCTOS_NUEVO} className="btn-primary w-full sm:w-auto text-center">
            + Nuevo Producto
          </Link>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Buscar productos..."
                className="input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input-field md:w-48"
              value={filterActivo}
              onChange={(e) => setFilterActivo(e.target.value as any)}
            >
              <option value="todos">📋 Todos</option>
              <option value="activos">✅ Activos</option>
              <option value="inactivos">❌ Inactivos</option>
            </select>
          </div>

          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredProductos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-lg font-medium">No se encontraron productos</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProductos.map((producto) => (
                      <tr key={producto.id} className="hover:bg-orange-50/50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {producto.nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {producto.nombre}
                              </div>
                              <div className="md:hidden text-xs text-gray-500 mt-1">
                                {producto.descripcion}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {producto.descripcion}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(producto.precioUnitario)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                            producto.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {producto.activo ? '✓ Activo' : '✕ Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                          <Link
                            to={`/productos/${producto.id}/editar`}
                            className="text-orange-600 hover:text-orange-900 font-semibold"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(producto.id, producto.nombre)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 font-semibold disabled:opacity-50"
                          >
                            Desactivar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
