import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivoById, createActivoHardware, updateActivoHardware } from '../../../api/activos';
import { getEmpleados } from '../../../api/empleados';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';

const ActivoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  
  const [formData, setFormData] = useState({
    tipo: 'HARDWARE', // Por defecto, HARDWARE, LICENCIA o ACCESO_WEB
    nombre: '',
    descripcion: '',
    numeroSerie: '',
    modelo: '',
    marca: '',
    fechaAdquisicion: '',
    valorAdquisicion: '',
    estado: 'ACTIVO', // Por defecto ACTIVO, MANTENIMIENTO, BAJA
    empleadoId: '', // ID del empleado asignado
    fechaAsignacion: '',
    observaciones: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar lista de empleados para el dropdown
        const empleadosData = await getEmpleados();
        setEmpleados(empleadosData);
        
        // Si es modo edición, cargar datos del activo
        if (isEditing) {
          const activoData = await getActivoById(id);
          
          // Formatear fechas para input date
          if (activoData.fechaAdquisicion) {
            activoData.fechaAdquisicion = new Date(activoData.fechaAdquisicion).toISOString().split('T')[0];
          }
          if (activoData.fechaAsignacion) {
            activoData.fechaAsignacion = new Date(activoData.fechaAsignacion).toISOString().split('T')[0];
          }
          
          // Extraer el ID del empleado si existe
          if (activoData.empleado) {
            activoData.empleadoId = activoData.empleado.id;
          }
          
          setFormData({
            ...activoData,
            valorAdquisicion: activoData.valorAdquisicion?.toString() || ''
          });
        }
      } catch (err) {
        setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Para campos numéricos, asegurarnos que sean válidos
    if (name === 'valorAdquisicion' && value !== '') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar campos específicos del tipo de activo cuando cambia el tipo
    if (name === 'tipo') {
      const newFormData = { ...formData, [name]: value };
      
      if (value === 'HARDWARE') {
        newFormData.numeroSerie = formData.numeroSerie || '';
        newFormData.modelo = formData.modelo || '';
        newFormData.marca = formData.marca || '';
      } else if (value === 'LICENCIA') {
        newFormData.fechaExpiracion = formData.fechaExpiracion || '';
        newFormData.clave = formData.clave || '';
      } else if (value === 'ACCESO_WEB') {
        newFormData.url = formData.url || '';
        newFormData.usuario = formData.usuario || '';
      }
      
      setFormData(newFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        valorAdquisicion: formData.valorAdquisicion ? parseFloat(formData.valorAdquisicion) : null
      };
      
      if (isEditing) {
        await updateActivo(id, dataToSubmit);
      } else {
        await createActivo(dataToSubmit);
      }
      navigate('/admin/activos');
    } catch (err) {
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el activo. Por favor, verifica los datos e intenta de nuevo.`);
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/activos');
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isEditing ? 'Editar Activo' : 'Nuevo Activo'}
      </h2>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tipo de Activo */}
          <div className="md:col-span-2">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Activo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HARDWARE">Hardware</option>
              <option value="LICENCIA">Licencia de Software</option>
              <option value="ACCESO_WEB">Acceso Web</option>
            </select>
          </div>

          {/* Nombre y Descripción (comunes para todos los tipos) */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campos específicos para HARDWARE */}
          {formData.tipo === 'HARDWARE' && (
            <>
              <div>
                <label htmlFor="numeroSerie" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Serie
                </label>
                <input
                  type="text"
                  id="numeroSerie"
                  name="numeroSerie"
                  value={formData.numeroSerie}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Campos específicos para LICENCIA */}
          {formData.tipo === 'LICENCIA' && (
            <>
              <div>
                <label htmlFor="clave" className="block text-sm font-medium text-gray-700 mb-1">
                  Clave de Licencia
                </label>
                <input
                  type="text"
                  id="clave"
                  name="clave"
                  value={formData.clave || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="fechaExpiracion" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Expiración
                </label>
                <input
                  type="date"
                  id="fechaExpiracion"
                  name="fechaExpiracion"
                  value={formData.fechaExpiracion || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Campos específicos para ACCESO_WEB */}
          {formData.tipo === 'ACCESO_WEB' && (
            <>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  value={formData.usuario || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Campos comunes para todos los tipos */}
          <div>
            <label htmlFor="fechaAdquisicion" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Adquisición
            </label>
            <input
              type="date"
              id="fechaAdquisicion"
              name="fechaAdquisicion"
              value={formData.fechaAdquisicion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="valorAdquisicion" className="block text-sm font-medium text-gray-700 mb-1">
              Valor de Adquisición
            </label>
            <input
              type="number"
              id="valorAdquisicion"
              name="valorAdquisicion"
              value={formData.valorAdquisicion}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVO">Activo</option>
              <option value="MANTENIMIENTO">En Mantenimiento</option>
              <option value="BAJA">De Baja</option>
            </select>
          </div>

          <div>
            <label htmlFor="empleadoId" className="block text-sm font-medium text-gray-700 mb-1">
              Empleado Asignado
            </label>
            <select
              id="empleadoId"
              name="empleadoId"
              value={formData.empleadoId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin asignar</option>
              {empleados.map(empleado => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.nombre} {empleado.apellido} - {empleado.departamento}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fechaAsignacion" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Asignación
            </label>
            <input
              type="date"
              id="fechaAsignacion"
              name="fechaAsignacion"
              value={formData.fechaAsignacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={submitLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitLoading}
          >
            {submitLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivoForm;