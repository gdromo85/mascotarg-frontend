import React from "react";
import { useAuth } from "../hooks/useAuth";
import { toasts } from "../utils/toasts";

function AdminDashboard() {
  const { user } = useAuth();

  const adminStats = [
    { label: 'Total Usuarios', value: '1,234', icon: '👥', color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Mascotas Registradas', value: '5,678', icon: '🐾', color: 'from-green-500 to-emerald-500', change: '+8%' },
    { label: 'Veterinarios', value: '89', icon: '👩‍⚕️', color: 'from-purple-500 to-violet-500', change: '+3%' },
    { label: 'Registros Médicos', value: '12,345', icon: '📋', color: 'from-orange-500 to-red-500', change: '+15%' }
  ];

  const quickActions = [
    { title: 'Gestionar Usuarios', desc: 'Ver, editar y administrar cuentas de usuario', icon: '👥', action: () => toasts.info('👥 Funcionalidad próximamente disponible') },
    { title: 'Moderar Contenido', desc: 'Revisar y moderar contenido reportado', icon: '🛡️', action: () => toasts.warning('🛡️ Sistema de moderación próximamente') },
    { title: 'Reportes del Sistema', desc: 'Ver estadísticas y reportes detallados', icon: '📊', action: () => toasts.info('📊 Funcionalidad próximamente disponible') },
    { title: 'Configuración', desc: 'Ajustar configuraciones del sistema', icon: '⚙️', action: () => toasts.info('⚙️ Funcionalidad próximamente disponible') },
    { title: 'Respaldos', desc: 'Gestionar respaldos y restauración', icon: '💾', action: () => toasts.success('💾 Sistema de respaldos activo') },
    { title: 'Logs del Sistema', desc: 'Revisar logs y actividad del sistema', icon: '📝', action: () => toasts.info('📝 Funcionalidad próximamente disponible') }
  ];

  const recentActivity = [
    { time: '10:30 AM', action: 'Nuevo usuario registrado', user: 'Ana González', type: 'user' },
    { time: '10:15 AM', action: 'Reporte de contenido', user: 'Sistema', type: 'report' },
    { time: '09:45 AM', action: 'Veterinario aprobado', user: 'Dr. Carlos Ruiz', type: 'vet' },
    { time: '09:30 AM', action: 'Backup completado', user: 'Sistema', type: 'system' },
    { time: '09:00 AM', action: 'Nueva mascota registrada', user: 'Luis Pérez', type: 'pet' }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      user: '👤', report: '⚠️', vet: '👩‍⚕️', system: '🖥️', pet: '🐕'
    };
    return icons[type] || '📌';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-8 text-white relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center ring-1 ring-white/20">
                  <span className="text-3xl">👑</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold font-display">Panel de Administrador</h1>
                  <p className="text-white/90 text-lg">Bienvenido, {user?.user.name}</p>
                </div>
              </div>
              <p className="text-white/80 max-w-2xl">
                Gestiona y supervisa toda la plataforma PetClinic QR desde este panel centralizado.
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <div key={index} className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center ring-1 ring-black/5`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <span className="text-sm font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Acciones Rápidas */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center space-x-2 text-slate-900">
                <span>⚡</span>
                <span>Acciones Rápidas</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-4 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-slate-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-lg">{action.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors duration-300">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">{action.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 text-slate-900">
              <span>📊</span>
              <span>Actividad Reciente</span>
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 border border-slate-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm ring-1 ring-slate-200">
                    <span className="text-sm">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{activity.action}</p>
                    <p className="text-xs text-slate-600">{activity.user}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funcionalidades Próximas */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-1 ring-slate-200">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Funcionalidades en Desarrollo
            </h2>
            <p className="text-slate-600 mb-6 max-w-3xl mx-auto">
              Estamos trabajando constantemente para mejorar la plataforma. Próximamente dispondrás de
              herramientas avanzadas de análisis, reportes personalizables y gestión automatizada.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { icon: '📈', title: 'Analytics Avanzado', desc: 'Métricas detalladas y tendencias' },
                { icon: '🤖', title: 'Automatización', desc: 'Procesos automáticos inteligentes' },
                { icon: '🔔', title: 'Notificaciones', desc: 'Sistema de alertas personalizable' }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
