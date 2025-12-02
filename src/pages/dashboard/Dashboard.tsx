import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../store/authContext';
import { ROUTES } from '../../utils/constants';

export default function Dashboard() {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Productos',
      description: 'Gestiona tu catálogo de productos',
      icon: 'inventory_2',
      route: ROUTES.PRODUCTOS,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Clientes',
      description: 'Administra tus clientes',
      icon: 'people',
      route: ROUTES.CLIENTES,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Ventas',
      description: 'Registra y consulta ventas',
      icon: 'point_of_sale',
      route: ROUTES.VENTAS,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="text-gray-600 text-lg">
            Selecciona una opción para comenzar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              className="group card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <span className="material-icons text-white text-5xl">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
                <div className={`flex items-center gap-2 ${item.textColor} font-semibold group-hover:gap-3 transition-all duration-300`}>
                  <span>Ir a {item.title}</span>
                  <span className="material-icons text-xl">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-white text-3xl">person</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-3">Información de Usuario</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">email</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">badge</span>
                  <span>{user?.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">admin_panel_settings</span>
                  <span>{user?.roles.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
