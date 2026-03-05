import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toasts } from '../../utils/toasts';

const Step1_SelectPet = ({ formData, setFormData, pets, loading, onPetSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toasts.error('Por favor ingresa un término de búsqueda');
      return;
    }

    try {
      const results = await onPetSearch(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
  };

  const handleSelectPet = (pet) => {
    setFormData({ ...formData, petId: pet.id, petName: pet.name, pet: pet });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddNewPet = () => {
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          🔍 Buscar mascota por nombre o código
        </label>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej: Luna, Max, código QR..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? '⏳' : 'Buscar'}
          </button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm font-medium text-emerald-800 mb-3">Resultados de búsqueda:</p>
          <div className="space-y-2">
            {searchResults.map((pet) => (
              <button
                key={pet.id}
                onClick={() => handleSelectPet(pet)}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-emerald-100 transition-colors duration-200 border border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getSpeciesEmoji(pet.species)}</span>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">{pet.name}</p>
                    <p className="text-sm text-slate-600">
                      {pet.species} • {pet.breed || 'Sin raza'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">{pet.owner.name}</p>
                  <p className="text-xs text-slate-500">Última visita: {pet.lastVisit || 'N/A'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">O selecciona de tus mascotas</span>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {loading && pets.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
            <p>Cargando mascotas...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🐾</span>
            </div>
            <p>No tienes mascotas asignadas</p>
            <button
              onClick={handleAddNewPet}
              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              ➕ Agregar Mascota
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pets.map((pet) => {
              const isSelected = formData.petId === pet.id;
              return (
                <button
                  key={pet.id}
                  onClick={() => handleSelectPet(pet)}
                  className={`
                    flex items-center space-x-3 p-4 rounded-xl transition-all duration-200
                    ${isSelected
                      ? 'bg-emerald-600 text-white shadow-md transform scale-105'
                      : 'bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                    }
                  `}
                >
                  <span className="text-3xl">{getSpeciesEmoji(pet.species || pet.especie)}</span>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {pet.name}
                    </p>
                    <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                      {pet.species || pet.especie} • {pet.breed || pet.raza || 'Sin raza'}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-xl">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddNewPet}
          className="text-sm text-emerald-700 hover:text-emerald-800 font-medium flex items-center space-x-1"
        >
          <span>➕</span>
          <span>Agregar nueva mascota</span>
        </button>
      </div>

      {formData.pet && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getSpeciesEmoji(formData.pet.species || formData.pet.especie)}</span>
            <div className="flex-1">
              <p className="font-semibold text-emerald-900">Mascota seleccionada: {formData.pet.name}</p>
              <p className="text-sm text-emerald-800">
                Dueño: {formData.pet.owner?.name || 'N/A'}
              </p>
            </div>
            <span className="text-xl">✓</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1_SelectPet;
