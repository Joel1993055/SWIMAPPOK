'use client';

import { AIZoneDetection } from '@/components/features/training/ai-zone-detection';
import { PDFExportButton, useTrainingPDFData } from '@/components/features/training/pdf-export-button';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { createSession, deleteSession, updateSession, type Session as SupabaseSession } from '@/lib/actions/sessions';
import { useSessionsData } from '@/lib/hooks/use-sessions-data';
import type { Session } from '@/lib/types/session';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar as CalendarIcon,
    Edit,
    FileText,
    MapPin,
    Plus,
    Save,
    Target,
    Trash2,
    Users
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// =====================================================
// TIPOS DE DATOS
// =====================================================
interface TrainingFormData {
  title: string;
  date: Date;
  location: string;
  coach: string;
  content: string;
  objective: string;
  timeSlot: 'AM' | 'PM';
  club: string;
  group: string;
  zoneVolumes: ZoneVolumeRow[];
}

interface ZoneVolumeRow {
  z1: number;
  z2: number;
  z3: number;
  z4: number;
  z5: number;
}

interface ClubData {
  name: string;
  groups: Array<{ id: string; name: string }>;
}

interface ClubsData {
  [key: string]: ClubData;
}

// =====================================================
// CONSTANTES
// =====================================================
const CLUBS_DATA: ClubsData = {
    'club-1': {
      name: 'Club Natación Madrid',
      groups: [
        { id: 'group-1-1', name: 'Grupo A - Competición' },
        { id: 'group-1-2', name: 'Grupo B - Desarrollo' },
        { id: 'group-1-3', name: 'Grupo C - Iniciación' },
      ],
    },
    'club-2': {
      name: 'Club Acuático Barcelona',
      groups: [
        { id: 'group-2-1', name: 'Elite' },
        { id: 'group-2-2', name: 'Promesas' },
        { id: 'group-2-3', name: 'Base' },
      ],
    },
    'club-3': {
      name: 'Centro Deportivo Valencia',
      groups: [
        { id: 'group-3-1', name: 'Senior' },
        { id: 'group-3-2', name: 'Junior' },
        { id: 'group-3-3', name: 'Infantil' },
      ],
    },
} as const;

const OBJECTIVE_OPTIONS = [
  { value: 'resistencia', label: 'Resistencia' },
  { value: 'velocidad', label: 'Velocidad' },
  { value: 'tecnica', label: 'Técnica' },
  { value: 'fuerza', label: 'Fuerza' },
  { value: 'recuperacion', label: 'Recuperación' },
  { value: 'competicion', label: 'Competición' },
  { value: 'test', label: 'Test' },
  { value: 'otro', label: 'Otro' },
] as const;

// =====================================================
// UTILIDADES
// =====================================================
const mapSupabaseToSession = (supabaseSession: SupabaseSession): Session => ({
  id: supabaseSession.id,
  date: supabaseSession.date,
  swimmer: supabaseSession.coach || 'N/A',
  distance: supabaseSession.distance,
  stroke: supabaseSession.stroke as Session['stroke'],
  sessionType: supabaseSession.type as Session['sessionType'],
  mainSet: supabaseSession.content || '',
  notes: supabaseSession.objective || '',
});

const mapSessionToSupabase = (session: Session): SupabaseSession => ({
  id: session.id,
  user_id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  title: session.mainSet,
  date: session.date,
  type: session.sessionType,
  duration: 0,
  distance: session.distance,
  stroke: session.stroke,
  rpe: 5,
  location: '',
  coach: session.swimmer,
  club: '',
  group_name: '',
  objective: session.notes || '',
  time_slot: 'AM',
  content: session.mainSet,
  zone_volumes: {
    z1: 0,
    z2: 0,
    z3: 0,
    z4: 0,
    z5: 0,
  },
});

const createEmptyZoneVolumes = (): ZoneVolumeRow[] =>
        Array.from({ length: 10 }, () => ({
          z1: 0,
          z2: 0,
          z3: 0,
          z4: 0,
          z5: 0,
  }));

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================
export default function TrainingPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <TrainingPageContent />
      </SidebarInset>
    </SidebarProvider>
  );
}

