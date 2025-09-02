"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Activity, 
  CheckCircle,
  AlertCircle
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
                    <div className={`w-3 h-3 rounded-full ${phase.color}`}></div>
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
        </TabsContent>

        {/* Tab: Objetivos */}
        <TabsContent value="objetivos" className="space-y-4">
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
