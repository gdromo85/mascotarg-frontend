import React from 'react';
import { getMaxDateForInput } from '../../utils/dateUtils';

const Step2_BasicInfo = ({ formData, setFormData, errors }) => {
  const consultationTypes = [
    { value: 'consulta', label: 'Consulta General', icon: '🩺', description: 'Revisión general de rutina' },
    { value: 'vacunacion', label: 'Vacunación', icon: '💉', description: 'Administración de vacunas' },
    { value: 'control', label: 'Control', icon: '📋', description: 'Control posterior a tratamiento' },
    { value: 'urgencia', label: 'Emergencia', icon: '🚨', description: 'Atención de emergencia' },
    { value: 'cirugia', label: 'Cirugía', icon: '🏥', description: 'Procedimiento quirúrgico' },
    { value: 'diagnostico', label: 'Diagnóstico', icon: '🔍', description: 'Exámenes diagnósticos' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          📅 Fecha de la consulta *
        </label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha || ''}
          onChange={handleInputChange}
          max={getMaxDateForInput()}
          className={`w-full px-4 py-3 border rounded-xl bg-slate-50 transition-all duration-300 ${
            errors.fecha
              ? 'border-red-500 focus:border-red-500 bg-red-50'
              : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
          }`}
        />
        {errors.fecha && (
          <p className="text-red-600 text-sm mt-1">❌ {errors.fecha}</p>
        )}
      </div>

      {/* Consultation Type */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          🩺 Tipo de consulta *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {consultationTypes.map((type) => {
            const isSelected = formData.type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange({ target: { name: 'type', value: type.value } })}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-md transform scale-105'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{type.icon}</span>
                  <span className={`font-semibold ${isSelected ? 'text-emerald-800' : 'text-slate-900'}`}>
                    {type.label}
                  </span>
                </div>
                <p className={`text-sm ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
        {errors.type && (
          <p className="text-red-600 text-sm mt-2">❌ {errors.type}</p>
        )}
      </div>

      {/* Motivo */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          📝 Motivo de la consulta
        </label>
        <textarea
          name="motivo"
          value={formData.motivo || ''}
          onChange={handleInputChange}
          rows={3}
          placeholder="Describe el motivo principal de la consulta..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.motivo ? (
            <p className="text-red-600 text-sm">❌ {errors.motivo}</p>
          ) : (
            <p className="text-slate-500 text-sm">
              Describe brevemente por qué se realiza la consulta
            </p>
          )}
          <span className="text-slate-500 text-sm">
            {(formData.motivo?.length || 0)}/200
          </span>
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          ⚖️ Peso actual (kg)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          name="peso"
          value={formData.peso || ''}
          onChange={handleInputChange}
          placeholder="Ej: 5.5"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
        />
      </div>

      {/* Severity (for emergency consultations) */}
      {formData.type === 'urgencia' && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            🚨 Nivel de severidad
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['baja', 'media', 'alta'].map((severity) => {
              const isSelected = formData.severity === severity;
              const colors = {
                baja: 'bg-amber-50 border-amber-300 text-amber-900',
                media: 'bg-orange-50 border-orange-300 text-orange-900',
                alta: 'bg-red-50 border-red-300 text-red-900'
              };
              const labels = {
                baja: 'Baja',
                media: 'Media',
                alta: 'Alta'
              };
              return (
                <button
                  key={severity}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'severity', value: severity } })}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 font-semibold
                    ${isSelected
                      ? `${colors[severity]} border-current shadow-md`
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
                    }
                  `}
                >
                  {labels[severity]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2_BasicInfo;
