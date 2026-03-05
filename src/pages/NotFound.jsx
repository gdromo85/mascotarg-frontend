import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Elementos decorativos animados */}
        <div className="relative mb-8">
          <div className="absolute top-10 left-10 w-16 h-16 bg-emerald-200/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-5 right-8 w-12 h-12 bg-teal-200/30 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-md animate-float" style={{animationDelay: '2s'}}></div>
          
          {/* Número 404 grande */}
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-bold font-display mb-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 bg-clip-text text-transparent animate-pulse-slow">
              404
            </h1>
            
            {/* Emoji de mascota perdida */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-6xl md:text-8xl animate-bounce-slow">🐕‍🦺</span>
            </div>
          </div>
        </div>
        
        {/* Mensaje principal */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
            ¡Ups! Esta página se perdió
          </h2>
          <p className="text-xl text-slate-600 mb-6 leading-relaxed">
            Parece que esta página se escapó como una mascota traviesa.
            <br className="hidden md:block" />
            No te preocupes, te ayudamos a encontrar el camino de vuelta.
          </p>
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link 
            to="/" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300"
          >
            <span>🏠</span>
            <span>Volver al Inicio</span>
          </Link>
          
          <Link 
            to="/dashboard" 
            className="bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-md"
          >
            <span>📊</span>
            <span>Ir al Dashboard</span>
          </Link>
        </div>
        
        {/* Sugerencias útiles */}
        <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            🔍 ¿Qué puedes hacer?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <span className="text-2xl mb-2 block">🐕</span>
              <p className="font-medium text-slate-700 mb-1">Ver tus mascotas</p>
              <Link to="/dashboard" className="text-emerald-700 hover:text-emerald-800 transition-colors">
                Ir al dashboard
              </Link>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <span className="text-2xl mb-2 block">➕</span>
              <p className="font-medium text-slate-700 mb-1">Agregar mascota</p>
              <Link to="/pets/new" className="text-emerald-700 hover:text-emerald-800 transition-colors">
                Crear perfil
              </Link>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <span className="text-2xl mb-2 block">❓</span>
              <p className="font-medium text-slate-700 mb-1">¿Necesitas ayuda?</p>
              <Link to="/" className="text-emerald-700 hover:text-emerald-800 transition-colors">
                Contactar soporte
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mensaje divertido */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-slate-500 text-sm">
            <span>🐾</span>
            <span>Error 404: Página no encontrada, pero las mascotas sí están seguras</span>
            <span>🐾</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
