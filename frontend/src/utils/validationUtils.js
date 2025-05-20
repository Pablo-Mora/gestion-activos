/**
 * Utilidades para validación de formularios
 */

// Validar que un campo no esté vacío
export const validateRequired = (value) => {
  if (!value && value !== 0) {
    return 'Este campo es obligatorio';
  }
  return '';
};

// Validar correo electrónico
export const validateEmail = (email) => {
  if (!email) return 'El correo electrónico es obligatorio';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Ingrese un correo electrónico válido';
  }
  return '';
};

// Validar longitud mínima
export const validateMinLength = (value, minLength) => {
  if (!value) return '';
  
  if (value.length < minLength) {
    return `Debe contener al menos ${minLength} caracteres`;
  }
  return '';
};

// Validar longitud máxima
export const validateMaxLength = (value, maxLength) => {
  if (!value) return '';
  
  if (value.length > maxLength) {
    return `No debe exceder ${maxLength} caracteres`;
  }
  return '';
};

// Validar contraseña segura (al menos 8 caracteres, una mayúscula, una minúscula y un número)
export const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra mayúscula';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra minúscula';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe contener al menos un número';
  }
  
  return '';
};

// Validar que dos contraseñas coincidan
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirme su contraseña';
  
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return '';
};

// Validar número positivo
export const validatePositiveNumber = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  
  const num = Number(value);
  if (isNaN(num)) {
    return 'Debe ser un número válido';
  }
  
  if (num <= 0) {
    return 'Debe ser un número positivo';
  }
  return '';
};

// Validar fecha en el pasado
export const validatePastDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const today = new Date();
  
  if (date > today) {
    return 'La fecha debe ser en el pasado o hoy';
  }
  return '';
};

// Validar formato de fecha
export const validateDateFormat = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Formato de fecha inválido';
  }
  return '';
};