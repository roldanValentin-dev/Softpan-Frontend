import { useState, useEffect } from 'react';
import { useAuth } from '../../store/authContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import logo from '../../assets/images/Logo-Softpan.png';
import BottomNav from '../common/BottomNav';
import type { ReactNode } from 'react';
import { MdPerson, MdEdit, MdLogout, MdMenu, MdClose, MdDashboard, MdInventory, MdPeople, MdShoppingCart, MdPayment } from 'react-icons/md';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowMobileMenu(false);
      setIsClosing(false);
    }, 300);
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
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to={ROUTES.DASHBOARD} className="md:hidden transform hover:scale-105 transition-transform duration-200">
              <img 
                src={logo} 
                alt="Softpan Logo" 
                className="h-14 w-auto"
              />
            </Link>
            
            <Link to={ROUTES.DASHBOARD} className="hidden md:block transform hover:scale-105 transition-transform duration-200">
              <img 
                src={logo} 
                alt="Softpan Logo" 
                className="h-16 w-auto"
              />
            </Link>
            
            <div className="hidden md:flex space-x-2 absolute left-1/2 -translate-x-1/2">
              {menuItems.map(item => (
                <Link
                  key={item.route}
                  to={item.route}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(item.route)
                      ? 'nav-link-active'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <MdPerson className="text-orange-600" />
                <span className="text-sm font-semibold text-gray-800">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-16 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
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
                    {user?.roles && user.roles.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {user.roles.map(role => (
                          <span key={role} className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold">
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2">
                    <Link
                      to={ROUTES.PERFIL}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <MdEdit className="text-gray-600 text-xl" />
                      <span className="text-sm font-semibold text-gray-700">Editar Perfil</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <MdLogout className="text-red-600 text-xl" />
                      <span className="text-sm font-semibold text-red-600">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <MdPerson className="text-2xl text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8 page-transition">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
