'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSessionsStore } from '@/core/stores/unified';
import { Activity, Edit, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MobileSessionsListProps {
  onEdit?: (session: any) => void;
  onDelete?: (sessionId: string) => void;
}

export function MobileSessionsList({ onEdit, onDelete }: MobileSessionsListProps) {
  const { sessions } = useSessionsStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStroke, setFilterStroke] = useState('all');
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    let filtered = sessions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply stroke filter
    if (filterStroke !== 'all') {
      filtered = filtered.filter(session => session.stroke === filterStroke);
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, filterStroke]);

  if (!isHydrated) {
    return <MobileSessionsListSkeleton />;
  }

  const STROKE_OPTIONS = [
    { value: 'all', label: 'Todos los estilos' },
    { value: 'Libre', label: 'Libre' },
    { value: 'Espalda', label: 'Espalda' },
    { value: 'Pecho', label: 'Pecho' },
    { value: 'Mariposa', label: 'Mariposa' },
  ];

  const getRPEColor = (rpe: number) => {
    if (rpe <= 3) return 'bg-green-500';
    if (rpe <= 6) return 'bg-yellow-500';
    if (rpe <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRPEBackground = (rpe: number) => {
    if (rpe <= 3) return 'bg-green-100 text-green-800';
    if (rpe <= 6) return 'bg-yellow-100 text-yellow-800';
    if (rpe <= 8) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mis Sesiones</h2>
        <Badge variant="secondary">{filteredSessions.length}</Badge>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar sesiones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <Select value={filterStroke} onValueChange={setFilterStroke}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Filtrar por estilo" />
          </SelectTrigger>
          <SelectContent>
            {STROKE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStroke !== 'all' 
                  ? 'No se encontraron sesiones con estos filtros'
                  : 'No tienes sesiones registradas'
                }
              </p>
              <Button size="sm">
                Crear Primera Sesión
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{session.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.date).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(session)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(session.id)}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {session.distance}m
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {session.stroke}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRPEBackground(session.rpe)}`}
                  >
                    RPE {session.rpe}
                  </Badge>
                </div>

                {/* Content Preview */}
                {session.content && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {session.content}
                  </p>
                )}

                {/* Zone Volumes (if available) */}
                {session.zone_volumes && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Zonas de Entrenamiento:</p>
                    <div className="flex gap-1">
                      {Object.entries(session.zone_volumes).map(([zone, volume]) => (
                        volume > 0 && (
                          <Badge key={zone} variant="secondary" className="text-xs">
                            {zone.toUpperCase()}: {volume}m
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function MobileSessionsListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="animate-pulse h-6 bg-muted rounded w-24"></div>
        <div className="animate-pulse h-5 bg-muted rounded w-8"></div>
      </div>

      <div className="space-y-3">
        <div className="animate-pulse h-10 bg-muted rounded"></div>
        <div className="animate-pulse h-10 bg-muted rounded"></div>
      </div>

      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="animate-pulse h-4 bg-muted rounded w-32 mb-2"></div>
                  <div className="animate-pulse h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="flex gap-1">
                  <div className="animate-pulse h-8 w-8 bg-muted rounded"></div>
                  <div className="animate-pulse h-8 w-8 bg-muted rounded"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="animate-pulse h-5 bg-muted rounded w-12"></div>
                <div className="animate-pulse h-5 bg-muted rounded w-12"></div>
                <div className="animate-pulse h-5 bg-muted rounded w-12"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
