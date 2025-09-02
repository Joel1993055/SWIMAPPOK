"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Activity, 
  CheckCircle,
  AlertCircle,
  Edit,
  Plus,
  Save,
  X
} from "lucide-react";

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
}

interface TrainingGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  progress: number;
}

interface WeeklyPlan {
  week: number;
  phase: string;
  totalDistance: number;
  sessions: number;
  focus: string;
  intensity: number;
}

// Datos de ejemplo
const trainingPhases: TrainingPhase[] = [
  {
    id: "base",
    name: "Base",
    duration: 8,
    description: "Desarrollo de la resistencia aeróbica base",
    focus: ["Aeróbico", "Técnica", "Fuerza"],
    intensity: 4,
    volume: 25000,
    color: "bg-blue-500"
  },
  {
    id: "construccion",
    name: "Construcción",
    duration: 6,
    description: "Aumento gradual de la intensidad y volumen",
    focus: ["Aeróbico", "Umbral", "Técnica"],
    intensity: 6,
    volume: 30000,
    color: "bg-green-500"
  },
  {
    id: "especifico",
    name: "Específico",
    duration: 4,
    description: "Entrenamiento específico para la competición",
    focus: ["Umbral", "VO2 Max", "Velocidad"],
    intensity: 8,
    volume: 28000,
    color: "bg-orange-500"
  },
  {
    id: "pico",
    name: "Pico",
    duration: 2,
    description: "Máxima intensidad y tapering",
    focus: ["Velocidad", "VO2 Max", "Recuperación"],
    intensity: 9,
    volume: 20000,
    color: "bg-red-500"
  }
];

const trainingGoals: TrainingGoal[] = [
  {
    id: "goal-1",
    title: "Campeonato Nacional 2025",
    description: "Objetivo principal del año - 100m libre",
    targetDate: "2025-06-15",
    priority: "high",
    status: "in-progress",
    progress: 65
  },
  {
    id: "goal-2",
    title: "Mejorar tiempo en 200m",
    description: "Bajar de 2:15 a 2:10 en 200m libre",
    targetDate: "2025-04-20",
    priority: "medium",
    status: "in-progress",
    progress: 40
  },
  {
    id: "goal-3",
    title: "Técnica de mariposa",
    description: "Perfeccionar la técnica de mariposa",
    targetDate: "2025-03-30",
    priority: "low",
    status: "pending",
    progress: 20
  }
];

const weeklyPlan: WeeklyPlan[] = [
  { week: 1, phase: "Base", totalDistance: 25000, sessions: 6, focus: "Aeróbico", intensity: 4 },
  { week: 2, phase: "Base", totalDistance: 26000, sessions: 6, focus: "Aeróbico", intensity: 4 },
  { week: 3, phase: "Base", totalDistance: 27000, sessions: 6, focus: "Técnica", intensity: 4 },
  { week: 4, phase: "Base", totalDistance: 28000, sessions: 6, focus: "Aeróbico", intensity: 5 },
  { week: 5, phase: "Construcción", totalDistance: 30000, sessions: 7, focus: "Umbral", intensity: 6 },
  { week: 6, phase: "Construcción", totalDistance: 31000, sessions: 7, focus: "Umbral", intensity: 6 },
  { week: 7, phase: "Construcción", totalDistance: 32000, sessions: 7, focus: "Aeróbico", intensity: 6 },
  { week: 8, phase: "Construcción", totalDistance: 33000, sessions: 7, focus: "Umbral", intensity: 7 },
  { week: 9, phase: "Específico", totalDistance: 28000, sessions: 8, focus: "VO2 Max", intensity: 8 },
  { week: 10, phase: "Específico", totalDistance: 29000, sessions: 8, focus: "Velocidad", intensity: 8 },
  { week: 11, phase: "Específico", totalDistance: 30000, sessions: 8, focus: "VO2 Max", intensity: 8 },
  { week: 12, phase: "Específico", totalDistance: 31000, sessions: 8, focus: "Velocidad", intensity: 9 },
  { week: 13, phase: "Pico", totalDistance: 20000, sessions: 6, focus: "Velocidad", intensity: 9 },
  { week: 14, phase: "Pico", totalDistance: 15000, sessions: 4, focus: "Recuperación", intensity: 5 }
];

