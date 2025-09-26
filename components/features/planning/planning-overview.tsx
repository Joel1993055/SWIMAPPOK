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

// ==============================
// Data Types
// ==============================
interface TrainingPhase {
  id: string;
  name: string;
  duration: number; // in weeks
  description: string;
  focus: string[];
  intensity: number; // 1-10
  volume: number; // meters per week
  color: string;
  startDate?: string; // Start date (optional)
  endDate?: string; // End date (automatically calculated)
  order: number; // Phase order
  created_at?: string; // Creation date
  updated_at?: string; // Update date
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

// ==============================
// Weekly example plan (sample data)
// ==============================
const weeklyPlan: WeeklyPlan[] = [
  { week: 1, phase: 'Base', totalDistance: 25000, sessions: 6, focus: 'Aerobic', intensity: 4 },
  { week: 2, phase: 'Base', totalDistance: 26000, sessions: 6, focus: 'Aerobic', intensity: 4 },
  { week: 3, phase: 'Base', totalDistance: 27000, sessions: 6, focus: 'Technique', intensity: 4 },
  { week: 4, phase: 'Base', totalDistance: 28000, sessions: 6, focus: 'Aerobic', intensity: 5 },
  { week: 5, phase: 'Construction', totalDistance: 30000, sessions: 7, focus: 'Threshold', intensity: 6 },
  { week: 6, phase: 'Construction', totalDistance: 31000, sessions: 7, focus: 'Threshold', intensity: 6 },
  { week: 7, phase: 'Construction', totalDistance: 32000, sessions: 7, focus: 'Aerobic', intensity: 6 },
  { week: 8, phase: 'Construction', totalDistance: 33000, sessions: 7, focus: 'Threshold', intensity: 7 },
  { week: 9, phase: 'Specific', totalDistance: 28000, sessions: 8, focus: 'VO2 Max', intensity: 8 },
  { week: 10, phase: 'Specific', totalDistance: 29000, sessions: 8, focus: 'Speed', intensity: 8 },
  { week: 11, phase: 'Specific', totalDistance: 30000, sessions: 8, focus: 'VO2 Max', intensity: 8 },
  { week: 12, phase: 'Specific', totalDistance: 31000, sessions: 8, focus: 'Speed', intensity: 9 },
  { week: 13, phase: 'Peak', totalDistance: 20000, sessions: 6, focus: 'Speed', intensity: 9 },
  { week: 14, phase: 'Peak', totalDistance: 15000, sessions: 4, focus: 'Recovery', intensity: 5 },
];

// ==============================
// Safe helpers for arrays
// ==============================
const safeArray = (arr: any): any[] => (Array.isArray(arr) ? arr : []);
const safeMap = <T,>(arr: any, callback: (item: T, index: number) => React.ReactNode): React.ReactNode =>
  Array.isArray(arr) ? arr.map(callback) : null;

// ==============================
// Main component (kept same name to avoid breaking imports)
// ==============================
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

  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');

