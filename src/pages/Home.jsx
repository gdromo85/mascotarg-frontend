import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: "📱",
      title: "Códigos QR",
      description: "Genera códigos QR únicos para cada mascota y accede rápidamente a su historial médico.",
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: "⚕️",
      title: "Historial Médico",
      description: "Mantén un registro completo de todas las consultas, tratamientos y medicamentos.",
      color: "from-teal-600 to-emerald-600"
    },
    {
      icon: "🐈",
      title: "Multi-Mascota",
      description: "Gestiona múltiples mascotas desde una sola cuenta con perfiles individualizados.",
      color: "from-amber-500 to-emerald-600"
    },
    {
      icon: "🔒",
      title: "Seguro y Confiable",
      description: "Tus datos están protegidos con encriptación de nivel bancario y respaldos automáticos.",
      color: "from-slate-600 to-emerald-700"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Dueña de Luna",
      content: "Excelente aplicación. El veterinario puede acceder al historial de Luna instantáneamente.",
      avatar: "👩"
    },
    {
      name: "Dr. Carlos Ruiz",
      role: "Veterinario",
      content: "Revolucionó mi consulta. Acceso inmediato a historiales completos y actualizados.",
      avatar: "👨‍⚕️"
    },
    {
      name: "Ana Martínez",
      role: "Dueña de Max y Bella",
      content: "Perfecto para gestionar mis dos mascotas. Todo organizado en un solo lugar.",
      avatar: "👩‍🦯"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-teal-200/30 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-200/30 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Contenido principal */}
            <div className="lg:w-1/2 text-left">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-900 rounded-full text-sm font-medium mb-4">
                  🎆 Nuevo: Soporte para múltiples veterinarias
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 bg-clip-text leading-tight text-slate-900">
                Cuida a tus mascotas con
                <span className="block text-slate-900">tecnología QR</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                La plataforma más avanzada para gestionar el historial clínico de tus mascotas.
                Acceso instantáneo, seguro y siempre actualizado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to={user?.user?.role === 'VET' ? '/vet-dashboard' : 
                           user?.user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard'}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <span>🚀</span>
                      <span>Ir al Dashboard</span>
                    </Link>
                    <Link 
                      to="/pets/new" 
                      className="bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-md"
                    >
                      <span>🐕</span>
                      <span>Agregar Mascota</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <span>🎆</span>
                      <span>Comenzar Gratis</span>
                    </Link>
                    <Link 
                      to="/login" 
                      className="bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-md"
                    >
                      <span>🔑</span>
                      <span>Iniciar Sesión</span>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>1000+ mascotas registradas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
                  <span>50+ veterinarias</span>
                </div>
              </div>
            </div>
            
            {/* Imagen/Ilustración */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                    <div className="text-center">
                      <div className="text-8xl mb-4 animate-bounce-slow">🐾</div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">QR de Luna</h3>
                      <div className="bg-slate-100 w-32 h-32 mx-auto rounded-lg flex items-center justify-center">
                        <div className="text-4xl">🗺️</div>
                      </div>
                      <p className="text-sm text-slate-600 mt-4">Escanea para ver historial</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4 text-slate-900">
              ✨ Características Principales
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Todo lo que necesitas para mantener a tus mascotas saludables y felices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white/90 rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4 text-slate-900">
              💬 Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-slate-600">
              Historias reales de dueños y veterinarios que confían en nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-md animate-slide-up border border-slate-200"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold font-display mb-6">
            🚀 ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de dueños y veterinarios que ya están transformando el cuidado de mascotas
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-emerald-800 hover:bg-emerald-50 px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
              >
                <span>🎆</span>
                <span>Registrarse Gratis</span>
              </Link>
              <Link 
                to="/login" 
                className="border border-white text-white hover:bg-white hover:text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <span>🔑</span>
                <span>Ya tengo cuenta</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
