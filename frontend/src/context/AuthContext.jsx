import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout, getUserInfo } from '../api/auth';

// Creación del contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verificar si el token es válido obteniendo la información del usuario
          const userData = await getUserInfo();
          setUser(userData);
        } catch (error) {
          console.error('Error al verificar el token:', error);
          // Si hay error, limpiar el token
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función para iniciar sesión
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await login(credentials);
      
      // Guardar el token en localStorage
      localStorage.setItem('token', response.token);
      
      // Obtener información del usuario
      const userData = await getUserInfo();
      setUser(userData);
      
      // Redirigir según el rol
      if (userData.rol === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
      
      return true;
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError(err.message || 'Credenciales inválidas. Intente nuevamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Siempre limpiamos el token y el estado del usuario
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user;

  // Verificar si el usuario tiene rol de administrador
  const isAdmin = user?.rol === 'ADMIN';

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login: handleLogin,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;