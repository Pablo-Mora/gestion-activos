import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getActa, createActa, updateActa } from '../../api/actas'; 
import { getEmpleados } from '../../api/empleados';
import { getActivos } from '../../api/activos';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ActaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [activos, setActivos] = useState([]);
  const [selectedActivos, setSelectedActivos] = useState([]);
  
  const [formData, setFormData] = useState({
    empleadoId: '',
    fechaEntrega: new Date().toISOString().split('T')[0],
    responsableEntregaId: '',
    observaciones: '',
    ubicacion: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener empleados para el dropdown
        const empleadosData = await getEmpleados();
        setEmpleados(empleadosData);
        
        // Obtener activos disponibles
        const activosData = await getActivos();
        setActivos(activosData.filter(activo => activo.estado === 'DISPONIBLE'));
        
        // Si estamos editando, cargar datos del acta
        if (isEditing) {
          const actaData = await getActa(id);
          
          setFormData({
            empleadoId: actaData.empleado?.id || '',
            fechaEntrega: new Date(actaData.fechaEntrega).toISOString().split('T')[0],
            responsableEntregaId: actaData.responsableEntrega?.id || '',
            observaciones: actaData.observaciones || '',
            ubicacion: actaData.ubicacion || '',
          });
          
          // Obtener los activos asociados al acta
          if (actaData.activos) {
            setSelectedActivos(actaData.activos);
          }
        }
        
        setError(null);
      } catch (err) {
        setError(`Error al cargar los datos: ${err.message}`);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActivoToggle = (activoId) => {
    setSelectedActivos(prev => {
      if (prev.some(a => a.id === activoId)) {
        return prev.filter(a => a.id !== activoId);
      } else {
        const activoToAdd = activos.find(a => a.id === activoId);
        return [...prev, activoToAdd];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        activosIds: selectedActivos.map(a => a.id),
      };
      
      if (isEditing) {
        await updateActa(id, payload);
      } else {
        await createActa(payload);
      }
      
      navigate('/admin/actas');
    } catch (err) {
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el acta: ${err.message}`);
      console.error('Error saving acta:', err);
      setLoading(false);
    }
  };

  if (loading && isEditing) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditing ? 'Editar Acta' : 'Nueva Acta'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Empleado */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empleadoId">
              Empleado*
            </label>
            <select
              id="empleadoId"
              name="empleadoId"
              value={formData.empleadoId}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map(empleado => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.nombre} {empleado.apellido} - {empleado.cargo}
                </option>
              ))}
            </select>
          </div>
          
          {/* Fecha de entrega */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaEntrega">
              Fecha de Entrega*
            </label>
            <input
              type="date"
              id="fechaEntrega"
              name="fechaEntrega"
              value={formData.fechaEntrega}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          {/* Responsable de la entrega */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="responsableEntregaId">
              Responsable de la Entrega*
            </label>
            <select
              id="responsableEntregaId"
              name="responsableEntregaId"
              value={formData.responsableEntregaId}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Seleccione un responsable</option>
              {empleados.map(empleado => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.nombre} {empleado.apellido} - {empleado.cargo}
                </option>
              ))}
            </select>
          </div>
          
          {/* Ubicación */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ubicacion">
              Ubicación*
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              placeholder="Ej: Oficina principal, piso 3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        
        {/* Observaciones */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="observaciones">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
            placeholder="Observaciones adicionales sobre la entrega"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        
        {/* Selección de activos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Seleccione los Activos*</h3>
          
          {activos.length === 0 ? (
            <p className="text-gray-500">No hay activos disponibles para asignar.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded-md p-3">
              {activos.map(activo => (
                <div key={activo.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`activo-${activo.id}`}
                    checked={selectedActivos.some(a => a.id === activo.id)}
                    onChange={() => handleActivoToggle(activo.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`activo-${activo.id}`} className="text-gray-700">
                    {activo.tipo === 'HARDWARE' ? (
                      `${activo.marca} ${activo.modelo} (${activo.serie})`
                    ) : activo.tipo === 'SOFTWARE' ? (
                      `${activo.nombre} (${activo.version})`
                    ) : (
                      `${activo.nombre} (${activo.url})`
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {selectedActivos.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-600 text-sm">
                {selectedActivos.length} activo(s) seleccionado(s)
              </p>
            </div>
          )}
        </div>
        
        {/* Botones */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/actas')}
            className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Acta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActaForm;