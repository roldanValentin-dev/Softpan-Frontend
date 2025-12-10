import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Swal from 'sweetalert2';
import { MdSearch, MdCheckCircle, MdCancel, MdInventory } from 'react-icons/md';

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
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
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



  return (
    <AppLayout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Productos' }]} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Productos</h1>
            <p className="text-gray-600 dark:text-gray-300">Gestiona tu catálogo de productos</p>
          </div>
          <Link to={ROUTES.PRODUCTOS_NUEVO} className="btn-primary w-full sm:w-auto text-center">
            + Nuevo Producto
          </Link>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input-field md:w-48"
              value={filterActivo}
              onChange={(e) => setFilterActivo(e.target.value as any)}
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>

          {/* Vista Mobile - Cards */}
          <div className="md:hidden space-y-4 pb-24">
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : filteredProductos.length === 0 ? (
              <EmptyState
                icon={<MdInventory />}
                title="No se encontraron productos"
                description="Comienza agregando tu primer producto al catálogo"
                action={
                  <Link to={ROUTES.PRODUCTOS_NUEVO} className="btn-primary">
                    + Nuevo Producto
                  </Link>
                }
              />
            ) : (
              filteredProductos.map((producto) => (
                <div key={producto.id} className="card hover:shadow-xl transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-3">
                      <span className="text-white font-bold text-2xl">
                        {producto.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{producto.descripcion}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-orange-600">
                        {formatCurrency(producto.precioUnitario)}
                      </span>
                      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full ${
                        producto.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {producto.activo ? <MdCheckCircle /> : <MdCancel />}
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Link
                        to={`/productos/${producto.id}/editar`}
                        className="flex-1 text-center bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(producto.id, producto.nombre)}
                        disabled={isDeleting}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Desactivar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vista Desktop - Tabla */}
          <div className="hidden md:block overflow-x-auto pb-6">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-6">
                        <TableSkeleton rows={5} />
                      </td>
                    </tr>
                  ) : filteredProductos.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState
                          icon={<MdInventory />}
                          title="No se encontraron productos"
                          description="Comienza agregando tu primer producto al catálogo"
                          action={
                            <Link to={ROUTES.PRODUCTOS_NUEVO} className="btn-primary">
                              + Nuevo Producto
                            </Link>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredProductos.map((producto) => (
                      <tr key={producto.id} className="table-row">
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 lg:gap-4">
                            <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-sm lg:text-lg">
                                {producto.nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {producto.nombre}
                              </div>
                              <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                {producto.descripcion}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {producto.descripcion}
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <div className="text-xs lg:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(producto.precioUnitario)}
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <span className={`px-2 lg:px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full ${
                            producto.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {producto.activo ? <MdCheckCircle className="hidden lg:inline" /> : <MdCancel className="hidden lg:inline" />}
                            <span className="hidden lg:inline">{producto.activo ? 'Activo' : 'Inactivo'}</span>
                            <span className="lg:hidden">{producto.activo ? 'A' : 'I'}</span>
                          </span>
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-medium">
                          <div className="flex flex-col lg:flex-row lg:space-x-3 gap-2 lg:gap-0 lg:justify-end">
                            <Link
                              to={`/productos/${producto.id}/editar`}
                              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 font-semibold whitespace-nowrap"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(producto.id, producto.nombre)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold disabled:opacity-50 whitespace-nowrap"
                            >
                              Desactivar
                            </button>
                          </div>
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
