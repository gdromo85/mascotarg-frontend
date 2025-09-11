import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePetsStore = create(
  persist(
    (set) => ({
      pets: [],
      selectedPet: null,
      loading: false,
      error: null,
      
      // Acciones para mascotas
      setPets: (pets) => set({ pets }),
      addPet: (pet) => set((state) => ({ 
        pets: [...state.pets, pet] 
      })),
      updatePet: (updatedPet) => set((state) => ({
        pets: state.pets.map(pet => 
          pet.id === updatedPet.id ? updatedPet : pet
        )
      })),
      removePet: (petId) => set((state) => ({
        pets: state.pets.filter(pet => pet.id !== petId)
      })),
      setSelectedPet: (pet) => set({ selectedPet: pet }),
      
      // Acciones para historial clínico
      addMedicalRecord: (petId, record) => set((state) => ({
        pets: state.pets.map(pet => {
          if (pet.id === petId) {
            return {
              ...pet,
              medicalRecords: [...(pet.medicalRecords || []), record]
            };
          }
          return pet;
        })
      })),
      
      updateMedicalRecord: (petId, updatedRecord) => set((state) => ({
        pets: state.pets.map(pet => {
          if (pet.id === petId) {
            return {
              ...pet,
              medicalRecords: pet.medicalRecords?.map(record => 
                record.id === updatedRecord.id ? updatedRecord : record
              ) || []
            };
          }
          return pet;
        })
      })),
      
      removeMedicalRecord: (petId, recordId) => set((state) => ({
        pets: state.pets.map(pet => {
          if (pet.id === petId) {
            return {
              ...pet,
              medicalRecords: pet.medicalRecords?.filter(record => 
                record.id !== recordId
              ) || []
            };
          }
          return pet;
        })
      })),
      
      // Estado de carga y errores
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'pets-storage'
    }
  )
);