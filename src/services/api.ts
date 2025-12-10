import axios, { type AxiosResponse } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type { ApiError } from '../types';

// Cliente HTTP base
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 segundos para Render (primera petición puede tardar)
});

// Interceptor para agregar token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('Response:', error.response);
    console.error('Request URL:', error.config?.url);
    console.error('Base URL:', error.config?.baseURL);
    
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Error desconocido',
      status: error.response?.status,
    };

    // Si es error 401, limpiar token y redirigir a login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

// Funciones helper para requests comunes
export const api = {
  get: <T>(url: string) => apiClient.get<T>(url),
  post: <T>(url: string, data?: any) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: any) => apiClient.put<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
};