import apiClient from './apiClient';

// Obtener todas las actas
export const getActas = async () => {
  try {
    const response = await apiClient.get('/api/actas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener actas:', error);
    throw error;
  }
};

// Obtener actas por ID de empleado
export const getActasByEmpleado = async (empleadoId) => {
  try {
    const response = await apiClient.get(`/api/actas/empleado/${empleadoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener actas del empleado ${empleadoId}:`, error);
    throw error;
  }
};

// Obtener actas por ID de usuario
export const getActasUsuario = async (userId) => {
  try {
    const response = await apiClient.get(`/api/actas/usuario/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener actas del usuario ${userId}:`, error);
    throw error;
  }
};

// Obtener un acta específica por ID
export const getActa = async (id) => {
  try {
    const response = await apiClient.get(`/api/actas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener acta con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva acta
export const createActa = async (actaData) => {
  try {
    const response = await apiClient.post('/api/actas', actaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear acta:', error);
    throw error;
  }
};

// Actualizar una acta existente
export const updateActa = async (id, actaData) => {
  try {
    const response = await apiClient.put(`/api/actas/${id}`, actaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar acta con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una acta
export const deleteActa = async (id) => {
  try {
    const response = await apiClient.delete(`/api/actas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar acta con ID ${id}:`, error);
    throw error;
  }
};

// Aprobar una acta
export const aprobarActa = async (id) => {
  try {
    const response = await apiClient.post(`/api/actas/${id}/aprobar`);
    return response.data;
  } catch (error) {
    console.error(`Error al aprobar acta con ID ${id}:`, error);
    throw error;
  }
};

// Rechazar una acta
export const rechazarActa = async (id, data) => {
  try {
    const response = await apiClient.post(`/api/actas/${id}/rechazar`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al rechazar acta con ID ${id}:`, error);
    throw error;
  }
};

// Generar PDF de acta
export const generateActaPdf = async (id) => {
  try {
    const response = await apiClient.get(`/api/actas/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error al generar PDF para acta con ID ${id}:`, error);
    throw error;
  }
};

// Obtener estadísticas de actas
export const getActasStats = async () => {
  try {
    const response = await apiClient.get('/api/actas/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de actas:', error);
    throw error;
  }
};