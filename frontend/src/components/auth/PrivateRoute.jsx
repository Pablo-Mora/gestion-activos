import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../utils/authUtils';

/**
 * Componente de ruta privada que verifica si el usuario está autenticado
 * y tiene el rol necesario para acceder a la ruta.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.allowedRoles - Roles permitidos para acceder a la ruta
 * @returns {JSX.Element} - Componente de ruta privada
 */
const PrivateRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();
  
  // Si no está autenticado, redirigir a login
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si hay roles permitidos y el usuario no tiene uno de ellos, redirigir a una página de acceso denegado
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/acceso-denegado" replace />;
  }
  
  // Si está autenticado y tiene el rol adecuado, mostrar el contenido de la ruta
  return <Outlet />;
};

export default PrivateRoute;