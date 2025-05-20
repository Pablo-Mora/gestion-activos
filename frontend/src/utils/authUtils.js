/**
 * Utilidades para manejar la autenticación en el cliente
 */

// Guardar token en localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Obtener token del localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Eliminar token (logout)
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Verificar si hay un token guardado
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Decodificar el token JWT para obtener información del usuario
export const decodeToken = (token) => {
  try {
    // JWT está formado por tres partes: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decodificar Base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

// Obtener rol del usuario
export const getUserRole = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const decodedToken = decodeToken(token);
  return decodedToken?.rol || null;
};

// Verificar si el usuario es administrador
export const isAdmin = () => {
  const role = getUserRole();
  return role === 'ADMIN';
};

// Obtener ID del usuario
export const getUserId = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const decodedToken = decodeToken(token);
  return decodedToken?.id || null;
};