import React from 'react';

const Step4_Observations = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const urgencyLevels = [
    { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-800 border-red-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Observaciones */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          📄 Observaciones
        </label>
        <textarea
          name="observaciones"
          value={formData.observaciones || ''}
          onChange={handleInputChange}
          rows={4}
          placeholder="Agrega cualquier observación relevante durante la consulta..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-slate-500 text-sm">
            Notas adicionales sobre el estado del paciente durante la consulta
          </p>
          <span className="text-slate-500 text-sm">
            {(formData.observaciones?.length || 0)}/800
          </span>
        </div>
      </div>

      {/* Próxima Visita */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          📅 Próxima visita
        </label>
        <input
          type="date"
          name="proximaVisita"
          value={formData.proximaVisita || ''}
          onChange={handleInputChange}
          min={formData.fecha || ''}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
        />
        <p className="text-slate-500 text-sm mt-1">
          Fecha programada para el siguiente control (opcional)
        </p>
      </div>

      {/* Recomendaciones */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          💡 Recomendaciones
        </label>
        <textarea
          name="recomendaciones"
          value={formData.recomendaciones || ''}
          onChange={handleInputChange}
          rows={3}
          placeholder="Recomendaciones para el dueño del paciente..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-slate-500 text-sm">
            Consejos y cuidados a seguir en casa
          </p>
          <span className="text-slate-500 text-sm">
            {(formData.recomendaciones?.length || 0)}/600
          </span>
        </div>
      </div>

      {/* Urgencia de Seguimiento */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          ⚠️ Nivel de urgencia de seguimiento
        </label>
        <div className="grid grid-cols-3 gap-3">
          {urgencyLevels.map((level) => {
            const isSelected = formData.urgency === level.value;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange({ target: { name: 'urgency', value: level.value } })}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 font-semibold
                  ${isSelected
                    ? `${level.color} border-current shadow-lg transform scale-105`
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
                  }
                `}
              >
                {level.label}
              </button>
            );
          })}
        </div>
        <p className="text-slate-500 text-sm mt-2">
          Evalúa qué tan urgente es el seguimiento de esta consulta
        </p>
      </div>

      {/* Estado del paciente */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          🏥 Estado del paciente al finalizar
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'estable', label: 'Estable', icon: '✅', description: 'Paciente en buen estado' },
            { value: 'mejorando', label: 'En recuperación', icon: '📈', description: 'Mejorando con el tratamiento' },
            { value: 'critico', label: 'Crítico', icon: '🚨', description: 'Requiere monitoreo constante' }
          ].map((state) => {
            const isSelected = formData.pacienteEstado === state.value;
            return (
              <div
                key={state.value}
                onClick={() => handleInputChange({ target: { name: 'pacienteEstado', value: state.value } })}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{state.icon}</span>
                  <span className="font-semibold text-slate-900">{state.label}</span>
                </div>
                <p className="text-sm text-slate-600">{state.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notas internas para el veterinario */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          🔒 Notas internas (solo visible para veterinarios)
        </label>
        <textarea
          name="notasInternas"
          value={formData.notasInternas || ''}
          onChange={handleInputChange}
          rows={3}
          placeholder="Notas que solo otros veterinarios podrán ver..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-slate-500 text-sm">
            Información confidencial para uso exclusivo del equipo veterinario
          </p>
          <span className="text-slate-500 text-sm">
            {(formData.notasInternas?.length || 0)}/600
          </span>
        </div>
      </div>
    </div>
  );
};

export default Step4_Observations;
