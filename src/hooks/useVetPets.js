import { useState, useEffect, useCallback } from 'react';
import { useApiClient } from './useApiClient';
import { toasts } from '../utils/toasts';

/**
 * Hook para obtener y gestionar las mascotas asignadas al veterinario
 */
export const useVetPets = () => {
  const api = useApiClient();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    species: 'all'
  });

  const fetchVetPets = useCallback(async (searchQuery = '', speciesFilter = 'all', statusFilter = 'all') => {
    if (hasFailed) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (speciesFilter !== 'all') {
        params.species = speciesFilter;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await api.get('/pets/get-veterinario', { params });
      console.log("🚀 ~ useVetPets ~ response:", response)
      setPets(response.data.pets || response.data || []);
      setTotal(response.data.total || response.data?.length || 0);
      setIsInitialLoad(false);
    } catch (err) {
      const errorMsg = err.code === 'ECONNABORTED'
        ? 'Timeout: El servidor no responde'
        : err.response?.data?.message || 'Error al cargar las mascotas';
      setError(errorMsg);
      setHasFailed(true);
      setIsInitialLoad(false);
      setPets([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [api, hasFailed]);

  const searchPets = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/pets/search?q=${encodeURIComponent(query)}`);
      return response.data.results || [];
    } catch (err) {
      const errorMsg = err.code === 'ECONNABORTED'
        ? 'Timeout: Búsqueda demasiado lenta'
        : err.response?.data?.message || 'Error al buscar mascotas';
      setError(errorMsg);
      toasts.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getPetById = useCallback(async (petId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/pets/${petId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener la mascota';
      setError(errorMsg);
      toasts.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const resetFetch = useCallback(() => {
    setHasFailed(false);
    setIsInitialLoad(true);
  }, []);

  useEffect(() => {
    if (!isInitialLoad || hasFailed) {
      return;
    }
    fetchVetPets(filters.search, filters.species, filters.status);
  }, [fetchVetPets, filters.search, filters.species, filters.status, isInitialLoad, hasFailed]);

  return {
    pets,
    loading,
    error,
    total,
    filters,
    setFilters,
    fetchVetPets,
    searchPets,
    getPetById,
    hasFailed,
    resetFetch
  };
};
      

export default useVetPets;
