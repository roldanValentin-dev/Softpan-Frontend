import { VALIDACIONES } from './constants';

// Funciones de validación para formularios

export const validateEmail = (email: string): string | null => {
  if (!email) return 'El email es requerido';
  if (!VALIDACIONES.EMAIL_REGEX.test(email)) return 'Email inválido';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < VALIDACIONES.MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${VALIDACIONES.MIN_PASSWORD_LENGTH} caracteres`;
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'El teléfono es requerido';
  if (!VALIDACIONES.TELEFONO_REGEX.test(phone)) return 'Teléfono inválido';
  return null;
};

export const validateNumber = (value: string | number, fieldName: string): string | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return `${fieldName} debe ser un número válido`;
  if (num < 0) return `${fieldName} debe ser mayor a 0`;
  return null;
};

export const validatePositiveNumber = (value: string | number, fieldName: string): string | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return `${fieldName} debe ser un número válido`;
  if (num <= 0) return `${fieldName} debe ser mayor a 0`;
  return null;
};