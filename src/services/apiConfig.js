export const API_BASE_URL = import.meta.env.VITE_API_URL ||"http://localhost:3001/api"; // Cambiar cuando conectes el backend
console.log("🚀 ~ API_BASE_URL:", API_BASE_URL)

// Exportar también el cliente axios configurado
export { default as apiClient } from './axiosConfig';
