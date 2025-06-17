// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth/';

const login = (username, password) => {
    return axios.post(API_URL + 'login', {
        username,
        password,
    });
};

// Registration is admin-only on backend, so a frontend call might not be directly used by typical users.
// const register = (username, email, password, roles) => {
// return axios.post(API_URL + 'register', {
// username,
// email,
// password,
// roles
// });
// };

const logout = () => {
    // For JWT, logout is typically handled client-side by removing the token.
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

const authHeader = () => {
    const user = getCurrentUser();
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

export default {
    login,
    logout,
    getCurrentUser,
    authHeader
    // register, // Uncomment if needed for an admin interface part
};
