import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { toasts } from '../utils/toasts';


export const API_BASE_URL = "http://localhost:3001/api";

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
});

// Variable para evitar múltiples intentos de renovación simultáneos
let isRefreshing = false;
let failedQueue = [];

// Función para procesar la cola de peticiones fallidas
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Función para renovar el token
const renewToken = async (currentToken) => {
  
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
    headers: {
      Authorization: `Bearer ${currentToken}`
    }
  });
  
  return response.data;
};

// Interceptor de peticiones - agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - manejar errores 401 y renovar token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 y no hemos intentado renovar el token para esta petición
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Marcar que ya intentamos renovar para esta petición
      originalRequest._retry = true;
      
      const { user, login, logout } = useAuthStore.getState();
      
      // Si no hay usuario o token, redirigir al login
      if (!user?.token) {
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      // Si ya estamos renovando el token, agregar esta petición a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      // Marcar que estamos renovando el token
      isRefreshing = true;
      
      try {
        // Mostrar toast de renovación
        const renewingToast = toasts.loading('🔄 Renovando sesión...');
        console.log("🚀 ~ renewToken1")
        // Intentar renovar el token
        const renewResponse = await renewToken(user.token);
        console.log("🚀 ~ renewToken2")
        
        // Actualizar el store con los nuevos datos
        const newUserData = {
          token: renewResponse.token || renewResponse.accessToken,
          user: renewResponse.user || user.user
        };
        
        login(newUserData);
        
        // Actualizar el header de la petición original
        originalRequest.headers.Authorization = `Bearer ${newUserData.token}`;
        
        // Procesar la cola de peticiones pendientes
        processQueue(null, newUserData.token);
        
        // Ocultar toast de renovación y mostrar éxito
        toasts.dismissById(renewingToast);
        toasts.success('✅ Sesión renovada exitosamente');
        
        // Reintentar la petición original
        return apiClient(originalRequest);
        
      } catch (renewError) {
        console.error('Error al renovar token:', renewError);
        
        // Procesar la cola con error
        processQueue(renewError, null);
        
        // Si la renovación falla, hacer logout y redirigir al login
        logout();
        
        // Mostrar mensaje de error
        toasts.error('🔒 Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        
        return Promise.reject(renewError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Para otros errores, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

export default apiClient;