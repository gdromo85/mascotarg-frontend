/**
 * Utilidades para manejo de fechas con zona horaria GMT -3
 * Evita desfases de fechas al convertir entre formatos
 */

// Zona horaria para Argentina/Chile (GMT -3)
const TIMEZONE_OFFSET = -3;

/**
 * Convierte una fecha a formato ISO considerando GMT -3
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato ISO con zona horaria GMT -3
 */
export const toISOStringGMT3 = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  // Ajustar la fecha para GMT -3
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000; // -3 horas en millisegundos
  const adjustedDate = new Date(dateObj.getTime() - offsetMs);
  
  return adjustedDate.toISOString();
};

/**
 * Convierte una fecha a formato de input date (YYYY-MM-DD) considerando GMT -3
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const toInputDateGMT3 = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  // Crear fecha local ajustada para GMT -3
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000;
  const adjustedDate = new Date(dateObj.getTime() - offsetMs);
  
  // Formatear como YYYY-MM-DD
  return adjustedDate.toISOString().split('T')[0];
};

/**
 * Convierte una fecha de input (YYYY-MM-DD) a Date considerando GMT -3
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {Date} Objeto Date ajustado para GMT -3
 */
export const fromInputDateGMT3 = (dateString) => {
  if (!dateString) return null;
  
  // Crear fecha a las 12:00 del día para evitar problemas de zona horaria
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  
  // Ajustar para GMT -3
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000;
  return new Date(date.getTime() - offsetMs);
};

/**
 * Convierte una fecha de input datetime-local (YYYY-MM-DDTHH:MM) a Date considerando GMT -3
 * @param {string} datetimeString - Fecha y hora en formato YYYY-MM-DDTHH:MM
 * @returns {Date} Objeto Date ajustado para GMT -3
 */
export const fromInputDateTimeGMT3 = (datetimeString) => {
  if (!datetimeString) return null;
  
  // Parsear la fecha y hora del formato datetime-local
  const [datePart, timePart] = datetimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  // Crear fecha con la hora especificada
  const date = new Date(year, month - 1, day, hours, minutes, 0);
  
  // Ajustar para GMT -3
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000;
  return new Date(date.getTime() - offsetMs);
};

/**
 * Obtiene la fecha actual en GMT -3 para inputs de fecha
 * @returns {string} Fecha actual en formato YYYY-MM-DD
 */
export const getCurrentDateGMT3 = () => {
  const now = new Date();
  
  // Ajustar para GMT -3
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000;
  const adjustedNow = new Date(now.getTime() - offsetMs);
  
  return adjustedNow.toISOString().split('T')[0];
};

/**
 * Formatea una fecha para mostrar en la UI (DD/MM/YYYY)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada como DD/MM/YYYY
 */
export const formatDateForDisplay = (date) => {
  if (!date) return 'No especificada';
  
  const dateObj = new Date(date);
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';
  
  // Ajustar para GMT -3
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000;
  const adjustedDate = new Date(dateObj.getTime() - offsetMs);
  
  return adjustedDate.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires'
  });
};

/**
 * Calcula la edad basada en una fecha de nacimiento considerando GMT -3
 * @param {Date|string} birthDate - Fecha de nacimiento
 * @returns {string} Edad formateada (ej: "2 años, 3 meses")
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return "N/A";
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  // Ajustar ambas fechas para GMT -3
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000;
  const adjustedBirth = new Date(birth.getTime() - offsetMs);
  const adjustedToday = new Date(today.getTime() - offsetMs);
  
  const diffTime = Math.abs(adjustedToday - adjustedBirth);
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  
  if (diffYears > 0) {
    return diffMonths > 0 ? `${diffYears} años, ${diffMonths} meses` : `${diffYears} años`;
  }
  return diffMonths > 0 ? `${diffMonths} meses` : "Menos de 1 mes";
};

/**
 * Valida si una fecha es válida y no es futura
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {boolean} True si la fecha es válida
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return false;
  
  // Verificar que no sea una fecha futura (considerando GMT -3)
  const offsetMs = TIMEZONE_OFFSET * 60 * 60 * 1000;
  const adjustedToday = new Date(today.getTime() - offsetMs);
  const adjustedDate = new Date(date.getTime() - offsetMs);
  
  return adjustedDate <= adjustedToday;
};

/**
 * Obtiene el máximo valor permitido para un input de fecha (hoy en GMT -3)
 * @returns {string} Fecha máxima en formato YYYY-MM-DD
 */
export const getMaxDateForInput = () => {
  return getCurrentDateGMT3();
};

export default {
  toISOStringGMT3,
  toInputDateGMT3,
  fromInputDateGMT3,
  fromInputDateTimeGMT3,
  getCurrentDateGMT3,
  formatDateForDisplay,
  calculateAge,
  isValidDate,
  getMaxDateForInput
};