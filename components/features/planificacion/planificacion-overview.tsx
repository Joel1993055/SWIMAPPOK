'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCompetitionsStore, useTrainingStore } from '@/lib/store/unified';
import {
  Activity,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Plus,
  Save,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
// NUEVO: Importar el store unificado

// Tipos de datos
interface TrainingPhase {
  id: string;
  name: string;
  duration: number; // en semanas
  description: string;
  focus: string[];
  intensity: number; // 1-10
  volume: number; // metros por semana
  color: string;
  startDate?: string; // Fecha de inicio (opcional)
  endDate?: string; // Fecha de fin (calculada automáticamente)
  order: number; // Orden de las fases
}

interface WeeklyPlan {
  week: number;
  phase: string;
  totalDistance: number;
  sessions: number;
  focus: string;
  intensity: number;
}

interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  type: 'nacional' | 'regional' | 'local' | 'internacional';
  events: string[];
  objectives: string;
  results?: {
    event: string;
    time: string;
    position: number;
    personalBest: boolean;
  }[];
  status: 'upcoming' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
}

// Los datos de ejemplo ahora están en el contexto

const weeklyPlan: WeeklyPlan[] = [
  {
    week: 1,
    phase: 'Base',
    totalDistance: 25000,
    sessions: 6,
    focus: 'Aeróbico',
    intensity: 4,
  },
  {
    week: 2,
    phase: 'Base',
    totalDistance: 26000,
    sessions: 6,
    focus: 'Aeróbico',
    intensity: 4,
  },
  {
    week: 3,
    phase: 'Base',
    totalDistance: 27000,
    sessions: 6,
    focus: 'Técnica',
    intensity: 4,
  },
  {
    week: 4,
    phase: 'Base',
    totalDistance: 28000,
    sessions: 6,
    focus: 'Aeróbico',
    intensity: 5,
  },
  {
    week: 5,
    phase: 'Construcción',
    totalDistance: 30000,
    sessions: 7,
    focus: 'Umbral',
    intensity: 6,
  },
  {
    week: 6,
    phase: 'Construcción',
    totalDistance: 31000,
    sessions: 7,
    focus: 'Umbral',
    intensity: 6,
  },
  {
    week: 7,
    phase: 'Construcción',
    totalDistance: 32000,
    sessions: 7,
    focus: 'Aeróbico',
    intensity: 6,
  },
  {
    week: 8,
    phase: 'Construcción',
    totalDistance: 33000,
    sessions: 7,
    focus: 'Umbral',
    intensity: 7,
  },
  {
    week: 9,
    phase: 'Específico',
    totalDistance: 28000,
    sessions: 8,
    focus: 'VO2 Max',
    intensity: 8,
  },
  {
    week: 10,
    phase: 'Específico',
    totalDistance: 29000,
    sessions: 8,
    focus: 'Velocidad',
    intensity: 8,
  },
  {
    week: 11,
    phase: 'Específico',
    totalDistance: 30000,
    sessions: 8,
    focus: 'VO2 Max',
    intensity: 8,
  },
  {
    week: 12,
    phase: 'Específico',
    totalDistance: 31000,
    sessions: 8,
    focus: 'Velocidad',
    intensity: 9,
  },
  {
    week: 13,
    phase: 'Pico',
    totalDistance: 20000,
    sessions: 6,
    focus: 'Velocidad',
    intensity: 9,
  },
  {
    week: 14,
    phase: 'Pico',
    totalDistance: 15000,
    sessions: 4,
    focus: 'Recuperación',
    intensity: 5,
  },
];

const competitions: Competition[] = [
  {
    id: 'comp-1',
    name: 'Campeonato Nacional 2025',
    date: '2025-06-15',
    location: 'Madrid, España',
    type: 'nacional',
    events: ['100m Libre', '200m Libre', '4x100m Libre'],
    objectives:
      'Objetivo principal del año. Buscar clasificación para el Campeonato de Europa',
    status: 'upcoming',
    priority: 'high',
  },
  {
    id: 'comp-2',
    name: 'Copa Regional Primavera',
    date: '2025-04-20',
    location: 'Barcelona, España',
    type: 'regional',
    events: ['50m Libre', '100m Libre'],
    objectives:
      'Test de forma antes del Nacional. Objetivo: mejorar tiempos personales',
    status: 'upcoming',
    priority: 'medium',
  },
  {
    id: 'comp-3',
    name: 'Trofeo Ciudad de Valencia',
    date: '2025-03-10',
    location: 'Valencia, España',
    type: 'local',
    events: ['100m Libre', '200m Libre'],
    objectives: 'Primera competición del año. Evaluar forma actual',
    results: [
      {
        event: '100m Libre',
        time: '52.45',
        position: 3,
        personalBest: true,
      },
      {
        event: '200m Libre',
        time: '1:58.32',
        position: 5,
        personalBest: false,
      },
    ],
    status: 'completed',
    priority: 'low',
  },
];

