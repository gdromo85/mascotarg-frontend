import React, { useState, useEffect } from "react";
import { useApiClient } from "../hooks/useApiClient";
import { usePets } from "../hooks/usePets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toasts } from "../utils/toasts";
import { getMaxDateForInput } from "../utils/dateUtils";

function AddPet() {
  const api = useApiClient();
  const { addPet } = usePets();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    especie: "",
    raza: "",
    genero: "",
    peso: "",
    fechaNacimiento: "",
    observaciones: "",
  });

  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
    phone: "",
    documento: "",
    location: "",
  });

  const [cuidadores, setCuidadores] = useState([]);
  const [selectedCuidador, setSelectedCuidador] = useState(null);
  const [searchCuidador, setSearchCuidador] = useState("");
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCuidadores, setLoadingCuidadores] = useState(false);

  const fromConsultation = searchParams.get("from") === "consultation";

  useEffect(() => {
    if (fromConsultation) {
      fetchCuidadores();
    }
  }, [fromConsultation]);

  const fetchCuidadores = async () => {
    setLoadingCuidadores(true);
    try {
      const response = await api.get("/auth/get-cuidador");
      setCuidadores(response.data.cuidadores || []);
    } catch (error) {
      console.log("No se pudieron cargar los cuidadores:", error);
      setCuidadores([]);
    } finally {
      setLoadingCuidadores(false);
    }
  };

  const filteredCuidadores = cuidadores.filter(
    (cuidador) =>
      cuidador.name?.toLowerCase().includes(searchCuidador.toLowerCase()) ||
      cuidador.email?.toLowerCase().includes(searchCuidador.toLowerCase()) ||
      cuidador.celular?.includes(searchCuidador) ||
      cuidador.documento?.includes(searchCuidador),
  );

  const handleSelectCuidador = (cuidador) => {
    setSelectedCuidador(cuidador);
    setOwnerData({
      name: cuidador.name || "",
      email: cuidador.email || "",
      phone: cuidador.celular || "",
      documento: cuidador.documento || "",
      location: cuidador.ubicacion || "",
    });
    setShowOwnerForm(false);
    setSearchCuidador("");
  };

  const handleClearCuidador = () => {
    setSelectedCuidador(null);
    setSearchCuidador("");
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidName = (name) => name.trim().length >= 2;
  const isValidWeight = (peso) =>
    !peso || (parseFloat(peso) > 0 && parseFloat(peso) <= 200);
  const isPetFormValid = isValidName(formData.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidName(formData.name)) {
      toasts.form.requiredFields();
      return;
    }

    if (formData.peso && !isValidWeight(formData.peso)) {
      toasts.error("El peso debe estar entre 0.1 y 200 kg");
      return;
    }

    if (fromConsultation && !selectedCuidador && !showOwnerForm) {
      toasts.error("Por favor selecciona o crea un cuidador");
      return;
    }

    setLoading(true);

    const loadingMessage = showOwnerForm
      ? "Creando cuidador y mascota..."
      : "Agregando a " + formData.name + "...";
    const loadingToast = toasts.loading(loadingMessage);

    try {
      let petResponse;
      let ownerId = selectedCuidador?.id;

      if (fromConsultation && showOwnerForm) {
        let ownerResponse;
        try {
          ownerResponse = await api.post("/auth/register-cuidador", {
            name: ownerData.name,
            email: ownerData.email,
            celular: ownerData.phone,
            documento: ownerData.documento,
            ubicacion: ownerData.location || "Sin especificar",
          });
          ownerId = ownerResponse.data.user?.id || ownerResponse.data.id;
        } catch (registerError) {
          if (
            registerError.response?.status === 404 ||
            registerError.response?.data?.message?.includes("route") ||
            registerError.response?.data?.message?.includes("not found")
          ) {
            ownerResponse = await api.post("/auth/register", {
              name: ownerData.name,
              email: ownerData.email,
              celular: ownerData.phone,
              documento: ownerData.documento,
              sexo: "prefiero_no_decir",
              ubicacion: JSON.stringify({
                lat: null,
                lng: null,
                address: ownerData.location || "Sin especificar",
              }),
            });
            ownerId = ownerResponse.data.user?.id || ownerResponse.data.id;
          } else {
            throw registerError;
          }
        }
      }

      const petData = {
        name: formData.name,
        especie: formData.especie,
        raza: formData.raza,
        genero: formData.genero,
        peso: formData.peso ? parseFloat(formData.peso) : 0,
        fechaNacimiento: formData.fechaNacimiento || null,
        observaciones: formData.observaciones || '',
        ownerId: ownerId,
      };

      console.log("🚀 ~ handleSubmit ~ petData:", petData);

      petResponse = await api.post("/pets/add-vet", petData);

      addPet(petResponse.data.pet);

      toasts.dismissById(loadingToast);
      toasts.pet.added(formData.name);

      setTimeout(() => {
        navigate(
          "/add-consultation/" + petResponse.data.pet.id + "?type=consulta",
        );
      }, 1500);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      toasts.dismissById(loadingToast);
      const errorMsg =
        error.response?.data?.message ||
        "Error al guardar. Por favor, intenta de nuevo.";
      toasts.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const especies = [
    { value: "Perro", emoji: "🐶" },
    { value: "Gato", emoji: "🐱" },
    { value: "Ave", emoji: "🦅" },
    { value: "Conejo", emoji: "🐰" },
    { value: "Hamster", emoji: "🐹" },
    { value: "Pez", emoji: "🐟" },
    { value: "Reptil", emoji: "🦎" },
    { value: "Otro", emoji: "🐾" },
  ];

  const generos = [
    { value: "macho", emoji: "Macho" },
    { value: "hembra", emoji: "Hembra" },
    { value: "desconocido", emoji: "Desconocido" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-1 ring-emerald-800/20">
            <span className="text-3xl text-white">🐾</span>
          </div>
          <h1 className="text-4xl font-bold font-display text-slate-900 mb-2">
            Agregar Nueva Mascota
          </h1>
          <p className="text-slate-600 text-lg">
            {fromConsultation
              ? "Completa los datos para continuar con la consulta"
              : "Crea el perfil de tu nuevo companero peludo"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            {fromConsultation && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                    <span>👤</span>
                    <span>Seleccionar Cuidador</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowOwnerForm(!showOwnerForm)}
                    className="text-sm text-emerald-700 hover:text-emerald-800 font-medium flex items-center space-x-1"
                  >
                    <span>
                      {showOwnerForm ? "Volver" : "Crear nuevo cuidador"}
                    </span>
                  </button>
                </div>

                {showOwnerForm ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-4">
                    <div className="space-y-2">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="ownerName"
                      >
                        Nombre Completo *
                      </label>
                      <input
                        id="ownerName"
                        name="name"
                        type="text"
                        value={ownerData.name}
                        onChange={handleOwnerChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder="Ej: Juan Perez"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="ownerEmail"
                      >
                        Correo Electronico *
                      </label>
                      <input
                        id="ownerEmail"
                        name="email"
                        type="email"
                        value={ownerData.email}
                        onChange={handleOwnerChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="ownerPhone"
                      >
                        Telefono *
                      </label>
                      <input
                        id="ownerPhone"
                        name="phone"
                        type="tel"
                        value={ownerData.phone}
                        onChange={handleOwnerChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder="Ej: +57 300 123 4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="ownerDocumento"
                      >
                        Documento de Identidad
                      </label>
                      <input
                        id="ownerDocumento"
                        name="documento"
                        type="text"
                        value={ownerData.documento}
                        onChange={handleOwnerChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder="Ej: 20123456"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="ownerLocation"
                      >
                        Ubicacion
                      </label>
                      <input
                        id="ownerLocation"
                        name="location"
                        type="text"
                        value={ownerData.location}
                        onChange={handleOwnerChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder="Ej: Cordoba, Argentina"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchCuidador}
                        onChange={(e) => setSearchCuidador(e.target.value)}
                        placeholder="Buscar por nombre, email, telefono o documento..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300"
                      />
                      {searchCuidador && (
                        <button
                          type="button"
                          onClick={() => setSearchCuidador("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          X
                        </button>
                      )}
                    </div>

                    {selectedCuidador ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-xl">👤</span>
                            </div>
                            <div>
                              <p className="font-semibold text-emerald-900">
                                {selectedCuidador.name}
                              </p>
                              <p className="text-sm text-emerald-800">
                                {selectedCuidador.email}
                              </p>
                              <p className="text-sm text-emerald-800">
                                {selectedCuidador.celular}
                              </p>
                              {selectedCuidador.documento && (
                                <p className="text-sm text-emerald-800">
                                  Doc: {selectedCuidador.documento}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleClearCuidador}
                            className="text-emerald-700 hover:text-emerald-800"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ) : loadingCuidadores ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-xl">Cargando...</span>
                        </div>
                        <p className="text-slate-600">Cargando cuidadores...</p>
                      </div>
                    ) : filteredCuidadores.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredCuidadores.map((cuidador) => (
                          <button
                            key={cuidador.id}
                            type="button"
                            onClick={() => handleSelectCuidador(cuidador)}
                            className="w-full flex items-center space-x-3 p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all duration-200 text-left"
                          >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-slate-200">
                              <span className="text-lg">👤</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">
                                {cuidador.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {cuidador.email} - {cuidador.celular}
                              </p>
                              {cuidador.documento && (
                                <p className="text-xs text-slate-400">
                                  Doc: {cuidador.documento}
                                </p>
                              )}
                            </div>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              {cuidador.source === "consultation"
                                ? "Nueva"
                                : "Registrada"}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-4xl">👥</span>
                        <p className="text-slate-600 mt-2">
                          {searchCuidador
                            ? "No se encontraron cuidadores"
                            : "No hay cuidadores disponibles"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Crea un nuevo cuidador
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div
              className={
                fromConsultation ? "border-t border-gray-200 pt-6" : ""
              }
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                <span>🐾</span>
                <span>Datos de la Mascota</span>
              </h3>

              <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-slate-700 mb-2"
                    htmlFor="name"
                  >
                    Nombre de la Mascota *
                  </label>
                  <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 placeholder-slate-400 border-slate-200 hover:border-slate-300"
                        placeholder="Ej: Luna, Max, Bella..."
                        required
                      />
                  </div>
                </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="especie"
                >
                  Especie
                </label>
                <select
                  id="especie"
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 border-slate-200 hover:border-slate-300"
                >
                  <option value="">Selecciona una especie</option>
                  {especies.map((especie) => (
                    <option key={especie.value} value={especie.value}>
                      {especie.emoji} {especie.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="raza"
                >
                  Raza
                </label>
                <input
                  id="raza"
                  name="raza"
                  type="text"
                  value={formData.raza}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 placeholder-slate-400 border-slate-200 hover:border-slate-300"
                  placeholder="Ej: Labrador, Persa, Canario..."
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="genero"
                >
                  Genero
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 border-slate-200 hover:border-slate-300"
                >
                  <option value="">Selecciona el genero</option>
                  {generos.map((genero) => (
                    <option key={genero.value} value={genero.value}>
                      {genero.emoji} {genero.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-slate-700 mb-2"
                    htmlFor="peso"
                  >
                    Peso (kg)
                  </label>
                  <input
                    id="peso"
                    name="peso"
                    type="number"
                    step="0.1"
                    min="0"
                    max="200"
                    value={formData.peso}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 placeholder-slate-400 border-slate-200 hover:border-slate-300"
                    placeholder="Ej: 5.5"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-slate-700 mb-2"
                    htmlFor="fechaNacimiento"
                  >
                    Fecha de Nacimiento
                  </label>
                  <input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    max={getMaxDateForInput()}
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 border-slate-200 hover:border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="observaciones"
                >
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 placeholder-slate-400 resize-none border-slate-200 hover:border-slate-300"
                  rows="4"
                  placeholder="Cualquier informacion adicional sobre tu mascota: habitos, alergias, comportamiento, etc."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() =>
                  navigate(fromConsultation ? "/vet-dashboard" : "/dashboard")
                }
                className="flex-1 py-3 px-6 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
              >
                <span>Cancelar</span>
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !isPetFormValid ||
                  (fromConsultation && !selectedCuidador && !showOwnerForm)
                }
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                  loading ||
                  !isPetFormValid ||
                  (fromConsultation && !selectedCuidador && !showOwnerForm)
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Agregar Mascota</span>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
              Consejos para completar el perfil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <span className="text-lg">📝</span>
                <div>
                  <p className="font-medium text-slate-900">
                    Informacion completa
                  </p>
                  <p className="text-slate-600">
                    Mientras mas datos proporciones, mejor podra ser el cuidado
                    de tu mascota.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg">📅</span>
                <div>
                  <p className="font-medium text-slate-900">Fecha exacta</p>
                  <p className="text-slate-600">
                    Si no conoces la fecha exacta, puedes usar una aproximada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPet;
