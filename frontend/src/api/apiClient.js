import axios from 'axios';

// Obtener la URL base de la API desde variables de entorno
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (No autorizado) y no es una solicitud de reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si la solicitud no es para login o refresh token
      if (!originalRequest.url.includes('auth/login') && !originalRequest.url.includes('auth/refresh')) {
        originalRequest._retry = true;
        
        try {
          // Intentar renovar el token
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await apiClient.post('/auth/refresh', { refreshToken });
            const { token } = response.data;
            
            // Guardar el nuevo token
            localStorage.setItem('token', token);
            
            // Actualizar el token en la solicitud original y reintentarla
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Si falla la renovación, cerrar sesión
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Redireccionar a login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // Manejar otros errores de respuesta
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Ha ocurrido un error inesperado';

    // Crear un objeto de error con detalles adicionales
    const enhancedError = new Error(errorMessage);
    enhancedError.statusCode = error.response?.status;
    enhancedError.data = error.response?.data;
    enhancedError.isAxiosError = true;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;