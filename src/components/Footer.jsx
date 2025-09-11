import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-primary-900 to-secondary-900 text-white mt-auto">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenido principal del footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">PetClinic QR</h3>
                <p className="text-sm text-white/80">Cuidando a tus mascotas</p>
              </div>
            </div>
            <p className="text-white/90 mb-4 max-w-md">
              La plataforma más completa para el manejo de historiales clínicos de mascotas. 
              Tecnología QR para un acceso rápido y seguro a la información médica.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                📱 <span>App Móvil</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                ☁️ <span>En la Nube</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                🔒 <span>100% Seguro</span>
              </div>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent-300">🔗 Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  🏠 Inicio
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/80 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  🔑 Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/80 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  📝 Registrarse
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Información de contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent-300">📞 Contacto</h4>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>info@petclinicqr.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📱</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>Ciudad, País</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🕰️</span>
                <span>24/7 Soporte</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Barra inferior */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-white/80">
              <span>© {currentYear} PetClinic QR - Todos los derechos reservados</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                📋 Política de Privacidad
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                📜 Términos de Servicio
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                ❓ Ayuda
              </a>
            </div>
          </div>
        </div>
        
        {/* Indicador de estado del sistema */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2 bg-success-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
            <span className="text-success-200">Sistema Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
