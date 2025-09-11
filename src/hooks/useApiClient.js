import { useCallback } from 'react';
import { apiClient } from '../services/apiConfig';
import { toasts } from '../utils/toasts';

/**
 * Hook personalizado para realizar peticiones HTTP con renovación automática de token
 * 
 * @returns {Object} Objeto con métodos para realizar peticiones HTTP
 */
export const useApiClient = () => {
  
  // Método GET
  const get = useCallback(async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response;
    } catch (error) {
      console.error(`Error en GET ${url}:`, error);
      throw error;
    }
  }, []);

  // Método POST
  const post = useCallback(async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response;
    } catch (error) {
      console.error(`Error en POST ${url}:`, error);
      throw error;
    }
  }, []);

  // Método PUT
  const put = useCallback(async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response;
    } catch (error) {
      console.error(`Error en PUT ${url}:`, error);
      throw error;
    }
  }, []);

  // Método DELETE
  const del = useCallback(async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response;
    } catch (error) {
      console.error(`Error en DELETE ${url}:`, error);
      throw error;
    }
  }, []);

  // Método PATCH
  const patch = useCallback(async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(url, data, config);
      return response;
    } catch (error) {
      console.error(`Error en PATCH ${url}:`, error);
      throw error;
    }
  }, []);

  return {
    get,
    post,
    put,
    delete: del,
    patch,
    // Acceso directo al cliente para casos especiales
    client: apiClient
  };
};

/**
 * Hook para realizar peticiones con manejo automático de loading y errores
 * 
 * @param {Function} apiCall - Función que realiza la llamada a la API
 * @param {Object} options - Opciones de configuración
 * @returns {Object} Estado y función para ejecutar la petición
 */
export const useApiRequest = (apiCall, options = {}) => {
  const {
    showLoadingToast = false,
    loadingMessage = 'Cargando...',
    successMessage = null,
    errorMessage = null,
    onSuccess = () => {},
    onError = () => {}
  } = options;

  const execute = useCallback(async (...args) => {
    let loadingToast = null;
    
    try {
      if (showLoadingToast) {
        loadingToast = toasts.loading(loadingMessage);
      }

      const response = await apiCall(...args);

      if (loadingToast) {
        toasts.dismissById(loadingToast);
      }

      if (successMessage) {
        toasts.success(successMessage);
      }

      onSuccess(response);
      return response;

    } catch (error) {
      if (loadingToast) {
        toasts.dismissById(loadingToast);
      }

      const message = errorMessage || 
                     error.response?.data?.message || 
                     'Ha ocurrido un error inesperado';
      
      toasts.error(message);
      onError(error);
      throw error;
    }
  }, [apiCall, showLoadingToast, loadingMessage, successMessage, errorMessage, onSuccess, onError]);

  return { execute };
};

export default useApiClient;