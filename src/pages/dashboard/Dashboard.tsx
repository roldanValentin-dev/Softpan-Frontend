import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../store/authContext';
import { useStats } from '../../hooks/useStats';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, DollarSign, ShoppingCart, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import logo from '../../assets/images/Logo-Softpan.png';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    dashboard, 
    ventasHoy, 
    ventasSemana,
    ventasMes, 
    topProductos, 
    clientesDeuda, 
    comparativaMensual,
    comparativaSemanal,
    ventasPorDia,
    ventasPorTipoCliente,
    metodosPago,
    productosSinMovimiento,
    isLoading 
  } = useStats();

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-12rem)] flex flex-col pb-24">
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base lg:text-lg">
              Resumen de tu negocio
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-900">Ventas Hoy</h3>
                    <DollarSign className="text-orange-600" size={20} />
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 break-words">
                    {formatCurrency(ventasHoy?.totalVentas || 0)}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-black mt-1">
                    {ventasHoy?.cantidadTransacciones || 0} transacciones
                  </p>
                </div>

                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-900">Ventas del Mes</h3>
                    <ShoppingCart className="text-blue-600" size={20} />
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 break-words">
                    {formatCurrency(ventasMes?.totalVentas || 0)}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-black mt-1">
                    Promedio: {formatCurrency(ventasMes?.ticketPromedio || 0)}
                  </p>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-900">Cobrado</h3>
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600 break-words">
                    {formatCurrency(ventasMes?.totalCobrado || 0)}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-black mt-1">
                    {ventasMes?.cantidadTransacciones || 0} ventas
                  </p>
                </div>

                <div className="card bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-900">Deudas</h3>
                    <AlertCircle className="text-red-600" size={20} />
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600 break-words">
                    {formatCurrency(dashboard?.deudas.totalDeudas || 0)}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-black mt-1">
                    {dashboard?.deudas.cantidadClientesConDeuda || 0} clientes
                  </p>
                </div>
              </div>

              {/* Comparativas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-blue-600" size={18} />
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Comparativa Semanal</h3>
                  </div>
                  {comparativaSemanal ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">Semana Actual</span>
                        <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white break-words">
                          {formatCurrency(comparativaSemanal.ventasPeriodoActual || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">Semana Anterior</span>
                        <span className="text-base md:text-lg lg:text-xl font-semibold text-gray-600 dark:text-gray-300 break-words">
                          {formatCurrency(comparativaSemanal.ventasPeriodoAnterior || 0)}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm md:text-base text-gray-700 dark:text-white font-medium">Crecimiento</span>
                          <div className={`flex items-center gap-1 ${(comparativaSemanal.porcentajeCrecimiento || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(comparativaSemanal.porcentajeCrecimiento || 0) >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                            <span className="text-lg md:text-xl font-bold">{Math.abs(comparativaSemanal.porcentajeCrecimiento || 0).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No hay datos disponibles</p>
                  )}
                </div>

                <div className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-purple-600" size={18} />
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Comparativa Mensual</h3>
                  </div>
                  {comparativaMensual ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">Mes Actual</span>
                        <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white break-words">
                          {formatCurrency(comparativaMensual.ventasPeriodoActual || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">Mes Anterior</span>
                        <span className="text-base md:text-lg lg:text-xl font-semibold text-gray-600 dark:text-gray-300 break-words">
                          {formatCurrency(comparativaMensual.ventasPeriodoAnterior || 0)}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm md:text-base text-gray-700 dark:text-white font-medium">Crecimiento</span>
                          <div className={`flex items-center gap-1 ${(comparativaMensual.porcentajeCrecimiento || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(comparativaMensual.porcentajeCrecimiento || 0) >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                            <span className="text-lg md:text-xl font-bold">{Math.abs(comparativaMensual.porcentajeCrecimiento || 0).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
                  )}
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Productos */}
                <div className="card">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Top Productos</h3>
                  {topProductos && topProductos.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProductos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombreProducto" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="totalVendido" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-12">No hay datos disponibles</p>
                  )}
                </div>

                {/* Clientes con Mayor Deuda */}
                <div className="card">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Clientes con Mayor Deuda</h3>
                  {clientesDeuda && clientesDeuda.length > 0 ? (
                    <div className="space-y-3">
                      {clientesDeuda.map((cliente, index) => (
                        <Link
                          key={cliente.clienteId}
                          to={`/clientes/${cliente.clienteId}/editar`}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">{cliente.nombreCliente}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{cliente.cantidadVentasPendientes} ventas</p>
                            </div>
                          </div>
                          <p className="font-bold text-red-600 text-sm md:text-base whitespace-nowrap ml-2">{formatCurrency(cliente.montoDeuda)}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-12">No hay deudas registradas</p>
                  )}
                </div>
              </div>

              {/* Ventas por Día de la Semana */}
              <div className="card">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Ventas por Día de la Semana (Últimos 30 días)</h3>
                {ventasPorDia && ventasPorDia.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ventasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="diaSemana" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line type="monotone" dataKey="totalVentas" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No hay datos disponibles</p>
                )}
              </div>

              {/* Resumen Semana */}
              <div className="card">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Resumen de la Semana</h3>
                {ventasSemana ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-1">Total Ventas</p>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 break-words">{formatCurrency(ventasSemana.totalVentas || 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-1">Transacciones</p>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{ventasSemana.cantidadTransacciones || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-1">Ticket Promedio</p>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-purple-600 break-words">{formatCurrency(ventasSemana.ticketPromedio || 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-1">Total Cobrado</p>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-600 break-words">{formatCurrency(ventasSemana.totalCobrado || 0)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
                )}
              </div>

              {/* Ventas por Tipo Cliente y Métodos de Pago */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Ventas por Tipo de Cliente</h3>
                  {ventasPorTipoCliente && ventasPorTipoCliente.length > 0 ? (
                    <div className="space-y-3">
                      {ventasPorTipoCliente.map((tipo: any) => (
                        <div key={tipo.tipoCliente} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">{tipo.tipoClienteNombre}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{tipo.cantidadTransacciones} transacciones</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(tipo.totalVentas)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{tipo.porcentaje.toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No hay datos disponibles</p>
                  )}
                </div>

                <div className="card">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Métodos de Pago</h3>
                  {metodosPago && metodosPago.length > 0 ? (
                    <div className="space-y-3">
                      {metodosPago.map((metodo: any) => (
                        <div key={metodo.tipoPago} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">{metodo.tipoPagoNombre}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{metodo.cantidadPagos} pagos</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{formatCurrency(metodo.totalCobrado)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{metodo.porcentaje.toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No hay datos disponibles</p>
                  )}
                </div>
              </div>

              {/* Productos sin Movimiento */}
              {productosSinMovimiento && productosSinMovimiento.length > 0 && (
                <div className="card">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Productos sin Movimiento (30 días)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {productosSinMovimiento.slice(0, 6).map((producto: any) => (
                      <div key={producto.productoId} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{producto.nombreProducto}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {producto.diasSinVenta} días sin venta
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="mt-auto pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Softpan" className="h-8 w-auto" />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold">© {new Date().getFullYear()} Softpan</p>
                <p>Todos los derechos reservados</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Versión 1.0.0</p>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}
