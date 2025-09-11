import { useMedicalRecordsStore } from "../store/medicalRecordsStore";

// Hook para manejar el historial clínico con zustand
export function useMedicalRecords() {
  const {
    records,
    loading,
    error,
    setRecords,
    addRecord,
    updateRecord,
    removeRecord,
    setLoading,
    setError
  } = useMedicalRecordsStore();

  return {
    // Estados
    records,
    loading,
    error,
    
    // Acciones
    setRecords,
    addRecord,
    updateRecord,
    removeRecord,
    setLoading,
    setError
  };
}