  // Editing states
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editingCompetition, setEditingCompetition] = useState<string | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [isAddingCompetition, setIsAddingCompetition] = useState(false);
  const [phaseScheduleInfo, setPhaseScheduleInfo] = useState<{
    message: string;
    type: 'info' | 'success' | 'warning';
  } | null>(null);

  // Forms
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

  // Initialize selections when data is available
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

  // Current selections
  const currentPhase = Array.isArray(phases) ? phases.find(phase => phase.id === selectedPhase) : null;
  const currentCompetition = competitions.find(comp => comp.id === selectedCompetition) || null;

  // Reset phase form when opening add modal
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
        order: phases.length + 1,
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

  // ===== Phase editing handlers =====
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

  // Next phase start date (sequential if needed)
  const getNextPhaseStartDate = (): string | undefined => {
    if (!phaseForm.startDate) return undefined;

    const phasesWithDates = phases
      .filter(phase => phase.startDate)
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

    if (phasesWithDates.length === 0) {
      return phaseForm.startDate;
    }

    const lastPhase = phasesWithDates.reduce((latest, phase) => {
      if (!phase.endDate) return latest;
      const phaseEnd = new Date(phase.endDate);
      const latestEnd = latest ? new Date(latest.endDate!) : new Date(0);
      return phaseEnd > latestEnd ? phase : latest;
    }, null as TrainingPhase | null);

    if (lastPhase?.endDate) {
      const nextStart = new Date(lastPhase.endDate);
      nextStart.setDate(nextStart.getDate() + 1);
      return nextStart.toISOString().split('T')[0];
    }

    return phaseForm.startDate;
  };

  // Recalculate all phase dates after editing one
  const recalculateAllPhaseDates = (updatedPhase: TrainingPhase) => {
    const calculateEndDate = (startDate: string, durationWeeks: number): string => {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + durationWeeks * 7);
      return end.toISOString().split('T')[0];
    };

    const otherPhases = phases
      .filter(phase => phase.id !== updatedPhase.id)
      .sort((a, b) => a.order - b.order);

    let currentDate = new Date(updatedPhase.startDate!);
    const updatedPhases: TrainingPhase[] = [];

    // Add updated phase
    updatedPhases.push({
      ...updatedPhase,
      endDate: calculateEndDate(updatedPhase.startDate!, updatedPhase.duration),
    });

    // Recalculate subsequent phases
    for (const phase of otherPhases) {
      if (phase.order > updatedPhase.order) {
        currentDate.setDate(currentDate.getDate() + 1);
        const newStartDate = currentDate.toISOString().split('T')[0];
        const newEndDate = calculateEndDate(newStartDate, phase.duration);

        updatedPhases.push({
          ...phase,
          startDate: newStartDate,
          endDate: newEndDate,
          updated_at: new Date().toISOString(),
        });

        currentDate = new Date(newEndDate);
      } else {
        updatedPhases.push(phase);
      }
    }

    // Persist recalculated dates
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
    if (!phaseForm.name.trim()) {
      console.warn('Please enter the phase name');
      return;
    }
    if (phaseForm.duration <= 0) {
      console.warn('Please enter a valid duration');
      return;
    }
    if (phaseForm.order <= 0) {
      console.warn('Please enter a valid order');
      return;
    }

    try {
      const calculateEndDate = (startDate: string, durationWeeks: number): string => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + durationWeeks * 7);
        return end.toISOString().split('T')[0];
      };

      const actualStartDate = getNextPhaseStartDate() || phaseForm.startDate;

      if (isAddingPhase) {
        const endDate = actualStartDate ? calculateEndDate(actualStartDate, phaseForm.duration) : undefined;

        const newPhase: TrainingPhase = {
          id: `phase-${Date.now()}`,
          name: phaseForm.name,
          duration: phaseForm.duration,
          description: phaseForm.description,
          focus: phaseForm.focus,
          intensity: phaseForm.intensity,
          volume: phaseForm.volume,
          color: 'bg-purple-500',
          startDate: actualStartDate,
          endDate,
          order: phaseForm.order,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        addPhase(newPhase);
        if (actualStartDate !== phaseForm.startDate) {
          setPhaseScheduleInfo({
            message: `Phase scheduled sequentially: ${new Date(actualStartDate).toLocaleDateString('en-US')} - ${endDate ? new Date(endDate).toLocaleDateString('en-US') : ''}`,
            type: 'info',
          });
          setTimeout(() => setPhaseScheduleInfo(null), 5000);
        } else {
          setPhaseScheduleInfo({
            message: `Phase created: ${new Date(actualStartDate).toLocaleDateString('en-US')} - ${endDate ? new Date(endDate).toLocaleDateString('en-US') : ''}`,
            type: 'success',
          });
          setTimeout(() => setPhaseScheduleInfo(null), 3000);
        }
      } else if (editingPhase) {
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
          endDate: phaseForm.startDate ? calculateEndDate(phaseForm.startDate, phaseForm.duration) : undefined,
          order: phaseForm.order,
          created_at: phases.find(p => p.id === editingPhase)?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        updatePhase(editingPhase, {
          name: phaseForm.name,
          duration: phaseForm.duration,
          description: phaseForm.description,
          focus: phaseForm.focus,
          intensity: phaseForm.intensity,
          volume: phaseForm.volume,
          startDate: phaseForm.startDate,
          endDate: phaseForm.startDate ? calculateEndDate(phaseForm.startDate, phaseForm.duration) : undefined,
          order: phaseForm.order,
          updated_at: new Date().toISOString(),
        });

        if (phaseForm.startDate) {
          recalculateAllPhaseDates(updatedPhase);
        }
      }

      setEditingPhase(null);
      setIsAddingPhase(false);
      console.log('Phase saved successfully');
    } catch (error) {
      console.error('Error saving phase:', error);
    }
  };

  const handleCancelPhase = () => {
    setEditingPhase(null);
    setIsAddingPhase(false);
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

  // ===== Competition editing handlers =====
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
    if (!competitionForm.name.trim()) {
      alert('Competition name is required');
      return;
    }
    if (!competitionForm.date) {
      alert('Competition date is required');
      return;
    }
    if (!competitionForm.location.trim()) {
      alert('Competition location is required');
      return;
    }
    if (competitionForm.events.length === 0) {
      alert('You must select at least one event');
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
      } else if (editingCompetition) {
        updateCompetition(editingCompetition, competitionData);
      }
    } catch (error) {
      console.error('Error saving competition:', error);
      alert('Error saving competition. Please try again.');
      return;
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

  return (
    <div className="space-y-6">
      {/* Informational message about phase scheduling */}
      {phaseScheduleInfo && (
        <div
          className={`p-4 rounded-lg border ${
            phaseScheduleInfo.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : phaseScheduleInfo.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                phaseScheduleInfo.type === 'info'
                  ? 'bg-blue-500'
                  : phaseScheduleInfo.type === 'success'
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}
            />
            <span className="text-sm font-medium">{phaseScheduleInfo.message}</span>
          </div>
        </div>
      )}

      {/* Main Tabs (values kept to match original keys) */}
      <Tabs defaultValue="fases" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fases">Cycle Phases</TabsTrigger>
          <TabsTrigger value="competiciones">Competitions</TabsTrigger>
          <TabsTrigger value="planificacion">Weekly Planning</TabsTrigger>
          <TabsTrigger value="carga">Training Load</TabsTrigger>
        </TabsList>

        {/* Tab: Cycle Phases */}
        <TabsContent value="fases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Training Phases</h3>
            <Button
              onClick={() => setIsAddingPhase(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add Phase
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {safeMap<TrainingPhase>(phases, (phase: TrainingPhase) => (
              <Card
                key={phase.id}
                className={`bg-muted/50 border-muted cursor-pointer transition-all hover:shadow-md ${
                  selectedPhase === phase.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPhase(phase.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleEditPhase(phase);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeletePhase(phase.id);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{phase.duration} weeks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {phase.description}
                  </p>

                  {phase.startDate && phase.endDate && (
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Period:</span>
                      </div>
                      <div>
                        {phase.startDate
                          ? new Date(phase.startDate).toLocaleDateString('en-US')
                          : 'No date'}{' '}
                        -{' '}
                        {phase.endDate
                          ? new Date(phase.endDate).toLocaleDateString('en-US')
                          : 'No date'}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Intensity:</span>
                      <Badge variant="outline">{phase.intensity}/10</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Volume:</span>
                      <Badge variant="outline">
                        {(phase.volume || 0).toLocaleString()}m
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium">Focus:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(phase.focus)
                        ? phase.focus.map((focus, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {focus}
                            </Badge>
                          ))
                        : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected phase details */}
          {currentPhase && (
            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${currentPhase.color}`} />
                  {currentPhase.name} - Details
                </CardTitle>
                <CardDescription>{currentPhase.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Duration</h4>
                    <p className="text-2xl font-bold">
                      {currentPhase.duration} weeks
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Target Intensity</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={currentPhase.intensity * 10} className="flex-1" />
                      <span className="font-bold">{currentPhase.intensity}/10</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Weekly Volume</h4>
                    <p className="text-2xl font-bold">
                      {(currentPhase?.volume || 0).toLocaleString()}m
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Training Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(currentPhase?.focus)
                      ? currentPhase.focus.map((focus, index) => (
                          <Badge key={index} variant="default" className="text-sm">
                            {focus}
                          </Badge>
                        ))
                      : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Phase Editing Modal */}
          <Dialog open={editingPhase !== null || isAddingPhase} onOpenChange={handleCancelPhase}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isAddingPhase ? 'Add New Phase' : 'Edit Phase'}</DialogTitle>
                <DialogDescription>
                  {isAddingPhase ? 'Create a new training phase' : 'Modify the training phase details'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase-name">Phase Name</Label>
                    <Input
                      id="phase-name"
                      value={phaseForm.name}
                      onChange={e => setPhaseForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Base, Construction, Peak"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phase-duration">Duration (weeks)</Label>
                    <Input
                      id="phase-duration"
                      type="number"
                      value={phaseForm.duration}
                      onChange={e =>
                        setPhaseForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))
                      }
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase-description">Description</Label>
                  <Textarea
                    id="phase-description"
                    value={phaseForm.description}
                    onChange={e => setPhaseForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the objective of this phase..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase-intensity">Intensity (1-10)</Label>
                    <Input
                      id="phase-intensity"
                      type="number"
                      min="1"
                      max="10"
                      value={phaseForm.intensity}
                      onChange={e =>
                        setPhaseForm(prev => ({ ...prev, intensity: parseInt(e.target.value) || 5 }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phase-volume">Weekly Volume (meters)</Label>
                    <Input
                      id="phase-volume"
                      type="number"
                      value={phaseForm.volume}
                      onChange={e =>
                        setPhaseForm(prev => ({ ...prev, volume: parseInt(e.target.value) || 0 }))
                      }
                      placeholder="25000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase-start-date">Start Date (first phase only)</Label>
                    <Input
                      id="phase-start-date"
                      type="date"
                      value={phaseForm.startDate}
                      onChange={e => setPhaseForm(prev => ({ ...prev, startDate: e.target.value }))}
                      disabled={phaseForm.order > 1}
                    />
                    {phaseForm.order > 1 && (
                      <p className="text-xs text-muted-foreground">
                        Later phases are calculated automatically
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phase-order">Phase Order</Label>
                    <Input
                      id="phase-order"
                      type="number"
                      min="1"
                      value={phaseForm.order}
                      onChange={e =>
                        setPhaseForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))
                      }
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Training Focus</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(phaseForm.focus)
                      ? phaseForm.focus.map((focus, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {focus}
                            <button
                              onClick={() => handleRemoveFocus(focus)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      : null}
                  </div>
                  <div className="flex gap-2">
                    {['Aerobic', 'Technique', 'Strength', 'Threshold', 'VO2 Max', 'Speed', 'Recovery'].map(
                      focus => (
                        <Button
                          key={focus}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFocus(focus)}
                          disabled={phaseForm.focus.includes(focus)}
                          className="text-xs"
                        >
                          {focus}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancelPhase}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePhase} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isAddingPhase ? 'Add' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Tab: Competitions */}
        <TabsContent value="competiciones" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Competitions</h3>
            <Button
              onClick={() => setIsAddingCompetition(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add Competition
            </Button>
          </div>

          <div className="grid gap-4">
            {safeMap<Competition>(competitions, (competition: Competition) => (
              <Card
                key={competition.id}
                className={`bg-muted/50 border-muted cursor-pointer transition-all hover:shadow-md ${
                  selectedCompetition === competition.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCompetition(competition.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold">{competition.name}</h3>
                        <Badge
                          variant="outline"
                          className={`${getTypeColor(competition.type)} text-white`}
                        >
                          {competition.type === 'internacional'
                            ? 'International'
                            : competition.type === 'nacional'
                            ? 'National'
                            : competition.type === 'regional'
                            ? 'Regional'
                            : 'Local'}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(competition.priority)} text-white`}
                        >
                          {competition.priority === 'high'
                            ? 'High'
                            : competition.priority === 'medium'
                            ? 'Medium'
                            : 'Low'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {competition.date
                              ? new Date(competition.date).toLocaleDateString('en-US')
                              : 'No date'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{competition.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className={getCompetitionStatusColor(competition.status)}>
                            {competition.status === 'completed'
                              ? 'Completed'
                              : competition.status === 'upcoming'
                              ? 'Upcoming'
                              : 'Cancelled'}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground">{competition.objectives}</p>

                      <div className="space-y-1">
                        <p className="text-xs font-medium">Events:</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(competition.events)
                            ? competition.events.map((event, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {event}
                                </Badge>
                              ))
                            : null}
                        </div>
                      </div>

                      {competition.results && competition.results.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Results:</p>
                          <div className="space-y-1">
                            {Array.isArray(competition.results)
                              ? competition.results.map((result, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">{result.event}:</span>
                                    <span>{result.time}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {result.position}º
                                    </Badge>
                                    {result.personalBest && (
                                      <Badge variant="default" className="text-xs bg-green-500">
                                        PB
                                      </Badge>
                                    )}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleEditCompetition(competition);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          deleteCompetition(competition.id);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected competition details */}
          {currentCompetition && currentCompetition !== null && (
            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {currentCompetition.name} - Details
                </CardTitle>
                <CardDescription>{currentCompetition.objectives}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Date</h4>
                    <p className="font-bold">
                      {currentCompetition?.date
                        ? new Date(currentCompetition.date).toLocaleDateString('en-US')
                        : 'No date'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Location</h4>
                    <p className="font-bold">{currentCompetition.location}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Type</h4>
                    <Badge
                      variant="outline"
                      className={`${getTypeColor(currentCompetition.type)} text-white`}
                    >
                      {currentCompetition.type === 'internacional'
                        ? 'International'
                        : currentCompetition.type === 'nacional'
                        ? 'National'
                        : currentCompetition.type === 'regional'
                        ? 'Regional'
                        : 'Local'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(currentCompetition?.events)
                      ? currentCompetition.events.map((event, index) => (
                          <Badge key={index} variant="default" className="text-sm">
                            {event}
                          </Badge>
                        ))
                      : null}
                  </div>
                </div>

                {currentCompetition.results && currentCompetition.results.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Results</h4>
                    <div className="space-y-2">
                      {Array.isArray(currentCompetition?.results)
                        ? currentCompetition.results.map((result, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{result.event}</span>
                                <span className="text-lg font-bold">{result.time}</span>
                                <Badge variant="outline">{result.position}º place</Badge>
                                {result.personalBest && (
                                  <Badge variant="default" className="bg-green-500">
                                    Personal Record
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Competition Editing Modal */}
          <Dialog open={editingCompetition !== null || isAddingCompetition} onOpenChange={handleCancelCompetition}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isAddingCompetition ? 'Add New Competition' : 'Edit Competition'}</DialogTitle>
                <DialogDescription>
                  {isAddingCompetition ? 'Create a new competition' : 'Modify competition details'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="comp-name">Competition Name</Label>
                    <Input
                      id="comp-name"
                      value={competitionForm.name}
                      onChange={e => setCompetitionForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., National Championships 2025"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comp-date">Date</Label>
                    <Input
                      id="comp-date"
                      type="date"
                      value={competitionForm.date}
                      onChange={e => setCompetitionForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="comp-location">Location</Label>
                    <Input
                      id="comp-location"
                      value={competitionForm.location}
                      onChange={e => setCompetitionForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Madrid, Spain"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comp-type">Type</Label>
                    <Select
                      value={competitionForm.type}
                      onValueChange={(value: 'nacional' | 'regional' | 'local' | 'internacional') =>
                        setCompetitionForm(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                        <SelectItem value="nacional">National</SelectItem>
                        <SelectItem value="internacional">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comp-objectives">Objectives</Label>
                  <Textarea
                    id="comp-objectives"
                    value={competitionForm.objectives}
                    onChange={e => setCompetitionForm(prev => ({ ...prev, objectives: e.target.value }))}
                    placeholder="Describe the objectives for this competition..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Events</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(competitionForm.events)
                      ? competitionForm.events.map((event, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {event}
                            <button
                              onClick={() => handleRemoveEvent(event)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      : null}
                  </div>

                  {/* Events organized by categories */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Freestyle</h4>
                      <div className="flex flex-wrap gap-1">
                        {['50m Freestyle', '100m Freestyle', '200m Freestyle', '400m Freestyle', '800m Freestyle', '1500m Freestyle'].map(
                          event => (
                            <Button
                              key={event}
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddEvent(event)}
                              disabled={competitionForm.events.includes(event)}
                              className="text-xs h-7"
                            >
                              {event}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Backstroke</h4>
                      <div className="flex flex-wrap gap-1">
                        {['50m Backstroke', '100m Backstroke', '200m Backstroke'].map(event => (
                          <Button
                            key={event}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddEvent(event)}
                            disabled={competitionForm.events.includes(event)}
                            className="text-xs h-7"
                          >
                            {event}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Breaststroke</h4>
                      <div className="flex flex-wrap gap-1">
                        {['50m Breaststroke', '100m Breaststroke', '200m Breaststroke'].map(event => (
                          <Button
                            key={event}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddEvent(event)}
                            disabled={competitionForm.events.includes(event)}
                            className="text-xs h-7"
                          >
                            {event}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Butterfly</h4>
                      <div className="flex flex-wrap gap-1">
                        {['50m Butterfly', '100m Butterfly', '200m Butterfly'].map(event => (
                          <Button
                            key={event}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddEvent(event)}
                            disabled={competitionForm.events.includes(event)}
                            className="text-xs h-7"
                          >
                            {event}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Individual Medley</h4>
                      <div className="flex flex-wrap gap-1">
                        {['200m IM', '400m IM'].map(event => (
                          <Button
                            key={event}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddEvent(event)}
                            disabled={competitionForm.events.includes(event)}
                            className="text-xs h-7"
                          >
                            {event}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Relays</h4>
                      <div className="flex flex-wrap gap-1">
                        {['4x100m Freestyle', '4x200m Freestyle', '4x100m Medley'].map(event => (
                          <Button
                            key={event}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddEvent(event)}
                            disabled={competitionForm.events.includes(event)}
                            className="text-xs h-7"
                          >
                            {event}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="comp-priority">Priority</Label>
                    <Select
                      value={competitionForm.priority}
                      onValueChange={(value: 'high' | 'medium' | 'low') =>
                        setCompetitionForm(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comp-status">Status</Label>
                    <Select
                      value={competitionForm.status}
                      onValueChange={(value: 'upcoming' | 'completed' | 'cancelled') =>
                        setCompetitionForm(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancelCompetition}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCompetition} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isAddingCompetition ? 'Add' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Tab: Weekly Planning */}
        <TabsContent value="planificacion" className="space-y-4">
          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle>Weekly Cycle Planning</CardTitle>
              <CardDescription>Load distribution and focus per week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safeMap<WeeklyPlan>(weeklyPlan, (week: WeeklyPlan) => (
                  <div
                    key={week.week}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">Week</p>
                          <p className="text-2xl font-bold">{week.week}</p>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline">{week.phase}</Badge>
                          <p className="text-sm text-muted-foreground">
                            Focus: {week.focus}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Distance</p>
                          <p className="font-bold">
                            {(week.totalDistance || 0).toLocaleString()}m
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Sessions</p>
                          <p className="font-bold">{week.sessions}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Intensity</p>
                          <div className="flex items-center gap-2">
                            <Progress value={week.intensity * 10} className="w-16 h-2" />
                            <span className="font-bold">{week.intensity}/10</span>
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

        {/* Tab: Training Load */}
        <TabsContent value="carga" className="space-y-4">
          {/* Current Training Zones */}
          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Training Zones
              </CardTitle>
              <CardDescription>
                Current methodology applied across the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {currentZones && typeof currentZones === 'object'
                  ? Object.entries(currentZones).map(([zone, zoneData]) => (
                      <div key={zone} className="text-center p-3 border rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-primary">{zone}</div>
                        <div className="text-sm text-muted-foreground">{zoneData.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {zoneData.min}%-{zoneData.max}%
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle>Volume Evolution</CardTitle>
                <CardDescription>Meters per week throughout the cycle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safeMap<WeeklyPlan>(weeklyPlan, (week: WeeklyPlan) => (
                    <div key={week.week} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">W{week.week}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{(week.totalDistance || 0).toLocaleString()}m</span>
                          <span className="text-muted-foreground">{week.phase}</span>
                        </div>
                        <Progress value={(week.totalDistance / 35000) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle>Intensity Evolution</CardTitle>
                <CardDescription>Intensity level per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safeMap<WeeklyPlan>(weeklyPlan, (week: WeeklyPlan) => (
                    <div key={week.week} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">W{week.week}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{week.intensity}/10</span>
                          <span className="text-muted-foreground">{week.focus}</span>
                        </div>
                        <Progress value={week.intensity * 10} className="h-2" />
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
