import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApiClient } from '../hooks/useApiClient';
import { formatDateForDisplay } from '../utils/dateUtils';
import { toasts } from '../utils/toasts';
import Loading from '../components/Loading';

const ClinicalRecordDetail = () => {
  const { petId, recordId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const api = useApiClient();

  const [record, setRecord] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRecordDetails();
  }, [petId, recordId, user, navigate]);

  const fetchRecordDetails = async () => {
    const loadingToast = toasts.loading('Cargando detalles del registro clínico...');
    
    try {
      setLoading(true);

      // Obtener detalles de la mascota
      const petResponse = await api.get(`/pets/${petId}`);
      setPet(petResponse.data);

      // Obtener todos los registros clínicos de la mascota
      const recordsResponse = await api.get(`/clinical-records/pet/${petId}`);
      const clinicalRecord = recordsResponse.data.find(r => r.id === parseInt(recordId));
      
      if (!clinicalRecord) {
        throw new Error('Registro clínico no encontrado');
      }
      
      setRecord(clinicalRecord);
      toasts.dismissById(loadingToast);
    } catch (error) {
      toasts.dismissById(loadingToast);
      const errorMsg = error.response?.data?.message || error.message || 'Error al cargar el registro clínico';
      toasts.error(errorMsg);
      
      // Redirigir al detalle de la mascota si hay error
      setTimeout(() => {
        navigate(`/pets/${petId}`);
      }, 2000);
    } finally {
      setLoading(false);
    }
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

  const getTypeIcon = (type) => {
    const typeMap = {
      consulta: "🩺",
      control: "📋",
      vacunación: "💉",
      cirugía: "🏥",
      emergencia: "🚨",
      otro: "📝"
    };
    return typeMap[type?.toLowerCase()] || "📝";
  };

  if (loading) {
    return (
      <Loading
        message="Cargando registro clínico..."
        variant="paw"
      />
    );
  }

  if (!record || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registro no encontrado
          </h2>
          <p className="text-red-600 mb-4">El registro clínico que buscas no existe</p>
          <button
            onClick={() => navigate(`/pets/${petId}`)}
            className="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
          >
            🔙 Volver al perfil de la mascota
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navegación */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/pets/${petId}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="text-xl">🔙</span>
            <span className="font-medium">Volver al perfil de {pet.name}</span>
          </button>
        </div>

        {/* Header del registro */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-2xl">{getTypeIcon(record.type)}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Registro Clínico</h1>
                <p className="text-green-100 text-sm">
                  {pet.name} {getSpeciesEmoji(pet.especie)} • {formatDateForDisplay(record.fecha)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <span className="text-sm font-medium">{record.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>📋</span>
                <span>Información del Registro</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-700 mb-1">Fecha</h3>
                  <p className="text-blue-600">{formatDateForDisplay(record.fecha)}</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-700 mb-1">Tipo de Consulta</h3>
                  <p className="text-green-600">{record.type}</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 md:col-span-2">
                  <h3 className="font-semibold text-purple-700 mb-1">Veterinario</h3>
                  <p className="text-purple-600 font-medium">{record.vetName}</p>
                  {record.vetEmail && (
                    <p className="text-purple-500 text-sm">{record.vetEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>📝</span>
                <span>Descripción</span>
              </h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {record.description || 'Sin descripción registrada'}
                </p>
              </div>
            </div>

            {/* Diagnóstico */}
            {record.diagnostico && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span>🔍</span>
                  <span>Diagnóstico</span>
                </h2>
                <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {record.diagnostico}
                  </p>
                </div>
              </div>
            )}

            {/* Tratamiento */}
            {record.tratamiento && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span>💊</span>
                  <span>Tratamiento</span>
                </h2>
                <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {record.tratamiento}
                  </p>
                </div>
              </div>
            )}

            {/* Observaciones */}
            {record.observaciones && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span>📄</span>
                  <span>Observaciones</span>
                </h2>
                <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {record.observaciones}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Información de la mascota */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>{getSpeciesEmoji(pet.especie)}</span>
                <span>Mascota</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-semibold text-gray-800">{pet.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Especie:</span>
                  <span className="font-semibold text-gray-800">{pet.especie}</span>
                </div>
                {pet.raza && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Raza:</span>
                    <span className="font-semibold text-gray-800">{pet.raza}</span>
                  </div>
                )}
                {pet.peso && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Peso:</span>
                    <span className="font-semibold text-gray-800">{pet.peso} kg</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => navigate(`/pets/${petId}`)}
                className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300"
              >
                Ver perfil completo
              </button>
            </div>

            {/* Metadatos */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>ℹ️</span>
                <span>Información del registro</span>
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Creado:</span>
                  <p className="font-medium text-gray-800">{formatDateForDisplay(record.createdAt)}</p>
                </div>
                {record.updatedAt !== record.createdAt && (
                  <div>
                    <span className="text-gray-600">Actualizado:</span>
                    <p className="font-medium text-gray-800">{formatDateForDisplay(record.updatedAt)}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">ID del registro:</span>
                  <p className="font-mono text-xs text-gray-500">{record.id}</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>⚡</span>
                <span>Acciones</span>
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/pets/${petId}`)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>🏠</span>
                  <span>Volver al perfil</span>
                </button>
                
                <button
                  onClick={() => toasts.info('📄 Funcionalidad próximamente disponible')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>📄</span>
                  <span>Imprimir registro</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalRecordDetail;