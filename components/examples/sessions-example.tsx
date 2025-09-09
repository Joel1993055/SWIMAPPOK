'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useSessions,
  useSessionsPagination,
  useSessionsStats,
} from '@/lib/hooks/use-sessions';
import { BarChart3, Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

// =====================================================
// COMPONENTE DE EJEMPLO - LISTA DE SESIONES
// =====================================================
export function SessionsListExample() {
  const {
    sessions,
    isLoading,
    error,
    loadSessions,
    createSession,
    updateSession,
    deleteSession,
    searchSessions,
    getTotalDistance,
    getAverageRPE,
  } = useSessions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // =====================================================
  // MANEJADORES DE EVENTOS
  // =====================================================
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchSessions(searchQuery);
    } else {
      await loadSessions();
    }
  };

  const handleFilterByDate = async () => {
    if (selectedDate) {
      await loadSessions({ date: selectedDate });
    } else {
      await loadSessions();
    }
  };

  const handleCreateSession = async () => {
    const newSession = {
      name: 'Nueva Sesión',
      date: new Date().toISOString().split('T')[0],
      duration_minutes: 60,
      distance_meters: 2000,
      stroke_type: 'freestyle' as const,
      session_type: 'aerobic' as const,
      main_set: '4x500m @ 80%',
      rpe: 7,
      notes: 'Sesión de ejemplo',
      training_phase_id: 'phase-1',
      pool_type: 'indoor' as const,
    };

    await createSession(newSession);
  };

  const handleUpdateSession = async (id: string) => {
    await updateSession(id, {
      notes: 'Sesión actualizada',
    });
  };

  const handleDeleteSession = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta sesión?')) {
      await deleteSession(id);
    }
  };

  // =====================================================
  // RENDERIZADO
  // =====================================================
  if (error) {
    return (
      <Alert className='border-destructive'>
        <AlertDescription>
          Error al cargar las sesiones:{' '}
          {error instanceof Error ? error.message : String(error)}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Estadísticas de Sesiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{sessions.length}</div>
              <div className='text-sm text-muted-foreground'>
                Total Sesiones
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {(getTotalDistance() / 1000).toFixed(1)}km
              </div>
              <div className='text-sm text-muted-foreground'>
                Distancia Total
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {getAverageRPE().toFixed(1)}
              </div>
              <div className='text-sm text-muted-foreground'>RPE Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de búsqueda y filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <Input
                placeholder='Buscar sesiones...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className='flex-1'>
              <Input
                type='date'
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <div className='flex gap-2'>
              <Button onClick={handleSearch} variant='outline'>
                <Search className='h-4 w-4 mr-2' />
                Buscar
              </Button>
              <Button onClick={handleFilterByDate} variant='outline'>
                <Filter className='h-4 w-4 mr-2' />
                Filtrar
              </Button>
              <Button onClick={handleCreateSession}>
                <Plus className='h-4 w-4 mr-2' />
                Nueva Sesión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de sesiones */}
      <div className='space-y-4'>
        {isLoading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className='p-6'>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-1/4' />
                    <Skeleton className='h-4 w-1/2' />
                    <Skeleton className='h-4 w-1/3' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>
                No hay sesiones disponibles
              </p>
            </CardContent>
          </Card>
        ) : (
          sessions.map(session => (
            <Card key={session.id}>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold'>{session.name}</h3>
                      <Badge variant='outline'>{session.date}</Badge>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <span>{session.distance_meters}m</span>
                      <span>{session.duration_minutes}min</span>
                      <span>RPE: {session.rpe}</span>
                      <Badge variant='secondary'>{session.stroke_type}</Badge>
                      <Badge variant='outline'>{session.session_type}</Badge>
                    </div>
                    {session.notes && (
                      <p className='text-sm text-muted-foreground'>
                        {session.notes}
                      </p>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleUpdateSession(session.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// =====================================================
// COMPONENTE DE EJEMPLO - PAGINACIÓN
// =====================================================
export function SessionsPaginationExample() {
  const { loadPage, loading, hasMore } = useSessionsPagination(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadPage = async (page: number) => {
    await loadPage(page);
    setCurrentPage(page);
  };

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Button
          onClick={() => handleLoadPage(1)}
          disabled={loading || currentPage === 1}
        >
          Primera Página
        </Button>
        <Button
          onClick={() => handleLoadPage(currentPage + 1)}
          disabled={loading || !hasMore}
        >
          Siguiente Página
        </Button>
      </div>
      {loading && <p>Cargando página {currentPage}...</p>}
    </div>
  );
}

// =====================================================
// COMPONENTE DE EJEMPLO - ESTADÍSTICAS
// =====================================================
export function SessionsStatsExample() {
  const { loadStats, loading, error } = useSessionsStats();
  const [stats, setStats] = useState<{
    totalSessions: number;
    totalDistance: number;
    totalDuration: number;
    averageRPE: number;
  } | null>(null);

  const handleLoadStats = async () => {
    const result = await loadStats({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });

    if (result.data) {
      setStats(result.data);
    }
  };

  if (error) {
    return (
      <Alert className='border-destructive'>
        <AlertDescription>
          Error al cargar estadísticas: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-4'>
      <Button onClick={handleLoadStats} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Estadísticas'}
      </Button>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Detalladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{stats.totalSessions}</div>
                <div className='text-sm text-muted-foreground'>Sesiones</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>
                  {(stats.totalDistance / 1000).toFixed(1)}km
                </div>
                <div className='text-sm text-muted-foreground'>Distancia</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{stats.totalDuration}h</div>
                <div className='text-sm text-muted-foreground'>Duración</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>
                  {stats.averageRPE.toFixed(1)}
                </div>
                <div className='text-sm text-muted-foreground'>
                  RPE Promedio
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
