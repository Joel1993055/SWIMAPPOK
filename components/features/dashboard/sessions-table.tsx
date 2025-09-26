'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    deleteSession,
    getSessions,
    updateSession,
    type Session as SupabaseSession,
} from '@/lib/actions/sessions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Activity,
    Calendar as CalendarIcon,
    Download,
    Edit,
    Filter,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// Data types for sessions (using Supabase interface)
type Session = SupabaseSession;

// Options for filters (adapted to real data)
const STROKE_OPTIONS = [
  { value: 'Libre', label: 'Libre' },
  { value: 'Espalda', label: 'Espalda' },
  { value: 'Pecho', label: 'Pecho' },
  { value: 'Mariposa', label: 'Mariposa' },
  { value: 'Mixto', label: 'Mixto' },
];

const SESSION_TYPE_OPTIONS = [
  { value: 'Aerobic', label: 'Aerobic' },
  { value: 'Threshold', label: 'Threshold' },
  { value: 'Speed', label: 'Speed' },
  { value: 'Technique', label: 'Technique' },
  { value: 'Recovery', label: 'Recovery' },
];

const RPE_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (most recent)' },
  { value: 'date-asc', label: 'Date (oldest)' },
  { value: 'distance-desc', label: 'Distance (highest)' },
  { value: 'distance-asc', label: 'Distance (lowest)' },
  { value: 'duration-desc', label: 'Duration (longest)' },
  { value: 'duration-asc', label: 'Duration (shortest)' },
  { value: 'rpe-desc', label: 'RPE (highest)' },
  { value: 'rpe-asc', label: 'RPE (lowest)' },
];

// Function to format dates
function formatDate(
  dateString: string,
  formatStr: string = 'dd/MM/yyyy'
): string {
  const date = new Date(dateString);
  if (formatStr === 'dd/MM/yyyy') {
    return date.toLocaleDateString('es-ES');
  }
  return format(date, formatStr, { locale: es });
}

