import { useAuth } from '../../store/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import logo from '../../assets/images/Logo-Softpan.png';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link to={ROUTES.DASHBOARD} className="transform hover:scale-105 transition-transform duration-200">
                <img 
                  src={logo} 
                  alt="Softpan Logo" 
                  className="h-16 w-auto"
                />
              </Link>
              <div className="hidden md:flex space-x-2">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.PRODUCTOS}
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Productos
                </Link>
                <Link
                  to={ROUTES.CLIENTES}
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Clientes
                </Link>
                <Link
                  to={ROUTES.VENTAS}
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Ventas
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-2 rounded-xl">
                <span className="text-sm font-semibold text-gray-800">
                  {user?.nombre}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
