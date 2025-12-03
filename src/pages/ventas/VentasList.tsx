import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVentas } from '../../hooks/useVentas';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Swal from 'sweetalert2';
import { MdSearch, MdCheckCircle, MdPending, MdAttachMoney, MdShoppingCart } from 'react-icons/md';

export default function VentasList() {
  const { ventas, isLoading, deleteVenta, isDeleting } = useVentas();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'todos' | '1' | '2' | '3'>('todos');

  const filteredVentas = ventas.filter(venta => {
    const matchesSearch = venta.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venta.id.toString().includes(searchTerm);
    
    const matchesFilter = filterEstado === 'todos' || venta.estado === Number(filterEstado);
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará la venta permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        await deleteVenta(id);
        Swal.fire({
          title: 'Eliminada',
          text: 'La venta ha sido eliminada',
          icon: 'success',
          confirmButtonColor: '#f97316'
        });
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo eliminar la venta',
          icon: 'error',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  const getEstadoBadge = (estado: number, estadoNombre: string) => {
    const badges = {
      1: 'bg-yellow-100 text-yellow-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-green-100 text-green-800',
    };
    
    const icons = {
      1: <MdPending />,
      2: <MdAttachMoney />,
      3: <MdCheckCircle />,
    };

    return (
      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full ${badges[estado as keyof typeof badges]}`}>
        {icons[estado as keyof typeof icons]}
        {estadoNombre}
      </span>
    );
  };



  return (
    <AppLayout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Ventas' }]} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Ventas</h1>
            <p className="text-gray-600">Gestiona tus ventas y pedidos</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to={ROUTES.PAGOS_NUEVO} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              Registrar Pago
            </Link>
            <Link to={ROUTES.VENTAS_NUEVA} className="btn-primary text-center">
              + Nueva Venta
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Buscar ventas..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input-field md:w-48"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as any)}
            >
              <option value="todos">Todos</option>
              <option value="1">Pendiente</option>
              <option value="2">Parcialmente Pagada</option>
              <option value="3">Pagada</option>
            </select>
          </div>

          {/* Vista Mobile - Cards */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : filteredVentas.length === 0 ? (
              <EmptyState
                icon={<MdShoppingCart />}
                title="No se encontraron ventas"
                description="Comienza registrando tu primera venta"
                action={
                  <Link to={ROUTES.VENTAS_NUEVA} className="btn-primary">
                    + Nueva Venta
                  </Link>
                }
              />
            ) : (
              filteredVentas.map((venta) => (
                <div key={venta.id} className="card hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-sm text-gray-500">Venta</span>
                      <h3 className="font-bold text-gray-900 text-xl">#{venta.id}</h3>
                    </div>
                    {getEstadoBadge(venta.estado, venta.estadoNombre)}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Cliente</span>
                      <p className="font-semibold text-gray-900">{venta.clienteNombre}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Fecha</span>
                      <p className="text-sm text-gray-900">{formatDateTime(venta.fechaCreacion)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total</span>
                      <p className="font-bold text-gray-900">{formatCurrency(venta.montoTotal)}</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-600">Pagado</span>
                      <p className="font-bold text-green-600">{formatCurrency(venta.montoPagado)}</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm text-gray-600">Saldo</span>
                      <p className="font-bold text-red-600">{formatCurrency(venta.saldoPendiente)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/ventas/${venta.id}`}
                      className="flex-1 text-center bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Ver Detalle
                    </Link>
                    <button
                      onClick={() => handleDelete(venta.id)}
                      disabled={isDeleting}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vista Desktop - Tabla */}
          <div className="hidden md:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pagado
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 transition-all duration-300">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-6">
                        <TableSkeleton rows={5} />
                      </td>
                    </tr>
                  ) : filteredVentas.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState
                          icon={<MdShoppingCart />}
                          title="No se encontraron ventas"
                          description="Comienza registrando tu primera venta"
                          action={
                            <Link to={ROUTES.VENTAS_NUEVA} className="btn-primary">
                              + Nueva Venta
                            </Link>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredVentas.map((venta) => (
                      <tr key={venta.id} className="table-row animate-fadeInUp">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            #{venta.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {venta.clienteNombre}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {formatDateTime(venta.fechaCreacion)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(venta.montoTotal)}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <div className="text-sm text-green-600 font-semibold">
                            {formatCurrency(venta.montoPagado)}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <div className="text-sm text-red-600 font-semibold">
                            {formatCurrency(venta.saldoPendiente)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getEstadoBadge(venta.estado, venta.estadoNombre)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                          <Link
                            to={`/ventas/${venta.id}`}
                            className="text-green-600 hover:text-green-900 font-semibold"
                          >
                            Ver Detalle
                          </Link>
                          <button
                            onClick={() => handleDelete(venta.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 font-semibold disabled:opacity-50"
                          >
                            Eliminar
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
