import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { geteActivoById } from '../../api/activos';
import { getActasUsuario } from '../../api/actas';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalActivosHardware: 0,
    totalLicenciasSoftware: 0,
    totalAccesosWeb: 0,
    totalActas: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Obtener activos asignados al usuario
        const activosData = await getActivosUsuario();
        
        // Obtener actas del usuario
        const actasData = await getActasUsuario();
        
        // Contar por tipo de activo
        const hardware = activosData.filter(activo => activo.tipo === 'HARDWARE').length;
        const software = activosData.filter(activo => activo.tipo === 'SOFTWARE').length;
        const accesosWeb = activosData.filter(activo => activo.tipo === 'ACCESO_WEB').length;
        
        setStats({
          totalActivosHardware: hardware,
          totalLicenciasSoftware: software,
          totalAccesosWeb: accesosWeb,
          totalActas: actasData.length
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar sus datos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Equipo Hardware</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalActivosHardware}</p>
            <p className="text-sm text-gray-500">Dispositivos asignados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Software</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalLicenciasSoftware}</p>
            <p className="text-sm text-gray-500">Licencias asignadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Accesos Web</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAccesosWeb}</p>
            <p className="text-sm text-gray-500">Credenciales asignadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Actas</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalActas}</p>
            <p className="text-sm text-gray-500">Actas de entrega</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Información de Usuario</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-semibold">Nombre:</span> {user?.nombre} {user?.apellido}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p><span className="font-semibold">Usuario:</span> {user?.username}</p>
              <p className="text-sm text-gray-500 mt-4">
                Para solicitar cambios en sus datos personales o reportar problemas con sus activos, 
                por favor contacte al administrador del sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;