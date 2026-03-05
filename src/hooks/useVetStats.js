import { useState, useEffect, useCallback } from 'react';
import { useApiClient } from './useApiClient';
import { toasts } from '../utils/toasts';

/**
 * Hook para obtener estadísticas del dashboard veterinario
 */
export const useVetStats = () => {
  const api = useApiClient();
  const [stats, setStats] = useState({
    totalPets: 0,
    consultationsToday: 0,
    pendingRecords: 0,
    emergencies: 0,
    recentPatients: [],
    upcomingAppointments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchVetStats = useCallback(async () => {
    if (hasFailed) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/vet/stats');
      setStats(response.data || {
        totalPets: 0,
        consultationsToday: 0,
        pendingRecords: 0,
        emergencies: 0,
        recentPatients: [],
        upcomingAppointments: []
      });
      setIsInitialLoad(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cargar las estadísticas';
      setError(errorMsg);
      setHasFailed(true);
      setIsInitialLoad(false);
      console.error('Error fetching vet stats:', err);
      toasts.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [api, hasFailed]);

  useEffect(() => {
    if (!isInitialLoad || hasFailed) {
      return;
    }
    fetchVetStats();
  }, [fetchVetStats, isInitialLoad, hasFailed]);

  const refreshStats = useCallback(() => {
    setIsInitialLoad(true);
    setHasFailed(false);
    fetchVetStats();
  }, [fetchVetStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    hasFailed
  };
};

export default useVetStats;