export function PlanificacionOverview() {
  const [selectedPhase, setSelectedPhase] = useState<string>("base");
  const [selectedGoal, setSelectedGoal] = useState<string>("goal-1");
  
  // Estados para edición
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  
  // Estados para formularios
  const [phaseForm, setPhaseForm] = useState({
    name: "",
    duration: 0,
    description: "",
    focus: [] as string[],
    intensity: 5,
    volume: 0
  });
  
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    targetDate: "",
    priority: "medium" as "high" | "medium" | "low",
    status: "pending" as "pending" | "in-progress" | "completed",
    progress: 0
  });

  const currentPhase = trainingPhases.find(phase => phase.id === selectedPhase);
  const currentGoal = trainingGoals.find(goal => goal.id === selectedGoal);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in-progress": return "text-blue-600";
      case "pending": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Activity className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Funciones para manejar edición de fases
  const handleEditPhase = (phase: TrainingPhase) => {
    setPhaseForm({
      name: phase.name,
      duration: phase.duration,
      description: phase.description,
      focus: [...phase.focus],
      intensity: phase.intensity,
      volume: phase.volume
    });
    setEditingPhase(phase.id);
  };

  const handleSavePhase = () => {
    // Aquí se guardaría en la base de datos
    console.log("Guardando fase:", phaseForm);
    setEditingPhase(null);
    setIsAddingPhase(false);
    setPhaseForm({
      name: "",
      duration: 0,
      description: "",
      focus: [],
      intensity: 5,
      volume: 0
    });
  };

  const handleCancelPhase = () => {
    setEditingPhase(null);
    setIsAddingPhase(false);
    setPhaseForm({
      name: "",
      duration: 0,
      description: "",
      focus: [],
      intensity: 5,
      volume: 0
    });
  };

  // Funciones para manejar edición de objetivos
  const handleEditGoal = (goal: TrainingGoal) => {
    setGoalForm({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      priority: goal.priority,
      status: goal.status,
      progress: goal.progress
    });
    setEditingGoal(goal.id);
  };

  const handleSaveGoal = () => {
    // Aquí se guardaría en la base de datos
    console.log("Guardando objetivo:", goalForm);
    setEditingGoal(null);
    setIsAddingGoal(false);
    setGoalForm({
      title: "",
      description: "",
      targetDate: "",
      priority: "medium",
      status: "pending",
      progress: 0
    });
  };

  const handleCancelGoal = () => {
    setEditingGoal(null);
    setIsAddingGoal(false);
    setGoalForm({
      title: "",
      description: "",
      targetDate: "",
      priority: "medium",
      status: "pending",
      progress: 0
    });
  };

  const handleAddFocus = (focus: string) => {
    if (!phaseForm.focus.includes(focus)) {
      setPhaseForm(prev => ({
        ...prev,
        focus: [...prev.focus, focus]
      }));
    }
  };

  const handleRemoveFocus = (focus: string) => {
    setPhaseForm(prev => ({
      ...prev,
      focus: prev.focus.filter(f => f !== focus)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header con objetivos principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objetivo Principal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Campeonato Nacional</div>
            <p className="text-xs text-muted-foreground">15 Junio 2025</p>
            <Progress value={65} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">65% completado</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fase Actual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Construcción</div>
            <p className="text-xs text-muted-foreground">Semana 6 de 14</p>
            <Progress value={43} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">43% del ciclo</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volumen Semanal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31,000m</div>
            <p className="text-xs text-muted-foreground">7 sesiones</p>
            <Progress value={75} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">75% del objetivo</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intensidad Media</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5/10</div>
            <p className="text-xs text-muted-foreground">Umbral</p>
            <Progress value={65} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Intensidad objetivo</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="fases" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fases">Fases del Ciclo</TabsTrigger>
          <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
          <TabsTrigger value="planificacion">Planificación Semanal</TabsTrigger>
          <TabsTrigger value="carga">Carga de Entrenamiento</TabsTrigger>
        </TabsList>

        {/* Tab: Fases del Ciclo */}
        <TabsContent value="fases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Fases de Entrenamiento</h3>
            <Button 
              onClick={() => setIsAddingPhase(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Agregar Fase
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trainingPhases.map((phase) => (
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
                      <div className={`w-3 h-3 rounded-full ${phase.color}`}></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPhase(phase);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{phase.duration} semanas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Intensidad:</span>
                      <Badge variant="outline">{phase.intensity}/10</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Volumen:</span>
                      <Badge variant="outline">{phase.volume.toLocaleString()}m</Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium">Enfoque:</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.focus.map((focus, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
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
            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${currentPhase.color}`}></div>
                  {currentPhase.name} - Detalles
                </CardTitle>
                <CardDescription>{currentPhase.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Duración</h4>
                    <p className="text-2xl font-bold">{currentPhase.duration} semanas</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Intensidad Objetivo</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={currentPhase.intensity * 10} className="flex-1" />
                      <span className="font-bold">{currentPhase.intensity}/10</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Volumen Semanal</h4>
                    <p className="text-2xl font-bold">{currentPhase.volume.toLocaleString()}m</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Enfoques de Entrenamiento</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPhase.focus.map((focus, index) => (
                      <Badge key={index} variant="default" className="text-sm">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modal de Edición de Fases */}
          <Dialog open={editingPhase !== null || isAddingPhase} onOpenChange={handleCancelPhase}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isAddingPhase ? "Agregar Nueva Fase" : "Editar Fase"}
                </DialogTitle>
                <DialogDescription>
                  {isAddingPhase 
                    ? "Crea una nueva fase de entrenamiento" 
                    : "Modifica los detalles de la fase de entrenamiento"
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase-name">Nombre de la Fase</Label>
                    <Input
                      id="phase-name"
                      value={phaseForm.name}
                      onChange={(e) => setPhaseForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Base, Construcción, Pico"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phase-duration">Duración (semanas)</Label>
                    <Input
                      id="phase-duration"
                      type="number"
                      value={phaseForm.duration}
                      onChange={(e) => setPhaseForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase-description">Descripción</Label>
                  <Textarea
                    id="phase-description"
                    value={phaseForm.description}
                    onChange={(e) => setPhaseForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe el objetivo de esta fase..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase-intensity">Intensidad (1-10)</Label>
                    <Input
                      id="phase-intensity"
                      type="number"
                      min="1"
                      max="10"
                      value={phaseForm.intensity}
                      onChange={(e) => setPhaseForm(prev => ({ ...prev, intensity: parseInt(e.target.value) || 5 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phase-volume">Volumen Semanal (metros)</Label>
                    <Input
                      id="phase-volume"
                      type="number"
                      value={phaseForm.volume}
                      onChange={(e) => setPhaseForm(prev => ({ ...prev, volume: parseInt(e.target.value) || 0 }))}
                      placeholder="25000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Enfoques de Entrenamiento</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {phaseForm.focus.map((focus, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {focus}
                        <button
                          onClick={() => handleRemoveFocus(focus)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {["Aeróbico", "Técnica", "Fuerza", "Umbral", "VO2 Max", "Velocidad", "Recuperación"].map((focus) => (
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
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancelPhase}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSavePhase} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isAddingPhase ? "Agregar" : "Guardar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Tab: Objetivos */}
        <TabsContent value="objetivos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Objetivos de Entrenamiento</h3>
            <Button 
              onClick={() => setIsAddingGoal(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Agregar Objetivo
            </Button>
          </div>
          
          <div className="grid gap-4">
            {trainingGoals.map((goal) => (
              <Card 
                key={goal.id} 
                className={`bg-muted/50 border-muted cursor-pointer transition-all hover:shadow-md ${
                  selectedGoal === goal.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedGoal(goal.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{goal.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${getPriorityColor(goal.priority)} text-white`}
                        >
                          {goal.priority === "high" ? "Alta" : goal.priority === "medium" ? "Media" : "Baja"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{goal.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Objetivo: {new Date(goal.targetDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(goal.status)}
                          <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status === "completed" ? "Completado" : 
                             goal.status === "in-progress" ? "En Progreso" : "Pendiente"}
                          </span>
                        </div>
                        <Progress value={goal.progress} className="w-24 h-2 mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">{goal.progress}%</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGoal(goal);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detalles del objetivo seleccionado */}
          {currentGoal && (
            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(currentGoal.status)}
                  {currentGoal.title} - Detalles
                </CardTitle>
                <CardDescription>{currentGoal.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Prioridad</h4>
                    <Badge 
                      variant="outline" 
                      className={`${getPriorityColor(currentGoal.priority)} text-white`}
                    >
                      {currentGoal.priority === "high" ? "Alta" : currentGoal.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Fecha Objetivo</h4>
                    <p className="font-bold">{new Date(currentGoal.targetDate).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Progreso</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={currentGoal.progress} className="flex-1" />
                      <span className="font-bold">{currentGoal.progress}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modal de Edición de Objetivos */}
          <Dialog open={editingGoal !== null || isAddingGoal} onOpenChange={handleCancelGoal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isAddingGoal ? "Agregar Nuevo Objetivo" : "Editar Objetivo"}
                </DialogTitle>
                <DialogDescription>
                  {isAddingGoal 
                    ? "Crea un nuevo objetivo de entrenamiento" 
                    : "Modifica los detalles del objetivo"
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Título del Objetivo</Label>
                  <Input
                    id="goal-title"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Campeonato Nacional 2025"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-description">Descripción</Label>
                  <Textarea
                    id="goal-description"
                    value={goalForm.description}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe tu objetivo..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-date">Fecha Objetivo</Label>
                    <Input
                      id="goal-date"
                      type="date"
                      value={goalForm.targetDate}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-progress">Progreso (%)</Label>
                    <Input
                      id="goal-progress"
                      type="number"
                      min="0"
                      max="100"
                      value={goalForm.progress}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-priority">Prioridad</Label>
                    <Select 
                      value={goalForm.priority} 
                      onValueChange={(value: "high" | "medium" | "low") => 
                        setGoalForm(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-status">Estado</Label>
                    <Select 
                      value={goalForm.status} 
                      onValueChange={(value: "pending" | "in-progress" | "completed") => 
                        setGoalForm(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="in-progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancelGoal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveGoal} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isAddingGoal ? "Agregar" : "Guardar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Tab: Planificación Semanal */}
        <TabsContent value="planificacion" className="space-y-4">
          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle>Planificación Semanal del Ciclo</CardTitle>
              <CardDescription>Distribución de carga y enfoques por semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyPlan.map((week) => (
                  <div key={week.week} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">Semana</p>
                          <p className="text-2xl font-bold">{week.week}</p>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline">{week.phase}</Badge>
                          <p className="text-sm text-muted-foreground">Enfoque: {week.focus}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Distancia</p>
                          <p className="font-bold">{week.totalDistance.toLocaleString()}m</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Sesiones</p>
                          <p className="font-bold">{week.sessions}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Intensidad</p>
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

        {/* Tab: Carga de Entrenamiento */}
        <TabsContent value="carga" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle>Evolución del Volumen</CardTitle>
                <CardDescription>Metros por semana a lo largo del ciclo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyPlan.map((week) => (
                    <div key={week.week} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">S{week.week}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{week.totalDistance.toLocaleString()}m</span>
                          <span className="text-muted-foreground">{week.phase}</span>
                        </div>
                        <Progress 
                          value={(week.totalDistance / 35000) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle>Evolución de la Intensidad</CardTitle>
                <CardDescription>Nivel de intensidad por semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyPlan.map((week) => (
                    <div key={week.week} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">S{week.week}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{week.intensity}/10</span>
                          <span className="text-muted-foreground">{week.focus}</span>
                        </div>
                        <Progress 
                          value={week.intensity * 10} 
                          className="h-2" 
                        />
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
