'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteSessionMutation, useSessionsQuery } from '@/lib/hooks/queries/use-sessions-query'
import { Session } from '@/lib/types/entities'
import { BarChart3, Edit, Filter, Plus, Search, Trash2 } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'

// =====================================================
// TIPOS
// =====================================================

interface SessionsListOptimizedProps {
  filters?: {
    date?: string
    startDate?: string
    endDate?: string
    training_phase_id?: string
    competition_id?: string
    stroke_type?: string
    session_type?: string
  }
  onEdit?: (session: Session) => void
  onCreate?: () => void
}

// =====================================================
// COMPONENTE DE SESIÓN INDIVIDUAL (MEMOIZADO)
// =====================================================

interface SessionItemProps {
  session: Session
  onEdit: (session: Session) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

const SessionItem = memo<SessionItemProps>(({ session, onEdit, onDelete, isDeleting }) => {
  const handleEdit = useCallback(() => {
    onEdit(session)
  }, [onEdit, session])

  const handleDelete = useCallback(() => {
    if (confirm('¿Estás seguro de que quieres eliminar esta sesión?')) {
      onDelete(session.id)
    }
  }, [onDelete, session.id])

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{session.name}</h3>
              <Badge variant="outline">{session.date}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{session.distance_meters}m</span>
              <span>{session.duration_minutes}min</span>
              <span>RPE: {session.rpe}</span>
              <Badge variant="secondary">{session.stroke_type}</Badge>
              <Badge variant="outline">{session.session_type}</Badge>
            </div>
            {session.notes && (
              <p className="text-sm text-muted-foreground">{session.notes}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

SessionItem.displayName = 'SessionItem'

// =====================================================
// COMPONENTE DE ESTADÍSTICAS (MEMOIZADO)
// =====================================================

interface StatsCardProps {
  sessions: Session[]
}

const StatsCard = memo<StatsCardProps>(({ sessions }) => {
  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        averageRPE: 0
      }
    }

    const totalDistance = sessions.reduce((sum, s) => sum + s.distance_meters, 0)
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
    const averageRPE = sessions.reduce((sum, s) => sum + s.rpe, 0) / sessions.length

    return {
      totalSessions: sessions.length,
      totalDistance,
      totalDuration,
      averageRPE
    }
  }, [sessions])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Estadísticas de Sesiones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sesiones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{(stats.totalDistance / 1000).toFixed(1)}km</div>
            <div className="text-sm text-muted-foreground">Distancia Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.averageRPE.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">RPE Promedio</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

StatsCard.displayName = 'StatsCard'

// =====================================================
// COMPONENTE DE FILTROS (MEMOIZADO)
// =====================================================

interface FiltersCardProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: () => void
  onFilter: () => void
  onCreate: () => void
}

const FiltersCard = memo<FiltersCardProps>(({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  onFilter, 
  onCreate 
}) => {
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }, [onSearch])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros y Búsqueda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar sesiones..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSearch} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button onClick={onFilter} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sesión
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

FiltersCard.displayName = 'FiltersCard'

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export const SessionsListOptimized = memo<SessionsListOptimizedProps>(({ 
  filters, 
  onEdit, 
  onCreate 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Queries
  const { data: sessionsData, isLoading, error } = useSessionsQuery(filters)
  const deleteSessionMutation = useDeleteSessionMutation()
  
  // Memoizar datos de sesiones
  const sessions = useMemo(() => sessionsData?.data || [], [sessionsData?.data])
  
  // Callbacks memoizados
  const handleSearch = useCallback(() => {
    // Implementar búsqueda
    console.log('Searching for:', searchQuery)
  }, [searchQuery])
  
  const handleFilter = useCallback(() => {
    // Implementar filtros
    console.log('Filtering with:', filters)
  }, [filters])
  
  const handleCreate = useCallback(() => {
    onCreate?.()
  }, [onCreate])
  
  const handleEdit = useCallback((session: Session) => {
    onEdit?.(session)
  }, [onEdit])
  
  const handleDelete = useCallback((id: string) => {
    deleteSessionMutation.mutate(id)
  }, [deleteSessionMutation])
  
  // Loading skeleton
  const LoadingSkeleton = useMemo(() => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ), [])

  if (error) {
    return (
      <Alert className="border-destructive">
        <AlertDescription>
          Error al cargar las sesiones: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <StatsCard sessions={sessions} />
      
      {/* Filtros */}
      <FiltersCard
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onCreate={handleCreate}
      />
      
      {/* Lista de sesiones */}
      {isLoading ? (
        LoadingSkeleton
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No hay sesiones disponibles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deleteSessionMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
})

SessionsListOptimized.displayName = 'SessionsListOptimized'
