import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActa, aprobarActa, rechazarActa } from '../../../api/actas';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';

const ActaDetail = ({ isAdmin = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [acta, setActa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchActa = async () => {
      try {
        setLoading(true);
        const data = await getActa(id);
        setActa(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar el acta. Por favor, inténtelo de nuevo.');
        console.error('Error fetching acta:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActa();
  }, [id]);

  const handleAprobarActa = async () => {
    if (window.confirm('¿Está seguro de que desea aprobar esta acta?')) {
      try {
        setActionLoading(true);
        await aprobarActa(id);
        // Recargar los datos del acta
        const updatedActa = await getActa(id);
        setActa(updatedActa);
      } catch (err) {
        setError('Error al aprobar el acta. Por favor, inténtelo de nuevo.');
        console.error('Error approving acta:', err);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRechazarActa = async () => {
    const motivo = window.prompt('Por favor, indique el motivo del rechazo:');
    
    if (motivo) {
      try {
        setActionLoading(true);
        await rechazarActa(id, { motivo });
        // Recargar los datos del acta
        const updatedActa = await getActa(id);
        setActa(updatedActa);
      } catch (err) {
        setError('Error al rechazar el acta. Por favor, inténtelo de nuevo.');
        console.error('Error rejecting acta:', err);
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!acta) return <ErrorMessage message="Acta no encontrada" />;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Encabezado */}
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Acta #{acta.id}
        </h2>
        <div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
            ${acta.estado === 'APROBADA' 
              ? 'bg-green-100 text-green-800' 
              : acta.estado === 'PENDIENTE' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'}`}
          >
            {acta.estado}
          </span>
        </div>
      </div>

      {/* Información principal */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Empleado</h3>
            <p className="text-lg font-medium">
              {acta.empleado?.nombre} {acta.empleado?.apellido}
            </p>
            <p className="text-gray-600">{acta.empleado?.cargo}</p>
            <p className="text-gray-600">{acta.empleado?.departamento}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Detalles</h3>
            <p className="text-gray-600">
              <span className="font-medium">Fecha de creación:</span>{' '}
              {new Date(acta.fechaCreacion).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Fecha de entrega:</span>{' '}
              {new Date(acta.fechaEntrega).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Ubicación:</span> {acta.ubicacion}
            </p>
          </div>
        </div>

        {/* Responsable */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Responsable de la Entrega</h3>
          <p className="text-lg font-medium">
            {acta.responsableEntrega?.nombre} {acta.responsableEntrega?.apellido}
          </p>
          <p className="text-gray-600">{acta.responsableEntrega?.cargo}</p>
        </div>

        {/* Observaciones */}
        {acta.observaciones && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Observaciones</h3>
            <p className="text-gray-800 bg-gray-50 p-3 rounded">{acta.observaciones}</p>
          </div>
        )}

        {/* Activos */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Activos Asignados</h3>
          
          {!acta.activos || acta.activos.length === 0 ? (
            <p className="text-gray-500 italic">No hay activos asignados en esta acta.</p>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificador</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acta.activos.map((activo) => (
                    <tr key={activo.id}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{activo.tipo}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {activo.tipo === 'HARDWARE' ? (
                          <span>{activo.marca} {activo.modelo}</span>
                        ) : activo.tipo === 'SOFTWARE' ? (
                          <span>{activo.nombre} {activo.version}</span>
                        ) : (
                          <span>{activo.nombre}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {activo.tipo === 'HARDWARE' ? activo.serie : activo.tipo === 'SOFTWARE' ? activo.licencia : activo.url}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Historial de aprobaciones */}
        {acta.aprobaciones && acta.aprobaciones.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Historial de Aprobaciones</h3>
            <div className="space-y-3">
              {acta.aprobaciones.map((aprobacion, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                      ${aprobacion.estado === 'APROBADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {aprobacion.estado}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(aprobacion.fecha).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">Aprobador:</span> {aprobacion.aprobador?.nombre} {aprobacion.aprobador?.apellido}
                  </p>
                  {aprobacion.motivo && (
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Motivo:</span> {aprobacion.motivo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-between items-center border-t pt-4 mt-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
            >
              Volver
            </button>
          </div>
          <div className="space-x-3">
            {isAdmin && (
              <>
                {acta.estado === 'PENDIENTE' && (
                  <>
                    <button
                      onClick={handleAprobarActa}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300 disabled:opacity-50"
                    >
                      {actionLoading ? 'Procesando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={handleRechazarActa}
                      disabled={actionLoading}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300 disabled:opacity-50"
                    >
                      {actionLoading ? 'Procesando...' : 'Rechazar'}
                    </button>
                  </>
                )}
                {acta.estado !== 'PENDIENTE' && (
                  <Link
                    to={`/admin/actas/${acta.id}/print`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Imprimir
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActaDetail;