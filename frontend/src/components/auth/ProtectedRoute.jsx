import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white text-lg">Verificando acceso...</p>
    </div>
  </div>
);

// Componente para mostrar acceso denegado
const AccessDenied = ({ userRole, requiredRole }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
      <p className="text-gray-300 mb-6">
        No tienes permisos para acceder a esta página.
        <br />
        <span className="text-sm">
          Tu rol: <span className="font-semibold">{userRole}</span>
          {requiredRole && (
            <>
              <br />
              Rol requerido: <span className="font-semibold">{requiredRole}</span>
            </>
          )}
        </span>
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Volver
      </button>
    </div>
  </div>
);

// Componente principal para proteger rutas
export const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  allowedRoles = null,
  redirectTo = null 
}) => {
  const { 
    user, 
    loading, 
    isAuthenticated, 
    userRole, 
    getDashboardRoute 
  } = useAuth();
  
  const location = useLocation();

  // Mostrar spinner mientras carga
  if (loading) {
    return <LoadingSpinner />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifica un rol específico requerido
  if (requiredRole && userRole !== requiredRole) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <AccessDenied userRole={userRole} requiredRole={requiredRole} />;
  }

  // Si se especifica una lista de roles permitidos
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <AccessDenied userRole={userRole} requiredRole={allowedRoles.join(' o ')} />;
  }

  // Si todo está bien, mostrar el contenido
  return children;
};

// Componente específico para rutas de admin
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="ADMIN" redirectTo="/user/dashboard">
    {children}
  </ProtectedRoute>
);

// Componente específico para rutas de usuario
export const UserRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['USER', 'EMPLOYEE']} redirectTo="/admin/dashboard">
    {children}
  </ProtectedRoute>
);

// Componente para redirigir al dashboard apropiado
export const DashboardRedirect = () => {
  const { getDashboardRoute, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  const dashboardRoute = getDashboardRoute();
  return <Navigate to={dashboardRoute} replace />;
};

// Hook personalizado para verificar permisos en componentes
export const usePermissions = () => {
  const { 
    isAuthenticated, 
    isAdmin, 
    isUser, 
    isEmployee, 
    hasRole, 
    canAccessRoute,
    userRole 
  } = useAuth();

  return {
    isAuthenticated,
    isAdmin,
    isUser,
    isEmployee,
    hasRole,
    canAccessRoute,
    userRole,
    
    // Funciones de utilidad adicionales
    canManageUsers: isAdmin,
    canManageAssets: isAdmin,
    canViewReports: isAdmin,
    canRequestAssets: isUser || isEmployee,
    canViewOwnAssets: isAuthenticated
  };
};

// Componente para mostrar contenido condicional según rol
export const RoleBasedComponent = ({ 
  adminContent, 
  userContent, 
  employeeContent, 
  fallbackContent 
}) => {
  const { userRole } = useAuth();

  switch (userRole) {
    case 'ADMIN':
      return adminContent || fallbackContent;
    case 'USER':
      return userContent || fallbackContent;
    case 'EMPLOYEE':
      return employeeContent || fallbackContent;
    default:
      return fallbackContent;
  }
};

// Ejemplo de uso en App.js o Router principal
export const AppRouterExample = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta de login - solo para no autenticados */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Ruta raíz - redirige según autenticación */}
        <Route 
          path="/" 
          element={<DashboardRedirect />} 
        />

        {/* Rutas de Admin */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="assets" element={<AssetManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Rutas de Usuario */}
        <Route path="/user/*" element={
          <UserRoute>
            <UserLayout />
          </UserRoute>
        }>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="my-assets" element={<MyAssets />} />
          <Route path="requests" element={<AssetRequests />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Rutas de Empleado */}
        <Route path="/employee/*" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="my-assets" element={<MyAssets />} />
          <Route path="requests" element={<AssetRequests />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Componente para rutas públicas (solo no autenticados)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, getDashboardRoute, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={getDashboardRoute()} replace />;
  }

  return children;
};