import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDateForDisplay, toISOStringGMT3, fromInputDateGMT3 } from '../utils/dateUtils';
import { API_BASE_URL } from '../services/axiosConfig';

const VetAccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    fecha: '',
    vetName: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });

  useEffect(() => {
    if (token) {
      fetchPetData();
    } else {
      toast.error('Token no válido');
      setLoading(false);
    }
  }, [token]);

  const fetchPetData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/qr/vet-access/${token}`);
      setPetData(response.data);
    } catch (error) {
      console.error('Error fetching pet data:', error);
      toast.error('Error al cargar los datos de la mascota');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description || !formData.fecha || !formData.vetName) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        petId: petData.pet.id || 1, // Usar el ID de la mascota si está disponible
        type: formData.type,
        description: formData.description,
        fecha: toISOStringGMT3(fromInputDateGMT3(formData.fecha)),
        vetName: formData.vetName,
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento,
        observaciones: formData.observaciones
      };

      await axios.post(`${API_BASE_URL}/clinical-records/${token}`, payload);
      
      toast.success('Registro clínico agregado exitosamente');
      
      // Limpiar formulario
      setFormData({
        type: '',
        description: '',
        fecha: '',
        vetName: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
      });
      
      // Ocultar formulario y recargar datos
      setShowForm(false);
      fetchPetData();
      
    } catch (error) {
      console.error('Error submitting clinical record:', error);
      toast.error('Error al guardar el registro clínico');
    } finally {
      setSubmitting(false);
    }
  };

  const parseLocation = (locationStr) => {
    try {
      return JSON.parse(locationStr);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la mascota...</p>
        </div>
      </div>
    );
  }

  if (!petData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Token no válido</h1>
          <p className="text-gray-600">No se pudo acceder a la información de la mascota</p>
        </div>
      </div>
    );
  }

  const { pet, owners, records, clinicalRecords } = petData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso Veterinario</h1>
          <p className="text-gray-600">Información de la mascota y registros médicos</p>
        </div>

        {/* Pet Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            🐾 Información de la Mascota
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-gray-700">Nombre:</strong>
              <p className="text-gray-600">{pet.name}</p>
            </div>
            <div>
              <strong className="text-gray-700">Especie:</strong>
              <p className="text-gray-600">{pet.especie}</p>
            </div>
            <div>
              <strong className="text-gray-700">Raza:</strong>
              <p className="text-gray-600">{pet.raza}</p>
            </div>
            <div>
              <strong className="text-gray-700">Peso:</strong>
              <p className="text-gray-600">{pet.peso} kg</p>
            </div>
            <div>
              <strong className="text-gray-700">Fecha de Nacimiento:</strong>
              <p className="text-gray-600">{formatDateForDisplay(pet.fechaNacimiento)}</p>
            </div>
            {pet.observaciones && (
              <div className="md:col-span-2">
                <strong className="text-gray-700">Observaciones:</strong>
                <p className="text-gray-600 whitespace-pre-wrap">{pet.observaciones}</p>
              </div>
            )}
          </div>
        </div>

        {/* Owners Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            👥 Propietarios
          </h2>
          {owners.map((owner, index) => {
            const location = parseLocation(owner.ubicacion);
            return (
              <div key={index} className={`${index > 0 ? 'border-t pt-4 mt-4' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-gray-700">Nombre:</strong>
                    <p className="text-gray-600">{owner.name}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Celular:</strong>
                    <p className="text-gray-600">{owner.celular}</p>
                  </div>
                  {location && (
                    <div className="md:col-span-2">
                      <strong className="text-gray-700">Ubicación:</strong>
                      <p className="text-gray-600">{location.address}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical Records */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            📋 Registros Médicos
          </h2>
          {records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{record.type}</h3>
                    <span className="text-sm text-gray-500">{formatDateForDisplay(record.date)}</span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap mb-2">{record.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Veterinario:</strong> {record.vetName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Creado: {formatDateForDisplay(record.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay registros médicos disponibles</p>
          )}
        </div>

        {/* Clinical Records */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            🏥 Registros Clínicos
          </h2>
          {clinicalRecords.length > 0 ? (
            <div className="space-y-4">
              {clinicalRecords.map((record, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{record.type}</h3>
                    <span className="text-sm text-gray-500">{formatDateForDisplay(record.fecha)}</span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap mb-2">{record.description}</p>
                  {record.diagnostico && (
                    <p className="text-gray-600 mb-1">
                      <strong>Diagnóstico:</strong> {record.diagnostico}
                    </p>
                  )}
                  {record.tratamiento && (
                    <p className="text-gray-600 mb-1">
                      <strong>Tratamiento:</strong> {record.tratamiento}
                    </p>
                  )}
                  {record.observaciones && (
                    <p className="text-gray-600 mb-2">
                      <strong>Observaciones:</strong> {record.observaciones}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    <strong>Veterinario:</strong> {record.vetName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay registros clínicos disponibles</p>
          )}
        </div>

        {/* Add Clinical Record Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            {showForm ? 'Cancelar' : 'Agregar Registro Clínico'}
          </button>
        </div>

        {/* Add Clinical Record Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuevo Registro Clínico</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Consulta *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Control">Control</option>
                    <option value="Vacunación">Vacunación</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Emergencia">Emergencia</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Veterinario *
                </label>
                <input
                  type="text"
                  name="vetName"
                  value={formData.vetName}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Dr. Juan Pérez"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Descripción del motivo de consulta..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico
                </label>
                <textarea
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Diagnóstico del veterinario..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento
                </label>
                <textarea
                  name="tratamiento"
                  value={formData.tratamiento}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Tratamiento prescrito..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Observaciones adicionales..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  {submitting ? 'Guardando...' : 'Guardar Registro'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetAccess;