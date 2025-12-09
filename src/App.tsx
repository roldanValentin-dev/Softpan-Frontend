import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/authContext';
import { ThemeProvider } from './store/themeContext';
import { ROUTES } from './utils/constants';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ProductosList from './pages/productos/ProductosList';
import ProductoForm from './pages/productos/ProductoForm';
import ClientesList from './pages/clientes/ClientesList';
import ClienteForm from './pages/clientes/ClienteForm';
import VentasList from './pages/ventas/VentasList';
import VentaForm from './pages/ventas/VentaForm';
import VentaDetalle from './pages/ventas/VentaDetalle';
import PagoForm from './pages/pagos/PagoForm';
import PagosList from './pages/pagos/PagosList';
import PagoDetalle from './pages/pagos/PagoDetalle';
import Perfil from './pages/perfil/Perfil';
import PrivateRoute from './components/layout/PrivateRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            
            {/* Rutas privadas */}
            <Route 
              path={ROUTES.DASHBOARD} 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PRODUCTOS} 
              element={
                <PrivateRoute>
                  <ProductosList />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PRODUCTOS_NUEVO} 
              element={
                <PrivateRoute>
                  <ProductoForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PRODUCTOS_EDITAR} 
              element={
                <PrivateRoute>
                  <ProductoForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.CLIENTES} 
              element={
                <PrivateRoute>
                  <ClientesList />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.CLIENTES_NUEVO} 
              element={
                <PrivateRoute>
                  <ClienteForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.CLIENTES_EDITAR} 
              element={
                <PrivateRoute>
                  <ClienteForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.VENTAS} 
              element={
                <PrivateRoute>
                  <VentasList />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.VENTAS_NUEVA} 
              element={
                <PrivateRoute>
                  <VentaForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.VENTAS_DETALLE} 
              element={
                <PrivateRoute>
                  <VentaDetalle />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PAGOS} 
              element={
                <PrivateRoute>
                  <PagosList />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PAGOS_NUEVO} 
              element={
                <PrivateRoute>
                  <PagoForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PAGOS_DETALLE} 
              element={
                <PrivateRoute>
                  <PagoDetalle />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PERFIL} 
              element={
                <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              } 
            />
            
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;