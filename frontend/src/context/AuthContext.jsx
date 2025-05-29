import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      console.log('🔍 Verificando token almacenado:', token ? 'Existe' : 'No existe');
      
      if (token) {
        try {
          // Verificar si el token es válido obteniendo la información del usuario
          const userData = await getUserInfo();
          console.log('✅ Token válido, usuario cargado:', userData);
          setUser(userData);
        } catch (error) {
          console.error('❌ Error al verificar el token:', error);
          // Si hay error, limpiar el token
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        console.log('ℹ️ No hay token almacenado');
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función para obtener las rutas según el rol (solo USER y ADMIN)
  const getRoutesForRole = (role) => {
    const routes = {
      'ADMIN': {
        dashboard: '/admin/dashboard',
        profile: '/admin/profile',
        users: '/admin/users',
        assets: '/admin/assets',
        reports: '/admin/reports'
      },
      'USER': {
        dashboard: '/user/dashboard',
        profile: '/user/profile',
        myAssets: '/user/my-assets',
        requests: '/user/requests'
      }
    };

    return routes[role] || routes['USER']; // Default a USER si el rol no existe
  };

  // Función para redirigir según el rol del usuario
  const redirectByRole = (userData) => {
    const role = userData.rol || userData.role; // Soporte para ambos nombres
    const routes = getRoutesForRole(role);
    
    console.log(`🔄 Redirigiendo usuario ${userData.username} (${role}) a:`, routes.dashboard);
    
    // Usar setTimeout para evitar problemas de estado
    setTimeout(() => {
      window.location.href = routes.dashboard;
    }, 100);
  };

  // Función para iniciar sesión
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Iniciando sesión para:', credentials.username);
      
      const response = await login(credentials);
      console.log('📡 Respuesta del servidor:', response);
      
      // Guardar el token en localStorage
      localStorage.setItem('token', response.token);
      console.log('💾 Token guardado en localStorage');
      
      // Obtener información del usuario
      const userData = await getUserInfo();
      console.log('👤 Información del usuario obtenida:', {
        username: userData.username,
        role: userData.rol || userData.role,
        id: userData.id
      });
      
      setUser(userData);
      
      // Redirigir según el rol
      redirectByRole(userData);
      
      return true;
    } catch (err) {
      console.error('❌ Error de inicio de sesión:', err);
      setError(err.message || 'Credenciales inválidas. Intente nuevamente.');
      
      // Limpiar cualquier token que pueda existir
      localStorage.removeItem('token');
      setUser(null);
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      console.log('👋 Cerrando sesión...');
      setLoading(true);
      
      // Intentar hacer logout en el servidor
      await logout();
      console.log('✅ Logout exitoso en servidor');
    } catch (error) {
      console.error('⚠️ Error al cerrar sesión en servidor:', error);
      // Continuamos con el logout local aunque falle el servidor
    } finally {
      // Siempre limpiamos el token y el estado del usuario
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
      setLoading(false);
      
      console.log('🧹 Datos locales limpiados');
      
      // Redirigir al login
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
  };

  // Funciones de utilidad para verificar roles y permisos (solo USER y ADMIN)
  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'ADMIN' || user?.role === 'ADMIN';
  const isUser = user?.rol === 'USER' || user?.role === 'USER';

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    const userRole = user?.rol || user?.role;
    return userRole === role;
  };

  // Función para verificar si el usuario puede acceder a una ruta
  const canAccessRoute = (route) => {
    if (!isAuthenticated) return false;
    
    const userRole = user?.rol || user?.role;
    const routes = getRoutesForRole(userRole);
    
    return Object.values(routes).includes(route);
  };

  // Función para obtener la ruta del dashboard según el rol
  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    const userRole = user?.rol || user?.role;
    const routes = getRoutesForRole(userRole);
    return routes.dashboard;
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Función para verificar permisos específicos
  const hasPermission = (permission) => {
    const userRole = user?.rol || user?.role;
    
    // Definir permisos por rol
    const permissions = {
      'ADMIN': [
        'manage_users',
        'manage_assets', 
        'view_reports',
        'system_configuration',
        'approve_requests',
        'view_all_assets'
      ],
      'USER': [
        'view_own_assets',
        'create_requests',
        'view_own_profile',
        'update_own_profile'
      ]
    };
    
    return permissions[userRole]?.includes(permission) || false;
  };

  // Valor del contexto
  const value = {
    // Estado
    user,
    loading,
    error,
    
    // Flags de autenticación y roles
    isAuthenticated,
    isAdmin,
    isUser,
    
    // Funciones principales
    login: handleLogin,
    logout: handleLogout,
    
    // Funciones de utilidad
    hasRole,
    hasPermission,
    canAccessRoute,
    getDashboardRoute,
    getRoutesForRole: () => getRoutesForRole(user?.rol || user?.role),
    clearError,
    
    // Información adicional del usuario
    userRole: user?.rol || user?.role,
    username: user?.username,
    userId: user?.id
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;