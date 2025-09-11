# Codebase Conventions

## Commands
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview build: `npm run preview`
- Add zustand: `npm install zustand`

## Code Style
- Use functional components with React hooks
- Component files use .jsx extension
- Import React from 'react' when using JSX
- Use Tailwind CSS for styling
- Use PropTypes for component prop validation
- Use camelCase for variables and functions
- Use PascalCase for components
- Use descriptive variable names
- Error handling: Use try/catch blocks and proper error messages
- Destructure props in function parameters when possible
- Use early returns to avoid nested if statements

## Project Structure
- src/App.jsx: Main app component
- src/main.jsx: Entry point
- src/routes/AppRouter.jsx: Routes configuration
- src/pages/: Page components
- src/components/: Reusable components
- src/hooks/: Custom hooks
- src/services/: API services
- src/assets/: Static assets

## Routing
- Uses React Router v7
- Routes defined in src/routes/AppRouter.jsx

## State Management
- Uses Zustand for global state management
- Uses React hooks (useState, useContext) for local component state