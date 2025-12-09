import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePagos } from '../../hooks/usePagos';
import { useClientes } from '../../hooks/useClientes';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { MdSearch, MdPayment } from 'react-icons/md';

export default function PagosList() {
  const [selectedClienteId, setSelectedClienteId] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoPago, setFilterTipoPago] = useState<'todos' | '1' | '2'>('todos');

  const { clientes } = useClientes();
  const { pagos, isLoading } = usePagos(selectedClienteId);

  const filteredPagos = pagos.filter(pago => {
    const matchesSearch = pago.clienteNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pago.id.toString().includes(searchTerm);
    const matchesFilter = filterTipoPago === 'todos' || pago.tipoPago === Number(filterTipoPago);
    return matchesSearch && matchesFilter;
  });



  return (
    <AppLayout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Pagos' }]} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Pagos</h1>
            <p className="text-gray-600 dark:text-gray-300">Historial de pagos registrados</p>
          </div>
          <Link to={ROUTES.PAGOS_NUEVO} className="btn-primary text-center w-full sm:w-auto">
            + Registrar Pago
          </Link>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              className="input-field md:w-64"
              value={selectedClienteId || ''}
              onChange={(e) => setSelectedClienteId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>

            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Buscar pagos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="input-field md:w-48"
              value={filterTipoPago}
              onChange={(e) => setFilterTipoPago(e.target.value as any)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="1">Efectivo</option>
              <option value="2">Transferencia</option>
            </select>
          </div>

          {/* Vista Mobile - Cards */}
          <div className="md:hidden space-y-4 pb-24">
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : !selectedClienteId ? (
              <EmptyState
                icon={<MdPayment />}
                title="Selecciona un cliente"
                description="Elige un cliente del selector para ver su historial de pagos"
              />
            ) : filteredPagos.length === 0 ? (
              <EmptyState
                icon={<MdPayment />}
                title="No se encontraron pagos"
                description="Este cliente aún no tiene pagos registrados"
                action={
                  <Link to={ROUTES.PAGOS_NUEVO} className="btn-primary">
                    + Registrar Pago
                  </Link>
                }
              />
            ) : (
              filteredPagos.map((pago) => (
                <div key={pago.id} className="card hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Pago</span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-xl">#{pago.id}</h3>
                    </div>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      pago.tipoPago === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pago.tipoPagoNombre}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cliente</span>
                      <p className="font-semibold text-gray-900 dark:text-white">{pago.clienteNombre}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fecha</span>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(pago.fechaPago)}</p>
                    </div>
                    {pago.observaciones && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Observaciones</span>
                        <p className="text-sm text-gray-900 dark:text-white">{pago.observaciones}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl mb-4">
                    <span className="text-sm text-gray-600">Monto</span>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(pago.monto)}</p>
                  </div>
                  <Link
                    to={`/pagos/${pago.id}`}
                    className="block text-center bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Ver Detalle
                  </Link>
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="hidden xl:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Observaciones
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 transition-all duration-300">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-6">
                        <TableSkeleton rows={5} />
                      </td>
                    </tr>
                  ) : !selectedClienteId ? (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState
                          icon={<MdPayment />}
                          title="Selecciona un cliente"
                          description="Elige un cliente del selector para ver su historial de pagos"
                        />
                      </td>
                    </tr>
                  ) : filteredPagos.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState
                          icon={<MdPayment />}
                          title="No se encontraron pagos"
                          description="Este cliente aún no tiene pagos registrados"
                          action={
                            <Link to={ROUTES.PAGOS_NUEVO} className="btn-primary">
                              + Registrar Pago
                            </Link>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredPagos.map((pago) => (
                      <tr key={pago.id} className="table-row animate-fadeInUp">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            #{pago.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {pago.clienteNombre}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDateTime(pago.fechaPago)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(pago.monto)}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                            pago.tipoPago === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {pago.tipoPagoNombre}
                          </span>
                        </td>
                        <td className="hidden xl:table-cell px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                            {pago.observaciones || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <Link
                            to={`/pagos/${pago.id}`}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-semibold"
                          >
                            Ver Detalle
                          </Link>
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
