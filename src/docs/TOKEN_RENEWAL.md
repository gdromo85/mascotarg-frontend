# 🔄 Sistema de Renovación Automática de Tokens

## 📖 Descripción

Este sistema implementa renovación automática de tokens JWT cuando el servidor responde con error 401 (Unauthorized). Utiliza interceptores de Axios para detectar automáticamente tokens expirados y renovarlos de forma transparente para el usuario.

## 🏗️ Arquitectura

### Componentes Principales:

1. **`axiosConfig.js`** - Cliente Axios con interceptores configurados
2. **`useApiClient.js`** - Hooks para facilitar el uso de la API
3. **`apiConfig.js`** - Configuración centralizada de la API

## 🚀 Funcionalidades

### ✅ Renovación Automática
- Detecta errores 401 automáticamente
- Renueva el token usando el endpoint `/auth/refresh`
- Reintenta la petición original con el nuevo token
- Maneja múltiples peticiones simultáneas correctamente

### ✅ Cola de Peticiones
- Evita múltiples intentos de renovación simultáneos
- Pone en cola las peticiones mientras se renueva el token
- Procesa todas las peticiones pendientes con el nuevo token

### ✅ Manejo de Errores
- Si la renovación falla, hace logout automático
- Redirige al login cuando la sesión expira definitivamente
- Muestra notificaciones apropiadas usando react-hot-toast

### ✅ Headers Automáticos
- Agrega automáticamente el token Authorization a todas las peticiones
- Se actualiza automáticamente cuando el token se renueva

## 📋 Uso

### Método 1: Usar el Hook useApiClient

```javascript
import { useApiClient } from '../hooks/useApiClient';

function MyComponent() {
  const api = useApiClient();

  const fetchData = async () => {
    try {
      // El token se agrega automáticamente
      // Se renueva automáticamente si es necesario
      const response = await api.get('/pets');
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createPet = async (petData) => {
    try {
      const response = await api.post('/pets', petData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Cargar Mascotas</button>
    </div>
  );
}
```

### Método 2: Usar el Cliente Directamente

```javascript
import { apiClient } from '../services/apiConfig';

// Todas las peticiones incluyen renovación automática
const response = await apiClient.get('/pets');
const createResponse = await apiClient.post('/pets', petData);
```

### Método 3: Hook con Manejo Automático de Loading/Errores

```javascript
import { useApiClient, useApiRequest } from '../hooks/useApiClient';

function MyComponent() {
  const api = useApiClient();
  
  const { execute: fetchPets } = useApiRequest(
    () => api.get('/pets'),
    {
      showLoadingToast: true,
      loadingMessage: 'Cargando mascotas...',
      successMessage: 'Mascotas cargadas exitosamente',
      errorMessage: 'Error al cargar mascotas'
    }
  );

  return (
    <button onClick={fetchPets}>
      Cargar Mascotas
    </button>
  );
}
```

## 🔧 Configuración

### Endpoint de Renovación
El sistema asume que existe un endpoint `POST /auth/refresh` que:
- Recibe el token actual en el header Authorization
- Responde con el nuevo token en formato:
```json
{
  "token": "nuevo_jwt_token",
  "user": { /* datos del usuario */ }
}
```

### Personalización
Puedes personalizar el comportamiento editando `axiosConfig.js`:

```javascript
// Cambiar timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos
});

// Cambiar endpoint de renovación
const renewResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {});
```

## 🔒 Seguridad

### Características de Seguridad:
- **Timeout**: Peticiones tienen timeout configurado (10 segundos por defecto)
- **Logout Automático**: Si la renovación falla, se hace logout automático
- **Redirección Segura**: Redirige al login cuando la sesión expira
- **Cola Controlada**: Evita intentos múltiples de renovación

### Consideraciones:
- El token renovado sobrescribe el anterior en el store
- La renovación solo se intenta una vez por petición
- Si falla la renovación, se elimina toda la sesión

## 📊 Estados y Notificaciones

### Notificaciones Automáticas:
- **🔄 Renovando sesión...** - Durante la renovación
- **✅ Sesión renovada exitosamente** - Renovación exitosa
- **🔒 Tu sesión ha expirado...** - Error de renovación

### Estados Manejados:
- `isRefreshing` - Evita renovaciones múltiples
- `failedQueue` - Cola de peticiones pendientes
- `originalRequest._retry` - Evita loops infinitos

## 🎯 Migración desde Axios Normal

### Antes:
```javascript
import axios from 'axios';
import { API_BASE_URL } from '../services/apiConfig';

const response = await axios.get(`${API_BASE_URL}/pets`, {
  headers: {
    Authorization: `Bearer ${user.token}`
  }
});
```

### Después:
```javascript
import { useApiClient } from '../hooks/useApiClient';

const api = useApiClient();
const response = await api.get('/pets'); // Token automático + renovación
```

## 🐛 Troubleshooting

### Problemas Comunes:

1. **Error: "Cannot read properties of undefined"**
   - Verificar que el endpoint `/auth/refresh` existe
   - Verificar formato de respuesta del endpoint

2. **Loops infinitos de renovación**
   - El campo `_retry` previene esto automáticamente
   - Verificar que el endpoint de renovación no devuelva 401

3. **Token no se actualiza**
   - Verificar que el store de Zustand esté funcionando
   - Verificar formato de respuesta del servidor

### Debug:
```javascript
// Habilitar logs en axiosConfig.js
console.log('Renovando token:', currentToken);
console.log('Respuesta de renovación:', renewResponse.data);
```

## 🔄 Flujo de Renovación

1. **Petición Inicial** → Error 401
2. **Verificar Estado** → ¿Ya renovando?
3. **Renovar Token** → POST /auth/refresh
4. **Actualizar Store** → Nuevo token guardado
5. **Procesar Cola** → Reintentar peticiones pendientes
6. **Petición Exitosa** → Respuesta al usuario

Este sistema asegura que el usuario nunca tenga que preocuparse por tokens expirados, proporcionando una experiencia de usuario fluida y segura. 🛡️