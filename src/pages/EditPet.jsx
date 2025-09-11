import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApiClient } from "../hooks/useApiClient";
import { usePets } from "../hooks/usePets";
import { toasts } from "../utils/toasts";
import Loading from "../components/Loading";
import { toInputDateGMT3, getMaxDateForInput } from "../utils/dateUtils";

function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const api = useApiClient(); // Usar el cliente API con renovación automática
  const { updatePet, setError } = usePets();
  
  const [formData, setFormData] = useState({
    name: "",
    especie: "",
    raza: "",
    genero: "",
    peso: "",
    fechaNacimiento: "",
    observaciones: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [petName, setPetName] = useState("");

  const especies = [
    { value: "Perro", emoji: "🐶" },
    { value: "Gato", emoji: "🐱" },
    { value: "Ave", emoji: "🦅" },
    { value: "Conejo", emoji: "🐰" },
    { value: "Hamster", emoji: "🐹" },
    { value: "Pez", emoji: "🐟" },
    { value: "Reptil", emoji: "🦎" },
    { value: "Otro", emoji: "🐾" }
  ];

  const generos = [
    { value: "macho", emoji: "♂️", label: "Macho" },
    { value: "hembra", emoji: "♀️", label: "Hembra" },
    { value: "desconocido", emoji: "❓", label: "Desconocido" }
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchPetDetails();
  }, [id, user, navigate]);

  const fetchPetDetails = async () => {
    const loadingToast = toasts.loading('Cargando datos de la mascota...');
    
    try {
      setLoading(true);
      
      const response = await api.get(`/pets/${id}`);

      const pet = response.data;
      setPetName(pet.name);
      setFormData({
        name: pet.name,
        especie: pet.especie || "",
        raza: pet.raza || "",
        genero: pet.genero || "",
        peso: pet.peso || "",
        fechaNacimiento: pet.fechaNacimiento ? 
          toInputDateGMT3(pet.fechaNacimiento) : "", // Usar utilidad GMT -3
        observaciones: pet.observaciones || ""
      });
      
      toasts.dismissById(loadingToast);
    } catch (error) {
      toasts.dismissById(loadingToast);
      const errorMsg = error.response?.data?.message || "Error al cargar los datos de la mascota";
      toasts.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones con toasts
    if (!isValidName(formData.name)) {
      toasts.form.requiredFields();
      return;
    }
    
    if (formData.peso && !isValidWeight(formData.peso)) {
      toasts.error("El peso debe estar entre 0.1 y 200 kg");
      return;
    }
    
    setSaving(true);
    
    // Toast de carga
    const loadingToast = toasts.loading(`Actualizando a ${formData.name}...`);

    try {
      const petData = {
        ...formData,
        peso: formData.peso ? parseFloat(formData.peso) : null
      };

      const response = await api.put(`/pets/${id}`, petData);

      // Actualizar la mascota en el store
      updatePet(response.data);
      
      // Reemplazar toast de carga con éxito
      toasts.dismissById(loadingToast);
      toasts.pet.updated(formData.name);

      setTimeout(() => {
        navigate(`/pets/${id}`);
      }, 1500);
    } catch (error) {
      toasts.dismissById(loadingToast);
      const errorMsg = error.response?.data?.message || "Error al actualizar la mascota. Por favor, intenta de nuevo.";
      toasts.error(errorMsg);
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const isValidName = (name) => name.trim().length >= 2;
  const isValidWeight = (peso) => !peso || (parseFloat(peso) > 0 && parseFloat(peso) <= 200);
  const isFormValid = isValidName(formData.name);

  const getSpeciesEmoji = (species) => {
    const found = especies.find(e => e.value.toLowerCase() === species?.toLowerCase());
    return found ? found.emoji : '🐾';
  };

  if (loading) {
    return <Loading message={`Cargando datos de ${petName || 'la mascota'}...`} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">{getSpeciesEmoji(formData.especie)}</span>
          </div>
          <h1 className="text-4xl font-bold font-display text-gray-800 mb-2">
            ✏️ Editar Perfil
          </h1>
          <p className="text-gray-600 text-lg">
            Actualiza la información de <span className="font-semibold text-primary-600">{petName}</span>
          </p>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="hover:text-primary-600 transition-colors">
            🏠 Dashboard
          </button>
          <span>/</span>
          <button onClick={() => navigate(`/pets/${id}`)} className="hover:text-primary-600 transition-colors">
            🐾 {petName}
          </button>
          <span>/</span>
          <span className="text-primary-600 font-medium">Editar</span>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-card p-8 space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                🏷️ Nombre de la Mascota *
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                    focusedField === 'name' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${formData.name && !isValidName(formData.name) ? 'border-red-300' : ''}`}
                  placeholder="Ej: Luna, Max, Bella..."
                  required
                />
                {formData.name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidName(formData.name) ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Especie */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="especie">
                🌿 Especie
              </label>
              <select
                id="especie"
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                onFocus={() => setFocusedField('especie')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 ${
                  focusedField === 'especie' 
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <option value="">Selecciona una especie</option>
                {especies.map((especie) => (
                  <option key={especie.value} value={especie.value}>
                    {especie.emoji} {especie.value}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Raza */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="raza">
                🐕 Raza
              </label>
              <input
                id="raza"
                name="raza"
                type="text"
                value={formData.raza}
                onChange={handleChange}
                onFocus={() => setFocusedField('raza')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                  focusedField === 'raza' 
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Ej: Labrador, Persa, Canario..."
              />
            </div>
            
            {/* Género */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="genero">
                ⚕️ Género
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                onFocus={() => setFocusedField('genero')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 ${
                  focusedField === 'genero' 
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <option value="">Selecciona el género</option>
                {generos.map((genero) => (
                  <option key={genero.value} value={genero.value}>
                    {genero.emoji} {genero.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Grid para Peso y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Peso */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="peso">
                  ⚖️ Peso (kg)
                </label>
                <div className="relative">
                  <input
                    id="peso"
                    name="peso"
                    type="number"
                    step="0.1"
                    min="0"
                    max="200"
                    value={formData.peso}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('peso')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                      focusedField === 'peso' 
                        ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${formData.peso && !isValidWeight(formData.peso) ? 'border-red-300' : ''}`}
                    placeholder="Ej: 5.5"
                  />
                  {formData.peso && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidWeight(formData.peso) ? (
                        <span className="text-green-500">✅</span>
                      ) : (
                        <span className="text-red-500">❌</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="fechaNacimiento">
                  🎂 Fecha de Nacimiento
                </label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  max={getMaxDateForInput()} // Usar utilidad GMT -3
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('fechaNacimiento')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 ${
                    focusedField === 'fechaNacimiento' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
            </div>
            
            {/* Observaciones */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="observaciones">
                📝 Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                onFocus={() => setFocusedField('observaciones')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 resize-none ${
                  focusedField === 'observaciones' 
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                rows="4"
                placeholder="Cualquier información adicional sobre tu mascota: hábitos, alergias, comportamiento, etc."
              />
            </div>
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/pets/${id}`)}
                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>❌</span>
                <span>Cancelar</span>
              </button>
              
              <button
                type="submit"
                disabled={saving || !isFormValid}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                  saving || !isFormValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-success text-white hover:-translate-y-1 hover:shadow-xl'
                }`}
              >
                {saving ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Guardando cambios...</span>
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              ⚡ Acciones Rápidas
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/pets/${id}`)}
                className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
              >
                <span>👁️</span>
                <span>Ver Perfil Completo</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
              >
                <span>🏠</span>
                <span>Volver al Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPet;