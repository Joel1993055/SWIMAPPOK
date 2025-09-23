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
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
  created_at?: string; // Fecha de creación
  updated_at?: string; // Fecha de actualización
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
  type: 'local' | 'regional' | 'nacional' | 'internacional';
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

// Datos hardcodeados eliminados - ahora se usan solo del store

// Helper functions para manejo seguro de arrays
const safeArray = (arr: any): any[] => Array.isArray(arr) ? arr : [];
const safeMap = <T,>(arr: any, callback: (item: T, index: number) => React.ReactNode): React.ReactNode => {
  return Array.isArray(arr) ? arr.map(callback) : null;
};

export function PlanificacionOverview() {
  const {
    zones: currentZones,
    phases,
    addPhase,
    updatePhase,
    deletePhase,
  } = useTrainingStore();
  const {
    competitions,
    addCompetition,
    updateCompetition,
    deleteCompetition,
  } = useCompetitionsStore();

  // OPTIMIZADO: Solo usar lo necesario del store

  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');


  // Estados para edición
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editingCompetition, setEditingCompetition] = useState<string | null>(
    null
  );
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [isAddingCompetition, setIsAddingCompetition] = useState(false);
  const [phaseScheduleInfo, setPhaseScheduleInfo] = useState<{
    message: string;
    type: 'info' | 'success' | 'warning';
  } | null>(null);

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
    type: 'local' as 'local' | 'regional' | 'nacional' | 'internacional',
    events: [] as string[],
    objectives: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
  });

  // Inicializar selecciones cuando los datos estén disponibles
  useEffect(() => {
    if (phases.length > 0 && !selectedPhase) {
      setSelectedPhase(phases[0].id);
    }
  }, [phases, selectedPhase]);

  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0].id);
    }
  }, [competitions, selectedCompetition]);

  // Validar que phases sea un array antes de usar find
  const currentPhase = Array.isArray(phases) ? phases.find(phase => phase.id === selectedPhase) : null;
  const currentCompetition = competitions.find(comp => comp.id === selectedCompetition) || null;


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

  // Función para calcular la fecha de inicio de la siguiente fase
  const getNextPhaseStartDate = (): string | undefined => {
    if (!phaseForm.startDate) return undefined;
    
    // Obtener todas las fases ordenadas por fecha de inicio
    const phasesWithDates = phases
      .filter(phase => phase.startDate)
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
    
    // Si no hay fases con fechas, usar la fecha del formulario
    if (phasesWithDates.length === 0) {
      return phaseForm.startDate;
    }
    
    // Encontrar la última fase por fecha de fin
    const lastPhase = phasesWithDates.reduce((latest, phase) => {
      if (!phase.endDate) return latest;
      const phaseEnd = new Date(phase.endDate);
      const latestEnd = latest ? new Date(latest.endDate!) : new Date(0);
      return phaseEnd > latestEnd ? phase : latest;
    }, null as TrainingPhase | null);
    
    // Si hay una última fase con fecha de fin, la siguiente fase empieza al día siguiente
    if (lastPhase?.endDate) {
      const nextStart = new Date(lastPhase.endDate);
      nextStart.setDate(nextStart.getDate() + 1);
      return nextStart.toISOString().split('T')[0];
    }
    
    // Si no hay fases con fechas de fin, usar la fecha del formulario
    return phaseForm.startDate;
  };

  // Función para recalcular fechas de todas las fases después de una edición
  const recalculateAllPhaseDates = (updatedPhase: TrainingPhase) => {
    const calculateEndDate = (startDate: string, durationWeeks: number): string => {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (durationWeeks * 7));
      return end.toISOString().split('T')[0];
    };

    // Obtener todas las fases excepto la que se está editando, ordenadas por orden
    const otherPhases = phases
      .filter(phase => phase.id !== updatedPhase.id)
      .sort((a, b) => a.order - b.order);

    // Recalcular fechas secuencialmente
    let currentDate = new Date(updatedPhase.startDate!);
    const updatedPhases: TrainingPhase[] = [];

    // Agregar la fase actualizada
    updatedPhases.push({
      ...updatedPhase,
      endDate: calculateEndDate(updatedPhase.startDate!, updatedPhase.duration),
    });

    // Recalcular las siguientes fases
    for (const phase of otherPhases) {
      if (phase.order > updatedPhase.order) {
        // Fase posterior: empieza al día siguiente de la anterior
        currentDate.setDate(currentDate.getDate() + 1);
        const newStartDate = currentDate.toISOString().split('T')[0];
        const newEndDate = calculateEndDate(newStartDate, phase.duration);
        
        updatedPhases.push({
          ...phase,
          startDate: newStartDate,
          endDate: newEndDate,
          updated_at: new Date().toISOString(),
        });
        
        // Actualizar currentDate para la siguiente fase
        currentDate = new Date(newEndDate);
      } else {
        // Fase anterior: mantener fechas originales
        updatedPhases.push(phase);
      }
    }

    // Actualizar todas las fases en el store
    updatedPhases.forEach(phase => {
      if (phase.id !== updatedPhase.id) {
        updatePhase(phase.id, {
          startDate: phase.startDate,
          endDate: phase.endDate,
          updated_at: phase.updated_at,
        });
      }
    });
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
      // Calcular fecha de fin basada en la duración
      const calculateEndDate = (startDate: string, durationWeeks: number): string => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + (durationWeeks * 7));
        return end.toISOString().split('T')[0];
      };

      // Obtener la fecha de inicio correcta (secuencial si es necesario)
      const actualStartDate = getNextPhaseStartDate() || phaseForm.startDate;

      if (isAddingPhase) {
        // Crear nueva fase con fechas calculadas secuencialmente
        const endDate = actualStartDate 
          ? calculateEndDate(actualStartDate, phaseForm.duration)
          : undefined;

        const newPhase: TrainingPhase = {
          id: `phase-${Date.now()}`,
          name: phaseForm.name,
          duration: phaseForm.duration,
          description: phaseForm.description,
          focus: phaseForm.focus,
          intensity: phaseForm.intensity,
          volume: phaseForm.volume,
          color: 'bg-purple-500', // Color por defecto
          startDate: actualStartDate,
          endDate: endDate,
          order: phaseForm.order,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        addPhase(newPhase);
        console.log('Fase agregada:', newPhase);
        
        // Mostrar información sobre las fechas calculadas
        if (actualStartDate !== phaseForm.startDate) {
          console.log(`Fase programada secuencialmente: ${actualStartDate} - ${endDate}`);
          setPhaseScheduleInfo({
            message: `Fase programada secuencialmente: ${new Date(actualStartDate).toLocaleDateString('es-ES')} - ${new Date(endDate!).toLocaleDateString('es-ES')}`,
            type: 'info'
          });
          // Limpiar el mensaje después de 5 segundos
          setTimeout(() => setPhaseScheduleInfo(null), 5000);
        } else {
          setPhaseScheduleInfo({
            message: `Fase creada: ${new Date(actualStartDate).toLocaleDateString('es-ES')} - ${new Date(endDate!).toLocaleDateString('es-ES')}`,
            type: 'success'
          });
          setTimeout(() => setPhaseScheduleInfo(null), 3000);
        }
      } else if (editingPhase) {
        // Crear la fase actualizada
        const updatedPhase: TrainingPhase = {
          id: editingPhase,
          name: phaseForm.name,
          duration: phaseForm.duration,
          description: phaseForm.description,
          focus: phaseForm.focus,
          intensity: phaseForm.intensity,
          volume: phaseForm.volume,
          color: phases.find(p => p.id === editingPhase)?.color || 'bg-purple-500',
          startDate: phaseForm.startDate,
          endDate: phaseForm.startDate 
            ? calculateEndDate(phaseForm.startDate, phaseForm.duration)
            : undefined,
          order: phaseForm.order,
          created_at: phases.find(p => p.id === editingPhase)?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Actualizar la fase en el store
        updatePhase(editingPhase, {
          name: phaseForm.name,
          duration: phaseForm.duration,
          description: phaseForm.description,
          focus: phaseForm.focus,
          intensity: phaseForm.intensity,
          volume: phaseForm.volume,
          startDate: phaseForm.startDate,
          endDate: phaseForm.startDate 
            ? calculateEndDate(phaseForm.startDate, phaseForm.duration)
            : undefined,
          order: phaseForm.order,
          updated_at: new Date().toISOString(),
        });

        // Recalcular fechas de todas las fases si se cambió la fecha de inicio
        if (phaseForm.startDate) {
          recalculateAllPhaseDates(updatedPhase);
        }

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
    const currentFocus = Array.isArray(phaseForm.focus) ? phaseForm.focus : [];
    if (!currentFocus.includes(focus)) {
      setPhaseForm(prev => ({
        ...prev,
        focus: [...currentFocus, focus],
      }));
    }
  };

  const handleRemoveFocus = (focus: string) => {
    const currentFocus = Array.isArray(phaseForm.focus) ? phaseForm.focus : [];
    setPhaseForm(prev => ({
      ...prev,
      focus: currentFocus.filter(f => f !== focus),
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
    // Validaciones
    if (!competitionForm.name.trim()) {
      alert('El nombre de la competición es requerido');
      return;
    }
    if (!competitionForm.date) {
      alert('La fecha de la competición es requerida');
      return;
    }
    if (!competitionForm.location.trim()) {
      alert('La ubicación de la competición es requerida');
      return;
    }
    if (competitionForm.events.length === 0) {
      alert('Debe seleccionar al menos un evento');
      return;
    }

    const competitionData: Competition = {
      id: editingCompetition || `comp-${Date.now()}`,
      name: competitionForm.name.trim(),
      date: competitionForm.date,
      location: competitionForm.location.trim(),
      type: competitionForm.type,
      events: competitionForm.events,
      objectives: competitionForm.objectives.trim(),
      priority: competitionForm.priority,
      status: competitionForm.status,
    };

    try {
      if (isAddingCompetition) {
        addCompetition(competitionData);
        console.log('Competición agregada:', competitionData);
      } else if (editingCompetition) {
        updateCompetition(editingCompetition, competitionData);
        console.log('Competición actualizada:', competitionData);
      }
    } catch (error) {
      console.error('Error al guardar competición:', error);
      alert('Error al guardar la competición. Inténtalo de nuevo.');
      return;
    }

    // Limpiar formulario y cerrar modal
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
    const currentEvents = Array.isArray(competitionForm.events) ? competitionForm.events : [];
    if (!currentEvents.includes(event)) {
      setCompetitionForm(prev => ({
        ...prev,
        events: [...currentEvents, event],
      }));
    }
  };

  const handleRemoveEvent = (event: string) => {
    const currentEvents = Array.isArray(competitionForm.events) ? competitionForm.events : [];
    setCompetitionForm(prev => ({
      ...prev,
      events: currentEvents.filter(e => e !== event),
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


  return (
    <div className='space-y-6'>
      {/* Mensaje informativo sobre programación de fases */}
      {phaseScheduleInfo && (
        <div className={`p-4 rounded-lg border ${
          phaseScheduleInfo.type === 'info' 
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : phaseScheduleInfo.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <div className='flex items-center gap-2'>
            <div className={`w-2 h-2 rounded-full ${
              phaseScheduleInfo.type === 'info' 
                ? 'bg-blue-500'
                : phaseScheduleInfo.type === 'success'
                ? 'bg-green-500'
                : 'bg-yellow-500'
            }`}></div>
            <span className='text-sm font-medium'>{phaseScheduleInfo.message}</span>
          </div>
        </div>
      )}

      {/* Header con objetivos principales */}

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
            {safeMap(phases, (phase: TrainingPhase) => (
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
                        {phase.startDate ? new Date(phase.startDate).toLocaleDateString('es-ES') : 'Sin fecha'}{' '}
                        - {phase.endDate ? new Date(phase.endDate).toLocaleDateString('es-ES') : 'Sin fecha'}
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
                        {(phase.volume || 0).toLocaleString()}m
                      </Badge>
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-xs font-medium'>Enfoque:</p>
                    <div className='flex flex-wrap gap-1'>
                      {Array.isArray(phase.focus) ? phase.focus.map((focus, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {focus}
                        </Badge>
                      )) : null}
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
                      {(currentPhase?.volume || 0).toLocaleString()}m
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Enfoques de Entrenamiento</h4>
                  <div className='flex flex-wrap gap-2'>
                    {Array.isArray(currentPhase?.focus) ? currentPhase.focus.map((focus, index) => (
                      <Badge key={index} variant='default' className='text-sm'>
                        {focus}
                      </Badge>
                    )) : null}
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
                    {Array.isArray(phaseForm.focus) ? phaseForm.focus.map((focus, index) => (
                      <Badge key={index} variant='secondary' className='gap-1'>
                        {focus}
                        <button
                          onClick={() => handleRemoveFocus(focus)}
                          className='ml-1 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    )) : null}
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
            {safeMap(competitions, (competition: Competition) => (
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
                            {competition.date ? new Date(competition.date).toLocaleDateString('es-ES') : 'Sin fecha'}
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
                          {Array.isArray(competition.events) ? competition.events.map((event, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='text-xs'
                            >
                              {event}
                            </Badge>
                          )) : null}
                        </div>
                      </div>

                      {competition.results &&
                        competition.results.length > 0 && (
                          <div className='space-y-1'>
                            <p className='text-xs font-medium'>Resultados:</p>
                            <div className='space-y-1'>
                              {Array.isArray(competition.results) ? competition.results.map((result, index) => (
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
                              )) : null}
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
          {currentCompetition && currentCompetition !== null && (
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
                      {currentCompetition?.date ? new Date(currentCompetition.date).toLocaleDateString('es-ES') : 'Sin fecha'}
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
                    {Array.isArray(currentCompetition?.events) ? currentCompetition.events.map((event, index) => (
                      <Badge key={index} variant='default' className='text-sm'>
                        {event}
                      </Badge>
                    )) : null}
                  </div>
                </div>

                {currentCompetition.results &&
                  currentCompetition.results.length > 0 && (
                    <div className='space-y-2'>
                      <h4 className='font-medium'>Resultados</h4>
                      <div className='space-y-2'>
                        {Array.isArray(currentCompetition?.results) ? currentCompetition.results.map((result, index) => (
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
                        )) : null}
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
                    {Array.isArray(competitionForm.events) ? competitionForm.events.map((event, index) => (
                      <Badge key={index} variant='secondary' className='gap-1'>
                        {event}
                        <button
                          onClick={() => handleRemoveEvent(event)}
                          className='ml-1 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    )) : null}
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
                {safeMap(weeklyPlan, (week: WeeklyPlan) => (
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
                            {(week.totalDistance || 0).toLocaleString()}m
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
                {currentZones && typeof currentZones === 'object' ? Object.entries(currentZones).map(([zone, zoneData]) => (
                  <div
                    key={zone}
                    className='text-center p-3 border rounded-lg bg-background/50'
                  >
                    <div className='text-lg font-bold text-primary'>{zone}</div>
                    <div className='text-sm text-muted-foreground'>
                      {zoneData.name}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {zoneData.min}%-{zoneData.max}%
                    </div>
                  </div>
                )) : null}
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
                  {safeMap(weeklyPlan, (week: WeeklyPlan) => (
                    <div key={week.week} className='flex items-center gap-3'>
                      <span className='text-sm font-medium w-12'>
                        S{week.week}
                      </span>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between text-sm mb-1'>
                          <span>{(week.totalDistance || 0).toLocaleString()}m</span>
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
                  {safeMap(weeklyPlan, (week: WeeklyPlan) => (
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
