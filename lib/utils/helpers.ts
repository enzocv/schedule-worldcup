/**
 * Utilidades generales
 */

/**
 * Genera un ID único basado en timestamp y random
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene el color asociado a una categoría de evento
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    work: 'var(--event-work)',
    personal: 'var(--event-personal)',
    meeting: 'var(--event-meeting)',
    other: 'var(--event-other)',
  };
  return colors[category] || colors.other;
}

/**
 * Obtiene el nombre legible de una categoría
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    work: 'Trabajo',
    personal: 'Personal',
    meeting: 'Reunión',
    other: 'Otro',
  };
  return labels[category] || 'Otro';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
