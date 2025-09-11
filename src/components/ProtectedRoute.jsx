import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

// Componente para proteger rutas que requieren autenticación
function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <Loading />;
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especificaron roles permitidos, verificar que el usuario tenga uno de ellos
  if (allowedRoles && !allowedRoles.includes(user.user.role)) {
    // Redirigir a una página apropiada según el rol del usuario
    switch (user.user.role) {
      case "CUIDADOR":
        return <Navigate to="/dashboard" replace />;
      case "VET":
        return <Navigate to="/vet-dashboard" replace />;
      case "ADMIN":
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;