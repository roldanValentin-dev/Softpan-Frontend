import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVentas } from '../../hooks/useVentas';
import { useClientes } from '../../hooks/useClientes';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import type { DetalleVentaForm } from '../../types';
import Swal from 'sweetalert2';
import { MdShoppingCart, MdSearch } from 'react-icons/md';

export default function VentaForm() {
  const navigate = useNavigate();
  const { createVenta, isCreating } = useVentas();
  const { clientes } = useClientes();
  const { productos } = useProducts();

  const [clienteId, setClienteId] = useState<number>(0);
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const productosActivos = productos.filter(p => p.activo);
  const productosFiltrados = productosActivos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCantidadChange = (productoId: number, cantidad: string) => {
    const num = parseInt(cantidad) || 0;
    if (num >= 0) {
      setCantidades(prev => ({
        ...prev,
        [productoId]: num
      }));
    }
  };

  const detalles: DetalleVentaForm[] = Object.entries(cantidades)
    .filter(([_, cantidad]) => cantidad > 0)
    .map(([productoId, cantidad]) => {
      const producto = productos.find(p => p.id === Number(productoId));
      return {
        productoId: Number(productoId),
        cantidad,
        precioUnitario: producto?.precioUnitario || 0,
        subtotal: cantidad * (producto?.precioUnitario || 0),
      };
    });

  const montoTotal = detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteId) {
      Swal.fire({
        title: 'Error',
        text: 'Selecciona un cliente',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (detalles.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Agrega al menos un producto',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    try {
      await createVenta({ clienteId, detalles });
      await Swal.fire({
        title: 'Venta Creada',
        text: 'La venta ha sido registrada correctamente',
        icon: 'success',
        confirmButtonColor: '#f97316'
      });
      navigate(ROUTES.VENTAS);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo crear la venta',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(ROUTES.VENTAS)}
            className="text-gray-600 hover:text-gray-900 font-medium mb-4 flex items-center gap-2 transition-colors"
          >
            <span className="material-icons text-xl">arrow_back</span>
            Volver a ventas
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nueva Venta
          </h1>
          <p className="text-gray-600">
            Selecciona el cliente y las cantidades de productos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cliente</h2>
            <select
              className="input-field"
              value={clienteId}
              onChange={(e) => setClienteId(Number(e.target.value))}
              required
            >
              <option value={0}>Seleccionar cliente</option>
              {clientes.filter(c => c.activo).map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.telefono}
                </option>
              ))}
            </select>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <MdShoppingCart className="text-2xl" />
              Productos
            </h2>
            <div className="relative mb-4">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {productosFiltrados.map(producto => {
                const cantidad = cantidades[producto.id] || 0;
                const subtotal = cantidad * producto.precioUnitario;
                
                return (
                  <div 
                    key={producto.id} 
                    className={`border-2 rounded-xl p-4 transition-all ${
                      cantidad > 0 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{producto.nombre}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{producto.descripcion}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {formatCurrency(producto.precioUnitario)}
                      </span>
                      {cantidad > 0 && (
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(subtotal)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCantidadChange(producto.id, String(Math.max(0, cantidad - 1)))}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="input-field text-center font-bold flex-1"
                        value={cantidad || ''}
                        onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleCantidadChange(producto.id, String(cantidad + 1))}
                        className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xl transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {detalles.length > 0 && (
            <div className="card animate-fadeInUp">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>
              <div className="space-y-2">
                {detalles.map(detalle => {
                  const producto = productos.find(p => p.id === detalle.productoId);
                  return (
                    <div key={detalle.productoId} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-semibold text-gray-900">{producto?.nombre}</span>
                        <span className="text-gray-500 ml-2">x {detalle.cantidad}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(detalle.subtotal || 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 animate-fadeInUp">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-3xl font-bold text-green-600">
                {formatCurrency(montoTotal)}
              </span>
            </div>
            {detalles.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {detalles.length} producto{detalles.length !== 1 ? 's' : ''} seleccionado{detalles.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.VENTAS)}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || detalles.length === 0}
              className={`btn-primary flex-1 ${(isCreating || detalles.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                '✓ Registrar Venta'
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
