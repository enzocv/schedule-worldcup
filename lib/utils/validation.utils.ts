/**
 * Utilidades de validación para eventos
 */

import { EventFormData, EventValidationError } from '../types/event.types';
import { parseTime } from './date.utils';

/**
 * Valida que un título no esté vacío
 */
export function validateTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return 'El título es requerido';
  }
  if (title.length > 100) {
    return 'El título no puede exceder 100 caracteres';
  }
  return null;
}

/**
 * Valida que la descripción no exceda el límite
 */
export function validateDescription(description?: string): string | null {
  if (description && description.length > 500) {
    return 'La descripción no puede exceder 500 caracteres';
  }
  return null;
}

/**
 * Valida que la fecha sea válida
 */
export function validateDate(dateString: string): string | null {
  if (!dateString) {
    return 'La fecha es requerida';
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return 'Formato de fecha inválido (debe ser YYYY-MM-DD)';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  return null;
}

/**
 * Valida que la hora sea válida
 */
export function validateTime(timeString: string): string | null {
  if (!timeString) {
    return 'La hora es requerida';
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(timeString)) {
    return 'Formato de hora inválido (debe ser HH:mm)';
  }

  return null;
}

/**
 * Valida que la hora de inicio sea anterior a la hora de fin
 */
export function validateTimeRange(startTime: string, endTime: string): string | null {
  const startError = validateTime(startTime);
  const endError = validateTime(endTime);

  if (startError || endError) {
    return null; // Los errores individuales ya se manejan
  }

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  if (startMinutes >= endMinutes) {
    return 'La hora de inicio debe ser anterior a la hora de fin';
  }

  return null;
}

/**
 * Valida que la categoría sea válida
 */
export function validateCategory(category: string): string | null {
  const validCategories = ['work', 'personal', 'meeting', 'other'];
  if (!validCategories.includes(category)) {
    return 'Categoría inválida';
  }
  return null;
}

/**
 * Valida todos los campos de un formulario de evento
 */
export function validateEventForm(formData: EventFormData): EventValidationError[] {
  const errors: EventValidationError[] = [];

  const titleError = validateTitle(formData.title);
  if (titleError) {
    errors.push({ field: 'title', message: titleError });
  }

  const descriptionError = validateDescription(formData.description);
  if (descriptionError) {
    errors.push({ field: 'description', message: descriptionError });
  }

  const dateError = validateDate(formData.date);
  if (dateError) {
    errors.push({ field: 'date', message: dateError });
  }

  const startTimeError = validateTime(formData.startTime);
  if (startTimeError) {
    errors.push({ field: 'startTime', message: startTimeError });
  }

  const endTimeError = validateTime(formData.endTime);
  if (endTimeError) {
    errors.push({ field: 'endTime', message: endTimeError });
  }

  // Solo validar el rango si ambas horas son válidas
  if (!startTimeError && !endTimeError) {
    const timeRangeError = validateTimeRange(formData.startTime, formData.endTime);
    if (timeRangeError) {
      errors.push({ field: 'endTime', message: timeRangeError });
    }
  }

  const categoryError = validateCategory(formData.category);
  if (categoryError) {
    errors.push({ field: 'category', message: categoryError });
  }

  return errors;
}

/**
 * Verifica si un formulario es válido
 */
export function isFormValid(formData: EventFormData): boolean {
  return validateEventForm(formData).length === 0;
}
