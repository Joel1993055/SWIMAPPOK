"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Clock, 
  Target, 
  Activity, 
  Calendar,
  Zap,
  Save,
  X
} from "lucide-react";

// Tipos de datos
interface QuickSession {
  date: string;
  distance: number;
  duration: number;
  stroke: string;
  sessionType: string;
  rpe: number;
  mainSet: string;
  notes: string;
}

// Opciones predefinidas
const STROKE_OPTIONS = [
  { value: "freestyle", label: "Libre", icon: "🏊‍♂️" },
  { value: "backstroke", label: "Espalda", icon: "🏊‍♀️" },
  { value: "breaststroke", label: "Pecho", icon: "🐸" },
  { value: "butterfly", label: "Mariposa", icon: "🦋" },
  { value: "mixed", label: "Mixto", icon: "🔄" }
];

const SESSION_TYPE_OPTIONS = [
  { value: "aerobic", label: "Aeróbico", color: "bg-blue-500", description: "Resistencia base" },
  { value: "threshold", label: "Umbral", color: "bg-green-500", description: "Intensidad moderada" },
  { value: "speed", label: "Velocidad", color: "bg-orange-500", description: "Alta intensidad" },
  { value: "technique", label: "Técnica", color: "bg-purple-500", description: "Perfeccionamiento" },
  { value: "recovery", label: "Recuperación", color: "bg-gray-500", description: "Descanso activo" }
];

const QUICK_TEMPLATES = [
  {
    name: "Aeróbico Base",
    distance: 2000,
    duration: 45,
    stroke: "freestyle",
    sessionType: "aerobic",
    rpe: 5,
    mainSet: "4x500m @1:30",
    description: "Sesión de resistencia base"
  },
  {
    name: "Umbral",
    distance: 1500,
    duration: 35,
    stroke: "freestyle",
    sessionType: "threshold",
    rpe: 7,
    mainSet: "3x500m @1:15",
    description: "Trabajo de umbral"
  },
  {
    name: "Velocidad",
    distance: 800,
    duration: 25,
    stroke: "freestyle",
    sessionType: "speed",
    rpe: 9,
    mainSet: "8x100m @1:45",
    description: "Sprint y velocidad"
  },
  {
    name: "Técnica",
    distance: 1200,
    duration: 30,
    stroke: "mixed",
    sessionType: "technique",
    rpe: 4,
    mainSet: "Drills técnicos",
    description: "Perfeccionamiento técnico"
  }
];

export function QuickCreate() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [session, setSession] = useState<QuickSession>({
    date: new Date().toISOString().split('T')[0],
    distance: 0,
    duration: 0,
    stroke: "",
    sessionType: "",
    rpe: 5,
    mainSet: "",
    notes: ""
  });

  const handleTemplateSelect = (template: typeof QUICK_TEMPLATES[0]) => {
    setSession({
      ...session,
      distance: template.distance,
      duration: template.duration,
      stroke: template.stroke,
      sessionType: template.sessionType,
      rpe: template.rpe,
      mainSet: template.mainSet
    });
    setSelectedTemplate(template.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Guardando sesión:", session);
    // Aquí se implementaría la lógica para guardar la sesión
    setIsOpen(false);
    // Reset form
    setSession({
      date: new Date().toISOString().split('T')[0],
      distance: 0,
      duration: 0,
      stroke: "",
      sessionType: "",
      rpe: 5,
      mainSet: "",
      notes: ""
    });
    setSelectedTemplate("");
  };

  const selectedStroke = STROKE_OPTIONS.find(s => s.value === session.stroke);
  const selectedSessionType = SESSION_TYPE_OPTIONS.find(s => s.value === session.sessionType);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Quick Create</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Crear Entrenamiento Rápido
          </DialogTitle>
          <DialogDescription>
            Añade una nueva sesión de entrenamiento de forma rápida y eficiente
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Panel izquierdo: Plantillas rápidas */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Plantillas Rápidas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona una plantilla para rellenar automáticamente los campos
              </p>
            </div>
            
            <div className="grid gap-3">
              {QUICK_TEMPLATES.map((template) => (
                <Card 
                  key={template.name}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.name ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {template.distance}m
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {template.duration}min
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            RPE {template.rpe}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={`${SESSION_TYPE_OPTIONS.find(s => s.value === template.sessionType)?.color} text-white`}
                        >
                          {SESSION_TYPE_OPTIONS.find(s => s.value === template.sessionType)?.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Panel derecho: Formulario */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Detalles del Entrenamiento</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Personaliza los detalles de tu sesión
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={session.date}
                  onChange={(e) => setSession({ ...session, date: e.target.value })}
                  required
                />
              </div>

              {/* Distancia y Duración */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Distancia (m)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    value={session.distance || ""}
                    onChange={(e) => setSession({ ...session, distance: parseInt(e.target.value) || 0 })}
                    placeholder="2000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duración (min)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={session.duration || ""}
                    onChange={(e) => setSession({ ...session, duration: parseInt(e.target.value) || 0 })}
                    placeholder="45"
                  />
                </div>
              </div>

              {/* Estilo y Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estilo</Label>
                  <Select value={session.stroke} onValueChange={(value) => setSession({ ...session, stroke: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      {STROKE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Sesión</Label>
                  <Select value={session.sessionType} onValueChange={(value) => setSession({ ...session, sessionType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* RPE */}
              <div className="space-y-2">
                <Label>RPE (1-10)</Label>
                <Select value={session.rpe.toString()} onValueChange={(value) => setSession({ ...session, rpe: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((rpe) => (
                      <SelectItem key={rpe} value={rpe.toString()}>
                        RPE {rpe}/10
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Serie Principal */}
              <div className="space-y-2">
                <Label htmlFor="mainSet">Serie Principal</Label>
                <Input
                  id="mainSet"
                  value={session.mainSet}
                  onChange={(e) => setSession({ ...session, mainSet: e.target.value })}
                  placeholder="4x500m @1:30"
                />
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={session.notes}
                  onChange={(e) => setSession({ ...session, notes: e.target.value })}
                  placeholder="Observaciones del entrenamiento..."
                  rows={3}
                />
              </div>

              {/* Resumen visual */}
              {(session.distance > 0 || session.stroke || session.sessionType) && (
                <Card className="bg-muted/50 border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Resumen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Distancia:</span>
                      <Badge variant="outline">{session.distance}m</Badge>
                    </div>
                    {session.duration > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Duración:</span>
                        <Badge variant="outline">{session.duration}min</Badge>
                      </div>
                    )}
                    {selectedStroke && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Estilo:</span>
                        <Badge variant="outline">{selectedStroke.icon} {selectedStroke.label}</Badge>
                      </div>
                    )}
                    {selectedSessionType && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Tipo:</span>
                        <Badge variant="outline" className={`${selectedSessionType.color} text-white`}>
                          {selectedSessionType.label}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span>RPE:</span>
                      <Badge variant="outline">RPE {session.rpe}/10</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Botones */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Entrenamiento
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
