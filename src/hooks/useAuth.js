/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

// Hook mejorado para manejar autenticación con JWT y zustand
export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  return { user, isAuthenticated, login, logout, loading };
}
