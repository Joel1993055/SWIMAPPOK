'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/app/marketing/components/layout/navbar';
import { Footer } from '@/app/marketing/components/layout/footer';

export function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Si estamos en rutas del dashboard, no mostrar navbar ni footer
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  
  // Para todas las demás rutas, mostrar navbar y footer
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}
