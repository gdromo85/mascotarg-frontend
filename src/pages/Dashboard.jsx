import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePets } from "../hooks/usePets";
import { useNavigate, Link } from "react-router-dom";
import { toasts } from "../utils/toasts";
import { useAuthStore } from '../store/authStore';
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";
import Loading from "../components/Loading";

function Dashboard() {
  const { user } = useAuth();
  const {logout } = useAuthStore.getState();
  const { pets, setPets, setLoading, setError, loading } = usePets();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("all");

  useEffect(() => {
    fetchPets();
  }, [user, navigate]);

  const fetchPets = async () => {
    const loadingToast = toasts.loading('Cargando tus mascotas...');
    
    try {
      if (!user) return;
      
      setLoading(true);
      
      const response = await axios.get(`${API_BASE_URL}/pets`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      setPets(response.data);
      toasts.dismissById(loadingToast);
      
      if (response.data.length === 0) {
        toasts.info('🐾 ¡Es hora de agregar tu primera mascota!');
      }
    } catch (err) {
      
      if (err.response.statusText === 'Unauthorized'){
        
        logout();
        navigate("/login");
      }
      
      toasts.dismissById(loadingToast);
      const errorMsg = err.response?.data?.message || "Error al cargar las mascotas";
      toasts.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today - birth);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffYears > 0) {
      return diffMonths > 0 ? `${diffYears} años, ${diffMonths} meses` : `${diffYears} años`;
    }
    return diffMonths > 0 ? `${diffMonths} meses` : "Menos de 1 mes";
  };

  const getSpeciesEmoji = (species) => {
    const speciesMap = {
      'perro': '🐶',
      'gato': '🐱',
      'ave': '🦅',
      'conejo': '🐰',
      'hamster': '🐹',
      'pez': '🐟',
      'reptil': '🦎',
      'otro': '🐾'
    };
    return speciesMap[species?.toLowerCase()] || '🐾';
  };

  const getHealthStatus = (pet) => {
    // Lógica simple para determinar estado de salud basado en datos disponibles
    if (pet.peso && pet.peso > 0) {
      return { status: 'healthy', text: 'Saludable', color: 'red', emoji: '🟢' };
    }
    return { status: 'unknown', text: 'Sin datos', color: 'gray', emoji: '❔' };
  };

  // Filtrar mascotas
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pet.raza && pet.raza.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecies = selectedSpecies === 'all' || 
                          pet.especie?.toLowerCase() === selectedSpecies.toLowerCase();
    return matchesSearch && matchesSpecies;
  });
  
  console.log("🚀 ~ Dashboard ~ filteredPets:", filteredPets)

  // Obtener especies únicas
  const uniqueSpecies = [...new Set(pets.map(pet => pet.especie).filter(Boolean))];

  const stats = {
    total: pets.length,
    species: uniqueSpecies.length,
    healthy: pets.filter(pet => getHealthStatus(pet).status === 'healthy').length,
    recent: pets.filter(pet => {
      const daysSinceAdded = Math.floor((new Date() - new Date(pet.createdAt || new Date())) / (1000 * 60 * 60 * 24));
      return daysSinceAdded <= 30;
    }).length
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h1 className="text-4xl font-bold font-display text-slate-900 mb-2">
                  🟠 Mis Mascotas
                </h1>
                <p className="text-slate-600 text-lg">
                  Gestiona y cuida a tus compañeros peludos
                </p>
              </div>
            
              <button
                onClick={() => navigate("/pets/new")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2 hover:shadow-md transition-all duration-300"
              >
              <span>➕</span>
              <span>Agregar Mascota</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Mascotas', value: stats.total, icon: '🐾', color: 'from-blue-500 to-cyan-500' },
            { label: 'Especies', value: stats.species, icon: '🌿', color: 'from-green-500 to-emerald-500' },
            { label: 'Saludables', value: stats.healthy, icon: '♥️', color: 'from-red-500 to-pink-500' },
            { label: 'Recientes', value: stats.recent, icon: '✨', color: 'from-purple-500 to-violet-500' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/90 rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 ring-1 ring-black/5`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        {pets.length > 0 && (
          <div className="bg-white/90 rounded-xl p-6 border border-slate-200 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🔍 Buscar mascotas
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o raza..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all duration-300"
                />
              </div>
              <div className="lg:w-64">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🌿 Filtrar por especie
                </label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 transition-all duration-300"
                >
                  <option value="all">Todas las especies</option>
                  {uniqueSpecies.map(species => (
                    <option key={species} value={species}>{species}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl text-white">🐾</span>
            </div>
            
            {pets.length === 0 ? (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  ¡Es hora de agregar tu primera mascota!
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Comienza creando el perfil de tu compañero peludo para llevar un registro completo de su salud.
                </p>
                <button
                  onClick={() => navigate("/pets/new")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center space-x-2 hover:shadow-md transition-all duration-300"
                >
                  <span>➕</span>
                  <span>Agregar primera mascota</span>
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No se encontraron mascotas
                </h3>
                <p className="text-slate-600 mb-6">
                  Intenta cambiar los filtros de búsqueda
                </p>
                <button
                  onClick={() => {
                    toasts.info('🧹 Filtros limpiados');
                    setSearchTerm("");
                    setSelectedSpecies("all");
                  }}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Limpiar filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet, index) => {
              const healthStatus = getHealthStatus(pet);
              return (
                <div 
                  key={pet.id} 
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Pet Header */}
                  <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl">{getSpeciesEmoji(pet.especie)}</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center space-x-1`}>
                          <span>{healthStatus.emoji}</span>
                          <span>{healthStatus.text}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-1 text-white">{pet.name}</h3>
                      <p className="text-sm text-white/90">{pet.especie || "Sin especie"}</p>
                    </div>
                  </div>
                  
                  {/* Pet Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                        <span className="text-sm text-slate-600">
                          <strong>Raza:</strong> {pet.raza || "No especificada"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                        <span className="text-sm text-slate-600">
                          <strong>Peso:</strong> {pet.peso ? `${pet.peso} kg` : "No registrado"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        <span className="text-sm text-slate-600">
                          <strong>Edad:</strong> {calculateAge(pet.fechaNacimiento)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/pets/${pet.id}`}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>👁️</span>
                        <span>Ver</span>
                      </Link>
                      <button
                        onClick={() => navigate(`/pets/${pet.id}/edit`)}
                        className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>✏️</span>
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {pets.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">⚡ Acciones Rápidas</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/pets/new")}
                  className="bg-white/15 hover:bg-white/25 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2 border border-white/20"
                >
                  <span>➕</span>
                  <span>Agregar otra mascota</span>
                </button>
                <button
                  onClick={() => {
                    toasts.info('📱 Funcionalidad próximamente disponible');
                    // Aquí iría la lógica para imprimir
                  }}
                  className="bg-white/15 hover:bg-white/25 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2 border border-white/20"
                >
                  <span>🖨️</span>
                  <span>Imprimir resumen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
