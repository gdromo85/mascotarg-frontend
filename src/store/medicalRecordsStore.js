import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMedicalRecordsStore = create(
  persist(
    (set) => ({
      records: {},
      loading: false,
      error: null,
      
      // Acciones para historial clínico
      setRecords: (petId, petRecords) => set((state) => ({
        records: {
          ...state.records,
          [petId]: petRecords
        }
      })),
      
      addRecord: (petId, record) => set((state) => ({
        records: {
          ...state.records,
          [petId]: [...(state.records[petId] || []), record]
        }
      })),
      
      updateRecord: (petId, updatedRecord) => set((state) => ({
        records: {
          ...state.records,
          [petId]: state.records[petId]?.map(record => 
            record.id === updatedRecord.id ? updatedRecord : record
          ) || []
        }
      })),
      
      removeRecord: (petId, recordId) => set((state) => ({
        records: {
          ...state.records,
          [petId]: state.records[petId]?.filter(record => 
            record.id !== recordId
          ) || []
        }
      })),
      
      // Estado de carga y errores
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'medical-records-storage'
    }
  )
);
