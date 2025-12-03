import { useParams, Link } from 'react-router-dom';
import { usePago } from '../../hooks/usePagos';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import { MdArrowBack, MdPayment, MdPerson, MdAttachMoney, MdReceipt } from 'react-icons/md';

export default function PagoDetalle() {
  const { id } = useParams<{ id: string }>();
  const { pago, isLoading } = usePago(Number(id));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  if (!pago) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Pago no encontrado</p>
          <Link to={ROUTES.PAGOS} className="text-green-600 hover:text-green-700 mt-4 inline-block">
            Volver a Pagos
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.PAGOS}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdArrowBack className="text-2xl text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalle de Pago #{pago.id}</h1>
            <p className="text-gray-600">Información completa del pago</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MdPayment className="text-green-600" />
              Información del Pago
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MdPerson className="text-gray-400 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="text-lg font-semibold text-gray-900">{pago.clienteNombre}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdAttachMoney className="text-gray-400 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Monto Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(pago.monto)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdPayment className="text-gray-400 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Tipo de Pago</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${
                    pago.tipoPago === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {pago.tipoPagoNombre}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdReceipt className="text-gray-400 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Pago</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDateTime(pago.fechaPago)}</p>
                </div>
              </div>

              {pago.observaciones && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Observaciones</p>
                  <p className="text-gray-900">{pago.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aplicación del Pago</h2>
            {!pago.pagosAplicados || pago.pagosAplicados.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MdReceipt className="text-5xl mx-auto mb-3" />
                <p>No hay información de aplicación</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pago.pagosAplicados.map((aplicado) => (
                  <div
                    key={aplicado.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm text-gray-600">Venta</p>
                      <Link
                        to={`/ventas/${aplicado.ventaId}`}
                        className="text-lg font-semibold text-green-600 hover:text-green-700"
                      >
                        #{aplicado.ventaId}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Monto Aplicado</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(aplicado.montoAplicado)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900">Total Aplicado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      pago.pagosAplicados.reduce((sum, p) => sum + p.montoAplicado, 0)
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
