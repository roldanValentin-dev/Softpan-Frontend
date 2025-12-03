import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagos } from '../../hooks/usePagos';
import { useClientes } from '../../hooks/useClientes';
import { useVentas } from '../../hooks/useVentas';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import type { VentaAAplicar } from '../../services/pagoService';
import Swal from 'sweetalert2';
import { MdPayment, MdAttachMoney } from 'react-icons/md';

export default function PagoForm() {
  const navigate = useNavigate();
  const { createPago, isCreating } = usePagos();
  const { clientes } = useClientes();
  const { ventasPendientes } = useVentas();

  const [clienteId, setClienteId] = useState<number>(0);
  const [monto, setMonto] = useState<number>(0);
  const [tipoPago, setTipoPago] = useState<number>(1);
  const [observaciones, setObservaciones] = useState<string>('');
  const [montosAplicados, setMontosAplicados] = useState<Record<number, number>>({});

  const ventasCliente = ventasPendientes.filter(v => v.clienteId === clienteId);
  const totalDeuda = ventasCliente.reduce((sum, v) => sum + v.saldoPendiente, 0);
  const totalAplicado = Object.values(montosAplicados).reduce((sum, m) => sum + m, 0);
  const montoRestante = monto - totalAplicado;

  useEffect(() => {
    if (clienteId) {
      setMontosAplicados({});
    }
  }, [clienteId]);

  const handleMontoAplicadoChange = (ventaId: number, valor: string) => {
    const num = parseFloat(valor) || 0;
    const venta = ventasCliente.find(v => v.id === ventaId);
    
    if (num >= 0 && venta && num <= venta.saldoPendiente) {
      setMontosAplicados(prev => ({
        ...prev,
        [ventaId]: num
      }));
    }
  };

  const distribuirAutomaticamente = () => {
    let montoDisponible = monto;
    const nuevosMontos: Record<number, number> = {};

    for (const venta of ventasCliente) {
      if (montoDisponible <= 0) break;
      
      const montoAAplicar = Math.min(montoDisponible, venta.saldoPendiente);
      nuevosMontos[venta.id] = montoAAplicar;
      montoDisponible -= montoAAplicar;
    }

    setMontosAplicados(nuevosMontos);
  };

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

    if (monto <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'El monto debe ser mayor a 0',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (monto > totalDeuda) {
      const result = await Swal.fire({
        title: 'Monto excede la deuda',
        text: `El monto (${formatCurrency(monto)}) es mayor a la deuda total (${formatCurrency(totalDeuda)}). ¿Deseas continuar de todas formas?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      });
      
      if (!result.isConfirmed) return;
    }

    if (totalAplicado === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debes aplicar el pago a al menos una venta',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (totalAplicado > monto) {
      Swal.fire({
        title: 'Error',
        text: 'El total aplicado no puede ser mayor al monto del pago',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    const ventasAAplicar: VentaAAplicar[] = Object.entries(montosAplicados)
      .filter(([_, monto]) => monto > 0)
      .map(([ventaId, montoAplicado]) => ({
        ventaId: Number(ventaId),
        montoAplicado
      }));

    try {
      await createPago({
        clienteId,
        monto,
        tipoPago,
        observaciones,
        ventasAAplicar
      });
      
      await Swal.fire({
        title: 'Pago Registrado',
        text: 'El pago ha sido registrado correctamente',
        icon: 'success',
        confirmButtonColor: '#f97316'
      });
      
      navigate(ROUTES.VENTAS);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo registrar el pago',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MdPayment className="text-4xl text-green-600" />
            Registrar Pago
          </h1>
          <p className="text-gray-600">
            Registra un pago y aplícalo a las ventas pendientes del cliente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Pago</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Cliente
                </label>
                <select
                  className="input-field"
                  value={clienteId}
                  onChange={(e) => setClienteId(Number(e.target.value))}
                  required
                >
                  <option value={0}>Seleccionar cliente</option>
                  {clientes.filter(c => c.activo).map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Monto del Pago
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field pl-8"
                    placeholder="0.00"
                    value={monto || ''}
                    onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select
                  className="input-field"
                  value={tipoPago}
                  onChange={(e) => setTipoPago(Number(e.target.value))}
                  required
                >
                  <option value={1}>Efectivo</option>
                  <option value={2}>Transferencia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Observaciones
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Opcional"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
          </div>

          {clienteId > 0 && (
            <div className="animate-fadeInUp">
              {ventasCliente.length === 0 ? (
                <div className="card bg-blue-50 border-2 border-blue-200">
                  <p className="text-center text-blue-800 font-semibold">
                    Este cliente no tiene ventas pendientes
                  </p>
                </div>
              ) : (
                <>
                  <div className="card">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        Aplicar Pago a Ventas
                      </h2>
                      {monto > 0 && (
                        <button
                          type="button"
                          onClick={distribuirAutomaticamente}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          Distribuir Automáticamente
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {ventasCliente.map(venta => {
                        const montoAplicado = montosAplicados[venta.id] || 0;
                        return (
                          <div key={venta.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-gray-900">Venta #{venta.id}</span>
                                  <span className="text-xs text-gray-500">
                                    {formatDateTime(venta.fechaCreacion)}
                                  </span>
                                </div>
                                <div className="flex gap-4 text-sm">
                                  <span className="text-gray-600">
                                    Total: <span className="font-semibold">{formatCurrency(venta.montoTotal)}</span>
                                  </span>
                                  <span className="text-red-600">
                                    Saldo: <span className="font-bold">{formatCurrency(venta.saldoPendiente)}</span>
                                  </span>
                                </div>
                              </div>
                              
                              <div className="w-full md:w-48">
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                  Monto a Aplicar
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max={venta.saldoPendiente}
                                    className="input-field pl-7 text-sm"
                                    placeholder="0.00"
                                    value={montoAplicado || ''}
                                    onChange={(e) => handleMontoAplicadoChange(venta.id, e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card bg-blue-50 border-2 border-blue-200">
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Deuda Total</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(totalDeuda)}
                      </p>
                    </div>

                    <div className="card bg-green-50 border-2 border-green-200">
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Total Aplicado</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalAplicado)}
                      </p>
                    </div>

                    <div className="card bg-orange-50 border-2 border-orange-200">
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Restante</h3>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(montoRestante)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

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
              disabled={isCreating || totalAplicado === 0}
              className={`btn-primary flex-1 ${(isCreating || totalAplicado === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                '✓ Registrar Pago'
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
