import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// CSS imports
import './index.css';
//import './styles/global.css';
//import './styles/tailwind.css';

// Layout Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorMessage from './components/common/ErrorMessage';

// Auth Components
import Login from './components/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import EmpleadosPage from './pages/admin/EmpleadosPage';
import ActivosPage from './pages/admin/ActivosPage';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import MisActivos from './pages/user/MisActivos';

// Layout componente que envuelve las páginas con la estructura común
const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Maneja el responsive para el sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={() => setSidebarOpen(false)} 
          userRole={user?.role || 'user'} 
        />
        
        <main className={`flex-1 p-4 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : ''}`}>
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

// Componente PrivateRoute que verifica la autenticación
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <ErrorMessage message="No tienes permiso para acceder a esta página" />
        <button 
          onClick={() => window.history.back()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver
        </button>
      </div>
    );
  }
  
  return children;
};

// Componente de pantalla de carga con redirección automática
const LoadingScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/login';
    }, 3000); // Cambiado a 3 segundos para una mejor experiencia
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando sistema...</p>
        <p className="mt-2 text-sm text-gray-500">Redirigiendo al login...</p>
      </div>
    </div>
  );
};

// Componente principal de la aplicación
const AppContent = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas de administrador */}
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['admin']}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/dashboard" element={
        <PrivateRoute allowedRoles={['admin']}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/users" element={
        <PrivateRoute allowedRoles={['admin']}>
          <Layout>
            <UserManagement />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/empleados" element={
        <PrivateRoute allowedRoles={['admin']}>
          <Layout>
            <EmpleadosPage />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/activos" element={
        <PrivateRoute allowedRoles={['admin']}>
          <Layout>
            <ActivosPage />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Rutas de usuario */}
      <Route path="/user/dashboard" element={
        <PrivateRoute allowedRoles={['user', 'admin']}>
          <Layout>
            <UserDashboard />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/user/activos" element={
        <PrivateRoute allowedRoles={['user', 'admin']}>
          <Layout>
            <MisActivos />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Ruta raíz - muestra la pantalla de carga */}
      <Route path="/" element={<LoadingScreen />} />
      
      {/* Captura de rutas no encontradas */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
          <h1 className="text-4xl font-bold text-gray-800">404</h1>
          <p className="text-xl text-gray-600 mt-2">Página no encontrada</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 