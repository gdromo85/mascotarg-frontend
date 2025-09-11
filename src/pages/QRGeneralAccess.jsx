import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import { toasts } from "../utils/toasts";
import { formatDateForDisplay } from "../utils/dateUtils";
import Loading from "../components/Loading";

function QRGeneralAccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const api = useApiClient();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('Token no encontrado en la URL');
      setLoading(false);
      return;
    }

    fetchPetInfo();
  }, [token]);

  const fetchPetInfo = async () => {
    const loadingToast = toasts.loading("Cargando información de la mascota...");

    try {
      setLoading(true);
      const response = await api.get(`/qr/accesogral/${token}`);
      setPet(response.data.pet);
      toasts.dismissById(loadingToast);
    } catch (error) {
      toasts.dismissById(loadingToast);
      const errorMsg = error.response?.data?.message || "Error al cargar la información de la mascota";
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
    const diffMonths = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );

    if (diffYears > 0) {
      return diffMonths > 0
        ? `${diffYears} años, ${diffMonths} meses`
        : `${diffYears} años`;
    }
    return diffMonths > 0 ? `${diffMonths} meses` : "Menos de 1 mes";
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

  const getGenderEmoji = (gender) => {
    const genderMap = {
      macho: "♂️",
      hembra: "♀️",
      desconocido: "❓"
    };
    return genderMap[gender?.toLowerCase()] || "❓";
  };

  const getGenderLabel = (gender) => {
    const labelMap = {
      macho: "Macho",
      hembra: "Hembra", 
      desconocido: "Desconocido"
    };
    return labelMap[gender?.toLowerCase()] || "No especificado";
  };

  const handleFoundPet = () => {
    toasts.info("🔍 Funcionalidad próximamente disponible");
  };

  const handleTakePhoto = () => {
    toasts.info("📸 Funcionalidad próximamente disponible");
  };

  if (loading) {
    return (
      <Loading
        message="Cargando información de la mascota..."
        variant="paw"
      />
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error de acceso
          </h2>
          <p className="text-red-600 mb-4">
            {error || "No se pudo cargar la información de la mascota"}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">{getSpeciesEmoji(pet.especie)}</span>
          </div>
          <h1 className="text-4xl font-bold font-display text-gray-800 mb-2">
            📱 Acceso QR General
          </h1>
          <p className="text-gray-600 text-lg">
            Información de la mascota
          </p>
        </div>

        {/* Información de la mascota */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">{getSpeciesEmoji(pet.especie)}</span>
            </div>
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-2">
              {pet.name}
            </h2>
            <div className="flex justify-center items-center space-x-4 text-gray-600">
              <span className="bg-primary-100 px-3 py-1 rounded-full text-sm font-medium">
                {pet.especie || "Sin especie"}
              </span>
              <span className="text-sm">
                🎂 {calculateAge(pet.fechaNacimiento)}
              </span>
            </div>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { icon: "🏷️", label: "Nombre", value: pet.name },
                {
                  icon: "🌿",
                  label: "Especie",
                  value: pet.especie || "No especificada",
                },
                {
                  icon: "🐕",
                  label: "Raza",
                  value: pet.raza || "No especificada",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-primary-50 rounded-xl"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: getGenderEmoji(pet.genero),
                  label: "Género",
                  value: getGenderLabel(pet.genero),
                },
                {
                  icon: "⚖️",
                  label: "Peso",
                  value: pet.peso ? `${pet.peso} kg` : "No registrado",
                },
                {
                  icon: "📅",
                  label: "Fecha de Nacimiento",
                  value: pet.fechaNacimiento
                    ? formatDateForDisplay(pet.fechaNacimiento)
                    : "No especificada",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-xl"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          {pet.observaciones && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <span>📝</span>
                <span>Observaciones</span>
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {pet.observaciones}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center space-x-2">
            <span>⚡</span>
            <span>¿Qué quieres hacer?</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleFoundPet}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-3 transform hover:-translate-y-1"
            >
              <span className="text-2xl">🔍</span>
              <span>Encontré esta mascota</span>
            </button>
            
            <button
              onClick={handleTakePhoto}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-3 transform hover:-translate-y-1"
            >
              <span className="text-2xl">📸</span>
              <span>Tomar foto</span>
            </button>
          </div>
        </div>

        {/* Footer informativo */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
            <p className="text-gray-600 text-sm">
              💡 Esta página te permite ver la información de una mascota mediante código QR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRGeneralAccess;