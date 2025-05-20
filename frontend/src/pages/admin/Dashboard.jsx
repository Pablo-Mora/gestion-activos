import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    totalActivosHardware: 0,
    totalLicenciasSoftware: 0,
    totalAccesosWeb: 0,
    totalActas: 0,
    activosPorTipo: {},
    empleadosSinActivos: 0,
    actasPendientes: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [activosData, empleadosData, actasData] = await Promise.all([
          getResumenActivos(),
          getResumenEmpleados(),
          getResumenActas()
        ]);

        setStats({
          totalEmpleados: empleadosData.totalEmpleados || 0,
          totalActivosHardware: activosData.totalActivosHardware || 0,
          totalLicenciasSoftware: activosData.totalLicenciasSoftware || 0,
          totalAccesosWeb: activosData.totalAccesosWeb || 0,
          totalActas: actasData.totalActas || 0,
          activosPorTipo: activosData.distribucionPorTipo || {},
          empleadosSinActivos: empleadosData.empleadosSinActivos || 0,
          actasPendientes: actasData.actasPendientes || 0
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Empleados</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalEmpleados}</p>
            <p className="text-sm text-gray-500">Total empleados registrados</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">{stats.empleadosSinActivos}</span> empleados sin activos asignados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Activos</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.totalActivosHardware + stats.totalLicenciasSoftware + stats.totalAccesosWeb}
            </p>
            <div className="text-sm mt-2">
              <p><span className="font-medium">{stats.totalActivosHardware}</span> activos hardware</p>
              <p><span className="font-medium">{stats.totalLicenciasSoftware}</span> licencias software</p>
              <p><span className="font-medium">{stats.totalAccesosWeb}</span> accesos web</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Actas</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalActas}</p>
            <p className="text-sm text-gray-500">Total actas generadas</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">{stats.actasPendientes}</span> actas pendientes de aprobación
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Distribución de Activos</h2>
          </CardHeader>
          <CardContent className="h-64">
            {/* Aquí se podría agregar una gráfica con una librería como recharts */}
            <div className="space-y-2">
              {Object.entries(stats.activosPorTipo).map(([tipo, cantidad]) => (
                <div key={tipo} className="flex justify-between items-center">
                  <span>{tipo}</span>
                  <span className="font-medium">{cantidad}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Actividad Reciente</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm italic">
              El módulo de actividad reciente está en desarrollo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;