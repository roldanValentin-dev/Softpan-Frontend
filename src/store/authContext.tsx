import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay usuario guardado al cargar la app
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = authService.getStoredToken();
    
    if (storedUser && token) {
      // Migrar datos antiguos si es necesario
      if ('nombre' in storedUser && !('firstName' in storedUser)) {
        const oldUser = storedUser as any;
        const [firstName = '', lastName = ''] = oldUser.nombre?.split(' ') || ['', ''];
        const migratedUser: AuthResponse = {
          token: oldUser.token,
          email: oldUser.email,
          firstName,
          lastName,
          roles: oldUser.roles
        };
        authService.storeAuthData(migratedUser);
        setUser(migratedUser);
      } else {
        setUser(storedUser);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const authData = await authService.login(credentials);
      authService.storeAuthData(authData);
      setUser(authData);
    } catch (error) {
      throw error; // Re-lanzar para que el componente maneje el error
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const authData = await authService.register(userData);
      authService.storeAuthData(authData);
      setUser(authData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
  } satisfies AuthContextType;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}