import apiClient from './apiClient';

/**
 * Iniciar sesión de usuario
 * @param {Object} credentials - Credenciales del usuario (username, password)
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener información del usuario autenticado
 * @returns {Promise} Promesa con los datos del usuario
 */
export const getUserInfo = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cerrar sesión del usuario
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    // En caso de error, manejamos silenciosamente para asegurar que se pueda cerrar sesión siempre
    console.error('Error al cerrar sesión:', error);
  }
};

/**
 * Obtener lista de usuarios (solo para administradores)
 * @returns {Promise} Promesa con la lista de usuarios
 */
export const getUsuarios = async () => {
  try {
    const response = await apiClient.get('/usuarios');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo usuario (solo para administradores)
 * @param {Object} userData - Datos del nuevo usuario
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const createUsuario = async (userData) => {
  try {
    const response = await apiClient.post('/usuarios', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un usuario existente (solo para administradores)
 * @param {number} id - ID del usuario a actualizar
 * @param {Object} userData - Nuevos datos del usuario
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const updateUsuario = async (id, userData) => {
  try {
    const response = await apiClient.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar un usuario (solo para administradores)
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const deleteUsuario = async (id) => {
  try {
    const response = await apiClient.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cambiar contraseña del usuario autenticado
 * @param {Object} passwordData - Datos para cambio de contraseña
 * @returns {Promise} Promesa con la respuesta del servidor
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};