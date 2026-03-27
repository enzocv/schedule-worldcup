export const HOUR_HEIGHT = 64; // px per hour
export const OVERFLOW_THRESHOLD = 2; // more than this → show overflow pill
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

export function formatHour(h: number): { label: string; period: string } {
  if (h === 0) return { label: '12:00', period: 'AM' };
  if (h < 12) return { label: `${h}:00`, period: 'AM' };
  if (h === 12) return { label: '12:00', period: 'PM' };
  return { label: `${h - 12}:00`, period: 'PM' };
}

export function abbrev(name: string): string {
  return name.substring(0, 3).toUpperCase();
}