// =====================================================
// COMPONENTE DE CONTENIDO PRINCIPAL
// =====================================================
function TrainingPageContent() {
  // Estados principales
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [editingTraining, setEditingTraining] = useState<Session | null>(null);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hook de datos
  const { sessions, isLoading: dataLoading, loadSessions } = useSessionsData();

  // =====================================================
  // EFECTOS
  // =====================================================
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // =====================================================
  // FUNCIONES DE MANEJO
  // =====================================================
  const handleEditTraining = useCallback((training: Session) => {
    setEditingTraining(training);
    setActiveTab('create');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTraining(null);
    setError(null);
    setSuccess(null);
  }, []);

  const handleSaveSuccess = useCallback((message: string) => {
    setSuccess(message);
    setEditingTraining(null);
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  const handleSaveError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleDeleteTraining = useCallback(
    async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteSession(id);
        
        // Recargar las sesiones para mostrar los cambios
        setIsRefreshing(true);
        try {
          await loadSessions(true);
        } finally {
          setIsRefreshing(false);
        }
        
        handleSaveSuccess('Entrenamiento eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando entrenamiento:', error);
        handleSaveError('Error al eliminar el entrenamiento');
    } finally {
      setIsLoading(false);
    }
    },
    [handleSaveSuccess, handleSaveError, loadSessions]
  );

  // =====================================================
  // RENDERIZADO
  // =====================================================
  if (!isHydrated) {
    return <TrainingPageSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Entrenamientos</h1>
        </div>
        <p className="text-muted-foreground">
          Crea y gestiona tus entrenamientos personalizados
        </p>

        {/* Mensajes de estado */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Navegación de tabs */}
        <div className="flex gap-2 mt-6">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {editingTraining ? 'Editando' : 'Crear Entrenamiento'}
          </Button>
          <Button
            variant={activeTab === 'saved' ? 'default' : 'outline'}
            onClick={() => setActiveTab('saved')}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Entrenamientos Guardados ({sessions.length})
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      {activeTab === 'create' ? (
        <TrainingForm
          editingTraining={editingTraining}
          onSaveSuccess={handleSaveSuccess}
          onSaveError={handleSaveError}
          onCancelEdit={handleCancelEdit}
          clubsData={CLUBS_DATA}
          objectiveOptions={OBJECTIVE_OPTIONS}
          onRefresh={async () => {
            setIsRefreshing(true);
            try {
              await loadSessions(true);
            } finally {
              setIsRefreshing(false);
            }
          }}
        />
      ) : (
        <TrainingList
          sessions={sessions}
          isLoading={dataLoading || isRefreshing}
          onEdit={handleEditTraining}
          onDelete={handleDeleteTraining}
        />
      )}
    </div>
  );
}

// =====================================================
// COMPONENTE DE FORMULARIO DE ENTRENAMIENTO
// =====================================================
interface TrainingFormProps {
  editingTraining: Session | null;
  onSaveSuccess: (message: string) => void;
  onSaveError: (message: string) => void;
  onCancelEdit: () => void;
  clubsData: ClubsData;
  objectiveOptions: readonly Array<{ value: string; label: string }>;
  onRefresh: () => Promise<void>;
}

