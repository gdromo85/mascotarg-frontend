import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useVetStats } from "../hooks/useVetStats";
import { useVetPets } from "../hooks/useVetPets";
import { toasts } from "../utils/toasts";
import QuickAddConsultationModal from "../components/Modal/QuickAddConsultationModal";
import Modal from "../components/Modal";

function VetDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, refreshStats } = useVetStats();
  const { pets, loading: petsLoading } = useVetPets();

  
const [showQuickConsultModal, setShowQuickConsultModal] = useState(false);
const [showSearchPetModal, setShowSearchPetModal] = useState(false);
const [activeTab, setActiveTab] = useState("dashboard");
const [searchPet, setSearchPet] = useState("");

  const vetStats = [
    {
      label: "Mascotas Asignadas",
      value: stats.totalPets || 0,
      icon: "🐾",
      color: "from-blue-500 to-cyan-500",
      trend: null,
    },
    {
      label: "Consultas Hoy",
      value: stats.consultationsToday || 0,
      icon: "👩‍⚕️",
      color: "from-green-500 to-emerald-500",
      trend: null,
    },
    {
      label: "Registros Pendientes",
      value: stats.pendingRecords || 0,
      icon: "📋",
      color: "from-orange-500 to-red-500",
      trend: null,
    },
    {
      label: "Emergencias",
      value: stats.emergencies || 0,
      icon: "🆘",
      color: "from-red-500 to-pink-500",
      trend: null,
    },
  ];

  const quickActions = [
    {
      title: "Agregar Consulta",
      desc: "Registrar nueva consulta veterinaria",
      icon: "➕",
      color: "btn-primary",
    },
    {
      title: "Ver Agenda",
      desc: "Revisar citas programadas para hoy",
      icon: "📅",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Buscar Mascota",
      desc: "Buscar por nombre o código QR",
      icon: "🔍",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      title: "Emergencias",
      desc: "Atender casos de emergencia",
      icon: "🆘",
      color: "bg-red-500 hover:bg-red-600",
    },
  ];

  const recentPatients = stats.recentPatients || [];
  const upcomingAppointments = stats.upcomingAppointments || [];

  const getStatusColor = (status) => {
    const colors = {
      Saludable: "text-green-600 bg-green-100",
      saludable: "text-green-600 bg-green-100",
      Seguimiento: "text-yellow-600 bg-yellow-100",
      seguimiento: "text-yellow-600 bg-yellow-100",
      Tratamiento: "text-red-600 bg-red-100",
      tratamiento: "text-red-600 bg-red-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

const handleQuickConsultation = (data) => {
  setShowQuickConsultModal(false);
  navigate(`/add-consultation/${data.pet.id}?type=${data.type}`);
};

const handleSelectPet = (pet) => {
  setShowSearchPetModal(false);
  setSearchPet("");
  navigate(`/pets/${pet.id}`);
};

const getSpeciesEmoji = (species) => {
  const speciesMap = {
    perro: "🐶",
    gato: "🐱",
    ave: "🦅",
    conejo: "🐰",
    hamster: "🐹",
    pez: "🐟",
    reptil: "🦎",
    otro: "🐾",
  };
  return speciesMap[species?.toLowerCase()] || "🐾";
};

const filteredPets = pets.filter(
  (pet) =>
    pet.name?.toLowerCase().includes(searchPet.toLowerCase()) ||
    (pet.species || pet.especie)?.toLowerCase().includes(searchPet.toLowerCase()) ||
    (pet.breed || pet.raza)?.toLowerCase().includes(searchPet.toLowerCase()) ||
    pet.owner?.name?.toLowerCase().includes(searchPet.toLowerCase())||
    pet.owner?.documento?.toLowerCase().includes(searchPet.toLowerCase())
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-8 text-white relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center ring-1 ring-white/20">
                  <span className="text-3xl">👩‍⚕️</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold font-display">Panel Veterinario</h1>
                  <p className="text-white/90 text-lg">
                    Bienvenido, Dr. {user?.user?.name}
                  </p>
                </div>
                <button
                  onClick={refreshStats}
                  className="ml-auto p-2 bg-white/15 hover:bg-white/25 rounded-lg transition-colors"
                  title="Actualizar datos"
                >
                  🔄
                </button>
              </div>
              <p className="text-white/80 max-w-2xl">
                Gestiona tus pacientes, consultas y registros médicos de manera
                eficiente.
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {vetStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center ring-1 ring-black/5`}
                >
                  <span className="text-xl">{stat.icon}</span>
                </div>
                {stat.trend && (
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.trend.startsWith("+")
                        ? "text-green-600 bg-green-100"
                        : stat.trend.startsWith("-")
                        ? "text-red-600 bg-red-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {stat.trend !== "0" ? stat.trend : "Sin cambios"}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-slate-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Acciones Rápidas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center space-x-2 text-slate-900">
                <span>⚡</span>
                <span>Acciones Rápidas</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (action.title === "Agregar Consulta") {
                        setShowQuickConsultModal(true);
                      } else if (action.title === "Ver Agenda") {
                        toasts.info("📅 Funcionalidad próximamente disponible");
} else if (action.title === "Buscar Mascota") {
  setShowSearchPetModal(true);
}
                    }}
                    className={`${action.color} text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex items-center space-x-3`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm opacity-90">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pacientes Recientes */}
            <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 text-slate-900">
                <span>🐾</span>
                <span>Pacientes Recientes</span>
              </h2>
              <div className="space-y-3">
                {recentPatients.map((patient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200 border border-slate-100"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm ring-1 ring-slate-200">
                        <span className="text-2xl">{patient.emoji}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                        <p className="text-sm text-slate-600">
                          {patient.species} - {patient.owner}
                        </p>
                        <p className="text-xs text-slate-500">
                          Última visita: {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        patient.status
                      )}`}
                    >
                      {patient.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Citas Próximas */}
          <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 text-slate-900">
              <span>📅</span>
              <span>Citas de Hoy</span>
            </h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="border-l-4 border-emerald-600 bg-emerald-50 p-4 rounded-r-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">{appointment.pet}</h3>
                    <span className="text-sm font-medium text-emerald-700">
                      {appointment.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{appointment.owner}</p>
                  <p className="text-xs text-emerald-700 font-medium">
                    {appointment.type}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => toasts.info("📅 Funcionalidad próximamente disponible")}
              className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors duration-300"
            >
              Ver agenda completa
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white/90 rounded-xl p-2 border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-emerald-600 text-white"
                  : "bg-transparent text-slate-700 hover:bg-slate-100"
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("pets")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "pets"
                  ? "bg-emerald-600 text-white"
                  : "bg-transparent text-slate-700 hover:bg-slate-100"
              }`}
            >
              🐾 Mascotas
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "pets" && (
          <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-slate-900">
              <span>🐾</span>
              <span>Mis Mascotas Asignadas</span>
            </h2>
            {petsLoading ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-3xl">⏳</span>
                </div>
                <p className="text-slate-600">Cargando mascotas...</p>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-5xl">🐾</span>
                <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">
                  No tienes mascotas asignadas
                </h3>
                <p className="text-slate-600">
                  Aún no tienes pacientes asignados a tu cuidado.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet) => {
                  const speciesMap = {
                    perro: "🐶",
                    gato: "🐱",
                    ave: "🦅",
                    conejo: "🐰",
                    hamster: "🐹",
                    pez: "🐟",
                    reptil: "🦎",
                    otro: "🐾",
                  };
                  const emoji =
                    speciesMap[(pet.species || pet.especie)?.toLowerCase()] || "🐾";

                  return (
                    <div
                      key={pet.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => navigate(`/pets/${pet.id}`)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">{emoji}</span>
                        <div>
                          <h4 className="font-bold text-slate-900">{pet.name}</h4>
                          <p className="text-sm text-slate-600">
                            {pet.species || pet.especie} • {pet.breed || pet.raza || "Sin raza"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">
                          Dueño: {pet.owner?.name || "N/A"}
                        </span>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/add-consultation/${pet.id}`);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          🩺 Consulta
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Herramientas Veterinarias */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-1 ring-slate-200">
              <span className="text-3xl">🩺</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Herramientas Especializadas
            </h2>
            <p className="text-slate-600">
              Accede a herramientas especializadas para el cuidado veterinario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📋", title: "Historiales Médicos", desc: "Revisar y actualizar historiales" },
              { icon: "💊", title: "Recetas Digitales", desc: "Generar recetas y tratamientos" },
              { icon: "📊", title: "Reportes Médicos", desc: "Crear reportes especializados" },
            ].map((tool, index) => (
              <button
                key={index}
                onClick={() => {
                  if (tool.title === "Historiales Médicos") {
                    toasts.info("📋 Funcionalidad próximamente disponible");
                  } else if (tool.title === "Recetas Digitales") {
                    toasts.info("💊 Funcionalidad próximamente disponible");
                  } else if (tool.title === "Reportes Médicos") {
                    toasts.info("📊 Funcionalidad próximamente disponible");
                  }
                }}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-600">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>

{/* Quick Add Consultation Modal */}
  <QuickAddConsultationModal
    isOpen={showQuickConsultModal}
    onClose={() => setShowQuickConsultModal(false)}
    pets={pets}
    onCreateConsultation={handleQuickConsultation}
  />

  {/* Search Pet Modal */}
  <Modal
    isOpen={showSearchPetModal}
    onClose={() => {
      setShowSearchPetModal(false);
      setSearchPet("");
    }}
    titulo="🔍 Buscar Mascota"
  >
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchPet}
          onChange={(e) => setSearchPet(e.target.value)}
          placeholder="Buscar por nombre, especie, raza o dueño..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-all duration-300"
          autoFocus
        />
        {searchPet && (
          <button
            type="button"
            onClick={() => setSearchPet("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            ✕
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {filteredPets.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <span className="text-4xl">🔍</span>
            <p className="text-gray-600 mt-2 mb-3">
              {searchPet
                ? "No se encontraron mascotas con ese criterio"
                : "No tienes mascotas asignadas"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredPets.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => handleSelectPet(pet)}
                className="flex items-center space-x-4 p-4 bg-white border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200 text-left"
              >
                <span className="text-3xl">{getSpeciesEmoji(pet.species || pet.especie)}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{pet.name}</h4>
                  <p className="text-sm text-slate-600">
                    {pet.species || pet.especie} • {pet.breed || pet.raza || "Sin raza"}
                  </p>
                  <p className="text-sm text-slate-500">👤 {pet.owner?.name || "N/A"}</p>
                </div>
                <span className="text-emerald-600 text-xl">→</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
        💡 Selecciona una mascota para ver su perfil completo
      </div>
    </div>
  </Modal>
      </div>
    </div>
  );
}

export default VetDashboard;
