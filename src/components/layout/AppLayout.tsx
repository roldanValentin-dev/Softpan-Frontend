import { useState, useEffect } from 'react';
import { useAuth } from '../../store/authContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import logo from '../../assets/images/Logo-Softpan.png';
import logoDark from '../../assets/images/Logo-SofrtpanDark.png';
import BottomNav from '../common/BottomNav';
import type { ReactNode } from 'react';
import { MdPerson, MdEdit, MdLogout, MdDashboard, MdInventory, MdPeople, MdShoppingCart, MdPayment, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../../store/themeContext';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isDark, toggle: toggleDarkMode } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (route: string) => {
    if (route === ROUTES.DASHBOARD) return location.pathname === route;
    return location.pathname.startsWith(route);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };


  const menuItems = [
    { label: 'Dashboard', route: ROUTES.DASHBOARD, icon: MdDashboard },
    { label: 'Productos', route: ROUTES.PRODUCTOS, icon: MdInventory },
    { label: 'Clientes', route: ROUTES.CLIENTES, icon: MdPeople },
    { label: 'Ventas', route: ROUTES.VENTAS, icon: MdShoppingCart },
    { label: 'Pagos', route: ROUTES.PAGOS, icon: MdPayment },
  ];

  return (
    <div className="min-h-screen">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-16 lg:w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 fixed h-screen z-50">
        <div className="p-3 lg:p-6 border-b border-gray-200 dark:border-gray-800">
          <Link to={ROUTES.DASHBOARD} className="flex items-center justify-center gap-3">
            <img src={isDark ? logoDark : logo} alt="Softpan Logo" className="h-8 lg:h-16 w-auto object-contain" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 lg:p-4">
          <div className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  className={`flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.route)
                      ? 'bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-semibold hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-2 lg:p-4 border-t border-gray-200 dark:border-gray-800 relative">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-xl transition-all duration-200 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 mb-2"
          >
            {isDark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            <span className="font-semibold hidden lg:block">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
          
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <MdPerson className="text-white text-xl" />
            </div>
            <div className="flex-1 text-left hidden lg:block">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Usuario'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full mb-2 left-2 lg:left-4 lg:right-4 w-56 lg:w-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
              <Link
                to={ROUTES.PERFIL}
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <MdEdit className="text-gray-600 dark:text-gray-400 text-xl" />
                <span className="text-sm font-semibold text-gray-700 dark:text-white">Editar Perfil</span>
              </Link>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <MdLogout className="text-red-600 dark:text-red-400 text-xl" />
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <nav className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 w-full">
        <div className="px-4 h-20 flex items-center justify-between">
          <Link to={ROUTES.DASHBOARD}>
            <img src={isDark ? logoDark : logo} alt="Softpan Logo" className="h-14 w-auto object-contain" />
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {isDark ? <MdLightMode className="text-2xl text-gray-700 dark:text-white" /> : <MdDarkMode className="text-2xl text-gray-700 dark:text-white" />}
            </button>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative"
            >
              <MdPerson className="text-2xl text-gray-700 dark:text-white" />
            </button>
          </div>

          {showUserMenu && (
            <div className="absolute right-4 top-20 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MdPerson className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                    </p>
                    <p className="text-sm text-orange-100">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Link
                  to={ROUTES.PERFIL}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <MdEdit className="text-gray-600 dark:text-gray-400 text-xl" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-white">Editar Perfil</span>
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
                >
                  <MdLogout className="text-red-600 dark:text-red-400 text-xl" />
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="md:ml-16 lg:ml-64 py-8 px-4 sm:px-6 lg:px-8 pb-8 page-transition">
        {children}
      </main>
      
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
