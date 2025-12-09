import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClientes } from '../../hooks/useClientes';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Swal from 'sweetalert2';
import { MdSearch, MdCheckCircle, MdCancel, MdPhone, MdLocationOn, MdPeople } from 'react-icons/md';

export default function ClientesList() {
  const { clientes, isLoading, deleteCliente, isDeleting } = useClientes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.telefono.includes(searchTerm) ||
                         cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActivo === 'todos' ||
                         (filterActivo === 'activos' && cliente.activo) ||
                         (filterActivo === 'inactivos' && !cliente.activo);
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se desactivará el cliente "${nombre}"`,
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
        await deleteCliente(id);
        Swal.fire({
          title: 'Desactivado',
          text: 'El cliente ha sido desactivado',
          icon: 'success',
          confirmButtonColor: '#f97316'
        });
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo desactivar el cliente',
          icon: 'error',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };



  return (
    <AppLayout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Clientes' }]} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Clientes</h1>
            <p className="text-gray-600 dark:text-gray-300">Gestiona tu cartera de clientes</p>
          </div>
          <Link to={ROUTES.CLIENTES_NUEVO} className="btn-primary w-full sm:w-auto text-center">
            + Nuevo Cliente
          </Link>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Buscar clientes..."
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
            ) : filteredClientes.length === 0 ? (
              <EmptyState
                icon={<MdPeople />}
                title="No se encontraron clientes"
                description="Comienza agregando tu primer cliente"
                action={
                  <Link to={ROUTES.CLIENTES_NUEVO} className="btn-primary">
                    + Nuevo Cliente
                  </Link>
                }
              />
            ) : (
              filteredClientes.map((cliente) => (
                <div key={cliente.id} className="card hover:shadow-xl transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-3">
                      <MdPeople className="text-white text-3xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">{cliente.nombre}</h3>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <MdPhone className="text-gray-400" />
                        {cliente.telefono}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <MdLocationOn className="text-gray-400" />
                        {cliente.direccion}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        cliente.tipoCliente === 1
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {cliente.tipoClienteNombre}
                      </span>
                      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full ${
                        cliente.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cliente.activo ? <MdCheckCircle /> : <MdCancel />}
                        {cliente.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Link
                        to={`/clientes/${cliente.id}/editar`}
                        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(cliente.id, cliente.nombre)}
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
          <div className="hidden md:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="hidden xl:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                      <td colSpan={6} className="px-6 py-6">
                        <TableSkeleton rows={5} />
                      </td>
                    </tr>
                  ) : filteredClientes.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState
                          icon={<MdPeople />}
                          title="No se encontraron clientes"
                          description="Comienza agregando tu primer cliente"
                          action={
                            <Link to={ROUTES.CLIENTES_NUEVO} className="btn-primary">
                              + Nuevo Cliente
                            </Link>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredClientes.map((cliente) => (
                      <tr key={cliente.id} className="table-row">
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 lg:gap-4">
                            <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                              <span className="material-icons text-white text-base lg:text-xl">person</span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {cliente.nombre}
                              </div>
                              <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                {cliente.telefono}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <MdPhone className="text-gray-400" />
                            {cliente.telefono}
                          </div>
                        </td>
                        <td className="hidden xl:table-cell px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <MdLocationOn className="text-gray-400" />
                            <span className="truncate max-w-xs">{cliente.direccion}</span>
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <span className={`px-2 lg:px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full whitespace-nowrap ${
                            cliente.tipoCliente === 1
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            <span className="lg:hidden">{cliente.tipoCliente === 1 ? 'C' : 'R'}</span>
                            <span className="hidden lg:inline">{cliente.tipoClienteNombre}</span>
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full ${
                            cliente.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {cliente.activo ? <MdCheckCircle /> : <MdCancel />}
                            {cliente.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-medium">
                          <div className="flex flex-col lg:flex-row lg:space-x-3 gap-2 lg:gap-0 lg:justify-end">
                            <Link
                              to={`/clientes/${cliente.id}/editar`}
                              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 font-semibold whitespace-nowrap"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(cliente.id, cliente.nombre)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 font-semibold disabled:opacity-50 whitespace-nowrap"
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
