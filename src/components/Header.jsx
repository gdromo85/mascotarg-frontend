import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderNavLinks = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link 
            to="/" 
            className="relative px-4 py-2 text-white hover:text-accent-300 transition-all duration-300 hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            🏠 Inicio
          </Link>
          <Link 
            to="/login" 
            className="relative px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            🔑 Ingresar
          </Link>
        </>
      );
    }

    // Navegación basada en el rol del usuario
    const roleConfig = {
      CUIDADOR: {
        links: [{ to: "/dashboard", label: "🐕 Dashboard", icon: "🐕" }],
        emoji: "👤"
      },
      VET: {
        links: [{ to: "/vet-dashboard", label: "🩺 Panel Veterinario", icon: "🩺" }],
        emoji: "⚕️"
      },
      ADMIN: {
        links: [
          { to: "/admin-dashboard", label: "⚙️ Panel Admin", icon: "⚙️" },
          { to: "/dashboard", label: "🐕 Dashboard", icon: "🐕" }
        ],
        emoji: "👑"
      }
    };

    const config = roleConfig[user.user.role] || { links: [], emoji: "👤" };

    return (
      <>
        {config.links.map((link) => (
          <Link 
            key={link.to}
            to={link.to} 
            className="relative px-4 py-2 text-white hover:text-accent-300 transition-all duration-300 hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        
        <div className="flex items-center space-x-3">
          <span className="hidden md:flex items-center space-x-2 text-white/90 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
            <span className="text-lg">{config.emoji}</span>
            <span className="font-medium">Hola, {user.user.name}</span>
          </span>
          
          <button 
            onClick={handleLogout}
            className="group relative px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <span className="flex items-center space-x-2">
              <span>🚪</span>
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </span>
          </button>
        </div>
      </>
    );
  };

  return (
    <header className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 shadow-xl backdrop-blur-sm">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
      
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center space-x-3 text-white hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <span className="text-2xl animate-bounce-slow">🐾</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-display">
                  PetClinic QR
                </h1>
                <p className="text-xs text-white/80 hidden sm:block">Cuidando a tus mascotas</p>
              </div>
            </div>
          </Link>
          
          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {renderNavLinks()}
          </div>
          
          {/* Botón menú móvil */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
            aria-label="Abrir menú"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>
        
        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t border-white/20 animate-slide-up">
            <div className="px-4 py-6 space-y-3">
              {isAuthenticated && user && (
                <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg mb-4">
                  <span className="text-2xl">
                    {user.user.role === 'VET' ? '⚕️' : user.user.role === 'ADMIN' ? '👑' : '👤'}
                  </span>
                  <div>
                    <p className="font-semibold text-primary-900">Hola, {user.user.name}</p>
                    <p className="text-sm text-primary-600">
                      {user.user.role === 'VET' ? 'Veterinario' : 
                       user.user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {renderNavLinks()}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;