import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmpleados, deleteEmpleado } from '../../../api/empleados';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoading(true);
        const data = await getEmpleados();
        setEmpleados(data);
      } catch (err) {
        setError('Error al cargar los empleados. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/empleados/editar/${id}`);
  };

  const handleView = (id) => {
    navigate(`/admin/empleados/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await deleteEmpleado(id);
        setEmpleados(empleados.filter(empleado => empleado.id !== id));
      } catch (err) {
        setError('Error al eliminar el empleado. Por favor, inténtalo de nuevo.');
        console.error(err);
      }
    }
  };

  const handleCreate = () => {
    navigate('/admin/empleados/crear');
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Empleados</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Nuevo Empleado
        </button>
      </div>

      {empleados.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay empleados registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Departamento</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Cargo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {empleados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{empleado.nombre} {empleado.apellido}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{empleado.departamento}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{empleado.cargo}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{empleado.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 flex space-x-2">
                    <button
                      onClick={() => handleView(empleado.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(empleado.id)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(empleado.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmpleadosList;