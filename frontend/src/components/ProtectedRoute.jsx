// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If allowedRoles are specified, check if the user has at least one of them
    if (allowedRoles && user?.roles) {
        const hasRequiredRole = user.roles.some(role => allowedRoles.includes(role));
        if (!hasRequiredRole) {
            // Redirect to an unauthorized page or dashboard if role doesn't match
            // For simplicity, redirecting to dashboard. Could be a specific /unauthorized page.
            console.warn("User does not have the required role for this route.");
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />; // Render child component if authenticated and authorized
};

export default ProtectedRoute;
