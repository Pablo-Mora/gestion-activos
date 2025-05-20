import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  
  // Navigation items for admin sidebar
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'chart-pie' },
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'users' },
    { label: 'Empleados', path: '/admin/empleados', icon: 'user-circle' },
    { label: 'Activos', path: '/admin/activos', icon: 'desktop-computer' },
    { label: 'Actas', path: '/admin/actas', icon: 'document-text' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar navItems={navItems} userRole="ADMIN" />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Panel de Administración" user={user} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;