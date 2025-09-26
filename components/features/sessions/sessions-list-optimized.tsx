'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDeleteSessionMutation,
  useSessionsQuery,
} from '@/lib/hooks/queries/use-sessions-query';
import { Session } from '@/lib/types/entities';
import { BarChart3, Edit, Filter, Plus, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

// =====================================================
// TYPES
// =====================================================

interface SessionsListOptimizedProps {
  filters?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    training_phase_id?: string;
    competition_id?: string;
    stroke_type?: string;
    session_type?: string;
  };
  onEdit?: (session: Session) => void;
  onCreate?: () => void;
}

// =====================================================
// INDIVIDUAL SESSION COMPONENT (MEMOIZED)
// =====================================================

interface SessionItemProps {
  session: Session;
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const SessionItem = memo<SessionItemProps>(
  ({ session, onEdit, onDelete, isDeleting }) => {
    const handleEdit = useCallback(() => {
      onEdit(session);
    }, [onEdit, session]);

    const handleDelete = useCallback(() => {
      if (confirm('Are you sure you want to delete this session?')) {
        onDelete(session.id);
      }
    }, [onDelete, session.id]);

    return (
      <Card className='hover:shadow-md transition-shadow'>
        <CardContent className='p-6'>
          <div className='flex items-start justify-between'>
            <div className='space-y-2 flex-1'>
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
                <p className='text-sm text-muted-foreground'>{session.notes}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={handleEdit}
                disabled={isDeleting}
              >
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

SessionItem.displayName = 'SessionItem';

// =====================================================
// STATS COMPONENT (MEMOIZED)
// =====================================================

interface StatsCardProps {
  sessions: Session[];
}

const StatsCard = memo<StatsCardProps>(({ sessions }) => {
  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        averageRPE: 0,
      };
    }

    const totalDistance = sessions.reduce(
      (sum, s) => sum + s.distance_meters,
      0
    );
    const totalDuration = sessions.reduce(
      (sum, s) => sum + s.duration_minutes,
      0
    );
    const averageRPE =
      sessions.reduce((sum, s) => sum + s.rpe, 0) / sessions.length;

    return {
      totalSessions: sessions.length,
      totalDistance,
      totalDuration,
      averageRPE,
    };
  }, [sessions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart3 className='h-5 w-5' />
          Session Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold'>{stats.totalSessions}</div>
            <div className='text-sm text-muted-foreground'>Total Sessions</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              {(stats.totalDistance / 1000).toFixed(1)}km
            </div>
            <div className='text-sm text-muted-foreground'>Total Distance</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              {stats.averageRPE.toFixed(1)}
            </div>
            <div className='text-sm text-muted-foreground'>Average RPE</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';

// =====================================================
// FILTERS COMPONENT (MEMOIZED)
// =====================================================

interface FiltersCardProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onFilter: () => void;
  onCreate: () => void;
}

const FiltersCard = memo<FiltersCardProps>(
  ({ searchQuery, onSearchChange, onSearch, onFilter, onCreate }) => {
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          onSearch();
        }
      },
      [onSearch]
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <Input
                placeholder='Search sessions...'
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className='flex gap-2'>
              <Button onClick={onSearch} variant='outline'>
                <Search className='h-4 w-4 mr-2' />
                Search
              </Button>
              <Button onClick={onFilter} variant='outline'>
                <Filter className='h-4 w-4 mr-2' />
                Filter
              </Button>
              <Button onClick={onCreate}>
                <Plus className='h-4 w-4 mr-2' />
                New Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FiltersCard.displayName = 'FiltersCard';

// =====================================================
// MAIN COMPONENT
// =====================================================

export const SessionsListOptimized = memo<SessionsListOptimizedProps>(
  ({ filters, onEdit, onCreate }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Queries
    const { data: sessionsData, isLoading, error } = useSessionsQuery(filters);
    const deleteSessionMutation = useDeleteSessionMutation();

    // Memoized sessions
    const sessions = useMemo(
      () => sessionsData?.data || [],
      [sessionsData?.data]
    );

    // Memoized callbacks
    const handleSearch = useCallback(() => {
      console.log('Searching for:', searchQuery);
    }, [searchQuery]);

    const handleFilter = useCallback(() => {
      console.log('Filtering with:', filters);
    }, [filters]);

    const handleCreate = useCallback(() => {
      onCreate?.();
    }, [onCreate]);

    const handleEdit = useCallback(
      (session: Session) => {
        onEdit?.(session);
      },
      [onEdit]
    );

    const handleDelete = useCallback(
      (id: string) => {
        deleteSessionMutation.mutate(id);
      },
      [deleteSessionMutation]
    );

    // Loading skeleton
    const LoadingSkeleton = useMemo(
      () => (
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
      ),
      []
    );

    if (error) {
      return (
        <Alert className='border-destructive'>
          <AlertDescription>
            Error loading sessions: {error.message}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className='space-y-6'>
        {/* Stats */}
        <StatsCard sessions={sessions} />

        {/* Filters */}
        <FiltersCard
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onCreate={handleCreate}
        />

        {/* Sessions list */}
        {isLoading ? (
          LoadingSkeleton
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>No sessions available</p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {sessions.map(session => (
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
    );
  }
);

SessionsListOptimized.displayName = 'SessionsListOptimized';
