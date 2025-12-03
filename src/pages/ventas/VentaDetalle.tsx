import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ventaService } from '../../services/ventaService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import type { Venta } from '../../types';
import { MdCheckCircle, MdPending, MdAttachMoney } from 'react-icons/md';

export default function VentaDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venta, setVenta] = useState<Venta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ventaService.getById(Number(id))
        .then(setVenta)
        .catch(() => navigate(ROUTES.VENTAS))
        .finally(() => setIsLoading(false));
    }
  }, [id, navigate]);

  const getEstadoBadge = (estado: number, estadoNombre: string) => {
    const badges = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
    };
    
    const icons = {
      0: <MdPending />,
      1: <MdAttachMoney />,
      2: <MdCheckCircle />,
    };

    return (
      <span className={`px-4 py-2 inline-flex items-center gap-2 text-sm font-bold rounded-xl ${badges[estado as keyof typeof badges]}`}>
        {icons[estado as keyof typeof icons]}
        {estadoNombre}
      </span>
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  if (!venta) return null;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(ROUTES.VENTAS)}
            className="text-gray-600 hover:text-gray-900 font-medium mb-4 flex items-center gap-2 transition-colors"
          >
            <span className="material-icons text-xl">arrow_back</span>
            Volver a ventas
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Venta #{venta.id}
              </h1>
              <p className="text-gray-600">
                {formatDateTime(venta.fechaCreacion)}
              </p>
            </div>
            {getEstadoBadge(venta.estado, venta.estadoNombre)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Cliente</h3>
            <p className="text-xl font-bold text-gray-900">{venta.clienteNombre}</p>
          </div>
          
          <div className="card">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Total</h3>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(venta.montoTotal)}</p>
          </div>
          
          <div className="card">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Saldo Pendiente</h3>
            <p className={`text-xl font-bold ${venta.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(venta.saldoPendiente)}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detalle de Productos</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Precio Unitario
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venta.detalles.map((detalle) => (
                  <tr key={detalle.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {detalle.productoNombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {detalle.cantidad}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatCurrency(detalle.precioUnitario)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(detalle.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    Total:
                  </td>
                  <td className="px-6 py-4 text-right text-lg font-bold text-green-600">
                    {formatCurrency(venta.montoTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="card bg-green-50 border-2 border-green-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Monto Pagado</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(venta.montoPagado)}
            </p>
          </div>
          
          <div className="card bg-red-50 border-2 border-red-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Saldo Pendiente</h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(venta.saldoPendiente)}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