function TrainingForm({
  editingTraining,
  onSaveSuccess,
  onSaveError,
  onCancelEdit,
  clubsData,
  objectiveOptions,
  onRefresh,
}: TrainingFormProps) {
  // Estados del formulario
  const [formData, setFormData] = useState<TrainingFormData>(() => ({
    title: '',
    date: new Date(),
    location: '',
    coach: '',
    content: '',
    objective: '',
    timeSlot: 'AM',
    club: 'club-1',
    group: 'group-1-1',
    zoneVolumes: createEmptyZoneVolumes(),
  }));

  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // EFECTOS
  // =====================================================
  useEffect(() => {
    if (editingTraining) {
      const supabaseTraining = mapSessionToSupabase(editingTraining);
      setFormData({
        title: supabaseTraining.title,
        date: new Date(editingTraining.date),
        location: supabaseTraining.location,
        coach: supabaseTraining.coach,
        content: supabaseTraining.content,
        objective: supabaseTraining.objective || '',
        timeSlot: supabaseTraining.time_slot as 'AM' | 'PM',
        club: 'club-1', // Default
        group: 'group-1-1', // Default
        zoneVolumes: createEmptyZoneVolumes(),
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        date: new Date(),
        location: '',
        coach: '',
        content: '',
        objective: '',
        timeSlot: 'AM',
        club: 'club-1',
        group: 'group-1-1',
        zoneVolumes: createEmptyZoneVolumes(),
      });
    }
  }, [editingTraining]);

  // =====================================================
  // FUNCIONES DE MANEJO
  // =====================================================
  const handleInputChange = useCallback((field: keyof TrainingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClubChange = useCallback((clubId: string) => {
    setFormData(prev => ({
      ...prev,
      club: clubId,
      group: clubsData[clubId]?.groups[0]?.id || 'group-1-1',
    }));
  }, [clubsData]);

  const handleZoneVolumeChange = useCallback((
    rowIndex: number,
    zone: keyof ZoneVolumeRow,
    value: string
  ) => {
    const numericValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      zoneVolumes: prev.zoneVolumes.map((row, index) =>
        index === rowIndex ? { ...row, [zone]: numericValue } : row
      ),
    }));
  }, []);

  // Función para aplicar zonas detectadas por IA
  const setZoneTotals = useCallback((zones: { z1: number; z2: number; z3: number; z4: number; z5: number }) => {
    // Crear una nueva matriz de volúmenes con las zonas detectadas en la primera fila
    const newZoneVolumes = [...formData.zoneVolumes];
    newZoneVolumes[0] = {
      z1: zones.z1,
      z2: zones.z2,
      z3: zones.z3,
      z4: zones.z4,
      z5: zones.z5,
    };
    
    setFormData(prev => ({
      ...prev,
      zoneVolumes: newZoneVolumes,
    }));
  }, [formData.zoneVolumes]);

  const handleSave = useCallback(async () => {
    if (!formData.title || !formData.content) {
      onSaveError('Por favor, completa el título y el contenido del entrenamiento');
      return;
    }

    try {
      setIsLoading(true);

      const selectedClubData = clubsData[formData.club];
      const selectedGroupData = selectedClubData?.groups.find(g => g.id === formData.group);

      // Calcular totales de metros por zona
      const zoneTotals = {
        z1: formData.zoneVolumes.reduce((sum, row) => sum + row.z1, 0),
        z2: formData.zoneVolumes.reduce((sum, row) => sum + row.z2, 0),
        z3: formData.zoneVolumes.reduce((sum, row) => sum + row.z3, 0),
        z4: formData.zoneVolumes.reduce((sum, row) => sum + row.z4, 0),
        z5: formData.zoneVolumes.reduce((sum, row) => sum + row.z5, 0),
      };

      const totalMeters = Object.values(zoneTotals).reduce((sum, volume) => sum + volume, 0);

      // Crear FormData con todos los datos
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date.toISOString().split('T')[0]);
      formDataToSend.append('type', 'Personalizado');
      formDataToSend.append('duration', '90');
      formDataToSend.append('distance', totalMeters.toString());
      formDataToSend.append('stroke', 'Libre');
      formDataToSend.append('rpe', '5');
      formDataToSend.append('location', formData.location || 'No especificado');
      formDataToSend.append('coach', formData.coach || 'No especificado');
      formDataToSend.append('club', selectedClubData?.name || 'No especificado');
      formDataToSend.append('group_name', selectedGroupData?.name || 'No especificado');
      formDataToSend.append('objective', formData.objective || 'otro');
      formDataToSend.append('time_slot', formData.timeSlot);
      formDataToSend.append('content', formData.content);

      // Agregar volúmenes por zona (esto es lo que se guarda en la base de datos)
      formDataToSend.append('z1', zoneTotals.z1.toString());
      formDataToSend.append('z2', zoneTotals.z2.toString());
      formDataToSend.append('z3', zoneTotals.z3.toString());
      formDataToSend.append('z4', zoneTotals.z4.toString());
      formDataToSend.append('z5', zoneTotals.z5.toString());

      console.log('Guardando entrenamiento con datos:', {
        title: formData.title,
        totalMeters,
        zoneTotals,
        club: selectedClubData?.name,
        group: selectedGroupData?.name,
      });

      if (editingTraining) {
        await updateSession(editingTraining.id, formDataToSend);
        onSaveSuccess('Entrenamiento actualizado correctamente');
      } else {
        await createSession(formDataToSend);
        onSaveSuccess('Entrenamiento guardado correctamente');
      }

      // Recargar las sesiones para mostrar los cambios
      console.log('Recargando sesiones después de guardar...');
      await onRefresh();
      console.log('Sesiones recargadas correctamente');


      // Reset form solo si no estamos editando
      if (!editingTraining) {
        setFormData({
          title: '',
          date: new Date(),
          location: '',
          coach: '',
          content: '',
          objective: '',
          timeSlot: 'AM',
          club: 'club-1',
          group: 'group-1-1',
          zoneVolumes: createEmptyZoneVolumes(),
        });
      }

    } catch (error) {
      console.error('Error guardando entrenamiento:', error);
      onSaveError(`Error al guardar el entrenamiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  }, [formData, editingTraining, clubsData, onSaveSuccess, onSaveError, onRefresh]);

  // =====================================================
  // CÁLCULOS DERIVADOS
  // =====================================================
  const totalMeters = useMemo(() => {
    return formData.zoneVolumes.reduce((total, row) => {
      return total + Object.values(row).reduce((sum, volume) => sum + volume, 0);
    }, 0);
  }, [formData.zoneVolumes]);

  const selectedClubGroups = useMemo(() => {
    return clubsData[formData.club]?.groups || [];
  }, [clubsData, formData.club]);

  // =====================================================
  // RENDERIZADO
  // =====================================================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Principal */}
      <div className="lg:col-span-2">
        <Card className="bg-muted/50">
              <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingTraining ? 'Editar Entrenamiento' : 'Crear Nuevo Entrenamiento'}
                </CardTitle>
                <CardDescription>
                  {editingTraining
                    ? 'Modifica los detalles de tu entrenamiento'
                    : 'Escribe tu entrenamiento con todos los detalles'}
                </CardDescription>
              </CardHeader>
          <CardContent className="space-y-6">
                {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="training-title">Título del entrenamiento</Label>
                    <Input
                  id="training-title"
                  placeholder="Ej: Entrenamiento de resistencia"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-date">Fecha</Label>
                <div className="flex gap-2">
                      <Input
                    type="date"
                    value={formData.date.toISOString().split('T')[0]}
                        onChange={e => {
                          const dateValue = e.target.value;
                          if (dateValue) {
                        handleInputChange('date', new Date(dateValue));
                          }
                        }}
                    className="flex-1"
                      />
                      <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleInputChange('date', new Date())}
                      >
                        Hoy
                      </Button>
                    </div>
                <div className="text-sm text-muted-foreground">
                  Fecha seleccionada: {format(formData.date, 'dd/MM/yyyy', { locale: es })}
                    </div>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-location">Ubicación</Label>
                    <Input
                  id="training-location"
                  placeholder="Ej: Piscina Municipal"
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-coach">Entrenador</Label>
                    <Input
                  id="training-coach"
                  placeholder="Ej: María García"
                  value={formData.coach}
                  onChange={e => handleInputChange('coach', e.target.value)}
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-club">Club</Label>
                <Select value={formData.club} onValueChange={handleClubChange}>
                      <SelectTrigger>
                    <SelectValue placeholder="Selecciona el club" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(clubsData).map(([clubId, club]) => (
                          <SelectItem key={clubId} value={clubId}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-group">Grupo</Label>
                    <Select
                  value={formData.group}
                  onValueChange={value => handleInputChange('group', value)}
                    >
                      <SelectTrigger>
                    <SelectValue placeholder="Selecciona el grupo" />
                      </SelectTrigger>
                      <SelectContent>
                    {selectedClubGroups.map(group => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-objective">Objetivo del Entrenamiento</Label>
                    <Select
                  value={formData.objective}
                  onValueChange={value => handleInputChange('objective', value)}
                    >
                      <SelectTrigger>
                    <SelectValue placeholder="Selecciona el objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                    {objectiveOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                        </SelectItem>
                    ))}
                      </SelectContent>
                    </Select>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-time-slot">Horario</Label>
                    <Select
                  value={formData.timeSlot}
                  onValueChange={value => handleInputChange('timeSlot', value as 'AM' | 'PM')}
                    >
                      <SelectTrigger>
                    <SelectValue placeholder="Selecciona el horario" />
                      </SelectTrigger>
                      <SelectContent>
                    <SelectItem value="AM">AM (Mañana)</SelectItem>
                    <SelectItem value="PM">PM (Tarde/Noche)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

            {/* Editor de contenido */}
            <div className="space-y-2">
              <Label htmlFor="training-content">Contenido del entrenamiento</Label>
              <Textarea
                id="training-content"
                placeholder="Escribe tu entrenamiento aquí... Ejemplo:&#10;&#10;Calentamiento: 200m libre Z1&#10;Serie principal: 8x100m libre Z3 con 20s descanso&#10;Vuelta a la calma: 200m espalda Z1&#10;&#10;Puedes incluir:&#10;- Distancias (200m, 1.5km)&#10;- Tiempos (45min, 1h 30min)&#10;- Zonas (Z1, Z2, Z3, Z4, Z5)&#10;- Estilos (libre, espalda, pecho, mariposa)"
                value={formData.content}
                onChange={e => handleInputChange('content', e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </div>

            {/* Volúmenes por zona - Debajo del contenido */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Volúmenes por Zona</Label>
                <div className="text-sm text-muted-foreground">
                  Total: <span className="font-semibold text-foreground">{totalMeters.toLocaleString()}m</span>
                </div>
              </div>

              {/* Una sola fila con 5 celdas para las zonas */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { zone: 'Z1', color: 'bg-green-100 dark:bg-green-900/20', name: 'Recuperación', key: 'z1' },
                  { zone: 'Z2', color: 'bg-blue-100 dark:bg-blue-900/20', name: 'Aeróbico Base', key: 'z2' },
                  { zone: 'Z3', color: 'bg-yellow-100 dark:bg-yellow-900/20', name: 'Aeróbico Umbral', key: 'z3' },
                  { zone: 'Z4', color: 'bg-orange-100 dark:bg-orange-900/20', name: 'Anaeróbico Láctico', key: 'z4' },
                  { zone: 'Z5', color: 'bg-red-100 dark:bg-red-900/20', name: 'Anaeróbico Aláctico', key: 'z5' },
                ].map(({ zone, color, name, key }) => {
                  const total = formData.zoneVolumes.reduce(
                    (sum, row) => sum + row[key as keyof ZoneVolumeRow],
                    0
                  );
                  
                  return (
                    <div key={zone} className={`p-4 rounded-lg border ${color} hover:shadow-md transition-shadow`}>
                      <div className="text-center mb-3">
                        <div className="font-bold text-xl">{zone}</div>
                        <div className="text-xs text-muted-foreground">{name}</div>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        step="50"
                        placeholder="0"
                        value={total || ''}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          setFormData(prev => ({
                            ...prev,
                            zoneVolumes: prev.zoneVolumes.map((row, index) =>
                              index === 0 ? { ...row, [key]: value } : { ...row, [key]: 0 }
                            ),
                          }));
                        }}
                        className="text-center font-mono text-sm h-10"
                      />
                      <div className="text-xs text-muted-foreground text-center mt-2 font-medium">
                        {total > 0 ? `${total.toLocaleString()}m` : '0m'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botones de utilidad */}
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      zoneVolumes: createEmptyZoneVolumes(),
                    }));
                  }}
                  className="text-xs"
                >
                  Limpiar Zonas
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Llenar con datos de ejemplo
                    setFormData(prev => ({
                      ...prev,
                      zoneVolumes: [
                        { z1: 200, z2: 400, z3: 600, z4: 200, z5: 100 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                      ],
                    }));
                  }}
                  className="text-xs"
                >
                  Ejemplo
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 text-center">
                <div>💡 <strong>Consejo:</strong> Introduce los metros que nadaste en cada zona de intensidad.</div>
                <div>📊 <strong>Total calculado:</strong> {totalMeters.toLocaleString()} metros</div>
              </div>
            </div>

                {/* Botones de acción */}
            <div className="flex justify-between">
                  <div>
                    {editingTraining && (
                  <Button variant="outline" onClick={onCancelEdit} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                        Cancelar Edición
                      </Button>
                    )}
                  </div>
              <div className="flex gap-2">
                    <Button
                  variant="outline"
                  onClick={() => handleInputChange('content', '')}
                    >
                      Limpiar
                    </Button>
                <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                      {isLoading ? (
                        <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Guardando...
                        </>
                      ) : (
                        <>
                      <Save className="h-4 w-4" />
                      {editingTraining ? 'Actualizar' : 'Guardar'} Entrenamiento
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Panel lateral */}
      <div className="lg:col-span-1 space-y-6">
            {/* Detección Automática de IA */}
            <AIZoneDetection
              content={formData.content}
              objective={formData.objective}
              timeSlot={formData.timeSlot}
              onZonesDetected={(zones) => {
                setZoneTotals(zones);
              }}
              disabled={isLoading}
            />

            {/* Panel de Ayuda */}
        <Card className="bg-muted/50">
              <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
                  Consejos para Escribir
                </CardTitle>
            <CardDescription>Mejores prácticas para crear entrenamientos</CardDescription>
              </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                  <div>
                <h4 className="font-medium mb-2">Estructura recomendada:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Calentamiento:</strong> 200-400m Z1</li>
                  <li>• <strong>Serie principal:</strong> Ejercicios específicos</li>
                  <li>• <strong>Vuelta a la calma:</strong> 200-300m Z1</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                <h4 className="font-medium mb-2">Formato de distancias:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 200m, 400m, 800m</li>
                      <li>• 1km, 1.5km, 2km</li>
                      <li>• 2000 metros</li>
                    </ul>
                  </div>

                  <div>
                <h4 className="font-medium mb-2">Zonas de intensidad:</h4>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {['Z1', 'Z2', 'Z3', 'Z4', 'Z5'].map(zone => (
                      <Badge key={zone} variant="outline">{zone}</Badge>
                    ))}
                      </div>
                  <div className="text-xs text-muted-foreground">
                    <div>• <strong>Z1:</strong> Recuperación activa</div>
                    <div>• <strong>Z2:</strong> Aeróbico base</div>
                    <div>• <strong>Z3:</strong> Aeróbico umbral</div>
                    <div>• <strong>Z4:</strong> Anaeróbico láctico</div>
                    <div>• <strong>Z5:</strong> Anaeróbico aláctico</div>
                        </div>
                    </div>
                  </div>

                  <div>
                <h4 className="font-medium mb-2">Estilos de natación:</h4>
                <div className="flex flex-wrap gap-1">
                  {['Libre', 'Espalda', 'Pecho', 'Mariposa'].map(style => (
                    <Badge key={style} variant="secondary">{style}</Badge>
                  ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
  );
}

// =====================================================
// COMPONENTE DE LISTA DE ENTRENAMIENTOS
// =====================================================
interface TrainingListProps {
  sessions: Session[];
  isLoading: boolean;
  onEdit: (training: Session) => void;
  onDelete: (id: string) => void;
}

function TrainingList({ sessions, isLoading, onEdit, onDelete }: TrainingListProps) {
  const { convertSessionToPDFData } = useTrainingPDFData();
  
  if (isLoading) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="text-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent mx-auto mb-4" />
          <p>Actualizando entrenamientos...</p>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No tienes entrenamientos guardados</p>
          <p className="text-sm text-muted-foreground">
            Crea tu primer entrenamiento en la pestaña "Crear Entrenamiento"
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Entrenamientos Guardados</CardTitle>
              <CardDescription>{sessions.length} entrenamientos guardados</CardDescription>
            </CardHeader>
            <CardContent>
        <div className="space-y-4">
          {sessions.map(training => (
            <div key={training.id} className="border rounded-lg p-4 bg-background/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{training.mainSet}</h3>
                    <Badge variant="outline">{training.sessionType}</Badge>
                    <Badge variant="secondary">{training.stroke}</Badge>
                          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(training.date), 'dd/MM/yyyy', { locale: es })}</span>
                            </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                              <span>{training.distance}m</span>
                            </div>
                          </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                            <span>N/A</span>
                    <Users className="h-4 w-4 ml-4" />
                            <span>{training.swimmer}</span>
                          </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <pre className="text-sm whitespace-pre-wrap font-mono">{training.mainSet}</pre>
                          </div>
                        </div>

                <div className="ml-4 flex gap-2">
                          <PDFExportButton
                    training={convertSessionToPDFData(training)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    PDF
                  </PDFExportButton>
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(training)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(training.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
          ))}
              </div>
            </CardContent>
          </Card>
  );
}

// =====================================================
// COMPONENTE DE CARGA
// =====================================================
function TrainingPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Entrenamientos</h1>
        </div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Inicializando formulario...
        </div>
      </div>
    </div>
  );
}