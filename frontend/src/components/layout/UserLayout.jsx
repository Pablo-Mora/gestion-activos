import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
  const { user } = useAuth();
  
  // Navigation items for user sidebar
  const navItems = [
    { label: 'Dashboard', path: '/user', icon: 'chart-pie' },
    { label: 'Mis Activos', path: '/user/mis-activos', icon: 'desktop-computer' },
    { label: 'Mis Actas', path: '/user/mis-actas', icon: 'document-text' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar navItems={navItems} userRole="USER" />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Panel de Usuario" user={user} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;