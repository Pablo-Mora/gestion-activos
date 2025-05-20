import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActas } from '../../api/actas';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ActasList = ({ isAdmin = false }) => {
  const [actas, setActas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActas = async () => {
      try {
        setLoading(true);
        const data = await getActas();
        setActas(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las actas. Por favor, inténtelo de nuevo más tarde.');
        console.error('Error fetching actas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActas();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Actas de Entrega</h2>
        {isAdmin && (
          <Link
            to="/admin/actas/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Nueva Acta
          </Link>
        )}
      </div>

      {actas.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No hay actas disponibles.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {actas.map((acta) => (
                <tr key={acta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acta.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(acta.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {acta.empleado?.nombre} {acta.empleado?.apellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        acta.estado === 'APROBADA'
                          ? 'bg-green-100 text-green-800'
                          : acta.estado === 'PENDIENTE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {acta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/${isAdmin ? 'admin' : 'user'}/actas/${acta.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          to={`/admin/actas/${acta.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Editar
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (window.confirm('¿Está seguro de que desea eliminar esta acta?')) {
                              // Llamada a función para eliminar acta
                              // deleteActa(acta.id);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
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

export default ActasList;