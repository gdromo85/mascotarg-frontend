# AGENTS.md - Development Guidelines for mascotarg-frontend

This document provides essential information for agentic coding assistants working in this repository.

## Build, Lint, and Test Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

Note: No test framework is currently configured. Single test execution is not available.

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: Zustand for global state, useState for component state
- **HTTP Client**: Axios via `useApiClient` hook
- **Notifications**: react-hot-toast via `toasts` utility
- **Language**: JavaScript (not TypeScript)

## Code Style Guidelines

### File Structure

```
src/
├── components/        # Reusable UI components
│   ├── Modal/        # Modal-specific components
│   ├── ConsultationForm/  # Form step components
│   └── *.jsx
├── hooks/           # Custom React hooks (camelCase with 'use' prefix)
├── pages/           # Page components (PascalCase, in .jsx)
├── routes/          # Route configuration
├── store/           # Zustand stores
└── utils/           # Utility functions
```

### Naming Conventions

- **Components**: PascalCase (`VetDashboard.jsx`, `QuickAddConsultation.jsx`)
- **Functions/Methods**: camelCase (`handleQuickConsultation`, `setFormData`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useVetPets`, `useVetConsultations`)
- **Constants**: camelCase for most, descriptive names for enums (e.g., `consultationTypes`)
- **Files**: 
  - Components: `ComponentName.jsx`
  - Hooks: `useHookName.js`
  - Utils: `utilityName.js`

### Import Style

```jsx
// External libraries first
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';

// Then hooks from local
import { useAuth } from "../hooks/useAuth";
import { useVetStats } from "../hooks/useVetStats";

// Then components
import Modal from "../components/Modal";
import QuickAddConsultationModal from "../components/Modal/QuickAddConsultationModal";

// Then utils
import { toasts } from "../utils/toasts";
```

### Component Guidelines

1. **Functional Components Only**: No class components
2. **Destructure Props**: Always destructure props at component start
3. **Early Returns**: Use early returns for loading/error states
4. **No PropTypes**: Using JavaScript (proptypes package is installed but not consistently used)

```jsx
function MyComponent({ prop1, prop2, children }) {
  const [state, setState] = useState(null);
  
  // Early return for loading
  if (loading) return <Loading />;
  
  // Early return for error
  if (error) return <Error />;
  
  return <div>{children}</div>;
}
```

### State Management Patterns

```jsx
// Local component state
const [formData, setFormData] = useState({
  petId: null,
  petName: '',
  type: ''
});

// Hooks for API data
const { pets, loading, error } = useVetPets();

// Hooks for actions
const { createConsultation } = useVetConsultations();
```

### Error Handling

- Use try-catch in async functions
- Store error state in hooks
- Display errors with `toasts.error()`
- Log to console with `console.error()`
- Graceful fallbacks (empty arrays, default values)

```jsx
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (err) {
  const errorMsg = err.response?.data?.message || 'Error message';
  setError(errorMsg);
  toasts.error(errorMsg);
  console.error('Error:', err);
  throw err;
}
```

### Form Handling

- Manage form state with `useState`
- Validate in submit handlers
- Use controlled components
- Clear form after successful submission
- Show validation errors via `toasts.form.validationError()`

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.value) {
    toasts.form.requiredFields();
    return;
  }
  
  try {
    await api.post('/submit', formData);
    toasts.success('Success!');
    setFormData(initialState);
  } catch (error) {
    toasts.error('Failed');
  }
};
```

### Routing

- Use `useNavigate` hook for programmatic navigation
- Protected routes via `ProtectedRoute` component
- Role-based access control: CUIDADOR, VET, ADMIN

```jsx
const navigate = useNavigate();
navigate('/vet-dashboard');

// Role-based navigation
const isVet = user?.user?.role === 'VET';
if (isVet) navigate('/vet-dashboard');
else navigate(`/pets/${petId}`);
```

### User Feedback

- **Loading states**: Show spinners for async operations
- **Success messages**: `toasts.success()` with emoji prefix
- **Error messages**: `toasts.error()` with clear description
- **Info messages**: `toasts.info()` with emoji prefix
- **Tooltips**: Use `title` attribute for button explanations

```jsx
toasts.success('📋 Consulta agregada exitosamente');
toasts.error('❌ Error al cargar datos');
toasts.info('ℹ️ Esto es información');
```

### ESLint Configuration

- React hooks enforced (`react-hooks` plugin)
- React refresh for HMR
- Unused variables checked (uppercase pattern ignored)
- `dist/` folder ignored

### Styling with Tailwind

- Use utility classes extensively
- Custom colors: `primary-*`, `secondary-*`, `accent-*`
- Gradient backgrounds common
- Rounded corners: `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-card`, `shadow-card-hover`
- Transitions: `transition-all duration-300`

### Accessibility

- Use semantic HTML elements
- Include `alt` text for images (though emojis used without)
- Keyboard navigation support via tab indices
- Clear button labels with icons

## Key Patterns from Existing Code

1. **Toast Utilities**: Use `toasts` namespace with domain-specific methods (`toasts.pet.added()`, `toasts.auth.loginSuccess()`)
2. **API Calls**: Wrap in custom hooks with loading/error states
3. **Modal Components**: Controlled open/close via props
4. **Date Handling**: Use `dateUtils` with GMT-3 timezone support
5. **Step Forms**: Use `FormStepper` component for multi-step processes

## Special Considerations

- **Language**: Primary UI language is Spanish
- **Icons**: Emojis are used extensively for icons
- **Timezone**: Application uses GMT-3 (Argentina timezone)
- **Role-Based**: Three roles (CUIDADOR, VET, ADMIN) with different dashboards and permissions
- **QR Codes**: Functional QR code generation and scanning support
- **Authentication**: JWT-based auth with token refresh
