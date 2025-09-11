import { usePetsStore } from "../store/petsStore";

// Hook para manejar las mascotas con zustand
export function usePets() {
  const {
    pets,
    selectedPet,
    loading,
    error,
    setPets,
    addPet,
    updatePet,
    removePet,
    setSelectedPet,
    addMedicalRecord,
    updateMedicalRecord,
    removeMedicalRecord,
    setLoading,
    setError
  } = usePetsStore();

  return {
    // Estados
    pets,
    selectedPet,
    loading,
    error,
    
    // Acciones de mascotas
    setPets,
    addPet,
    updatePet,
    removePet,
    setSelectedPet,
    
    // Acciones de historial clínico
    addMedicalRecord,
    updateMedicalRecord,
    removeMedicalRecord,
    
    // Acciones de estado
    setLoading,
    setError
  };
}