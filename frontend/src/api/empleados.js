import apiClient from './apiClient';

/**
 * Obtener lista de empleados
 * @param {Object} params - Parámetros de consulta (paginación, filtros)
 * @returns {Promise} Promesa con la lista de empleados
 */
export const getEmpleados = async (params = {}) => {
  try {
    const response = await apiClient.get('/empleados', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener un empleado por su ID
 * @param {number} id - ID del empleado
 * @returns {Promise} Promesa con los datos del empleado
 */
export const getEmpleadoById = async (id) => {
  try {
    const response = await apiClient.get(`/empleados/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo empleado
 * @param {Object} empleadoData - Datos del nuevo empleado
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const createEmpleado = async (empleadoData) => {
  try {
    const response = await apiClient.post('/empleados', empleadoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un empleado existente
 * @param {number} id - ID del empleado a actualizar
 * @param {Object} empleadoData - Nuevos datos del empleado
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const updateEmpleado = async (id, empleadoData) => {
  try {
    const response = await apiClient.put(`/empleados/${id}`, empleadoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar un empleado
 * @param {number} id - ID del empleado a eliminar
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const deleteEmpleado = async (id) => {
  try {
    const response = await apiClient.delete(`/empleados/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener activos asignados a un empleado
 * @param {number} empleadoId - ID del empleado
 * @returns {Promise} Promesa con la lista de activos asignados
 */
export const getActivosEmpleado = async (empleadoId) => {
  try {
    const response = await apiClient.get(`/empleados/${empleadoId}/activos`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener actas de entrega de un empleado
 * @param {number} empleadoId - ID del empleado
 * @returns {Promise} Promesa con la lista de actas de entrega
 */
export const getActasEmpleado = async (empleadoId) => {
  try {
    const response = await apiClient.get(`/empleados/${empleadoId}/actas`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener resumen estadístico de empleados (para dashboard)
 * @returns {Promise} Promesa con estadísticas de empleados
 */
export const getResumenEmpleados = async () => {
  try {
    const response = await apiClient.get('/empleados/resumen');
    return response.data;
  } catch (error) {
    throw error;
  }
};