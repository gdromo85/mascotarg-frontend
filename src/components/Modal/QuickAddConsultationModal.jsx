import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal';

const QuickAddConsultationModal = ({ isOpen, onClose, pets, onCreateConsultation }) => {
  
  const [selectedPetId, setSelectedPetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPet, setSearchPet] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase().includes(searchPet.toLowerCase()) ||
    pet.especie?.toLowerCase().includes(searchPet.toLowerCase()) ||
    pet.raza?.toLowerCase().includes(searchPet.toLowerCase()) ||
    pet.owner?.name?.toLowerCase().includes(searchPet.toLowerCase()) ||
    pet.owner?.documento?.toLowerCase().includes(searchPet.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPetId) {
      return;
    }

    setLoading(true);

    try {
      const pet = pets.find(p => p.id === parseInt(selectedPetId));

      if (onCreateConsultation) {
        await onCreateConsultation({ pet, type: 'consulta' });
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewPet = () => {
    onClose();
    navigate('/add-pet?from=consultation');
  };

  const getSpeciesEmoji = (species) => {
    const speciesMap = {
      perro: '🐶',
      gato: '🐱',
      ave: '🦅',
      conejo: '🐰',
      hamster: '🐹',
      pez: '🐟',
      reptil: '🦎',
      otro: '🐾'
    };
    return speciesMap[species?.toLowerCase()] || '🐾';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo="🩺 Consulta Rápida"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-700">
              🐾 Seleccionar Mascota
            </label>
            <button
              type="button"
              onClick={handleAddNewPet}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <span>➕</span>
              <span>Agregar nueva</span>
            </button>
          </div>
          
          <div className="mb-3">
            <input
              type="text"
              value={searchPet}
              onChange={(e) => setSearchPet(e.target.value)}
              placeholder="Buscar por nombre, especie, raza o dueño..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-all duration-300"
            />
            {searchPet && (
              <button
                type="button"
                onClick={() => setSearchPet('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {filteredPets.length === 0 ? (
              <div className="col-span-2 text-center py-6 bg-gray-50 rounded-lg">
                <span className="text-3xl">🔍</span>
                <p className="text-gray-600 mt-2 mb-3">
                  {searchPet ? "No se encontraron mascotas" : "No tienes mascotas asignadas"}
                </p>
                <button
                  type="button"
                  onClick={handleAddNewPet}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  {searchPet ? "➕ Agregar Mascota" : "➕ Agregar Primera Mascota"}
                </button>
              </div>
            ) : (
              filteredPets.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setSelectedPetId(pet.id.toString())}
                  className={`
                    flex flex-col items-start space-y-1 p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${selectedPetId === pet.id.toString()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getSpeciesEmoji(pet.species || pet.especie)}</span>
                    <span className="font-medium text-sm">{pet.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {pet.especie || pet.species} • {pet.raza || 'Sin raza'}
                  </div>
                  <div className="text-xs text-gray-400">
                    👤 {pet.owner?.name || 'N/A'}
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {pet.source === 'registered' ? 'Registrada' : 'Consulta'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!selectedPetId || loading}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Procesando...
              </span>
            ) : (
              '➡️ Continuar'
            )}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          💡 Esta acción te llevará al formulario completo para agregar todos los detalles de la consulta.
        </div>
      </form>
    </Modal>
  );
};

export default QuickAddConsultationModal;
