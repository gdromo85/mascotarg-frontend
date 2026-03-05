import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useVetPets } from '../hooks/useVetPets';
import { useVetConsultations } from '../hooks/useVetConsultations';
import { useAuth } from '../hooks/useAuth';
import { toasts } from '../utils/toasts';
import { getCurrentDateGMT3 } from '../utils/dateUtils';
import FormStepper from '../components/FormStepper';
import Step1_SelectPet from '../components/ConsultationForm/Step1_SelectPet';
import Step2_BasicInfo from '../components/ConsultationForm/Step2_BasicInfo';
import Step3_MedicalDetails from '../components/ConsultationForm/Step3_MedicalDetails';
import Step4_Observations from '../components/ConsultationForm/Step4_Observations';

const AddVetConsultation = () => {
  const { petId: petIdUrl } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { pets, loading: petsLoading, searchPets } = useVetPets();
  const { createConsultation, loading: submitting } = useVetConsultations();

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    petId: null,
    petName: '',
    pet: null,
    fecha: getCurrentDateGMT3(),
    type: '',
    motivo: '',
    peso: '',
    severity: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos: [],
    observaciones: '',
    proximaVisita: '',
    recomendaciones: '',
    urgency: '',
    pacienteEstado: '',
    notasInternas: ''
  });

  const steps = [
    { title: 'Seleccionar Mascota', component: Step1_SelectPet },
    { title: 'Información Básica', component: Step2_BasicInfo },
    { title: 'Detalles Médicos', component: Step3_MedicalDetails },
    { title: 'Observaciones', component: Step4_Observations }
  ];

  useEffect(() => {
    console.log("🚀 ~ AddVetConsultation ~ petIdUrl:", petIdUrl)
    if (petIdUrl) {
      const pet = pets.find(p => p.id === parseInt(petIdUrl));
      console.log("🚀 ~ AddVetConsultation ~ pet:", pet)
      if (pet) {
        setFormData(prev => ({
          ...prev,
          petId: pet.id,
          petName: pet.name,
          pet: pet
        }));
      }
    }
  }, [petIdUrl, pets]);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    console.log("🚀 ~ AddVetConsultation ~ typeParam:", typeParam)
    if (typeParam) {
      setFormData(prev => ({
        ...prev,
        type: typeParam
      }));
      if (currentStep < 1) {
        setCurrentStep(1);
      }
    }
  }, [searchParams, currentStep]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.petId) {
          newErrors.pet = 'Debes seleccionar una mascota';
        }
        break;

      case 1:
        if (!formData.fecha) {
          newErrors.fecha = 'La fecha es requerida';
        }
        if (!formData.type) {
          newErrors.type = 'El tipo de consulta es requerido';
        }
        if (!formData.motivo?.trim() && formData.type === 'urgencia') {
          newErrors.motivo = 'El motivo es requerido para emergencias';
        }
        break;

      case 2:
        if (!formData.diagnostico?.trim()) {
          newErrors.diagnostico = 'El diagnóstico es requerido';
        } else if (formData.diagnostico.length < 10) {
          newErrors.diagnostico = 'El diagnóstico debe tener al menos 10 caracteres';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      toasts.form.validationError('Por favor corrige los errores antes de continuar');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      toasts.form.validationError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const consultationData = {
        petId: formData.petId || petIdUrl,
        type: formData.type,
        fecha: formData.fecha,
        motivo: formData.motivo,
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento,
        medicamentos: formData.medicamentos?.length > 0 ? formData.medicamentos : null,
        observaciones: formData.observaciones,
        proximaVisita: formData.proximaVisita || null,
        recomendaciones: formData.recomendaciones
      };

      await createConsultation(consultationData, { name: user?.user?.name || user?.name, email: user?.user?.email || user?.email });

toasts.success(`📋 Consulta agregada exitosamente para ${formData.petName}`);

setTimeout(() => {
          const isVet = user?.user?.role === 'VET' || user?.role === 'VET';
          if (petIdUrl && !isVet) {
            navigate(`/pets/${petIdUrl}`);
          } else {
            navigate(`/vet-dashboard`);
          }
        }, 1500);

    } catch (error) {
      console.error('Error al crear consulta:', error);
    }
  };

  const renderStep = () => {
    const StepComponent = steps[currentStep].component;

    return (
      <StepComponent
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        pets={pets}
        loading={petsLoading}
        onPetSearch={searchPets}
        onSelectPet={(pet) => {
          setFormData(prev => ({
            ...prev,
            petId: pet.id,
            petName: pet.name,
            pet: pet
          }));
        }}
      />
    );
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return !!formData.petId;
      case 1:
        return !!formData.fecha && !!formData.type;
      case 2:
        return !!formData.diagnostico?.trim();
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <button
              onClick={() => navigate('/vet-dashboard')}
              className="hover:text-emerald-700 transition-colors"
            >
              Panel Veterinario
            </button>
            <span>›</span>
            <span className="text-slate-900 font-medium">Nueva Consulta</span>
          </nav>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-8 text-white mb-8 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-4 translate-y-4" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center ring-1 ring-white/20">
                <span className="text-3xl">🩺</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold font-display">Nueva Consulta Veterinaria</h1>
                <p className="text-white/90 text-lg">
                  Agrega un nuevo registro clínico completo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <FormStepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Form Content */}
        <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
          </form>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1 sm:flex-none px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>⬅️</span>
              <span>Anterior</span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <span>Paso</span>
              <span className="font-semibold text-emerald-700">{currentStep + 1}</span>
              <span>de</span>
              <span className="font-semibold">{steps.length}</span>
            </div>

            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !isStepValid(currentStep)}
                className="flex-1 sm:flex-none px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Guardar Consulta</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Siguiente</span>
                <span>➡️</span>
              </button>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">💡</span>
              <span className="font-semibold text-emerald-900">Consejo</span>
            </div>
            <p className="text-sm text-emerald-800">
              Completa la información con el mayor detalle posible para un mejor seguimiento del paciente.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">✅</span>
              <span className="font-semibold text-emerald-900">Paso completado</span>
            </div>
            <p className="text-sm text-emerald-800">
              Serás notificado cuando todos los campos requeridos estén completos.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">↩️</span>
              <span className="font-semibold text-amber-900">Edición</span>
            </div>
            <p className="text-sm text-amber-800">
              Puedes volver a pasos anteriores usando el indicador de progreso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVetConsultation;
