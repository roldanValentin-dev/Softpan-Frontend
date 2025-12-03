import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClientes } from '../../hooks/useClientes';
import { clienteService, type ClienteForm as ClienteFormType } from '../../services/clienteService';
import { validateRequired } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import Swal from 'sweetalert2';

interface FormErrors {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  tipoCliente?: string;
}

export default function ClienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { createCliente, updateCliente, isCreating, isUpdating } = useClientes();

  const [formData, setFormData] = useState<ClienteFormType>({
    nombre: '',
    telefono: '',
    direccion: '',
    tipoCliente: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      clienteService.getById(Number(id))
        .then((cliente) => {
          setFormData({
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            direccion: cliente.direccion,
            tipoCliente: cliente.tipoCliente,
          });
        })
        .catch(() => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el cliente',
            icon: 'error',
            confirmButtonColor: '#f97316'
          });
          navigate(ROUTES.CLIENTES);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'tipoCliente') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nombreError = validateRequired(formData.nombre, 'Nombre');
    if (nombreError) newErrors.nombre = nombreError;

    const telefonoError = validateRequired(formData.telefono, 'Teléfono');
    if (telefonoError) newErrors.telefono = telefonoError;

    const direccionError = validateRequired(formData.direccion, 'Dirección');
    if (direccionError) newErrors.direccion = direccionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditing && id) {
        await updateCliente({
          id: Number(id),
          cliente: formData
        });
        await Swal.fire({
          title: 'Actualizado',
          text: 'El cliente ha sido actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#f97316'
        });
      } else {
        await createCliente(formData);
        await Swal.fire({
          title: 'Creado',
          text: 'El cliente ha sido creado correctamente',
          icon: 'success',
          confirmButtonColor: '#f97316'
        });
      }
      navigate(ROUTES.CLIENTES);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo guardar el cliente',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(ROUTES.CLIENTES)}
            className="text-gray-600 hover:text-gray-900 font-medium mb-4 flex items-center gap-2 transition-colors"
          >
            <span className="material-icons text-xl">arrow_back</span>
            Volver a clientes
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Actualiza la información del cliente' : 'Completa los datos del nuevo cliente'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre del cliente
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className={`input-field ${errors.nombre ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="Ej: Panadería Central"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="material-icons text-sm">error</span>
                {errors.nombre}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              className={`input-field ${errors.telefono ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="Ej: 555-0001"
              value={formData.telefono}
              onChange={handleChange}
            />
            {errors.telefono && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="material-icons text-sm">error</span>
                {errors.telefono}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-bold text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              id="direccion"
              name="direccion"
              rows={3}
              required
              className={`input-field resize-none ${errors.direccion ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="Dirección completa del cliente..."
              value={formData.direccion}
              onChange={handleChange}
            />
            {errors.direccion && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="material-icons text-sm">error</span>
                {errors.direccion}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="tipoCliente" className="block text-sm font-bold text-gray-700 mb-2">
              Tipo de Cliente
            </label>
            <select
              id="tipoCliente"
              name="tipoCliente"
              required
              className="input-field"
              value={formData.tipoCliente}
              onChange={handleChange}
            >
              <option value={0}>Seleccionar tipo</option>
              <option value={1}>Comercio</option>
              <option value={2}>Revendedor</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.CLIENTES)}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className={`btn-primary flex-1 ${(isCreating || isUpdating) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCreating || isUpdating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                isEditing ? '✓ Actualizar Cliente' : '+ Crear Cliente'
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
