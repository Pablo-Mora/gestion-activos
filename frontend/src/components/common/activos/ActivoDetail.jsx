import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivoById, updateActivo } from '../../../api/activos';
import { getEmpleados } from '../../../api/empleados';
import { formatDate } from '../../../utils/formatUtils';
import { validateRequired } from '../../../utils/validationUtils';

const ActivoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activo, setActivo] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    fechaAdquisicion: '',
    valorAdquisicion: '',
    estado: 'ACTIVO',
    empleadoId: '',
    marca: '',
    modelo: '',
    serial: '',
    tipo: 'HARDWARE' // Asumiendo que es un activo de hardware
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos del activo
        const activoData = await getActivoById(id);
        setActivo(activoData);
        
        // Inicializar formulario con datos del activo
        setFormData({
          codigo: activoData.codigo || '',
          nombre: activoData.nombre || '',
          descripcion: activoData.descripcion || '',
          fechaAdquisicion: activoData.fechaAdquisicion ? activoData.fechaAdquisicion.split('T')[0] : '',
          valorAdquisicion: activoData.valorAdquisicion || '',
          estado: activoData.estado || 'ACTIVO',
          empleadoId: activoData.empleado?.id || '',
          marca: activoData.marca || '',
          modelo: activoData.modelo || '',
          serial: activoData.serial || '',
          tipo: activoData.tipo || 'HARDWARE'
        });
        
        // Cargar lista de empleados
        const empleadosData = await getEmpleados();
        setEmpleados(empleadosData);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del activo');
        setLoading(false);
        console.error('Error al cargar activo:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const errors = {};
    
    // Validar campos requeridos
    errors.codigo = validateRequired(formData.codigo);
    errors.nombre = validateRequired(formData.nombre);
    errors.estado = validateRequired(formData.estado);
    errors.fechaAdquisicion = validateRequired(formData.fechaAdquisicion);
    
    setFormErrors(errors);
    
    // Formulario válido si no hay errores
    return !Object.values(errors).some(x => x);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar datos para enviar
      const activoData = {
        ...formData,
        id: activo.id,
        valorAdquisicion: parseFloat(formData.valorAdquisicion) || 0
      };
      
      // Enviar actualización
      await updateActivo(id, activoData);
      
      // Actualizar estado local
      setActivo({
        ...activo,
        ...activoData,
        empleado: empleados.find(emp => emp.id === formData.empleadoId)
      });
      
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setError('Error al actualizar el activo');
      setLoading(false);
      console.error('Error al actualizar activo:', err);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      codigo: activo.codigo || '',
      nombre: activo.nombre || '',
      descripcion: activo.descripcion || '',
      fechaAdquisicion: activo.fechaAdquisicion ? activo.fechaAdquisicion.split('T')[0] : '',
      valorAdquisicion: activo.valorAdquisicion || '',
      estado: activo.estado || 'ACTIVO',
      empleadoId: activo.empleado?.id || '',
      marca: activo.marca || '',
      modelo: activo.modelo || '',
      serial: activo.serial || '',
      tipo: activo.tipo || 'HARDWARE'
    });
    
    setFormErrors({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">{error}</div>
    );
  }

  if (!activo) {
    return (
      <div className="alert alert-warning">No se encontró el activo solicitado</div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h2 className="m-0">Detalle del Activo: {activo.nombre}</h2>
        <div>
          <button 
            onClick={toggleEdit} 
            className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'} mr-2`}
          >
            {isEditing ? 'Cancelar Edición' : 'Editar Activo'}
          </button>
          
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline"
          >
            Volver
          </button>
        </div>
      </div>
      
      <div className="card-body">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="codigo">Código *</label>
                <input
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={`form-input ${formErrors.codigo ? 'border-red-500' : ''}`}
                />
                {formErrors.codigo && <div className="form-error">{formErrors.codigo}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre *</label>
                <input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`form-input ${formErrors.nombre ? 'border-red-500' : ''}`}
                />
                {formErrors.nombre && <div className="form-error">{formErrors.nombre}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="HARDWARE">Hardware</option>
                  <option value="SOFTWARE">Software</option>
                  <option value="ACCESO">Acceso Web</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="estado">Estado *</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={`form-select ${formErrors.estado ? 'border-red-500' : ''}`}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="MANTENIMIENTO">En Mantenimiento</option>
                  <option value="BAJA">Baja</option>
                </select>
                {formErrors.estado && <div className="form-error">{formErrors.estado}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="marca">Marca</label>
                <input
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="modelo">Modelo</label>
                <input
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="serial">Serial</label>
                <input
                  id="serial"
                  name="serial"
                  value={formData.serial}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="fechaAdquisicion">Fecha de Adquisición *</label>
                <input
                  type="date"
                  id="fechaAdquisicion"
                  name="fechaAdquisicion"
                  value={formData.fechaAdquisicion}
                  onChange={handleChange}
                  className={`form-input ${formErrors.fechaAdquisicion ? 'border-red-500' : ''}`}
                />
                {formErrors.fechaAdquisicion && <div className="form-error">{formErrors.fechaAdquisicion}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="valorAdquisicion">Valor de Adquisición</label>
                <input
                  type="number"
                  id="valorAdquisicion"
                  name="valorAdquisicion"
                  value={formData.valorAdquisicion}
                  onChange={handleChange}
                  className="form-input"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="empleadoId">Asignado a</label>
                <select
                  id="empleadoId"
                  name="empleadoId"
                  value={formData.empleadoId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- No asignado --</option>
                  {empleados.map(empleado => (
                    <option key={empleado.id} value={empleado.id}>
                      {empleado.nombre} {empleado.apellido} ({empleado.codigo})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="form-input"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end mt-4">
              <button type="button" onClick={handleCancel} className="btn btn-secondary mr-2">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray-600 text-sm">Código</h3>
              <p className="font-medium">{activo.codigo}</p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Nombre</h3>
              <p className="font-medium">{activo.nombre}</p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Tipo</h3>
              <p className="font-medium">{activo.tipo}</p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Estado</h3>
              <span className={`badge ${
                activo.estado === 'ACTIVO' ? 'badge-green' :
                activo.estado === 'INACTIVO' ? 'badge-red' :
                activo.estado === 'MANTENIMIENTO' ? 'badge-yellow' : 'badge-gray'
              }`}>
                {activo.estado}
              </span>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Marca</h3>
              <p className="font-medium">{activo.marca || 'No especificado'}</p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Modelo</h3>
              <p className="font-medium">{activo.modelo || 'No especificado'}</p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Serial</h3>
              <p className="font-medium">{activo.serial || 'No especificado'}</p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Fecha de Adquisición</h3>
              <p className="font-medium">{formatDate(activo.fechaAdquisicion)}</p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Valor de Adquisición</h3>
              <p className="font-medium">
                {activo.valorAdquisicion
                  ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(activo.valorAdquisicion)
                  : 'No especificado'}
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-600 text-sm">Asignado a</h3>
              <p className="font-medium">
                {activo.empleado
                  ? `${activo.empleado.nombre} ${activo.empleado.apellido}`
                  : 'No asignado'}
              </p>
            </div> 
            
            <div className="col-span-2">
              <h3 className="text-gray-600 text-sm">Descripción</h3>
              <p className="font-medium">{activo.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivoDetail;