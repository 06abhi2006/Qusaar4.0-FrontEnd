import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import apiClient from '../lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
    const token = sessionStorage.getItem('auth_token');
    const userData = sessionStorage.getItem('user_data');

    if (token && userData) {
      try {
          // Validate token format (basic check)
          // If token exists but is malformed, clear it
          const parsedUser = JSON.parse(userData);
          
          // Basic validation
          if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
            setUser(parsedUser);
          } else {
            // Invalid user data, clear it
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user_data');
          }
        } catch (error) {
          // Invalid JSON or other error, clear storage
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_data');
      }
    }
    setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      // CRITICAL: Save token and user data synchronously BEFORE any state updates
      // This ensures token is available immediately for subsequent requests
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('user_data', JSON.stringify(userData));
      
      // Update user state after token is saved
      setUser(userData);
      
      // Return user data for immediate use
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
