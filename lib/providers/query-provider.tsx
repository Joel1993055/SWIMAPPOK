'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

// =====================================================
// CONFIGURACIÓN DE REACT QUERY
// =====================================================

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Tiempo de cache por defecto: 5 minutos
        staleTime: 5 * 60 * 1000,
        // Tiempo de garbage collection: 10 minutos
        gcTime: 10 * 60 * 1000,
        // Reintentar 3 veces en caso de error
        retry: 3,
        // Retry delay con backoff exponencial
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch automático cuando la ventana recupera el foco
        refetchOnWindowFocus: true,
        // Refetch automático cuando se reconecta la red
        refetchOnReconnect: true,
        // No refetch automático en montaje
        refetchOnMount: false,
      },
      mutations: {
        // Reintentar mutaciones 1 vez
        retry: 1,
        // Retry delay para mutaciones
        retryDelay: 1000,
      },
    },
  })
}

// =====================================================
// PROVIDER COMPONENT
// =====================================================

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Crear QueryClient una sola vez por instancia del provider
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Solo mostrar devtools en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}
