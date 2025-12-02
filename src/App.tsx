import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/authContext';
import { ROUTES } from './utils/constants';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ProductosList from './pages/productos/ProductosList';
import ProductoForm from './pages/productos/ProductoForm';
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
              path="/productos/:id/editar" 
              element={
                <PrivateRoute>
                  <ProductoForm />
                </PrivateRoute>
              } 
            />
            
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;