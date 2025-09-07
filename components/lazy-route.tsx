'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { ComponentType, Suspense, lazy } from 'react'

interface LazyRouteProps {
  route: string
  fallback?: ComponentType
}

// Lazy load components
const LazyComponents: Record<string, ComponentType> = {
  'dashboard': lazy(() => import('@/app/dashboard/page')),
  'entrenamientos': lazy(() => import('@/app/entrenamientos/page')),
  'planificacion': lazy(() => import('@/app/planificacion/page')),
  'analisis': lazy(() => import('@/app/analisis/page')),
  'equipo': lazy(() => import('@/app/equipo/page')),
  'reports': lazy(() => import('@/app/reports/page')),
  'herramientas': lazy(() => import('@/app/herramientas/page')),
  'settings': lazy(() => import('@/app/settings/page')),
}

function DefaultFallback() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}

export function LazyRoute({ route, fallback: Fallback = DefaultFallback }: LazyRouteProps) {
  const LazyComponent = LazyComponents[route]
  
  if (!LazyComponent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Component not found: {route}</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<Fallback />}>
      <LazyComponent />
    </Suspense>
  )
}
