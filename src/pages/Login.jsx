import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toasts } from "../utils/toasts";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Effect to handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      let dashboardPath = "/dashboard";
      let roleText = "usuario";
      
      // Navigate based on user role
      switch (user.user.role) {
        case "VET":
          dashboardPath = "/vet-dashboard";
          roleText = "veterinario";
          break;
        case "ADMIN":
          dashboardPath = "/admin-dashboard";
          roleText = "administrador";
          break;
        default:
          dashboardPath = "/dashboard";
          roleText = "usuario";
      }
      
      toasts.success(`¡Bienvenido, ${user.user.name}! 🎉\nRedirigiendo al panel de ${roleText}...`, {
        duration: 2000,
        icon: '🚀',
      });
      
      setTimeout(() => {
        navigate(dashboardPath);
      }, 1500);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Toast de carga
    const loadingToast = toasts.loading('Iniciando sesión...');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Reemplazar el toast de carga con uno de éxito
      toasts.dismissById(loadingToast);
      toasts.success('¡Credenciales correctas! ✅', {
        duration: 1500,
      });
      
      login({ token, user });
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error("Login error:", error);
      
      // Reemplazar el toast de carga con uno de error
      const errorMessage = error.response?.data?.message || "Credenciales inválidas. Por favor, intenta de nuevo.";
      toasts.dismissById(loadingToast);
      toasts.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-1 ring-emerald-800/20">
            <span className="text-3xl text-white">🔐</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">
            ¡Bienvenido de nuevo!
          </h1>
          <p className="text-slate-600">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-slate-700 mb-2" 
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
                  className={`w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 placeholder-slate-400 ${
                    focusedField === 'email' 
                      ? 'border-emerald-500 shadow-sm shadow-emerald-500/20' 
                      : 'border-slate-200 hover:border-slate-300'
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
            
            {/* Password Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-semibold text-slate-700 mb-2" 
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
                  className={`w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition-all duration-300 placeholder-slate-400 ${
                    focusedField === 'password' 
                      ? 'border-emerald-500 shadow-sm shadow-emerald-500/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors duration-200"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !email || !password || !isValidEmail(email)}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                loading || !email || !password || !isValidEmail(email)
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </button>
          </div>
        </form>
        
        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Link 
              to="/forgot-password" 
              className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors duration-200"
            >
              🤔 ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <div className="border-t border-slate-200 pt-6">
            <p className="text-slate-600 mb-4">¿No tienes cuenta aún?</p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center space-x-2 w-full py-3 px-6 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl font-semibold transition-all duration-300 hover:shadow-md"
            >
              <span>📝</span>
              <span>Crear cuenta nueva</span>
            </Link>
          </div>
        </div>
        
        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <h3 className="text-sm font-semibold text-emerald-900 mb-2">🧪 Credenciales de prueba:</h3>
          <div className="text-xs text-emerald-800 space-y-1">
            <p><strong>Usuario:</strong> user@test.com / password123</p>
            <p><strong>Veterinario:</strong> vet@test.com / password123</p>
            <p><strong>Admin:</strong> admin@test.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