export function PlanificacionOverview() {
  const {
    zones: currentZones,
    phases,
    addPhase,
    updatePhase,
    deletePhase,
  } = useTrainingStore();
  const {
    addCompetition,
    updateCompetition,
    deleteCompetition,
    getMainCompetition,
  } = useCompetitionsStore();

  // OPTIMIZADO: Solo usar lo necesario del store
  const { phases: storePhases, addPhase: storeAddPhase } = useTrainingStore();

  const {
    competitions: storeCompetitions,
    addCompetition: storeAddCompetition,
  } = useCompetitionsStore();
  // NUEVO: Funciones de sincronización
  const syncPhasesToStore = useCallback(() => {
    if (phases.length > 0 && storePhases.length === 0) {
      phases.forEach(phase => storeAddPhase(phase));
    }
  }, [phases, storePhases, storeAddPhase]);

  const syncCompetitionsToStore = useCallback(() => {
    if (competitions.length > 0 && storeCompetitions.length === 0) {
      competitions.forEach(competition => storeAddCompetition(competition));
    }
  }, [storeCompetitions, storeAddCompetition]);

  // Ejecutar sincronización
  React.useEffect(() => {
    syncPhasesToStore();
    syncCompetitionsToStore();
  }, [syncPhasesToStore, syncCompetitionsToStore]);

  const [selectedPhase, setSelectedPhase] = useState<string>('base');
  const [selectedCompetition, setSelectedCompetition] = useState<string>(
    competitions.length > 0 ? competitions[0].id : ''
  );

  // Estado para la competición principal (prioridad alta)
  const [mainCompetition, setMainCompetition] = useState<Competition | null>(
    getMainCompetition()
  );

  // Estados para edición
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editingCompetition, setEditingCompetition] = useState<string | null>(
    null
  );
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [isAddingCompetition, setIsAddingCompetition] = useState(false);

  // Estados para formularios
  const [phaseForm, setPhaseForm] = useState({
    name: '',
    duration: 0,
    description: '',
    focus: [] as string[],
    intensity: 5,
    volume: 0,
    startDate: '',
    order: 1,
  });

  const [competitionForm, setCompetitionForm] = useState({
    name: '',
    date: '',
    location: '',
    type: 'local' as 'nacional' | 'regional' | 'local' | 'internacional',
    events: [] as string[],
    objectives: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
  });

  const currentPhase = phases.find(phase => phase.id === selectedPhase);
  const currentCompetition = competitions.find(
    comp => comp.id === selectedCompetition
  );

  // Sincronizar la competición principal cuando cambien las competiciones
  useEffect(() => {
    setMainCompetition(getMainCompetition());
  }, [getMainCompetition]);

  // Reiniciar formulario cuando se abra el modal de agregar fase
  useEffect(() => {
    if (isAddingPhase && !editingPhase) {
      setPhaseForm({
        name: '',
        duration: 0,
        description: '',
        focus: [],
        intensity: 5,
        volume: 0,
        startDate: '',
        order: phases.length + 1, // Orden automático basado en el número de fases existentes
      });
    }
  }, [isAddingPhase, editingPhase, phases.length]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Las fases ya vienen con fechas calculadas del contexto

  // Funciones para manejar edición de fases
  const handleEditPhase = (phase: TrainingPhase) => {
    setPhaseForm({
      name: phase.name,
      duration: phase.duration,
      description: phase.description,
      focus: [...phase.focus],
      intensity: phase.intensity,
      volume: phase.volume,
      startDate: phase.startDate || '',
      order: phase.order,
    });
    setEditingPhase(phase.id);
  };

  const handleSavePhase = () => {
    // Validar que todos los campos requeridos estén llenos
    if (!phaseForm.name.trim()) {
      console.warn('Por favor, ingresa el nombre de la fase');
      return;
    }
    if (phaseForm.duration <= 0) {
      console.warn('Por favor, ingresa una duración válida');
      return;
    }
    if (phaseForm.order <= 0) {
      console.warn('Por favor, ingresa un orden válido');
      return;
    }

    try {
      if (isAddingPhase) {
        // Crear nueva fase
        const newPhase: TrainingPhase = {
          id: `phase-${Date.now()}`,
          name: phaseForm.name,
          duration: phaseForm.duration,
          description: phaseForm.description,
          focus: phaseForm.focus,
          intensity: phaseForm.intensity,
          volume: phaseForm.volume,
          color: 'bg-purple-500', // Color por defecto
          startDate: phaseForm.startDate,
          order: phaseForm.order,
        };
        addPhase(newPhase);
        console.log('Fase agregada:', newPhase);
      } else if (editingPhase) {
        // Actualizar fase existente
        updatePhase(editingPhase, {
          name: phaseForm.name,
          duration: phaseForm.duration,
          description: phaseForm.description,
          focus: phaseForm.focus,
          intensity: phaseForm.intensity,
          volume: phaseForm.volume,
          startDate: phaseForm.startDate,
          order: phaseForm.order,
        });
        console.log('Fase actualizada:', editingPhase);
      }

      // Cerrar el modal pero NO reiniciar el formulario inmediatamente
      setEditingPhase(null);
      setIsAddingPhase(false);

      // Mostrar mensaje de éxito (sin alert)
      console.log('Fase guardada correctamente');
    } catch (error) {
      console.error('Error guardando fase:', error);
    }
  };

  const handleCancelPhase = () => {
    setEditingPhase(null);
    setIsAddingPhase(false);
    // Solo reiniciar el formulario cuando se cancele, no cuando se guarde
    setPhaseForm({
      name: '',
      duration: 0,
      description: '',
      focus: [],
      intensity: 5,
      volume: 0,
      startDate: '',
      order: 1,
    });
  };

  const handleDeletePhase = (phaseId: string) => {
    deletePhase(phaseId);
  };

  const handleAddFocus = (focus: string) => {
    if (!phaseForm.focus.includes(focus)) {
      setPhaseForm(prev => ({
        ...prev,
        focus: [...prev.focus, focus],
      }));
    }
  };

  const handleRemoveFocus = (focus: string) => {
    setPhaseForm(prev => ({
      ...prev,
      focus: prev.focus.filter(f => f !== focus),
    }));
  };

  // Funciones para manejar edición de competiciones
  const handleEditCompetition = (competition: Competition) => {
    setCompetitionForm({
      name: competition.name,
      date: competition.date,
      location: competition.location,
      type: competition.type,
      events: [...competition.events],
      objectives: competition.objectives,
      priority: competition.priority,
      status: competition.status,
    });
    setEditingCompetition(competition.id);
  };

  const handleSaveCompetition = () => {
    const competitionData: Competition = {
      id: editingCompetition || `comp-${Date.now()}`,
      name: competitionForm.name,
      date: competitionForm.date,
      location: competitionForm.location,
      type: competitionForm.type,
      events: competitionForm.events,
      objectives: competitionForm.objectives,
      priority: competitionForm.priority,
      status: competitionForm.status,
    };

    if (isAddingCompetition) {
      addCompetition(competitionData);
    } else if (editingCompetition) {
      updateCompetition(editingCompetition, competitionData);
    }

    // Si la competición tiene prioridad alta, actualizar la competición principal
    if (competitionForm.priority === 'high') {
      setMainCompetition(competitionData);
    }

    setEditingCompetition(null);
    setIsAddingCompetition(false);
    setCompetitionForm({
      name: '',
      date: '',
      location: '',
      type: 'local',
      events: [],
      objectives: '',
      priority: 'medium',
      status: 'upcoming',
    });
  };

  const handleCancelCompetition = () => {
    setEditingCompetition(null);
    setIsAddingCompetition(false);
    setCompetitionForm({
      name: '',
      date: '',
      location: '',
      type: 'local',
      events: [],
      objectives: '',
      priority: 'medium',
      status: 'upcoming',
    });
  };

  const handleAddEvent = (event: string) => {
    if (!competitionForm.events.includes(event)) {
      setCompetitionForm(prev => ({
        ...prev,
        events: [...prev.events, event],
      }));
    }
  };

  const handleRemoveEvent = (event: string) => {
    setCompetitionForm(prev => ({
      ...prev,
      events: prev.events.filter(e => e !== event),
    }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internacional':
        return 'bg-purple-500';
      case 'nacional':
        return 'bg-red-500';
      case 'regional':
        return 'bg-orange-500';
      case 'local':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCompetitionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'upcoming':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Función para calcular días restantes hasta la competición principal
  const getDaysToMainCompetition = () => {
    if (!mainCompetition) return null;

    const today = new Date();
    const competitionDate = new Date(mainCompetition.date);
    const timeDiff = competitionDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  };

  const daysToCompetition = getDaysToMainCompetition();

  return (
    <div className='space-y-6'>
      {/* Header con objetivos principales */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-muted/50 border-muted'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Días al Campeonato
            </CardTitle>
            <Target className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {mainCompetition ? (
              <>
                <div className='text-2xl font-bold'>
                  {daysToCompetition !== null
                    ? daysToCompetition > 0
                      ? `${daysToCompetition} días`
                      : daysToCompetition === 0
                        ? '¡Hoy!'
                        : `Hace ${Math.abs(daysToCompetition)} días`
                    : 'N/A'}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {mainCompetition.name}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {new Date(mainCompetition.date).toLocaleDateString('es-ES')}
                </p>
                <Progress
                  value={
                    daysToCompetition !== null && daysToCompetition > 0
                      ? Math.max(
                          0,
                          Math.min(100, ((365 - daysToCompetition) / 365) * 100)
                        )
                      : 100
                  }
                  className='h-2 mt-2'
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  {daysToCompetition !== null && daysToCompetition > 0
                    ? `${Math.round(((365 - daysToCompetition) / 365) * 100)}% del año transcurrido`
                    : 'Competición completada'}
                </p>
              </>
            ) : (
              <>
                <div className='text-2xl font-bold text-muted-foreground'>
                  Sin objetivo
                </div>
                <p className='text-xs text-muted-foreground'>
                  Crea una competición con prioridad alta
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className='bg-muted/50 border-muted'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Fase Actual</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>Construcción</div>
            <p className='text-xs text-muted-foreground'>Semana 6 de 14</p>
            <Progress value={43} className='h-2 mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>43% del ciclo</p>
          </CardContent>
        </Card>

        <Card className='bg-muted/50 border-muted'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Volumen Semanal
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>31,000m</div>
            <p className='text-xs text-muted-foreground'>7 sesiones</p>
            <Progress value={75} className='h-2 mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              75% del objetivo
            </p>
          </CardContent>
        </Card>

        <Card className='bg-muted/50 border-muted'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Intensidad Media
            </CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>6.5/10</div>
            <p className='text-xs text-muted-foreground'>Umbral</p>
            <Progress value={65} className='h-2 mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              Intensidad objetivo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue='fases' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='fases'>Fases del Ciclo</TabsTrigger>
          <TabsTrigger value='competiciones'>Competiciones</TabsTrigger>
          <TabsTrigger value='planificacion'>Planificación Semanal</TabsTrigger>
          <TabsTrigger value='carga'>Carga de Entrenamiento</TabsTrigger>
        </TabsList>

        {/* Tab: Fases del Ciclo */}
        <TabsContent value='fases' className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>Fases de Entrenamiento</h3>
            <Button
              onClick={() => setIsAddingPhase(true)}
              className='gap-2'
              size='sm'
            >
              <Plus className='h-4 w-4' />
              Agregar Fase
            </Button>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {phases.map(phase => (
              <Card
                key={phase.id}
                className={`bg-muted/50 border-muted cursor-pointer transition-all hover:shadow-md ${
                  selectedPhase === phase.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPhase(phase.id)}
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg'>{phase.name}</CardTitle>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-3 h-3 rounded-full ${phase.color}`}
                      ></div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          handleEditPhase(phase);
                        }}
                        className='h-6 w-6 p-0'
                      >
                        <Edit className='h-3 w-3' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          handleDeletePhase(phase.id);
                        }}
                        className='h-6 w-6 p-0 text-red-500 hover:text-red-700'
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{phase.duration} semanas</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <p className='text-sm text-muted-foreground'>
                    {phase.description}
                  </p>

                  {phase.startDate && phase.endDate && (
                    <div className='text-xs text-muted-foreground bg-muted/30 rounded p-2'>
                      <div className='flex items-center gap-1 mb-1'>
                        <Calendar className='h-3 w-3' />
                        <span className='font-medium'>Período:</span>
                      </div>
                      <div>
                        {new Date(phase.startDate).toLocaleDateString('es-ES')}{' '}
                        - {new Date(phase.endDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  )}

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span>Intensidad:</span>
                      <Badge variant='outline'>{phase.intensity}/10</Badge>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span>Volumen:</span>
                      <Badge variant='outline'>
                        {phase.volume.toLocaleString()}m
                      </Badge>
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-xs font-medium'>Enfoque:</p>
                    <div className='flex flex-wrap gap-1'>
                      {phase.focus.map((focus, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detalles de la fase seleccionada */}
          {currentPhase && (
            <Card className='bg-muted/50 border-muted'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <div
                    className={`w-4 h-4 rounded-full ${currentPhase.color}`}
                  ></div>
                  {currentPhase.name} - Detalles
                </CardTitle>
                <CardDescription>{currentPhase.description}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-3'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Duración</h4>
                    <p className='text-2xl font-bold'>
                      {currentPhase.duration} semanas
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Intensidad Objetivo</h4>
                    <div className='flex items-center gap-2'>
                      <Progress
                        value={currentPhase.intensity * 10}
                        className='flex-1'
                      />
                      <span className='font-bold'>
                        {currentPhase.intensity}/10
                      </span>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Volumen Semanal</h4>
                    <p className='text-2xl font-bold'>
                      {currentPhase.volume.toLocaleString()}m
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Enfoques de Entrenamiento</h4>
                  <div className='flex flex-wrap gap-2'>
                    {currentPhase.focus.map((focus, index) => (
                      <Badge key={index} variant='default' className='text-sm'>
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modal de Edición de Fases */}
          <Dialog
            open={editingPhase !== null || isAddingPhase}
            onOpenChange={handleCancelPhase}
          >
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>
                  {isAddingPhase ? 'Agregar Nueva Fase' : 'Editar Fase'}
                </DialogTitle>
                <DialogDescription>
                  {isAddingPhase
                    ? 'Crea una nueva fase de entrenamiento'
                    : 'Modifica los detalles de la fase de entrenamiento'}
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='phase-name'>Nombre de la Fase</Label>
                    <Input
                      id='phase-name'
                      value={phaseForm.name}
                      onChange={e =>
                        setPhaseForm(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder='Ej: Base, Construcción, Pico'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phase-duration'>Duración (semanas)</Label>
                    <Input
                      id='phase-duration'
                      type='number'
                      value={phaseForm.duration}
                      onChange={e =>
                        setPhaseForm(prev => ({
                          ...prev,
                          duration: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder='8'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phase-description'>Descripción</Label>
                  <Textarea
                    id='phase-description'
                    value={phaseForm.description}
                    onChange={e =>
                      setPhaseForm(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder='Describe el objetivo de esta fase...'
                    className='min-h-[80px]'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='phase-intensity'>Intensidad (1-10)</Label>
                    <Input
                      id='phase-intensity'
                      type='number'
                      min='1'
                      max='10'
                      value={phaseForm.intensity}
                      onChange={e =>
                        setPhaseForm(prev => ({
                          ...prev,
                          intensity: parseInt(e.target.value) || 5,
                        }))
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phase-volume'>
                      Volumen Semanal (metros)
                    </Label>
                    <Input
                      id='phase-volume'
                      type='number'
                      value={phaseForm.volume}
                      onChange={e =>
                        setPhaseForm(prev => ({
                          ...prev,
                          volume: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder='25000'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='phase-start-date'>
                      Fecha de Inicio (solo primera fase)
                    </Label>
                    <Input
                      id='phase-start-date'
                      type='date'
                      value={phaseForm.startDate}
                      onChange={e =>
                        setPhaseForm(prev => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      disabled={phaseForm.order > 1}
                    />
                    {phaseForm.order > 1 && (
                      <p className='text-xs text-muted-foreground'>
                        Las fases posteriores se calculan automáticamente
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phase-order'>Orden de la Fase</Label>
                    <Input
                      id='phase-order'
                      type='number'
                      min='1'
                      value={phaseForm.order}
                      onChange={e =>
                        setPhaseForm(prev => ({
                          ...prev,
                          order: parseInt(e.target.value) || 1,
                        }))
                      }
                      placeholder='1'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>Enfoques de Entrenamiento</Label>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    {phaseForm.focus.map((focus, index) => (
                      <Badge key={index} variant='secondary' className='gap-1'>
                        {focus}
                        <button
                          onClick={() => handleRemoveFocus(focus)}
                          className='ml-1 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className='flex gap-2'>
                    {[
                      'Aeróbico',
                      'Técnica',
                      'Fuerza',
                      'Umbral',
                      'VO2 Max',
                      'Velocidad',
                      'Recuperación',
                    ].map(focus => (
                      <Button
                        key={focus}
                        variant='outline'
                        size='sm'
                        onClick={() => handleAddFocus(focus)}
                        disabled={phaseForm.focus.includes(focus)}
                        className='text-xs'
                      >
                        {focus}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                  <Button variant='outline' onClick={handleCancelPhase}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSavePhase} className='gap-2'>
                    <Save className='h-4 w-4' />
                    {isAddingPhase ? 'Agregar' : 'Guardar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Tab: Competiciones */}
        <TabsContent value='competiciones' className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>Competiciones</h3>
            <Button
              onClick={() => setIsAddingCompetition(true)}
              className='gap-2'
              size='sm'
            >
              <Plus className='h-4 w-4' />
              Agregar Competición
            </Button>
          </div>

          <div className='grid gap-4'>
            {competitions.map(competition => (
              <Card
                key={competition.id}
                className={`bg-muted/50 border-muted cursor-pointer transition-all hover:shadow-md ${
                  selectedCompetition === competition.id
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
                onClick={() => setSelectedCompetition(competition.id)}
              >
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2 flex-1'>
                      <div className='flex items-center gap-2'>
                        <Trophy className='h-5 w-5 text-yellow-500' />
                        <h3 className='text-lg font-semibold'>
                          {competition.name}
                        </h3>
                        <Badge
                          variant='outline'
                          className={`${getTypeColor(competition.type)} text-white`}
                        >
                          {competition.type === 'internacional'
                            ? 'Internacional'
                            : competition.type === 'nacional'
                              ? 'Nacional'
                              : competition.type === 'regional'
                                ? 'Regional'
                                : 'Local'}
                        </Badge>
                        <Badge
                          variant='outline'
                          className={`${getPriorityColor(competition.priority)} text-white`}
                        >
                          {competition.priority === 'high'
                            ? 'Alta'
                            : competition.priority === 'medium'
                              ? 'Media'
                              : 'Baja'}
                        </Badge>
                      </div>

                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-4 h-4' />
                          <span>
                            {new Date(competition.date).toLocaleDateString(
                              'es-ES'
                            )}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <MapPin className='w-4 h-4' />
                          <span>{competition.location}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          <span
                            className={getCompetitionStatusColor(
                              competition.status
                            )}
                          >
                            {competition.status === 'completed'
                              ? 'Completada'
                              : competition.status === 'upcoming'
                                ? 'Próxima'
                                : 'Cancelada'}
                          </span>
                        </div>
                      </div>

                      <p className='text-muted-foreground'>
                        {competition.objectives}
                      </p>

                      <div className='space-y-1'>
                        <p className='text-xs font-medium'>Eventos:</p>
                        <div className='flex flex-wrap gap-1'>
                          {competition.events.map((event, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='text-xs'
                            >
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {competition.results &&
                        competition.results.length > 0 && (
                          <div className='space-y-1'>
                            <p className='text-xs font-medium'>Resultados:</p>
                            <div className='space-y-1'>
                              {competition.results.map((result, index) => (
                                <div
                                  key={index}
                                  className='flex items-center gap-2 text-sm'
                                >
                                  <span className='font-medium'>
                                    {result.event}:
                                  </span>
                                  <span>{result.time}</span>
                                  <Badge variant='outline' className='text-xs'>
                                    {result.position}º
                                  </Badge>
                                  {result.personalBest && (
                                    <Badge
                                      variant='default'
                                      className='text-xs bg-green-500'
                                    >
                                      PB
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          handleEditCompetition(competition);
                        }}
                        className='h-8 w-8 p-0'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          deleteCompetition(competition.id);
                        }}
                        className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detalles de la competición seleccionada */}
          {currentCompetition && (
            <Card className='bg-muted/50 border-muted'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Trophy className='h-5 w-5 text-yellow-500' />
                  {currentCompetition.name} - Detalles
                </CardTitle>
                <CardDescription>
                  {currentCompetition.objectives}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-3'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Fecha</h4>
                    <p className='font-bold'>
                      {new Date(currentCompetition.date).toLocaleDateString(
                        'es-ES'
                      )}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Ubicación</h4>
                    <p className='font-bold'>{currentCompetition.location}</p>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Tipo</h4>
                    <Badge
                      variant='outline'
                      className={`${getTypeColor(currentCompetition.type)} text-white`}
                    >
                      {currentCompetition.type === 'internacional'
                        ? 'Internacional'
                        : currentCompetition.type === 'nacional'
                          ? 'Nacional'
                          : currentCompetition.type === 'regional'
                            ? 'Regional'
                            : 'Local'}
                    </Badge>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Eventos</h4>
                  <div className='flex flex-wrap gap-2'>
                    {currentCompetition.events.map((event, index) => (
                      <Badge key={index} variant='default' className='text-sm'>
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                {currentCompetition.results &&
                  currentCompetition.results.length > 0 && (
                    <div className='space-y-2'>
                      <h4 className='font-medium'>Resultados</h4>
                      <div className='space-y-2'>
                        {currentCompetition.results.map((result, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between p-3 border rounded-lg'
                          >
                            <div className='flex items-center gap-3'>
                              <span className='font-medium'>
                                {result.event}
                              </span>
                              <span className='text-lg font-bold'>
                                {result.time}
                              </span>
                              <Badge variant='outline'>
                                {result.position}º puesto
                              </Badge>
                              {result.personalBest && (
                                <Badge
                                  variant='default'
                                  className='bg-green-500'
                                >
                                  Récord Personal
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

          {/* Modal de Edición de Competiciones */}
          <Dialog
            open={editingCompetition !== null || isAddingCompetition}
            onOpenChange={handleCancelCompetition}
          >
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {isAddingCompetition
                    ? 'Agregar Nueva Competición'
                    : 'Editar Competición'}
                </DialogTitle>
                <DialogDescription>
                  {isAddingCompetition
                    ? 'Crea una nueva competición'
                    : 'Modifica los detalles de la competición'}
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='comp-name'>Nombre de la Competición</Label>
                    <Input
                      id='comp-name'
                      value={competitionForm.name}
                      onChange={e =>
                        setCompetitionForm(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder='Ej: Campeonato Nacional 2025'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='comp-date'>Fecha</Label>
                    <Input
                      id='comp-date'
                      type='date'
                      value={competitionForm.date}
                      onChange={e =>
                        setCompetitionForm(prev => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='comp-location'>Ubicación</Label>
                    <Input
                      id='comp-location'
                      value={competitionForm.location}
                      onChange={e =>
                        setCompetitionForm(prev => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder='Ej: Madrid, España'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='comp-type'>Tipo</Label>
                    <Select
                      value={competitionForm.type}
                      onValueChange={(
                        value:
                          | 'nacional'
                          | 'regional'
                          | 'local'
                          | 'internacional'
                      ) =>
                        setCompetitionForm(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='local'>Local</SelectItem>
                        <SelectItem value='regional'>Regional</SelectItem>
                        <SelectItem value='nacional'>Nacional</SelectItem>
                        <SelectItem value='internacional'>
                          Internacional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='comp-objectives'>Objetivos</Label>
                  <Textarea
                    id='comp-objectives'
                    value={competitionForm.objectives}
                    onChange={e =>
                      setCompetitionForm(prev => ({
                        ...prev,
                        objectives: e.target.value,
                      }))
                    }
                    placeholder='Describe los objetivos para esta competición...'
                    className='min-h-[80px]'
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Eventos</Label>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    {competitionForm.events.map((event, index) => (
                      <Badge key={index} variant='secondary' className='gap-1'>
                        {event}
                        <button
                          onClick={() => handleRemoveEvent(event)}
                          className='ml-1 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* Eventos organizados por categorías */}
                  <div className='space-y-3'>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>Estilo Libre</h4>
                      <div className='flex flex-wrap gap-1'>
                        {[
                          '50m Libre',
                          '100m Libre',
                          '200m Libre',
                          '400m Libre',
                          '800m Libre',
                          '1500m Libre',
                        ].map(event => (
                          <Button
                            key={event}
                            variant='outline'
                            size='sm'
                            onClick={() => handleAddEvent(event)}
                            disabled={competitionForm.events.includes(event)}
                            className='text-xs h-7'
                          >
                            {event}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>Espalda</h4>
                      <div className='flex flex-wrap gap-1'>
                        {['50m Espalda', '100m Espalda', '200m Espalda'].map(
                          event => (
                            <Button
                              key={event}
                              variant='outline'
                              size='sm'
                              onClick={() => handleAddEvent(event)}
                              disabled={competitionForm.events.includes(event)}
                              className='text-xs h-7'
                            >
                              {event}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>Braza</h4>
                      <div className='flex flex-wrap gap-1'>
                        {['50m Braza', '100m Braza', '200m Braza'].map(
                          event => (
                            <Button
                              key={event}
                              variant='outline'
                              size='sm'
                              onClick={() => handleAddEvent(event)}
                              disabled={competitionForm.events.includes(event)}
                              className='text-xs h-7'
                            >
                              {event}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>Mariposa</h4>
                      <div className='flex flex-wrap gap-1'>
                        {['50m Mariposa', '100m Mariposa', '200m Mariposa'].map(
                          event => (
                            <Button
                              key={event}
                              variant='outline'
                              size='sm'
                              onClick={() => handleAddEvent(event)}
                              disabled={competitionForm.events.includes(event)}
                              className='text-xs h-7'
                            >
                              {event}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>Estilos</h4>
                      <div className='flex flex-wrap gap-1'>
                        {['200m Estilos', '400m Estilos'].map(event => (
                          <Button
                            key={event}
                            variant='outline'
                            size='sm'
                            onClick={() => handleAddEvent(event)}
                            disabled={competitionForm.events.includes(event)}
                            className='text-xs h-7'
                          >
                            {event}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>Relevos</h4>
                      <div className='flex flex-wrap gap-1'>
                        {['4x100m Libre', '4x200m Libre', '4x100m Estilos'].map(
                          event => (
                            <Button
                              key={event}
                              variant='outline'
                              size='sm'
                              onClick={() => handleAddEvent(event)}
                              disabled={competitionForm.events.includes(event)}
                              className='text-xs h-7'
                            >
                              {event}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='comp-priority'>Prioridad</Label>
                    <Select
                      value={competitionForm.priority}
                      onValueChange={(value: 'high' | 'medium' | 'low') =>
                        setCompetitionForm(prev => ({
                          ...prev,
                          priority: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='high'>Alta</SelectItem>
                        <SelectItem value='medium'>Media</SelectItem>
                        <SelectItem value='low'>Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='comp-status'>Estado</Label>
                    <Select
                      value={competitionForm.status}
                      onValueChange={(
                        value: 'upcoming' | 'completed' | 'cancelled'
                      ) =>
                        setCompetitionForm(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='upcoming'>Próxima</SelectItem>
                        <SelectItem value='completed'>Completada</SelectItem>
                        <SelectItem value='cancelled'>Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                  <Button variant='outline' onClick={handleCancelCompetition}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveCompetition} className='gap-2'>
                    <Save className='h-4 w-4' />
                    {isAddingCompetition ? 'Agregar' : 'Guardar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Tab: Planificación Semanal */}
        <TabsContent value='planificacion' className='space-y-4'>
          <Card className='bg-muted/50 border-muted'>
            <CardHeader>
              <CardTitle>Planificación Semanal del Ciclo</CardTitle>
              <CardDescription>
                Distribución de carga y enfoques por semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {weeklyPlan.map(week => (
                  <div
                    key={week.week}
                    className='border rounded-lg p-4 hover:bg-muted/30 transition-colors'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='text-center'>
                          <p className='text-sm font-medium'>Semana</p>
                          <p className='text-2xl font-bold'>{week.week}</p>
                        </div>
                        <div className='space-y-1'>
                          <Badge variant='outline'>{week.phase}</Badge>
                          <p className='text-sm text-muted-foreground'>
                            Enfoque: {week.focus}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-6'>
                        <div className='text-center'>
                          <p className='text-sm text-muted-foreground'>
                            Distancia
                          </p>
                          <p className='font-bold'>
                            {week.totalDistance.toLocaleString()}m
                          </p>
                        </div>
                        <div className='text-center'>
                          <p className='text-sm text-muted-foreground'>
                            Sesiones
                          </p>
                          <p className='font-bold'>{week.sessions}</p>
                        </div>
                        <div className='text-center'>
                          <p className='text-sm text-muted-foreground'>
                            Intensidad
                          </p>
                          <div className='flex items-center gap-2'>
                            <Progress
                              value={week.intensity * 10}
                              className='w-16 h-2'
                            />
                            <span className='font-bold'>
                              {week.intensity}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Carga de Entrenamiento */}
        <TabsContent value='carga' className='space-y-4'>
          {/* Zonas de Entrenamiento Actuales */}
          <Card className='bg-muted/50 border-muted'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5' />
                Zonas de Entrenamiento
              </CardTitle>
              <CardDescription>
                Metodología actual aplicada en toda la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                {Object.entries(currentZones).map(([zone, name]) => (
                  <div
                    key={zone}
                    className='text-center p-3 border rounded-lg bg-background/50'
                  >
                    <div className='text-lg font-bold text-primary'>{zone}</div>
                    <div className='text-sm text-muted-foreground'>{name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='grid gap-4 md:grid-cols-2'>
            <Card className='bg-muted/50 border-muted'>
              <CardHeader>
                <CardTitle>Evolución del Volumen</CardTitle>
                <CardDescription>
                  Metros por semana a lo largo del ciclo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {weeklyPlan.map(week => (
                    <div key={week.week} className='flex items-center gap-3'>
                      <span className='text-sm font-medium w-12'>
                        S{week.week}
                      </span>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between text-sm mb-1'>
                          <span>{week.totalDistance.toLocaleString()}m</span>
                          <span className='text-muted-foreground'>
                            {week.phase}
                          </span>
                        </div>
                        <Progress
                          value={(week.totalDistance / 35000) * 100}
                          className='h-2'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-muted/50 border-muted'>
              <CardHeader>
                <CardTitle>Evolución de la Intensidad</CardTitle>
                <CardDescription>
                  Nivel de intensidad por semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {weeklyPlan.map(week => (
                    <div key={week.week} className='flex items-center gap-3'>
                      <span className='text-sm font-medium w-12'>
                        S{week.week}
                      </span>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between text-sm mb-1'>
                          <span>{week.intensity}/10</span>
                          <span className='text-muted-foreground'>
                            {week.focus}
                          </span>
                        </div>
                        <Progress value={week.intensity * 10} className='h-2' />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
