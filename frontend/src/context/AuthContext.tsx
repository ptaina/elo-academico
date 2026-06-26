import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/User';
import { api, STORAGE_KEY_TOKEN } from '../services/Api';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  login:  (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = user !== null;
  const isAdmin         = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const isSuperAdmin    = user?.role === 'SUPERADMIN';

  useEffect(() => {
    const restore = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (!storedToken) { setIsLoading(false); return; }
      try {
        const freshUser = await api.get<User>('/users/me');
        setUser(freshUser);
      } catch {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void restore();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const { token, user: loggedUser } = await api.post<{ token: string; user: User; message: string }>(
      '/users/login',
      { email, password }
    );
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    setUser(loggedUser);
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isSuperAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
