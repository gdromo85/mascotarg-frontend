import React from 'react';

const Step3_MedicalDetails = ({ formData, setFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMedicamentoChange = (index, field, value) => {
    const newMedicamentos = [...(formData.medicamentos || [])];
    if (!newMedicamentos[index]) {
      newMedicamentos[index] = {};
    }
    newMedicamentos[index][field] = value;
    setFormData({ ...formData, medicamentos: newMedicamentos });
  };

  const addMedicamento = () => {
    const newMedicamentos = [...(formData.medicamentos || []), {
      nombre: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      notas: ''
    }];
    setFormData({ ...formData, medicamentos: newMedicamentos });
  };

  const removeMedicamento = (index) => {
    const newMedicamentos = formData.medicamentos.filter((_, i) => i !== index);
    setFormData({ ...formData, medicamentos: newMedicamentos });
  };

  return (
    <div className="space-y-6">
      {/* Diagnóstico */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          🔍 Diagnóstico *
        </label>
        <textarea
          name="diagnostico"
          value={formData.diagnostico || ''}
          onChange={handleInputChange}
          rows={4}
          placeholder="Describe el diagnóstico clínico detallado..."
          className={`w-full px-4 py-3 border rounded-xl bg-slate-50 transition-all duration-300 resize-none ${
            errors.diagnostico
              ? 'border-red-500 focus:border-red-500 bg-red-50'
              : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
          }`}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.diagnostico ? (
            <p className="text-red-600 text-sm">❌ {errors.diagnostico}</p>
          ) : (
            <p className="text-slate-500 text-sm">
              Incluye el diagnóstico principal y cualquier diagnóstico secundario
            </p>
          )}
          <span className="text-slate-500 text-sm">
            {(formData.diagnostico?.length || 0)}/1000
          </span>
        </div>
      </div>

      {/* Tratamiento */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          💊 Tratamiento
        </label>
        <textarea
          name="tratamiento"
          value={formData.tratamiento || ''}
          onChange={handleInputChange}
          rows={4}
          placeholder="Describe el tratamiento a seguir..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.tratamiento ? (
            <p className="text-red-600 text-sm">❌ {errors.tratamiento}</p>
          ) : (
            <p className="text-slate-500 text-sm">
              Describe el tratamiento farmacológico y no farmacológico
            </p>
          )}
          <span className="text-slate-500 text-sm">
            {(formData.tratamiento?.length || 0)}/1000
          </span>
        </div>
      </div>

      {/* Medicamentos */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-slate-700">
            💉 Medicamentos recetados
          </label>
          <button
            type="button"
            onClick={addMedicamento}
            className="text-emerald-700 hover:text-emerald-900 font-semibold text-sm flex items-center space-x-1"
          >
            <span>➕</span>
            <span>Agregar medicamento</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.medicamentos?.map((med, index) => (
            <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-emerald-800">Medicamento #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeMedicamento(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️ Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={med.nombre || ''}
                    onChange={(e) => handleMedicamentoChange(index, 'nombre', e.target.value)}
                    placeholder="Ej: Amoxicilina"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Dosis *
                  </label>
                  <input
                    type="text"
                    value={med.dosis || ''}
                    onChange={(e) => handleMedicamentoChange(index, 'dosis', e.target.value)}
                    placeholder="Ej: 10mg/kg"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Frecuencia *
                  </label>
                  <input
                    type="text"
                    value={med.frecuencia || ''}
                    onChange={(e) => handleMedicamentoChange(index, 'frecuencia', e.target.value)}
                    placeholder="Ej: cada 12hs"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duración *
                  </label>
                  <input
                    type="text"
                    value={med.duracion || ''}
                    onChange={(e) => handleMedicamentoChange(index, 'duracion', e.target.value)}
                    placeholder="Ej: 7 días"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas adicionales
                </label>
                <input
                  type="text"
                  value={med.notas || ''}
                  onChange={(e) => handleMedicamentoChange(index, 'notas', e.target.value)}
                  placeholder="Ej: Administrar con comida"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          ))}

          {(!formData.medicamentos || formData.medicamentos.length === 0) && (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <span className="text-slate-400 text-lg">📦</span>
              <p className="text-slate-500 text-sm mt-2">
                No hay medicamentos agregados. Haz clic en "Agregar medicamento"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3_MedicalDetails;
