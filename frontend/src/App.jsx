// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout'; // Import MainLayout

// Import Bootstrap CSS (ensure it's here or in main.jsx)
import 'bootstrap/dist/css/bootstrap.min.css';

// Placeholder pages for assets (to be created later)
const EmployeePage = () => <div><h1>Employees Page</h1></div>;
const HardwarePage = () => <div><h1>Hardware Page</h1></div>;
const LicensePage = () => <div><h1>Licenses Page</h1></div>;
const WebAccessPage = () => <div><h1>Web Accesses Page</h1></div>;


function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Routes using MainLayout */}
                    <Route element={<ProtectedRoute />}> {/* Outer protection for layout */}
                        <Route element={<MainLayout />}> {/* Nest routes within MainLayout */}
                            <Route path="/dashboard" element={<DashboardPage />} />
                            {/* Admin-only asset management routes */}
                            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                                <Route path="/employees" element={<EmployeePage />} />
                                <Route path="/hardware" element={<HardwarePage />} />
                                <Route path="/licenses" element={<LicensePage />} />
                                <Route path="/web-accesses" element={<WebAccessPage />} />
                                {/* <Route path="/user-management" element={<div>User Management Page</div>} /> */}
                            </Route>
                            {/* Add other routes that use MainLayout here */}
                        </Route>
                    </Route>

                    {/* Fallback: redirect unauthenticated to login, authenticated to dashboard */}
                    <Route path="*" element={<Navigate to="/login" />} />
                    {/* A better root path handling might be needed depending on auth state */}
                     <Route path="/" element={<Navigate to="/dashboard" />} />

                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
