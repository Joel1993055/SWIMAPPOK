/**
 * Mobile Utility Functions
 * Helper functions for mobile-specific functionality
 */

// Breakpoint constants
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1280;

// Device detection utilities
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function isTabletDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT;
}

export function isDesktopDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= TABLET_BREAKPOINT;
}

// Touch detection
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Mobile-specific formatting
export function formatDistanceForMobile(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)}k`;
  }
  return `${distance}m`;
}

export function formatDateForMobile(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// Mobile navigation helpers
export function getMobileNavigationItems() {
  return [
    { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { label: 'Sesiones', href: '/training', icon: 'Activity' },
    { label: 'Calendario', href: '/calendar', icon: 'Calendar' },
    { label: 'Análisis', href: '/analysis', icon: 'TrendingUp' },
    { label: 'Reportes', href: '/reports', icon: 'FileText' },
  ];
}

// Mobile form validation
export function validateMobileForm(data: Record<string, any>): string[] {
  const errors: string[] = [];
  
  if (!data.distance || data.distance <= 0) {
    errors.push('La distancia debe ser mayor a 0');
  }
  
  if (!data.stroke) {
    errors.push('Debe seleccionar un estilo');
  }
  
  if (!data.rpe || data.rpe < 1 || data.rpe > 10) {
    errors.push('El RPE debe estar entre 1 y 10');
  }
  
  return errors;
}
