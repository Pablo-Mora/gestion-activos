/**
 * Utilidades para formateo de datos
 */

// Formatear fecha (YYYY-MM-DD a DD/MM/YYYY)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Formatear moneda (número a formato $1,234.56)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

// Formatear nombre completo
export const formatFullName = (firstName, lastName) => {
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Truncar texto largo
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Formatear serial o código (añadir guiones cada X caracteres)
export const formatSerial = (serial, chunkSize = 4) => {
  if (!serial) return '';
  
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return serial.match(regex).join('-');
};

// Formatear estado de activo
export const formatActivoStatus = (status) => {
  const statusMap = {
    ACTIVO: { label: 'Activo', color: 'text-green-600' },
    INACTIVO: { label: 'Inactivo', color: 'text-red-600' },
    MANTENIMIENTO: { label: 'Mantenimiento', color: 'text-yellow-600' },
    BAJA: { label: 'Baja', color: 'text-gray-600' },
  };
  
  return statusMap[status] || { label: status, color: 'text-gray-600' };
};

// Capitalizar primera letra
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};