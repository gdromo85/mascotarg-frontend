# 🔥 Guía de React Hot Toast

Este proyecto utiliza **react-hot-toast** para manejar todas las notificaciones de manera consistente y elegante.

## 📦 Instalación

Para instalar react-hot-toast en el proyecto:

```bash
npm install react-hot-toast
```

## ⚙️ Configuración

### 1. Toaster Global
El componente `Toaster` está configurado en `src/App.jsx` con estilos personalizados:

```jsx
import { Toaster } from 'react-hot-toast';

// En el componente App
<Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  toastOptions={{
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    success: {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    },
  }}
/>
```

### 2. Utilidades Personalizadas
Se creó un archivo de utilidades en `src/utils/toasts.js` que proporciona funciones predefinidas para diferentes tipos de notificaciones.

## 🚀 Uso Básico

### Importar las utilidades
```jsx
import { toasts } from '../utils/toasts';
```

### Tipos de Toast Disponibles

#### ✅ Éxito
```jsx
toasts.success('¡Operación exitosa!');
toasts.success('Mensaje personalizado', {
  duration: 3000,
  icon: '🎉'
});
```

#### ❌ Error
```jsx
toasts.error('Ha ocurrido un error');
toasts.error('Error personalizado', {
  duration: 5000
});
```

#### ⏳ Carga
```jsx
const loadingToast = toasts.loading('Procesando...');
// Más tarde...
toasts.dismissById(loadingToast);
toasts.success('¡Completado!');
```

#### ℹ️ Información
```jsx
toasts.info('Información importante');
```

#### ⚠️ Advertencia
```jsx
toasts.warning('Ten cuidado con esto');
```

## 🐾 Toasts Específicos del Dominio

### Mascotas
```jsx
// Cuando se agrega una mascota
toasts.pet.added('Firulais');

// Cuando se actualiza
toasts.pet.updated('Firulais');

// Cuando se elimina
toasts.pet.deleted('Firulais');

// Registro médico agregado
toasts.pet.medicalRecordAdded('Firulais');

// QR generado
toasts.pet.qrGenerated('Firulais');
```

### Autenticación
```jsx
// Login exitoso
toasts.auth.loginSuccess('Juan Pérez');

// Error de login
toasts.auth.loginError();

// Registro exitoso
toasts.auth.registerSuccess();

// Logout
toasts.auth.logoutSuccess();

// Sesión expirada
toasts.auth.sessionExpired();
```

### Formularios
```jsx
// Email inválido
toasts.form.invalidEmail();

// Contraseñas no coinciden
toasts.form.passwordMismatch();

// Campos requeridos
toasts.form.requiredFields();

// Teléfono inválido
toasts.form.phoneInvalid();
```

### Archivos
```jsx
// Archivo subido
toasts.file.uploaded('documento.pdf');

// Error de subida
toasts.file.uploadError();

// Descarga lista
toasts.file.downloadReady();
```

### Red
```jsx
// Sin conexión
toasts.network.offline();

// Conexión restaurada
toasts.network.online();

// Error del servidor
toasts.network.serverError();
```

## 🔧 Funciones Avanzadas

### Toast Promise
Para operaciones asíncronas:
```jsx
const myPromise = fetch('/api/data');

toasts.promise(myPromise, {
  loading: 'Cargando datos...',
  success: '¡Datos cargados!',
  error: 'Error al cargar datos'
});
```

### Cerrar Toasts
```jsx
// Cerrar todos los toasts
toasts.dismiss();

// Cerrar un toast específico
toasts.dismissById(toastId);
```

## 📱 Ejemplo Práctico

### En un formulario de registro:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validaciones
  if (password !== confirmPassword) {
    toasts.form.passwordMismatch();
    return;
  }
  
  if (!isValidEmail(email)) {
    toasts.form.invalidEmail();
    return;
  }
  
  // Proceso de registro
  const loadingToast = toasts.loading('Creando cuenta...');
  
  try {
    const response = await registerUser(userData);
    
    toasts.dismissById(loadingToast);
    toasts.auth.registerSuccess();
    
    navigate('/dashboard');
  } catch (error) {
    toasts.dismissById(loadingToast);
    toasts.error(error.message || 'Error al crear cuenta');
  }
};
```

## 🎨 Personalización

### Estilos Personalizados
```jsx
toasts.success('Mensaje', {
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
  },
  iconTheme: {
    primary: '#713200',
    secondary: '#FFFAEE',
  },
});
```

### Posición del Toast
```jsx
toasts.success('Mensaje', {
  position: 'bottom-center'
});
```

### Duración Personalizada
```jsx
toasts.success('Este mensaje dura 10 segundos', {
  duration: 10000
});
```

## 📂 Archivos Modificados

- `src/App.jsx` - Configuración del Toaster global
- `src/pages/Register.jsx` - Implementación en registro
- `src/pages/Login.jsx` - Implementación en login
- `src/store/authStore.js` - Toast en logout
- `src/utils/toasts.js` - Utilidades personalizadas

## 💡 Mejores Prácticas

1. **Usa las utilidades predefinidas** en lugar de importar `toast` directamente
2. **Cierra los toasts de carga** antes de mostrar el resultado
3. **Usa duraciones apropiadas**: 3s para éxito, 5s para errores
4. **Incluye emojis** para hacer las notificaciones más amigables
5. **Agrupa notificaciones relacionadas** usando las funciones específicas del dominio

## 🔮 Funcionalidades Futuras

- Toast con botones de acción
- Toast de confirmación
- Toast persistentes para errores críticos
- Integración con sistema de logs
- Toast con progress bar para operaciones largas

---

¡Disfruta de unas notificaciones elegantes y consistentes! 🎉