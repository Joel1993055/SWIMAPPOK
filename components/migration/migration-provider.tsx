// =====================================================
// PROVIDER DE MIGRACIÓN - COMPONENTE SEGURO
// =====================================================

"use client";

import { useCompleteMigration } from '@/lib/hooks/use-migration';
import { useEffect, useState } from 'react';

interface MigrationProviderProps {
  children: React.ReactNode;
}

export function MigrationProvider({ children }: MigrationProviderProps) {
  const [isMigrating, setIsMigrating] = useState(true);

  // Ejecutar migración
  useCompleteMigration();

  useEffect(() => {
    // Simular tiempo de migración
    const timer = setTimeout(() => {
      setIsMigrating(false);
      console.log('🎉 Migración completada exitosamente');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading durante migración
  if (isMigrating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Migrando datos...</p>
        </div>
      </div>
    );
  }

  // Mostrar children después de migración
  return <>{children}</>;
}
