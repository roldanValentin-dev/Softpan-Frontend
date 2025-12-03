import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { MdDashboard, MdInventory, MdPeople, MdShoppingCart, MdPayment } from 'react-icons/md';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (route: string) => {
    if (route === ROUTES.DASHBOARD) return location.pathname === route;
    return location.pathname.startsWith(route);
  };

  const navItems = [
    { label: 'Inicio', route: ROUTES.DASHBOARD, icon: MdDashboard },
    { label: 'Productos', route: ROUTES.PRODUCTOS, icon: MdInventory },
    { label: 'Clientes', route: ROUTES.CLIENTES, icon: MdPeople },
    { label: 'Ventas', route: ROUTES.VENTAS, icon: MdShoppingCart },
    { label: 'Pagos', route: ROUTES.PAGOS, icon: MdPayment },
  ];

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.route);
          return (
            <Link
              key={item.route}
              to={item.route}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                active ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                active ? 'bg-orange-100' : ''
              }`}>
                <Icon className="text-2xl" />
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
