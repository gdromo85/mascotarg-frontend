import { useState, useCallback } from 'react';
import { useApiClient } from './useApiClient';
import { toasts } from '../utils/toasts';
import { toISOStringGMT3 } from '../utils/dateUtils';

/**
 * Hook para manejar consultas veterinarias (Clinical Records)
 */
export const useVetConsultations = () => {
  const api = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createConsultation = useCallback(async (consultationData, vetInfo) => {
    setLoading(true);
    setError(null);

    try {
      const { petId, ...restData } = consultationData;

      const payload = {
        ...restData,
        vetName: vetInfo?.name,
        vetEmail: vetInfo?.email,
        fecha: consultationData.fecha ? toISOStringGMT3(consultationData.fecha) : new Date().toISOString()
      };

      console.log("🚀 ~ useVetConsultations ~ petId:", petId);
      console.log("🚀 ~ useVetConsultations ~ payload:", payload);

      const response = await api.post(`/clinical-records/pet/${petId}`, payload);

      toasts.success('📋 Consulta agregada exitosamente');
      return response.data;

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear la consulta';
      setError(errorMsg);
      toasts.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const updateConsultation = useCallback(async (recordId, consultationData) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...consultationData,
        fecha: consultationData.fecha ? toISOStringGMT3(consultationData.fecha) : undefined
      };

      const response = await api.put(`/clinical-records/${recordId}`, payload);
      
      toasts.success('📋 Consulta actualizada exitosamente');
      return response.data;
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar la consulta';
      setError(errorMsg);
      toasts.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/clinical-records/${consultationId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener la consulta';
      setError(errorMsg);
      toasts.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getConsultationsByPet = useCallback(async (petId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/clinical-records/pet/${petId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener las consultas de la mascota';
      setError(errorMsg);
      toasts.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getVetConsultations = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.petId) params.petId = filters.petId;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.type) params.type = filters.type;

      const response = await api.get('/vet/consultations', { params });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener las consultas';
      setError(errorMsg);
      return { consultations: [], total: 0, page: 1, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  }, [api]);

  const deleteConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/clinical-records/${consultationId}`);
      toasts.success('🗑️ Consulta eliminada exitosamente');
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar la consulta';
      setError(errorMsg);
      toasts.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return {
    loading,
    error,
    createConsultation,
    updateConsultation,
    getConsultation,
    getConsultationsByPet,
    getVetConsultations,
    deleteConsultation
  };
};

export default useVetConsultations;