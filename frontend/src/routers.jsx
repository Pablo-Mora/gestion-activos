import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/AuthLayout';
import AuthLayout from './components/layout/UserLayout';

// Auth Pages
import Login from './components/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import EmpleadosPage from './pages/admin/EmpleadosPage';
import ActivosPage from './pages/admin/ActivosPage';
// Falta creacion de esta page= import ActasAdminPage from './pages/admin/ActasPage';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import MisActivos from './pages/user/MisActivos';
// Falta creacion de esta page= import MisActas from './pages/user/MisActas';

// Common Pages
// Falta creacion de esta page= import NotFound from './pages/NotFound';

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<Login />} />
      </Route>
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="usuarios" element={<UserManagement />} />
        <Route path="empleados" element={<EmpleadosPage />} />
        <Route path="activos" element={<ActivosPage />} />
        <Route path="actas" element={<ActasAdminPage />} />
      </Route>
      
      {/* User Routes */}
      <Route 
        path="/user" 
        element={
          <PrivateRoute requiredRole="USER">
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="mis-activos" element={<MisActivos />} />
        <Route path="mis-actas" element={<MisActas />} />
      </Route>
      
      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;