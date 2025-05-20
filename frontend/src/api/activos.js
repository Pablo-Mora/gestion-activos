import apiClient from './apiClient';

/**
 * Get all hardware assets
 * @returns {Promise<Array>} - List of hardware assets
 */
export const getAllActivosHardware = async () => {
  try {
    const response = await apiClient.get('/activos/hardware');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener activos hardware');
  }
};

/**
 * Get all software licenses
 * @returns {Promise<Array>} - List of software licenses
 */
export const getAllLicenciasSoftware = async () => {
  try {
    const response = await apiClient.get('/activos/software');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener licencias software');
  }
};

/**
 * Get all web access
 * @returns {Promise<Array>} - List of web access
 */
export const getAllAccesosWeb = async () => {
  try {
    const response = await apiClient.get('/activos/accesos');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener accesos web');
  }
};

/**
 * Get asset by ID and type
 * @param {string} type - Asset type (hardware, software, acceso)
 * @param {number} id - Asset ID
 * @returns {Promise<Object>} - Asset data
 */
export const getActivoById = async (type, id) => {
  try {
    const response = await apiClient.get(`/activos/${type}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener activo');
  }
};

/**
 * Create new hardware asset
 * @param {Object} activoData - Asset data
 * @returns {Promise<Object>} - Created asset
 */
export const createActivoHardware = async (activoData) => {
  try {
    const response = await apiClient.post('/activos/hardware', activoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear activo hardware');
  }
};

/**
 * Create new software license
 * @param {Object} licenciaData - License data
 * @returns {Promise<Object>} - Created license
 */
export const createLicenciaSoftware = async (licenciaData) => {
  try {
    const response = await apiClient.post('/activos/software', licenciaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear licencia software');
  }
};

/**
 * Create new web access
 * @param {Object} accesoData - Access data
 * @returns {Promise<Object>} - Created access
 */
export const createAccesoWeb = async (accesoData) => {
  try {
    const response = await apiClient.post('/activos/accesos', accesoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear acceso web');
  }
};

/**
 * Update hardware asset
 * @param {number} id - Asset ID
 * @param {Object} activoData - Asset data to update
 * @returns {Promise<Object>} - Updated asset
 */
export const updateActivoHardware = async (id, activoData) => {
  try {
    const response = await apiClient.put(`/activos/hardware/${id}`, activoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar activo hardware');
  }
};

/**
 * Update software license
 * @param {number} id - License ID
 * @param {Object} licenciaData - License data to update
 * @returns {Promise<Object>} - Updated license
 */
export const updateLicenciaSoftware = async (id, licenciaData) => {
  try {
    const response = await apiClient.put(`/activos/software/${id}`, licenciaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar licencia software');
  }
};

/**
 * Update web access
 * @param {number} id - Access ID
 * @param {Object} accesoData - Access data to update
 * @returns {Promise<Object>} - Updated access
 */
export const updateAccesoWeb = async (id, accesoData) => {
  try {
    const response = await apiClient.put(`/activos/accesos/${id}`, accesoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar acceso web');
  }
};

/**
 * Delete asset by type and ID
 * @param {string} type - Asset type (hardware, software, acceso)
 * @param {number} id - Asset ID
 * @returns {Promise<void>}
 */
export const deleteActivo = async (type, id) => {
  try {
    await apiClient.delete(`/activos/${type}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar activo');
  }
};

/**
 * Assign asset to employee
 * @param {string} type - Asset type (hardware, software, acceso)
 * @param {number} activoId - Asset ID
 * @param {number} empleadoId - Employee ID
 * @returns {Promise<Object>} - Assignment result
 */
export const asignarActivo = async (type, activoId, empleadoId) => {
  try {
    const response = await apiClient.post(`/activos/${type}/${activoId}/asignar/${empleadoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al asignar activo');
  }
};