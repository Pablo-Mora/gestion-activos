// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import MyAssetsPage from './pages/MyAssetsPage';
import EmployeePage from './pages/EmployeePage'; // Assuming these are correctly created
import HardwarePage from './pages/HardwarePage';
import LicensePage from './pages/LicensePage';
import WebAccessPage from './pages/WebAccessPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import custom App styles

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/my-assets" element={<MyAssetsPage />} />

                            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                                <Route path="/employees" element={<EmployeePage />} />
                                <Route path="/hardware" element={<HardwarePage />} />
                                <Route path="/licenses" element={<LicensePage />} />
                                <Route path="/web-accesses" element={<WebAccessPage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    {/* Fallback for unmatched routes - redirect to dashboard if logged in, else login might be better if context is available here */}
                    {/* For simplicity, always to /dashboard, ProtectedRoute will handle auth check */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}
export default App;
