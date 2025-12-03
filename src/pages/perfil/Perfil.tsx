import { useState } from 'react';
import { useAuth } from '../../store/authContext';
import AppLayout from '../../components/layout/AppLayout';
import { MdPerson, MdEmail, MdSave } from 'react-icons/md';
import Swal from 'sweetalert2';

export default function Perfil() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implementar actualización de perfil cuando el backend tenga el endpoint
    await Swal.fire({
      title: 'Funcionalidad pendiente',
      text: 'La actualización de perfil estará disponible próximamente',
      icon: 'info',
      confirmButtonColor: '#f97316'
    });
    
    setIsEditing(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <MdPerson className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Editar
              </button>
            )}
          </div>

          {user?.roles && user.roles.length > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Roles</p>
              <div className="flex gap-2">
                {user.roles.map(role => (
                  <span key={role} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre
              </label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  className="input-field pl-10"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido
              </label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  className="input-field pl-10"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  className="input-field pl-10 bg-gray-50"
                  value={formData.email}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <MdSave />
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.email || '',
                    });
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
