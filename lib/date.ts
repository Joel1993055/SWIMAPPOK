import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  isToday,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
} from 'date-fns';
import { es } from 'date-fns/locale';

// Formateo de fechas
export function formatDate(
  date: string | Date,
  formatStr: string = 'yyyy-MM-dd'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

export function formatDateReadable(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
}

// Fechas de intervalo
export function getWeekRange(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const start = startOfWeek(dateObj, { weekStartsOn: 1 }); // Lunes
  const end = endOfWeek(dateObj, { weekStartsOn: 1 });

  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
    startDate: start,
    endDate: end,
  };
}

export function getMonthRange(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const start = startOfMonth(dateObj);
  const end = endOfMonth(dateObj);

  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
    startDate: start,
    endDate: end,
  };
}

export function getYearRange(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const start = startOfYear(dateObj);
  const end = endOfYear(dateObj);

  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
    startDate: start,
    endDate: end,
  };
}

// Generación de fechas
export function getDaysInMonth(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = endOfMonth(start);

  return eachDayOfInterval({ start, end });
}

export function getMonthsInYear(year: number) {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 11, 31));

  return eachMonthOfInterval({ start, end });
}

// Utilidades de fecha
export function isCurrentDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
}

export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Navegación de fechas
export function getPreviousDate(date: string | Date, days: number = 1): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const previous = subDays(dateObj, days);
  return format(previous, 'yyyy-MM-dd');
}

export function getNextDate(date: string | Date, days: number = 1): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const next = addDays(dateObj, days);
  return format(next, 'yyyy-MM-dd');
}

export function getPreviousMonth(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const previous = subMonths(dateObj, 1);
  return format(previous, 'yyyy-MM-dd');
}

export function getNextMonth(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const next = addMonths(dateObj, 1);
  return format(next, 'yyyy-MM-dd');
}

export function getPreviousYear(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const previous = subYears(dateObj, 1);
  return format(previous, 'yyyy-MM-dd');
}

export function getNextYear(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const next = addYears(dateObj, 1);
  return format(next, 'yyyy-MM-dd');
}

// Validación de fechas
export function isValidDate(dateString: string): boolean {
  const date = parseISO(dateString);
  return !isNaN(date.getTime());
}

export function isDateInRange(
  date: string | Date,
  start: string,
  end: string
): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const startObj = parseISO(start);
  const endObj = parseISO(end);

  return dateObj >= startObj && dateObj <= endObj;
}

// Constantes útiles
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  READABLE: "EEEE, d 'de' MMMM 'de' yyyy",
  SHORT: 'dd/MM/yyyy',
  MONTH: 'MMMM yyyy',
  YEAR: 'yyyy',
  TIME: 'HH:mm',
} as const;
