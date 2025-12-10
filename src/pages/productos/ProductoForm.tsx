import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import { validateRequired, validatePositiveNumber } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import AppLayout from '../../components/layout/AppLayout';
import type { ProductoForm as ProductoFormType, Producto } from '../../types';
import Swal from 'sweetalert2';

interface FormErrors {
  nombre?: string;
  descripcion?: string;
  precioUnitario?: string;
}

export default function ProductoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { createProducto, updateProducto, isCreating, isUpdating } = useProducts();

  const [formData, setFormData] = useState<ProductoFormType>({
    nombre: '',
    descripcion: '',
    precioUnitario: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      productService.getById(Number(id))
        .then((producto) => {
          setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precioUnitario: producto.precioUnitario,
          });
        })
        .catch(() => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el producto',
            icon: 'error',
            confirmButtonColor: '#f97316'
          });
          navigate(ROUTES.PRODUCTOS);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'precioUnitario') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
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

    const descripcionError = validateRequired(formData.descripcion, 'Descripción');
    if (descripcionError) newErrors.descripcion = descripcionError;

    const precioError = validatePositiveNumber(formData.precioUnitario, 'Precio');
    if (precioError) newErrors.precioUnitario = precioError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditing && id) {
        await updateProducto({
          id: Number(id),
          producto: { ...formData, id: Number(id), activo: true } as Producto
        });
        await Swal.fire({
          title: 'Actualizado',
          text: 'El producto ha sido actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#f97316'
        });
      } else {
        await createProducto(formData);
        await Swal.fire({
          title: 'Creado',
          text: 'El producto ha sido creado correctamente',
          icon: 'success',
          confirmButtonColor: '#f97316'
        });
      }
      navigate(ROUTES.PRODUCTOS);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo guardar el producto',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto pb-24">
        <div className="mb-8">
          <button
            onClick={() => navigate(ROUTES.PRODUCTOS)}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a productos
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isEditing ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nombre del producto
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className={`input-field ${errors.nombre ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="Ej: Pan Francés"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.nombre}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              required
              className={`input-field resize-none ${errors.descripcion ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="Describe las características del producto..."
              value={formData.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.descripcion}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="precioUnitario" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Precio Unitario
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                id="precioUnitario"
                name="precioUnitario"
                type="number"
                step="0.01"
                min="0"
                required
                className={`input-field pl-8 ${errors.precioUnitario ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                placeholder="0.00"
                value={formData.precioUnitario || ''}
                onChange={handleChange}
              />
            </div>
            {errors.precioUnitario && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.precioUnitario}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.PRODUCTOS)}
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
                isEditing ? '✓ Actualizar Producto' : '+ Crear Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
