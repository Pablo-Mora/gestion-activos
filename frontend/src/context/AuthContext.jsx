// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Optional: Add logic here to verify token validity on app load if needed
        // For instance, make a request to a /verifyToken endpoint or check expiration
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        } else {
            // If no user, ensure they are on a public page or redirect to login
            // This logic might be better handled by ProtectedRoute
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await AuthService.login(username, password);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
            }
            return response;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        navigate('/login'); // Navigate to login on logout
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        // isAdmin: user?.roles?.includes('ROLE_ADMIN') // Example role check
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
