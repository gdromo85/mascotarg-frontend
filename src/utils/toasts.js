import toast from 'react-hot-toast';

// Utilidades para toasts personalizados
export const toasts = {
  // Toasts de éxito
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      ...options,
    });
  },

  // Toasts de error
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      ...options,
    });
  },

  // Toasts de carga
  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
    });
  },

  // Toast de información
  info: (message, options = {}) => {
    return toast(message, {
      icon: 'ℹ️',
      duration: 3000,
      ...options,
    });
  },

  // Toast de advertencia
  warning: (message, options = {}) => {
    return toast(message, {
      icon: '⚠️',
      duration: 4000,
      style: {
        background: '#F59E0B',
        color: '#fff',
      },
      ...options,
    });
  },

  // Toasts específicos para el dominio de mascotas
  pet: {
    added: (petName) => toast.success(`🐾 ${petName} ha sido agregado exitosamente!`, {
      duration: 3000,
      icon: '🎉',
    }),

    updated: (petName) => toast.success(`🐾 ${petName} ha sido actualizado!`, {
      duration: 3000,
      icon: '✨',
    }),

    deleted: (petName) => toast.success(`${petName} ha sido eliminado`, {
      duration: 3000,
      icon: '👋',
    }),

    medicalRecordAdded: (petName) => toast.success(`📋 Registro médico agregado para ${petName}`, {
      duration: 3000,
      icon: '🩺',
    }),

    qrGenerated: (petName) => toast.success(`📱 Código QR generado para ${petName}`, {
      duration: 3000,
      icon: '🔗',
    }),
  },

  // Toasts para autenticación
  auth: {
    loginSuccess: (userName) => toast.success(`¡Bienvenido de nuevo, ${userName}! 🚀`, {
      duration: 2000,
      icon: '🎉',
    }),

    loginError: () => toast.error('Credenciales inválidas. Por favor, intenta de nuevo.', {
      duration: 4000,
      icon: '🔒',
    }),

    registerSuccess: () => toast.success('¡Cuenta creada exitosamente! 🎉\nRedirigiendo...', {
      duration: 2000,
      icon: '🎊',
    }),

    logoutSuccess: () => toast.success('Sesión cerrada correctamente 👋', {
      duration: 2000,
      icon: '🚪',
    }),

    sessionExpired: () => toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', {
      duration: 5000,
      icon: '⏰',
    }),
  },

  // Toasts para acciones de archivos
  file: {
    uploaded: (fileName) => toast.success(`📁 ${fileName} subido exitosamente!`, {
      duration: 3000,
      icon: '⬆️',
    }),

    uploadError: () => toast.error('Error al subir el archivo. Intenta de nuevo.', {
      duration: 4000,
      icon: '📁',
    }),

    downloadReady: () => toast.success('Descarga lista 📥', {
      duration: 2000,
      icon: '⬇️',
    }),
  },

  // Toasts para validaciones de formularios
  form: {
    invalidEmail: () => toast.error('Por favor, ingresa un email válido', {
      duration: 3000,
      icon: '📧',
    }),

    passwordMismatch: () => toast.error('Las contraseñas no coinciden', {
      duration: 3000,
      icon: '🔒',
    }),

    requiredFields: () => toast.error('Por favor, completa todos los campos requeridos', {
      duration: 3000,
      icon: '📝',
    }),

    phoneInvalid: () => toast.error('Por favor, ingresa un número de teléfono válido', {
      duration: 3000,
      icon: '📱',
    }),
  },

  // Toasts para acciones de red
  network: {
    offline: () => toast.error('Sin conexión a internet', {
      duration: 5000,
      icon: '📡',
    }),

    online: () => toast.success('Conexión restaurada', {
      duration: 2000,
      icon: '🌐',
    }),

    serverError: () => toast.error('Error del servidor. Intenta de nuevo más tarde.', {
      duration: 5000,
      icon: '🔧',
    }),
  },

  // Función para cerrar todos los toasts
  dismiss: () => toast.dismiss(),

  // Función para cerrar un toast específico
  dismissById: (id) => toast.dismiss(id),

  // Promise toast - útil para operaciones asíncronas
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Cargando...',
      success: messages.success || '¡Operación exitosa!',
      error: messages.error || 'Algo salió mal',
      ...messages.options,
    });
  },
};

export default toasts;