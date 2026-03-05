import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import { toasts } from "../utils/toasts";
import { getCurrentDateGMT3, toISOStringGMT3, getMaxDateForInput } from "../utils/dateUtils";

function AddMedicalRecord() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const api = useApiClient(); // Usar el cliente API con renovación automática
  
  const [formData, setFormData] = useState({
    date: getCurrentDateGMT3(), // Usar utilidad GMT -3
    type: '',
    description: '',
    vetName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const careTypes = [
    { value: 'consulta', label: 'Consulta' },
    { value: 'vacunacion', label: 'Vacunación' },
    { value: 'control', label: 'Control' },
    { value: 'urgencias', label: 'Urgencias' },
    { value: 'cirugia', label: 'Cirugía' },
    { value: 'diagnostico_imagen', label: 'Diagnóstico por imagen' },
    { value: 'tratamientos_especializados', label: 'Tratamientos especializados' },
    { value: 'peluqueria', label: 'Peluquería' },
    { value: 'analisis_laboratorio', label: 'Análisis de laboratorio' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    
    if (!formData.type) {
      newErrors.type = 'El tipo de atención es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!formData.vetName.trim()) {
      newErrors.vetName = 'El nombre del veterinario es requerido';
    } else if (formData.vetName.trim().length < 2) {
      newErrors.vetName = 'El nombre debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toasts.form.validationError('Por favor corrige los errores del formulario');
      return;
    }

    setLoading(true);
    const loadingToast = toasts.loading('Guardando registro médico...');

    try {
      const selectedType = careTypes.find(type => type.value === formData.type);
      
      const recordData = {
        petId: parseInt(petId),
        date: toISOStringGMT3(formData.date), // Usar utilidad GMT -3
        type: selectedType.label,
        description: formData.description.trim(),
        vetName: formData.vetName.trim()
      };

      // ✨ NUEVA FORMA: Usando el cliente API con renovación automática
      // No necesitamos manejar headers ni renovación manual
      await api.post('/records', recordData);

      toasts.dismissById(loadingToast);
      toasts.success('📋 Registro médico creado exitosamente');
      
      // Redirigir al detalle de la mascota
      navigate(`/pets/${petId}`);
      
    } catch (error) {
      console.error('Error al crear registro médico:', error);
      toasts.dismissById(loadingToast);
      
      const errorMessage = error.response?.data?.message || 'Error al crear el registro médico';
      toasts.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-emerald-700 transition-colors"
            >
              Dashboard
            </button>
            <span>›</span>
            <button 
              onClick={() => navigate(`/pets/${petId}`)}
              className="hover:text-emerald-700 transition-colors"
            >
              Detalle de Mascota
            </button>
            <span>›</span>
            <span className="text-slate-900 font-medium">Nuevo Registro Médico</span>
          </nav>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-8 text-white mb-8 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center ring-1 ring-white/20">
                <span className="text-3xl">📋</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold font-display">Nuevo Registro Médico</h1>
                <p className="text-white/90 text-lg">Agregar información médica de la mascota</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📅 Fecha del registro *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={getMaxDateForInput()} // Usar utilidad GMT -3
                className={`w-full px-4 py-3 border rounded-xl bg-slate-50 transition-all duration-300 ${
                  errors.date 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                }`}
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <span>❌</span>
                  <span>{errors.date}</span>
                </p>
              )}
            </div>

            {/* Tipo de Atención */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🩺 Tipo de atención *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl bg-slate-50 transition-all duration-300 ${
                  errors.type 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                }`}
              >
                <option value="">Selecciona el tipo de atención</option>
                {careTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <span>❌</span>
                  <span>{errors.type}</span>
                </p>
              )}
            </div>

            {/* Nombre del Veterinario */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                👩‍⚕️ Nombre del veterinario *
              </label>
              <input
                type="text"
                name="vetName"
                value={formData.vetName}
                onChange={handleInputChange}
                placeholder="Ej: Dr. Juan Pérez"
                className={`w-full px-4 py-3 border rounded-xl bg-slate-50 transition-all duration-300 ${
                  errors.vetName 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                }`}
              />
              {errors.vetName && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <span>❌</span>
                  <span>{errors.vetName}</span>
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📝 Descripción del registro *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Describe detalladamente el procedimiento, diagnóstico, tratamiento o observaciones..."
                className={`w-full px-4 py-3 border rounded-xl bg-slate-50 transition-all duration-300 resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <span>❌</span>
                    <span>{errors.description}</span>
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm">
                    Mínimo 10 caracteres
                  </p>
                )}
                <span className="text-slate-500 text-sm">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/pets/${petId}`)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <span>❌</span>
                <span>Cancelar</span>
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Guardar Registro</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <span className="text-emerald-700 text-xl">💡</span>
            <div>
              <h3 className="font-semibold text-emerald-900 mb-2">Consejos para un buen registro</h3>
              <ul className="text-emerald-800 text-sm space-y-1">
                <li>• Incluye todos los detalles relevantes del procedimiento</li>
                <li>• Menciona medicamentos administrados y dosis</li>
                <li>• Especifica recomendaciones de seguimiento</li>
                <li>• Registra cualquier reacción o comportamiento observado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMedicalRecord;
