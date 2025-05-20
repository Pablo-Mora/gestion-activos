import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmpleadoById } from '../../api/empleados';
import { getActivosByEmpleadoId } from '../../api/activos';
import { getActasByEmpleadoId } from '../../api/actas';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const EmpleadoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [empleado, setEmpleado] = useState(null);
  const [activos, setActivos] = useState([]);
  const [actas, setActas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cargar datos del empleado
        const empleadoData = await getEmpleadoById(id);
        setEmpleado(empleadoData);
        
        // Cargar activos asignados al empleado
        const activosData = await getActivosByEmpleadoId(id);
        setActivos(activosData);
        
        // Cargar actas relacionadas con el empleado
        const actasData = await getActasByEmpleadoId(id);
        setActas(actasData);
      } catch (err) {
        setError('Error al cargar los datos del empleado.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/empleados');
  };

  const handleEdit = () => {
    navigate(`/admin/empleados/editar/${id}`);
  };

  const handleViewActivo = (activoId) => {
    navigate(`/admin/activos/${activoId}`);
  };

  const handleViewActa = (actaId) => {
    navigate(`/admin/actas/${actaId}`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!empleado) return <ErrorMessage message="No se encontró el empleado solicitado." />;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Detalles del Empleado</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Editar
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Nombre Completo</h3>
            <p className="text-gray-900">{empleado.nombre} {empleado.apellido}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Email</h3>
            <p className="text-gray-900">{empleado.email}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Teléfono</h3>
            <p className="text-gray-900">{empleado.telefono || 'No registrado'}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Departamento</h3>
            <p className="text-gray-900">{empleado.departamento}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Cargo</h3>
            <p className="text-gray-900">{empleado.cargo}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Fecha de Ingreso</h3>
            <p className="text-gray-900">
              {empleado.fechaIngreso 
                ? new Date(empleado.fechaIngreso).toLocaleDateString() 
                : 'No registrada'}
            </p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Estado</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              empleado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {empleado.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Sección de Activos Asignados */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Activos Asignados</h3>
          
          {activos.length === 0 ? (
            <p className="text-gray-500">No hay activos asignados a este empleado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre/Descripción</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Asignación</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activos.map((activo) => (
                    <tr key={activo.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">{activo.tipo}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{activo.nombre || activo.descripcion}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {activo.fechaAsignacion ? new Date(activo.fechaAsignacion).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activo.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activo.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        <button
                          onClick={() => handleViewActivo(activo.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección de Actas */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Actas</h3>
          
          {actas.length === 0 ? (
            <p className="text-gray-500">No hay actas registradas para este empleado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {actas.map((acta) => (
                    <tr key={acta.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">{acta.numero}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{acta.tipo}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {acta.fecha ? new Date(acta.fecha).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        <button
                          onClick={() => handleViewActa(acta.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Ver acta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpleadoDetail;