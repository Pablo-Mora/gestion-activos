import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivoById, deleteActivo } from '../../../api/activos';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';

const ActivosList = () => {
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState({
    tipo: '',
    estado: '',
    busqueda: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        setLoading(true);
        const data = await getActivos();
        setActivos(data);
      } catch (err) {
        setError('Error al cargar los activos. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/activos/editar/${id}`);
  };

  const handleView = (id) => {
    navigate(`/admin/activos/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este activo?')) {
      try {
        await deleteActivo(id);
        setActivos(activos.filter(activo => activo.id !== id));
      } catch (err) {
        setError('Error al eliminar el activo. Por favor, inténtalo de nuevo.');
        console.error(err);
      }
    }
  };

  const handleCreate = () => {
    navigate('/admin/activos/crear');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltro({
      ...filtro,
      [name]: value
    });
  };

  // Filtrar activos basado en el estado del filtro
  const activosFiltrados = activos.filter(activo => {
    // Filtrar por tipo
    if (filtro.tipo && activo.tipo !== filtro.tipo) {
      return false;
    }
    
    // Filtrar por estado
    if (filtro.estado && activo.estado !== filtro.estado) {
      return false;
    }
    
    // Filtrar por término de búsqueda (nombre, descripción, serie, etc.)
    if (filtro.busqueda) {
      const terminoBusqueda = filtro.busqueda.toLowerCase();
      return (
        (activo.nombre && activo.nombre.toLowerCase().includes(terminoBusqueda)) ||
        (activo.descripcion && activo.descripcion.toLowerCase().includes(terminoBusqueda)) ||
        (activo.numeroSerie && activo.numeroSerie.toLowerCase().includes(terminoBusqueda)) ||
        (activo.modelo && activo.modelo.toLowerCase().includes(terminoBusqueda))
      );
    }
    
    return true;
  });

  // Obtener los tipos únicos para el filtro
  const tiposUnicos = [...new Set(activos.map(activo => activo.tipo))];
  
  // Obtener los estados únicos para el filtro
  const estadosUnicos = [...new Set(activos.map(activo => activo.estado))];

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Activos</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Nuevo Activo
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            id="busqueda"
            name="busqueda"
            value={filtro.busqueda}
            onChange={handleFilterChange}
            placeholder="Nombre, descripción, serie..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Activo
          </label>
          <select
            id="tipo"
            name="tipo"
            value={filtro.tipo}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            {tiposUnicos.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={filtro.estado}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            {estadosUnicos.map((estado, index) => (
              <option key={index} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => setFiltro({ tipo: '', estado: '', busqueda: '' })}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {activosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No se encontraron activos con los filtros actuales.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Tipo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nombre/Descripción</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Serie/Modelo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Empleado Asignado</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activosFiltrados.map((activo) => (
                <tr key={activo.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{activo.tipo}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{activo.nombre || activo.descripcion}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {activo.numeroSerie ? `Serie: ${activo.numeroSerie}` : ''}
                    {activo.numeroSerie && activo.modelo ? ' / ' : ''}
                    {activo.modelo ? `Modelo: ${activo.modelo}` : ''}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {activo.empleado ? `${activo.empleado.nombre} ${activo.empleado.apellido}` : 'Sin asignar'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activo.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 
                      activo.estado === 'MANTENIMIENTO' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activo.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 flex space-x-2">
                    <button
                      onClick={() => handleView(activo.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(activo.id)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(activo.id)}
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

export default ActivosList;