/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toasts } from "../utils/toasts";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
  const [showMap, setShowMap] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toasts.form.passwordMismatch();
      return;
    }
    
    if (password.length < 6) {
      toasts.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setLoading(true);

    // Toast de carga
    const loadingToast = toasts.loading('Creando tu cuenta...');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        celular: phone,
        sexo: gender,
        ubicacion: JSON.stringify(location)
      });

      const { token, user } = response.data;

      const responseLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token: Logintoken, user: Loginuser } = responseLogin.data;
      
      login({ token: Logintoken, user: Loginuser });
      
      // Reemplazar el toast de carga con uno de éxito
      toasts.auth.registerSuccess();
      toasts.dismissById(loadingToast);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error('Error en registro:', err);
      
      // Reemplazar el toast de carga con uno de error
      const errorMessage = err.response?.data?.message || "Error al registrar usuario. Por favor, intenta de nuevo.";
      toasts.dismissById(loadingToast);
      toasts.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidName = (name) => {
    return name.trim().length >= 2;
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const isValidPhone = (phone) => {
    return /^[0-9+\-\s()]{10,}$/.test(phone.replace(/\s/g, ''));
  };

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const isFormValid = isValidName(name) && isValidEmail(email) && 
                     isValidPassword(password) && passwordsMatch &&
                     isValidPhone(phone) && gender && location.address;

  // Función para obtener ubicación actual
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          console.log("🚀 ~ getCurrentLocation ~ lat:", lat)
          const lng = position.coords.longitude;
          console.log("🚀 ~ getCurrentLocation ~ lng:", lng)
          
          // Reverse geocoding usando una API gratuita
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`)
            .then(response => response.json())
            .then(data => {
              setLocation({
                lat,
                lng,
                address: data.localityInfo?.administrative?.[2]?.name + ', ' + data.countryName || 'Ubicación detectada'
              });
            })
            .catch(() => {
              setLocation({
                lat,
                lng,
                address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
              });
            });
        },
        (error) => {
          console.warn('Error obteniendo ubicación:', error);
          toasts.error('No se pudo obtener la ubicación. Por favor, ingresa manualmente.');
        }
      );
    } else {
      toasts.error('Tu navegador no soporta geolocalización.');
    }
  };

  // Función para manejar selección manual de ubicación
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowMap(false);
    toasts.success(`📍 Ubicación seleccionada: ${selectedLocation.address}`, {
      duration: 2000,
    });
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">🐾</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-gray-800 mb-2">
            ¡Únete a PetClinic QR!
          </h1>
          <p className="text-gray-600">
            Crea tu cuenta y comienza a cuidar a tus mascotas
          </p>
        </div>
        
        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-8 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-gray-700 mb-2" 
                htmlFor="name"
              >
                👤 Nombre Completo
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                    focusedField === 'name' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${name && !isValidName(name) ? 'border-red-300' : ''}`}
                  placeholder="Ej: Juan Pérez"
                  required
                />
                {name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidName(name) ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </div>
                )}
              </div>
              {name && !isValidName(name) && (
                <p className="text-red-500 text-xs mt-1">El nombre debe tener al menos 2 caracteres</p>
              )}
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-gray-700 mb-2" 
                htmlFor="email"
              >
                📧 Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                    focusedField === 'email' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${email && !isValidEmail(email) ? 'border-red-300' : ''}`}
                  placeholder="tu@email.com"
                  required
                />
                {email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidEmail(email) ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </div>
                )}
              </div>
              {email && !isValidEmail(email) && (
                <p className="text-red-500 text-xs mt-1">Por favor, ingresa un email válido</p>
              )}
            </div>
            
            {/* Phone Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-gray-700 mb-2" 
                htmlFor="phone"
              >
                📱 Teléfono
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                    focusedField === 'phone' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${phone && !isValidPhone(phone) ? 'border-red-300' : ''}`}
                  placeholder="Ej: +57 300 123 4567"
                  required
                />
                {phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidPhone(phone) ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </div>
                )}
              </div>
              {phone && !isValidPhone(phone) && (
                <p className="text-red-500 text-xs mt-1">Por favor, ingresa un número de teléfono válido</p>
              )}
            </div>
            
            {/* Gender Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-gray-700 mb-2" 
                htmlFor="gender"
              >
                👤 Sexo
              </label>
              <div className="relative">
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 ${
                    focusedField === 'gender' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  required
                >
                  <option value="">Selecciona tu sexo</option>
                  <option value="masculino">🚹 Masculino</option>
                  <option value="femenino">🚺 Femenino</option>
                  <option value="otro">⚧️ Otro</option>
                  <option value="prefiero_no_decir">🤐 Prefiero no decir</option>
                </select>
                {gender && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <span className="text-green-500">✅</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Location Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-gray-700 mb-2" 
                htmlFor="location"
              >
                📍 Ubicación
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    value={location.address}
                    onChange={(e) => setLocation({...location, address: e.target.value})}
                    onFocus={() => setFocusedField('location')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                      focusedField === 'location' 
                        ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Ej: Córdoba, Argentina"
                    required
                  />
                  {location.address && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-green-500">✅</span>
                    </div>
                  )}
                </div>
                
                {/* Location Buttons */}
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                  >
                    🎯 Usar mi ubicación
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                  >
                    🗺️ Seleccionar en mapa
                  </button>
                </div>
                
                {location.lat && location.lng && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">
                      📍 Coordenadas: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-gray-700 mb-2" 
                htmlFor="password"
              >
                🔒 Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                    focusedField === 'password' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${password && !isValidPassword(password) ? 'border-red-300' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {password && !isValidPassword(password) && (
                <p className="text-red-500 text-xs mt-1">La contraseña debe tener al menos 6 caracteres</p>
              )}
              {password && isValidPassword(password) && (
                <p className="text-green-500 text-xs mt-1">✅ Contraseña válida</p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-gray-700 mb-2" 
                htmlFor="confirmPassword"
              >
                🔐 Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${
                    focusedField === 'confirmPassword' 
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${confirmPassword && !passwordsMatch ? 'border-red-300' : ''}`}
                  placeholder="Repite tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {confirmPassword && (
                <div className="text-xs mt-1">
                  {passwordsMatch ? (
                    <p className="text-green-500">✅ Las contraseñas coinciden</p>
                  ) : (
                    <p className="text-red-500">❌ Las contraseñas no coinciden</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                loading || !isFormValid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-secondary text-white hover:-translate-y-1 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Creando cuenta...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🎉</span>
                  <span>Crear mi cuenta</span>
                </div>
              )}
            </button>
          </div>
        </form>
        
        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 mb-4">¿Ya tienes una cuenta?</p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center space-x-2 w-full py-3 px-6 border-2 border-primary-500 text-primary-600 hover:bg-primary-50 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              <span>🔑</span>
              <span>Iniciar sesión</span>
            </Link>
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            🌟 ¿Por qué elegir PetClinic QR?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <span className="text-2xl">🏥</span>
              <p className="text-sm text-gray-600">
                <strong>Historial completo</strong><br/>
                Toda la información médica en un solo lugar
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-2xl">📱</span>
              <p className="text-sm text-gray-600">
                <strong>Acceso inmediato</strong><br/>
                Códigos QR para consultas rápidas
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-2xl">🔒</span>
              <p className="text-sm text-gray-600">
                <strong>100% seguro</strong><br/>
                Datos protegidos y encriptados
              </p>
            </div>
          </div>
        </div>
        
        {/* Map Modal */}
        {showMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  🗺️ Selecciona tu ubicación
                </h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Mapa placeholder - En una implementación real usarías Google Maps, Leaflet, etc. */}
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-gray-600">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="font-medium">Mapa Interactivo</p>
                    <p className="text-sm">Haz clic para seleccionar ubicación</p>
                  </div>
                  
                  {/* Simulación de marcadores de ciudades */}
                  <div className="absolute inset-0">
                    <button
                      onClick={() => handleLocationSelect({
                        lat: 4.7110,
                        lng: -74.0721,
                        address: 'Bogotá, Colombia'
                      })}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 w-4 h-4 rounded-full hover:bg-red-600 transition-colors"
                      title="Bogotá"
                    ></button>
                    
                    <button
                      onClick={() => handleLocationSelect({
                        lat: 6.2442,
                        lng: -75.5812,
                        address: 'Medellín, Colombia'
                      })}
                      className="absolute top-1/3 left-1/3 bg-red-500 w-4 h-4 rounded-full hover:bg-red-600 transition-colors"
                      title="Medellín"
                    ></button>
                    
                    <button
                      onClick={() => handleLocationSelect({
                        lat: 3.4516,
                        lng: -76.5320,
                        address: 'Cali, Colombia'
                      })}
                      className="absolute bottom-1/3 left-2/5 bg-red-500 w-4 h-4 rounded-full hover:bg-red-600 transition-colors"
                      title="Cali"
                    ></button>
                    
                    <button
                      onClick={() => handleLocationSelect({
                        lat: 11.0041,
                        lng: -74.8070,
                        address: 'Barranquilla, Colombia'
                      })}
                      className="absolute top-1/4 left-3/5 bg-red-500 w-4 h-4 rounded-full hover:bg-red-600 transition-colors"
                      title="Barranquilla"
                    ></button>
                  </div>
                </div>
                
                {/* Ciudades principales */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLocationSelect({
                      lat: 4.7110,
                      lng: -74.0721,
                      address: 'Bogotá, Colombia'
                    })}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-gray-800">Bogotá</div>
                    <div className="text-sm text-gray-600">Colombia</div>
                  </button>
                  
                  <button
                    onClick={() => handleLocationSelect({
                      lat: 6.2442,
                      lng: -75.5812,
                      address: 'Medellín, Colombia'
                    })}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-gray-800">Medellín</div>
                    <div className="text-sm text-gray-600">Colombia</div>
                  </button>
                  
                  <button
                    onClick={() => handleLocationSelect({
                      lat: 3.4516,
                      lng: -76.5320,
                      address: 'Cali, Colombia'
                    })}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-gray-800">Cali</div>
                    <div className="text-sm text-gray-600">Colombia</div>
                  </button>
                  
                  <button
                    onClick={() => handleLocationSelect({
                      lat: 11.0041,
                      lng: -74.8070,
                      address: 'Barranquilla, Colombia'
                    })}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-gray-800">Barranquilla</div>
                    <div className="text-sm text-gray-600">Colombia</div>
                  </button>
                </div>
                
                {/* Input manual de ubicación */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O ingresa manualmente:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ciudad, País"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const address = e.target.value;
                          if (address.trim()) {
                            handleLocationSelect({
                              lat: null,
                              lng: null,
                              address: address.trim()
                            });
                          }
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        const address = input.value;
                        if (address.trim()) {
                          handleLocationSelect({
                            lat: null,
                            lng: null,
                            address: address.trim()
                          });
                        }
                      }}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;