export function SessionsTable() {
  // States for real data
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real sessions from Supabase
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error loading sessions:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // States for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date-desc');

  // States for filters
  const [selectedStrokes, setSelectedStrokes] = useState<string[]>([]);
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>(
    []
  );
  const [selectedRPEs, setSelectedRPEs] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [distanceRange, setDistanceRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  // States for dialogs
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Function to filter and sort sessions
  const filteredAndSortedSessions = useMemo(() => {
    const filtered = sessions.filter(session => {
      // Búsqueda por texto
      const matchesSearch =
        !searchTerm ||
        session.coach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.stroke?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.title &&
          session.title.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filters by stroke
      const matchesStroke =
        selectedStrokes.length === 0 ||
        selectedStrokes.includes(session.stroke || '');

      // Filters by session type
      const matchesSessionType =
        selectedSessionTypes.length === 0 ||
        selectedSessionTypes.includes(session.type || '');

      // RPE filters
      const matchesRPE =
        selectedRPEs.length === 0 || selectedRPEs.includes(session.rpe || 0);

      // Filters by date
      const sessionDate = new Date(session.date);
      const matchesDate =
        (!dateRange.from || sessionDate >= dateRange.from) &&
        (!dateRange.to || sessionDate <= dateRange.to);

      // Filters by distance
      const matchesDistance =
        (!distanceRange.min || session.distance >= distanceRange.min) &&
        (!distanceRange.max || session.distance <= distanceRange.max);

      return (
        matchesSearch &&
        matchesStroke &&
        matchesSessionType &&
        matchesRPE &&
        matchesDate &&
        matchesDistance
      );
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      const [field, direction] = sortBy.split('-');
      const isAsc = direction === 'asc';

      switch (field) {
        case 'date':
          return isAsc
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'distance':
          return isAsc ? a.distance - b.distance : b.distance - a.distance;
        case 'duration':
          return isAsc
            ? (a.duration || 0) - (b.duration || 0)
            : (b.duration || 0) - (a.duration || 0);
        case 'rpe':
          return isAsc
            ? (a.rpe || 0) - (b.rpe || 0)
            : (b.rpe || 0) - (a.rpe || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    sessions,
    searchTerm,
    selectedStrokes,
    selectedSessionTypes,
    selectedRPEs,
    dateRange,
    distanceRange,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredAndSortedSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredAndSortedSessions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Functions to handle filters
  const toggleStrokeFilter = (stroke: string) => {
    setSelectedStrokes(prev =>
      prev.includes(stroke) ? prev.filter(s => s !== stroke) : [...prev, stroke]
    );
    setCurrentPage(1);
  };

  const toggleSessionTypeFilter = (type: string) => {
    setSelectedSessionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleRPEFilter = (rpe: number) => {
    setSelectedRPEs(prev =>
      prev.includes(rpe) ? prev.filter(r => r !== rpe) : [...prev, rpe]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedStrokes([]);
    setSelectedSessionTypes([]);
    setSelectedRPEs([]);
    setDateRange({});
    setDistanceRange({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedStrokes.length > 0 ||
    selectedSessionTypes.length > 0 ||
    selectedRPEs.length > 0 ||
    dateRange.from ||
    dateRange.to ||
    distanceRange.min ||
    distanceRange.max;

  // Functions to handle sessions
  const handleEdit = (session: Session) => {
    setEditingSession({ ...session });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (session: Session) => {
    setSessionToDelete(session);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;

    try {
      // Convertir objeto a FormData
      const formData = new FormData();
      formData.append('title', editingSession.title || '');
      formData.append('date', editingSession.date);
      formData.append('type', editingSession.type || 'Aerobic');
      formData.append('duration', (editingSession.duration || 0).toString());
      formData.append('distance', editingSession.distance.toString());
      formData.append('stroke', editingSession.stroke || 'Libre');
      formData.append('rpe', (editingSession.rpe || 5).toString());
      formData.append('location', editingSession.location || '');
      formData.append('coach', editingSession.coach || '');
      formData.append('club', editingSession.club || '');
      formData.append('group_name', editingSession.group_name || '');
      formData.append('objective', editingSession.objective || 'otro');
      formData.append('content', editingSession.content || '');
      formData.append(
        'zone_volumes',
        JSON.stringify(
          editingSession.zone_volumes || { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 }
        )
      );

      await updateSession(editingSession.id, formData);

      // Reload sessions
      const data = await getSessions();
      setSessions(data);

      setIsEditDialogOpen(false);
      setEditingSession(null);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;

    try {
      await deleteSession(sessionToDelete.id);

      // Reload sessions
      const data = await getSessions();
      setSessions(data);

      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);

      if (paginatedSessions.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Título',
      'Distance (m)',
      'Duration (min)',
      'Stroke',
      'Tipo',
      'RPE',
      'Coach',
      'Objective',
      'Contenido',
    ];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedSessions.map(session =>
        [
          formatDate(session.date),
          `"${session.title || ''}"`,
          session.distance,
          session.duration || 0,
          STROKE_OPTIONS.find(s => s.value === session.stroke)?.label ||
            session.stroke ||
            '',
          SESSION_TYPE_OPTIONS.find(s => s.value === session.type)?.label ||
            session.type ||
            '',
          session.rpe || 0,
          `"${session.coach || ''}"`,
          session.objective || 'otro',
          `"${session.content || ''}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `sessions_${format(new Date(), 'yyyy-MM-dd')}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='space-y-4'>
      {/* Header con búsqueda y controles */}
      <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold'>Session History</h3>
          <p className='text-sm text-muted-foreground'>
            {filteredAndSortedSessions.length} of {sessions.length} sessions
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full lg:w-auto'>
          {/* Búsqueda */}
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search sessions...'
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className='pl-8 w-full sm:w-64'
            />
          </div>

          {/* Botones de control */}
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowFilters(!showFilters)}
              className={
                showFilters ? 'bg-primary text-primary-foreground' : ''
              }
            >
              <Filter className='w-4 h-4 mr-2' />
              Filters
              {hasActiveFilters && (
                <Badge variant='secondary' className='ml-2 h-5 w-5 p-0 text-xs'>
                  {selectedStrokes.length +
                    selectedSessionTypes.length +
                    selectedRPEs.length +
                    (dateRange.from ? 1 : 0) +
                    (dateRange.to ? 1 : 0) +
                    (distanceRange.min ? 1 : 0) +
                    (distanceRange.max ? 1 : 0)}
                </Badge>
              )}
            </Button>

            <Button variant='outline' size='sm' onClick={exportToCSV}>
              <Download className='w-4 h-4 mr-2' />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <Card className='bg-muted/50 border-muted'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base'>Advanced Filters</CardTitle>
              <Button variant='ghost' size='sm' onClick={clearAllFilters}>
                <X className='w-4 h-4 mr-2' />
                Clear all
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {/* Filter by stroke */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Stroke</Label>
                <div className='space-y-1'>
                  {STROKE_OPTIONS.map(option => (
                    <div
                      key={option.value}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={`stroke-${option.value}`}
                        checked={selectedStrokes.includes(option.value)}
                        onCheckedChange={() => toggleStrokeFilter(option.value)}
                      />
                      <Label
                        htmlFor={`stroke-${option.value}`}
                        className='text-sm'
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter by session type */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Session Type</Label>
                <div className='space-y-1'>
                  {SESSION_TYPE_OPTIONS.map(option => (
                    <div
                      key={option.value}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={`type-${option.value}`}
                        checked={selectedSessionTypes.includes(option.value)}
                        onCheckedChange={() =>
                          toggleSessionTypeFilter(option.value)
                        }
                      />
                      <Label
                        htmlFor={`type-${option.value}`}
                        className='text-sm'
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por RPE */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>RPE</Label>
                <div className='grid grid-cols-2 gap-1'>
                  {RPE_OPTIONS.map(rpe => (
                    <div key={rpe} className='flex items-center space-x-2'>
                      <Checkbox
                        id={`rpe-${rpe}`}
                        checked={selectedRPEs.includes(rpe)}
                        onCheckedChange={() => toggleRPEFilter(rpe)}
                      />
                      <Label htmlFor={`rpe-${rpe}`} className='text-sm'>
                        {rpe}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter by distance */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Distance (m)</Label>
                <div className='space-y-2'>
                  <Input
                    type='number'
                    placeholder='Mínimo'
                    value={distanceRange.min || ''}
                    onChange={e =>
                      setDistanceRange(prev => ({
                        ...prev,
                        min: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                  <Input
                    type='number'
                    placeholder='Máximo'
                    value={distanceRange.max || ''}
                    onChange={e =>
                      setDistanceRange(prev => ({
                        ...prev,
                        max: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Filter by date */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Date Range</Label>
              <div className='flex gap-2'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='justify-start text-left font-normal'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {dateRange.from
                        ? format(dateRange.from, 'dd/MM/yyyy')
                        : 'Desde'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={dateRange.from}
                      onSelect={date =>
                        setDateRange(prev => ({ ...prev, from: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='justify-start text-left font-normal'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {dateRange.to
                        ? format(dateRange.to, 'dd/MM/yyyy')
                        : 'Hasta'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={dateRange.to}
                      onSelect={date =>
                        setDateRange(prev => ({ ...prev, to: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles de ordenamiento y paginación */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Label className='text-sm'>Sort by:</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Label className='text-sm'>Show:</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={value => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className='border rounded-lg bg-muted/50'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-muted/50'>
              <tr>
                <th className='text-left p-3 font-medium text-sm'>Date</th>
                <th className='text-left p-3 font-medium text-sm'>Título</th>
                <th className='text-left p-3 font-medium text-sm'>Distance</th>
                <th className='text-left p-3 font-medium text-sm'>Duration</th>
                <th className='text-left p-3 font-medium text-sm'>Stroke</th>
                <th className='text-left p-3 font-medium text-sm'>Tipo</th>
                <th className='text-left p-3 font-medium text-sm'>RPE</th>
                <th className='text-left p-3 font-medium text-sm'>Objective</th>
                <th className='text-left p-3 font-medium text-sm'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className='text-center py-8'>
                    <div className='flex flex-col items-center gap-2'>
                      <Activity className='w-8 h-8 text-muted-foreground animate-pulse' />
                      <p className='text-muted-foreground'>
                        Loading sessions...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className='text-center py-8'>
                    <div className='flex flex-col items-center gap-2'>
                      <Activity className='w-8 h-8 text-muted-foreground' />
                      <p className='text-muted-foreground'>
                        {searchTerm || hasActiveFilters
                          ? 'No sessions found with those criteria'
                          : 'No sessions registered'}
                      </p>
                      {(searchTerm || hasActiveFilters) && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={clearAllFilters}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSessions.map(session => (
                  <tr
                    key={session.id}
                    className='border-t hover:bg-muted/50 transition-colors'
                  >
                    <td className='p-3'>
                      <div className='flex items-center gap-2'>
                        <CalendarIcon className='w-4 h-4 text-muted-foreground' />
                        {formatDate(session.date, 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className='p-3 font-medium'>
                      {session.title || 'Sin título'}
                    </td>
                    <td className='p-3'>
                      <Badge variant='outline'>{session.distance}m</Badge>
                    </td>
                    <td className='p-3'>
                      {session.duration && session.duration > 0
                        ? `${session.duration}min`
                        : '-'}
                    </td>
                    <td className='p-3'>
                      <Badge variant='outline' className='capitalize'>
                        {STROKE_OPTIONS.find(s => s.value === session.stroke)
                          ?.label ||
                          session.stroke ||
                          'N/A'}
                      </Badge>
                    </td>
                    <td className='p-3'>
                      <Badge
                        variant={
                          session.type === 'Technique' ? 'default' : 'secondary'
                        }
                        className='capitalize'
                      >
                        {SESSION_TYPE_OPTIONS.find(
                          s => s.value === session.type
                        )?.label ||
                          session.type ||
                          'N/A'}
                      </Badge>
                    </td>
                    <td className='p-3'>
                      <Badge variant='outline'>RPE {session.rpe || 0}/10</Badge>
                    </td>
                    <td className='p-3'>
                      <Badge variant='outline' className='capitalize'>
                        {session.objective || 'otro'}
                      </Badge>
                    </td>
                    <td className='p-3'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEdit(session)}
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDelete(session)}
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Mostrando {startIndex + 1}-
            {Math.min(
              startIndex + itemsPerPage,
              filteredAndSortedSessions.length
            )}{' '}
            of {filteredAndSortedSessions.length} sessions
          </p>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>

            <div className='flex items-center gap-1'>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                if (totalPages <= 5) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setCurrentPage(page)}
                      className='w-8 h-8 p-0'
                    >
                      {page}
                    </Button>
                  );
                }

                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setCurrentPage(page)}
                      className='w-8 h-8 p-0'
                    >
                      {page}
                    </Button>
                  );
                }

                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className='px-2'>
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              Modify training session details
            </DialogDescription>
          </DialogHeader>

          {editingSession && (
            <form onSubmit={handleEditSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-date'>Fecha</Label>
                  <Input
                    id='edit-date'
                    type='date'
                    value={editingSession.date}
                    onChange={e =>
                      setEditingSession({
                        ...editingSession,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='edit-title'>Título</Label>
                  <Input
                    id='edit-title'
                    type='text'
                    value={editingSession.title || ''}
                    onChange={e =>
                      setEditingSession({
                        ...editingSession,
                        title: e.target.value,
                      })
                    }
                    placeholder='Título del entrenamiento'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-distance'>Distance (m)</Label>
                  <Input
                    id='edit-distance'
                    type='number'
                    value={editingSession.distance}
                    onChange={e =>
                      setEditingSession({
                        ...editingSession,
                        distance: parseInt(e.target.value),
                      })
                    }
                    required
                    min='1'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='edit-coach'>Coach</Label>
                  <Input
                    id='edit-coach'
                    type='text'
                    value={editingSession.coach || ''}
                    onChange={e =>
                      setEditingSession({
                        ...editingSession,
                        coach: e.target.value,
                      })
                    }
                    placeholder='Nombre del entrenador'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-duration'>Duración (min)</Label>
                  <Input
                    id='edit-duration'
                    type='number'
                    value={editingSession.duration || 0}
                    onChange={e =>
                      setEditingSession({
                        ...editingSession,
                        duration: parseInt(e.target.value),
                      })
                    }
                    min='1'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='edit-rpe'>RPE (1-10)</Label>
                  <Select
                    value={(editingSession.rpe || 5).toString()}
                    onValueChange={value =>
                      setEditingSession({
                        ...editingSession,
                        rpe: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RPE_OPTIONS.map(rpe => (
                        <SelectItem key={rpe} value={rpe.toString()}>
                          {rpe}/10
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-stroke'>Estilo</Label>
                  <Select
                    value={editingSession.stroke || 'Libre'}
                    onValueChange={value =>
                      setEditingSession({ ...editingSession, stroke: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STROKE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='edit-sessionType'>Tipo</Label>
                  <Select
                    value={editingSession.type || 'Aerobic'}
                    onValueChange={value =>
                      setEditingSession({ ...editingSession, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSION_TYPE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-content'>
                  Training Content
                </Label>
                <Textarea
                  id='edit-content'
                  value={editingSession.content || ''}
                  onChange={e =>
                    setEditingSession({
                      ...editingSession,
                      content: e.target.value,
                    })
                  }
                  placeholder='Descripción detallada del entrenamiento...'
                  rows={3}
                />
              </div>

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  <Edit className='w-4 h-4 mr-2' />
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta sesión? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {sessionToDelete && (
            <div className='space-y-4'>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>
                        {sessionToDelete.distance}m{' '}
                        {STROKE_OPTIONS.find(
                          s => s.value === sessionToDelete.stroke
                        )?.label ||
                          sessionToDelete.stroke ||
                          'N/A'}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {formatDate(sessionToDelete.date, 'dd/MM/yyyy')} -{' '}
                        {sessionToDelete.title || 'Sin título'}
                      </p>
                    </div>
                    <Badge variant='outline'>
                      RPE {sessionToDelete.rpe || 0}/10
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant='destructive' onClick={handleDeleteConfirm}>
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
