import React from 'react';
import { useNavigate } from 'react-router-dom';

const VetPetsList = ({ pets, loading, onSelectPet, onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterSpecies, setFilterSpecies] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');

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

  const getStatusColor = (status) => {
    const colors = {
      saludable: 'bg-green-100 text-green-800 border-green-300',
      seguimiento: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      tratamiento: 'bg-red-100 text-red-800 border-red-300',
      emergencia: 'bg-red-600 text-white border-red-700'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const filteredPets = React.useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = !searchQuery || 
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pet.breed || pet.raza || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSpecies = filterSpecies === 'all' || 
        (pet.species || pet.especie || '').toLowerCase() === filterSpecies.toLowerCase();
      
      const matchesStatus = filterStatus === 'all' || 
        (pet.status || '').toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [pets, searchQuery, filterSpecies, filterStatus]);

  const uniqueSpecies = [...new Set(pets.map(p => p.species || p.especie).filter(Boolean))];
  const uniqueStatus = [...new Set(pets.map(p => p.status).filter(Boolean))];

  if (loading) {
    return (
      <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-3xl">⏳</span>
        </div>
        <p className="text-slate-600">Cargando mascotas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o raza..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors duration-300"
            >
              Buscar
            </button>
          </form>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
            >
              <option value="all">Todas las especies</option>
              {uniqueSpecies.map(species => (
                <option key={species} value={species}>
                  {species.charAt(0).toUpperCase() + species.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
            >
              <option value="all">Todos los estados</option>
              {uniqueStatus.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">
          {filteredPets.length} {filteredPets.length === 1 ? 'mascota' : 'mascotas'} encontradas
        </h2>
        <p className="text-sm text-slate-600">
          Total asignadas: {pets.length}
        </p>
      </div>

      {/* Pets List */}
      {filteredPets.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <span className="text-5xl">🔍</span>
          <h3 className="text-xl font-semibold text-amber-900 mt-4 mb-2">
            No se encontraron mascotas
          </h3>
          <p className="text-amber-800">
            {searchQuery || filterSpecies !== 'all' || filterStatus !== 'all'
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'No tienes mascotas asignadas todavía'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Pet Header */}
              <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{getSpeciesEmoji(pet.species || pet.especie)}</span>
                    <div>
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p className="text-sm text-white/90">
                        {pet.species || pet.especie}
                      </p>
                    </div>
                  </div>
                  {pet.status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pet.status)}`}>
                      {pet.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Pet Body */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Raza:</span>
                  <span className="font-medium text-slate-900">
                    {pet.breed || pet.raza || 'Sin raza'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Peso:</span>
                  <span className="font-medium text-slate-900">
                    {pet.peso ? `${pet.peso} kg` : 'No registrado'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Dueño:</span>
                  <span className="font-medium text-slate-900">
                    {pet.owner?.name || 'N/A'}
                  </span>
                </div>

                {pet.lastVisit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Última visita:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(pet.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/pets/${pet.id}`)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors duration-200"
                    >
                      👁️ Ver detalle
                    </button>
                    {onSelectPet && (
                      <button
                        onClick={() => onSelectPet(pet)}
                        className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-sm transition-colors duration-200"
                      >
                        🩺 Consulta
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetPetsList;
