import { useQuery } from '@tanstack/react-query';
import { statsService } from '../services/statsService';

export function useStats() {
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: () => statsService.getDashboard(),
    retry: false,
  });

  const { data: ventasHoy, isLoading: isVentasHoyLoading } = useQuery({
    queryKey: ['stats', 'ventas', 'hoy'],
    queryFn: () => statsService.getVentasHoy(),
    retry: false,
  });

  const { data: ventasSemana, isLoading: isVentasSemanaLoading } = useQuery({
    queryKey: ['stats', 'ventas', 'semana'],
    queryFn: () => statsService.getVentasSemana(),
    retry: false,
  });

  const { data: ventasMes, isLoading: isVentasMesLoading } = useQuery({
    queryKey: ['stats', 'ventas', 'mes'],
    queryFn: () => statsService.getVentasMes(),
    retry: false,
  });

  const { data: topProductos, isLoading: isTopProductosLoading } = useQuery({
    queryKey: ['stats', 'productos', 'top'],
    queryFn: () => statsService.getTopProductos(5),
    retry: false,
  });

  const { data: clientesDeuda, isLoading: isClientesDeudaLoading } = useQuery({
    queryKey: ['stats', 'deudas', 'clientes'],
    queryFn: () => statsService.getClientesConMayorDeuda(5),
    retry: false,
  });

  const { data: resumenDeudas, isLoading: isResumenDeudasLoading } = useQuery({
    queryKey: ['stats', 'deudas', 'resumen'],
    queryFn: () => statsService.getResumenDeudas(),
    retry: false,
  });

  const { data: comparativaMensual, isLoading: isComparativaMensualLoading } = useQuery({
    queryKey: ['stats', 'comparativa', 'mensual'],
    queryFn: () => statsService.getComparativaMensual(),
    retry: false,
  });

  const { data: comparativaSemanal, isLoading: isComparativaSemanalLoading } = useQuery({
    queryKey: ['stats', 'comparativa', 'semanal'],
    queryFn: () => statsService.getComparativaSemanal(),
    retry: false,
  });

  const { data: ventasPorDia, isLoading: isVentasPorDiaLoading } = useQuery({
    queryKey: ['stats', 'ventas', 'por-dia'],
    queryFn: () => statsService.getVentasPorDiaSemana(),
    retry: false,
  });

  const { data: ventasPorTipoCliente, isLoading: isVentasTipoLoading } = useQuery({
    queryKey: ['stats', 'ventas', 'tipo-cliente'],
    queryFn: () => statsService.getVentasPorTipoCliente(),
    retry: false,
  });

  const { data: metodosPago, isLoading: isMetodosPagoLoading } = useQuery({
    queryKey: ['stats', 'pagos', 'metodos'],
    queryFn: () => statsService.getMetodosPago(),
    retry: false,
  });

  const { data: productosSinMovimiento, isLoading: isProductosSinMovLoading } = useQuery({
    queryKey: ['stats', 'productos', 'sin-movimiento'],
    queryFn: () => statsService.getProductosSinMovimiento(30),
    retry: false,
  });

  return {
    dashboard,
    ventasHoy,
    ventasSemana,
    ventasMes,
    topProductos,
    clientesDeuda,
    resumenDeudas,
    comparativaMensual,
    comparativaSemanal,
    ventasPorDia,
    ventasPorTipoCliente,
    metodosPago,
    productosSinMovimiento,
    isLoading: isDashboardLoading || isVentasHoyLoading || isVentasSemanaLoading || 
               isVentasMesLoading || isTopProductosLoading || isClientesDeudaLoading || 
               isResumenDeudasLoading || isComparativaMensualLoading || isComparativaSemanalLoading ||
               isVentasPorDiaLoading || isVentasTipoLoading || isMetodosPagoLoading || isProductosSinMovLoading,
  };
}
