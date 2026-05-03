// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // On mount — check if a valid JWT exists and fetch the user profile
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await authService.getMe();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch {
        // Token invalid — stay logged out
      } finally {
        setIsLoading(false);
      }
    };
    authService.onUnauthorized(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
    restoreSession();
  }, []);

  const register = async (name, email, password) => {
    try {
      const newUser = await authService.register(name, email, password);
      setUser(newUser);
      setIsAuthenticated(true);
      showSuccess('Account created! Welcome to Karigar.');
      return newUser;
    } catch (error) {
      showError(error.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      showSuccess('Successfully logged in');
      return loggedInUser;
    } catch (error) {
      showError(error.message || 'Invalid email or password');
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    showSuccess('Successfully logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
