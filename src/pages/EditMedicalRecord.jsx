import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import { toasts } from "../utils/toasts";
import { toInputDateGMT3, toISOStringGMT3, getMaxDateForInput } from "../utils/dateUtils";

// Mover careTypes fuera del componente para evitar recreación
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

function EditMedicalRecord() {
  const { petId, recordId } = useParams();
  const navigate = useNavigate();
  const api = useApiClient(); // Usar el cliente API con renovación automática
  
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    description: '',
    vetName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Cargar datos del registro médico
  const fetchMedicalRecord = useCallback(async () => {
    const loadingToast = toasts.loading('Cargando registro médico...');
    
    try {
      const response = await api.get(`/records/${petId}`);
      console.log("🚀 ~ fetchMedicalRecord ~ response:", response)

      // Buscar el registro específico
      const record = response.data.find(r => r.id === parseInt(recordId));
      
      if (record) {
        // Mapear el tipo del registro a nuestro formato
        const typeValue = careTypes.find(type => 
          type.label.toLowerCase() === record.type.toLowerCase()
        )?.value || '';

        setFormData({
          date: toInputDateGMT3(record.date), // Usar utilidad GMT -3
          type: typeValue,
          description: record.description || '',
          vetName: record.vetName || ''
        });
        toasts.dismissById(loadingToast);
      } else {
        toasts.dismissById(loadingToast);
        toasts.error('Registro médico no encontrado');
        navigate(`/pets/${petId}`);
        return;
      }

      toasts.dismissById(loadingToast);
    } catch (error) {
      console.error('Error al cargar registro médico:', error);
      toasts.dismissById(loadingToast);
      toasts.error('Error al cargar el registro médico');
      navigate(`/pets/${petId}`);
    } finally {
      setInitialLoading(false);
    }
  }, [petId, recordId, navigate]); // Removiendo api de las dependencias

  useEffect(() => {
    if (petId && recordId) {
      fetchMedicalRecord();
    }
  }, [petId, recordId, fetchMedicalRecord]);

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
    const loadingToast = toasts.loading('Actualizando registro médico...');

    try {
      const selectedType = careTypes.find(type => type.value === formData.type);
      
      const recordData = {
        date: toISOStringGMT3(formData.date), // Usar utilidad GMT -3
        type: selectedType.label,
        description: formData.description.trim(),
        vetName: formData.vetName.trim()
      };

      // ✨ NUEVA FORMA: Usando el cliente API con renovación automática
      await api.put(`/records/${recordId}`, recordData);

      toasts.dismissById(loadingToast);
      toasts.success('✏️ Registro médico actualizado exitosamente');
      
      // Redirigir al detalle de la mascota
      navigate(`/pets/${petId}`);
      
    } catch (error) {
      console.error('Error al actualizar registro médico:', error);
      toasts.dismissById(loadingToast);
      
      const errorMessage = error.response?.data?.message || 'Error al actualizar el registro médico';
      toasts.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando registro médico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary-600 transition-colors"
            >
              Dashboard
            </button>
            <span>›</span>
            <button 
              onClick={() => navigate(`/pets/${petId}`)}
              className="hover:text-primary-600 transition-colors"
            >
              Detalle de Mascota
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">Editar Registro Médico</span>
          </nav>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold font-display">Editar Registro Médico</h1>
                <p className="text-white/90 text-lg">Actualizar información médica de la mascota</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Fecha del registro *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={getMaxDateForInput()} // Usar utilidad GMT -3
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                  errors.date 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-primary-500 focus:bg-white'
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🩺 Tipo de atención *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                  errors.type 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-primary-500 focus:bg-white'
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👩‍⚕️ Nombre del veterinario *
              </label>
              <input
                type="text"
                name="vetName"
                value={formData.vetName}
                onChange={handleInputChange}
                placeholder="Ej: Dr. Juan Pérez"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                  errors.vetName 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-primary-500 focus:bg-white'
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Descripción del registro *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Describe detalladamente el procedimiento, diagnóstico, tratamiento o observaciones..."
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-primary-500 focus:bg-white'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <span>❌</span>
                    <span>{errors.description}</span>
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Mínimo 10 caracteres
                  </p>
                )}
                <span className="text-gray-500 text-sm">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/pets/${petId}`)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <span>❌</span>
                <span>Cancelar</span>
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Actualizar Registro</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <span className="text-orange-600 text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Importante</h3>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• Los cambios se guardarán permanentemente</li>
                <li>• Asegúrate de que toda la información sea correcta</li>
                <li>• Si tienes dudas, consulta con el veterinario antes de guardar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMedicalRecord;