import React from "react";
import { useAuth } from "../hooks/useAuth";
import { toasts } from "../utils/toasts";

function VetDashboard() {
  const { user } = useAuth();

  const vetStats = [
    { label: 'Mascotas Asignadas', value: '42', icon: '🐾', color: 'from-blue-500 to-cyan-500', trend: '+5' },
    { label: 'Consultas Hoy', value: '8', icon: '👩‍⚕️', color: 'from-green-500 to-emerald-500', trend: '+2' },
    { label: 'Registros Pendientes', value: '3', icon: '📋', color: 'from-orange-500 to-red-500', trend: '-1' },
    { label: 'Emergencias', value: '1', icon: '🆘', color: 'from-red-500 to-pink-500', trend: '0' }
  ];

  const quickActions = [
    { title: 'Agregar Consulta', desc: 'Registrar nueva consulta veterinaria', icon: '➕', color: 'btn-primary' },
    { title: 'Ver Agenda', desc: 'Revisar citas programadas para hoy', icon: '📅', color: 'bg-purple-500 hover:bg-purple-600' },
    { title: 'Buscar Mascota', desc: 'Buscar por nombre o código QR', icon: '🔍', color: 'bg-indigo-500 hover:bg-indigo-600' },
    { title: 'Emergencias', desc: 'Atender casos de emergencia', icon: '🆘', color: 'bg-red-500 hover:bg-red-600' }
  ];

  const recentPatients = [
    { name: 'Luna', species: 'Perro', owner: 'Ana Martínez', lastVisit: '2025-01-20', status: 'Saludable', emoji: '🐶' },
    { name: 'Milo', species: 'Gato', owner: 'Carlos Ruiz', lastVisit: '2025-01-19', status: 'Seguimiento', emoji: '🐱' },
    { name: 'Paco', species: 'Ave', owner: 'Luis Pérez', lastVisit: '2025-01-18', status: 'Tratamiento', emoji: '🦅' },
    { name: 'Bella', species: 'Perro', owner: 'María González', lastVisit: '2025-01-17', status: 'Saludable', emoji: '🐶' }
  ];

  const upcomingAppointments = [
    { time: '10:00 AM', pet: 'Rocky', owner: 'Pedro Silva', type: 'Vacunación' },
    { time: '11:30 AM', pet: 'Whiskers', owner: 'Ana López', type: 'Revisión' },
    { time: '02:00 PM', pet: 'Max', owner: 'José Ramírez', type: 'Cirugía menor' },
    { time: '03:30 PM', pet: 'Lola', owner: 'Carmen Torres', type: 'Consulta' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Saludable': 'text-green-600 bg-green-100',
      'Seguimiento': 'text-yellow-600 bg-yellow-100',
      'Tratamiento': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">👩‍⚕️</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold font-display">Panel Veterinario</h1>
                  <p className="text-white/90 text-lg">Bienvenido, Dr. {user?.user.name}</p>
                </div>
              </div>
              <p className="text-white/80 max-w-2xl">
                Gestiona tus pacientes, consultas y registros médicos de manera eficiente.
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {vetStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend.startsWith('+') ? 'text-green-600 bg-green-100' :
                  stat.trend.startsWith('-') ? 'text-red-600 bg-red-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {stat.trend !== '0' ? stat.trend : 'Sin cambios'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Acciones Rápidas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center space-x-2">
                <span>⚡</span>
                <span>Acciones Rápidas</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (action.title === 'Agregar Consulta') {
                        toasts.info('🏥 Funcionalidad próximamente disponible');
                      } else if (action.title === 'Ver Agenda') {
                        toasts.info('📅 Funcionalidad próximamente disponible');
                      } else if (action.title === 'Buscar Mascota') {
                        toasts.info('🔍 Funcionalidad próximamente disponible');
                      } else if (action.title === 'Emergencias') {
                        toasts.warning('🆘 Protocolo de emergencias activado');
                      }
                    }}
                    className={`${action.color} text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center space-x-3`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm opacity-90">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pacientes Recientes */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <span>🐾</span>
                <span>Pacientes Recientes</span>
              </h2>
              <div className="space-y-3">
                {recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-2xl">{patient.emoji}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                        <p className="text-sm text-gray-600">{patient.species} - {patient.owner}</p>
                        <p className="text-xs text-gray-500">Última visita: {patient.lastVisit}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Citas Próximas */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <span>📅</span>
              <span>Citas de Hoy</span>
            </h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="border-l-4 border-primary-500 bg-primary-50 p-4 rounded-r-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{appointment.pet}</h3>
                    <span className="text-sm font-medium text-primary-600">{appointment.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{appointment.owner}</p>
                  <p className="text-xs text-primary-700 font-medium">{appointment.type}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => toasts.info('📅 Funcionalidad próximamente disponible')}
              className="w-full mt-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors duration-300"
            >
              Ver agenda completa
            </button>
          </div>
        </div>

        {/* Herramientas Veterinarias */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">🩺</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Herramientas Especializadas
            </h2>
            <p className="text-gray-600">
              Accede a herramientas especializadas para el cuidado veterinario
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📋', title: 'Historiales Médicos', desc: 'Revisar y actualizar historiales' },
              { icon: '💊', title: 'Recetas Digitales', desc: 'Generar recetas y tratamientos' },
              { icon: '📊', title: 'Reportes Médicos', desc: 'Crear reportes especializados' }
            ].map((tool, index) => (
              <button 
                key={index} 
                onClick={() => {
                  if (tool.title === 'Historiales Médicos') {
                    toasts.info('📋 Funcionalidad próximamente disponible');
                  } else if (tool.title === 'Recetas Digitales') {
                    toasts.info('💊 Funcionalidad próximamente disponible');
                  } else if (tool.title === 'Reportes Médicos') {
                    toasts.info('📊 Funcionalidad próximamente disponible');
                  }
                }}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VetDashboard;