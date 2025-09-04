"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Plus,
  Save,
  Calendar as CalendarIcon,
  Clock,
  Target,
  Activity,
  MapPin,
  Users,
  FileText,
  Trash2,
  Edit,
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AdvancedZoneDetector } from "@/components/advanced-zone-detector";
import { AICoach } from "@/components/ai-coach";
import { useAICoach } from "@/lib/contexts/ai-coach-context";
import { createSession, getSessions, updateSession, deleteSession, type Session } from "@/lib/actions/sessions";

// Datos de ejemplo de entrenamientos guardados
const sampleSavedTrainings = [
  {
    id: 1,
    title: "Entrenamiento de Resistencia",
    date: "2025-01-15",
    type: "Aeróbico",
    duration: 45,
    distance: 2000,
    stroke: "Libre",
    rpe: 6,
    location: "Piscina Municipal",
    coach: "María García",
    content: `Calentamiento: 200m libre Z1
Serie principal: 8x100m libre Z3 con 20s descanso
Vuelta a la calma: 200m espalda Z1`,
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Trabajo de Técnica",
    date: "2025-01-17",
    type: "Técnica",
    duration: 30,
    distance: 1500,
    stroke: "Espalda",
    rpe: 4,
    location: "Piscina Municipal",
    coach: "Carlos López",
    content: `Calentamiento: 300m libre Z1
Ejercicios técnicos: 4x50m espalda con tabla
Serie principal: 6x100m espalda Z2
Vuelta a la calma: 200m libre Z1`,
    createdAt: "2025-01-17T14:30:00Z"
  }
];

function TrainingContent() {
  const [activeTab, setActiveTab] = useState<"create" | "saved">("create");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [trainingDate, setTrainingDate] = useState<Date>(() => {
    const today = new Date();
    console.log("Inicializando trainingDate con:", today);
    return today;
  });
  const [trainingLocation, setTrainingLocation] = useState("");
  const [trainingCoach, setTrainingCoach] = useState("");
  const [trainingContent, setTrainingContent] = useState("");
  const [selectedClub, setSelectedClub] = useState("club-1");
  const [selectedGroup, setSelectedGroup] = useState("group-1-1");
  const [trainingObjective, setTrainingObjective] = useState("");
  const [trainingTimeSlot, setTrainingTimeSlot] = useState<"AM" | "PM">("AM");
  const [savedTrainings, setSavedTrainings] = useState<Session[]>([]);
  const [editingTraining, setEditingTraining] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para volúmenes por zona
  const [zoneVolumes, setZoneVolumes] = useState({
    z1: 0,
    z2: 0,
    z3: 0,
    z4: 0,
    z5: 0
  });
  
  const { analyzeTraining } = useAICoach();

  // Debug: Monitorear cambios en trainingDate
  useEffect(() => {
    console.log("trainingDate cambió a:", trainingDate);
    console.log("Fecha formateada:", trainingDate.toISOString().split('T')[0]);
  }, [trainingDate]);

  // Cargar entrenamientos al montar el componente
  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      setIsLoading(true);
      const trainings = await getSessions();
      setSavedTrainings(trainings);
    } catch (error) {
      console.error("Error cargando entrenamientos:", error);
      setError("Error al cargar los entrenamientos");
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular total de metros
  const totalMeters = Object.values(zoneVolumes).reduce((sum, volume) => sum + volume, 0);

  // Función para actualizar volúmenes por zona
  const handleZoneVolumeChange = (zone: keyof typeof zoneVolumes, value: string) => {
    const numericValue = parseInt(value) || 0;
    setZoneVolumes(prev => ({
      ...prev,
      [zone]: numericValue
    }));
  };

  const handleClubChange = (value: string) => {
    setSelectedClub(value);
    const newGroups = clubsData[value as keyof typeof clubsData];
    if (newGroups && newGroups.groups.length > 0) {
      setSelectedGroup(newGroups.groups[0].id);
    }
  };


  // Datos de ejemplo para clubs y grupos
  const clubsData = {
    "club-1": {
      name: "Club Natación Madrid",
      groups: [
        { id: "group-1-1", name: "Grupo A - Competición" },
        { id: "group-1-2", name: "Grupo B - Desarrollo" },
        { id: "group-1-3", name: "Grupo C - Iniciación" }
      ]
    },
    "club-2": {
      name: "Club Acuático Barcelona",
      groups: [
        { id: "group-2-1", name: "Elite" },
        { id: "group-2-2", name: "Promesas" },
        { id: "group-2-3", name: "Base" }
      ]
    },
    "club-3": {
      name: "Centro Deportivo Valencia",
      groups: [
        { id: "group-3-1", name: "Senior" },
        { id: "group-3-2", name: "Junior" },
        { id: "group-3-3", name: "Infantil" }
      ]
    }
  };

  const handleSaveTraining = async () => {
    if (!trainingTitle || !trainingContent) {
      setError("Por favor, completa el título y el contenido del entrenamiento");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const selectedClubData = clubsData[selectedClub as keyof typeof clubsData];
      const selectedGroupData = selectedClubData?.groups.find(g => g.id === selectedGroup);


      // Debug detallado de la fecha
      console.log("=== DEBUG FECHA ===");
      console.log("trainingDate objeto:", trainingDate);
      console.log("trainingDate tipo:", typeof trainingDate);
      console.log("trainingDate instanceof Date:", trainingDate instanceof Date);
      console.log("trainingDate.toISOString():", trainingDate.toISOString());
      console.log("Fecha formateada para guardar:", trainingDate.toISOString().split('T')[0]);
      console.log("==================");

      const formData = new FormData();
      formData.append("title", trainingTitle);
      formData.append("date", trainingDate.toISOString().split('T')[0]);
      formData.append("type", "Personalizado");
      formData.append("duration", "90"); // Valor por defecto
      formData.append("distance", totalMeters.toString());
      formData.append("stroke", "Libre");
      formData.append("rpe", "5");
      formData.append("location", trainingLocation || "No especificado");
      formData.append("coach", trainingCoach || "No especificado");
      formData.append("club", selectedClubData?.name || "No especificado");
      formData.append("group_name", selectedGroupData?.name || "No especificado");
      formData.append("objective", trainingObjective || "otro");
      formData.append("time_slot", trainingTimeSlot);
      formData.append("content", trainingContent);
      formData.append("z1", zoneVolumes.z1.toString());
      formData.append("z2", zoneVolumes.z2.toString());
      formData.append("z3", zoneVolumes.z3.toString());
      formData.append("z4", zoneVolumes.z4.toString());
      formData.append("z5", zoneVolumes.z5.toString());

      if (editingTraining) {
        await updateSession(editingTraining.id, formData);
        setSuccess("Entrenamiento actualizado correctamente");
      } else {
        await createSession(formData);
        setSuccess("Entrenamiento guardado correctamente");
      }

      // Analizar con AI Coach
      await analyzeTraining({
        title: trainingTitle,
        content: trainingContent,
        type: "Personalizado",
        date: trainingDate,
        totalDistance: totalMeters,
        detectedZones: [],
      });

      // Limpiar formulario
      setTrainingTitle("");
      setTrainingContent("");
      setTrainingLocation("");
      setTrainingCoach("");
      setTrainingObjective("");
      setTrainingTimeSlot("AM");
      // No resetear la fecha para mantener la selección del usuario
      // setTrainingDate(new Date());
      setSelectedClub("club-1");
      setSelectedGroup("group-1-1");
      setZoneVolumes({ z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 });
      setEditingTraining(null);
      
      // Recargar entrenamientos
      await loadTrainings();
      
    } catch (error) {
      console.error("Error guardando entrenamiento:", error);
      setError("Error al guardar el entrenamiento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTraining = (training: Session) => {
    setTrainingTitle(training.title);
    setTrainingDate(new Date(training.date));
    setTrainingLocation(training.location);
    setTrainingCoach(training.coach);
    setTrainingObjective(training.objective || "otro");
    setTrainingTimeSlot((training as any).time_slot || "AM");
    setTrainingContent(training.content);
    
    // Cargar volúmenes por zona si existen
    if (training.zone_volumes) {
      setZoneVolumes(training.zone_volumes);
    } else {
      setZoneVolumes({ z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 });
    }
    
    // Buscar el club y grupo correspondientes
    const clubEntry = Object.entries(clubsData).find(([, clubData]) => 
      clubData.name === training.club
    );
    if (clubEntry) {
      setSelectedClub(clubEntry[0]);
      const group = clubEntry[1].groups.find(g => g.name === training.group_name);
      if (group) {
        setSelectedGroup(group.id);
      }
    }
    
    setEditingTraining(training);
    setActiveTab("create");
  };

  const handleDeleteTraining = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este entrenamiento?")) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteSession(id);
      setSuccess("Entrenamiento eliminado correctamente");
      await loadTrainings();
    } catch (error) {
      console.error("Error eliminando entrenamiento:", error);
      setError("Error al eliminar el entrenamiento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTrainingTitle("");
    setTrainingContent("");
    setTrainingLocation("");
    setTrainingCoach("");
    setTrainingObjective("");
    setTrainingTimeSlot("AM");
    setTrainingDate(new Date());
    setSelectedClub("club-1");
    setSelectedGroup("group-1-1");
    setZoneVolumes({ z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 });
    setEditingTraining(null);
    setError(null);
    setSuccess(null);
  };

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

        {/* Mensajes de error y éxito */}
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
        
        {/* Tabs Navigation */}
        <div className="flex gap-2 mt-6">
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {editingTraining ? "Editando" : "Crear Entrenamiento"}
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "outline"}
            onClick={() => setActiveTab("saved")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Entrenamientos Guardados ({savedTrainings.length})
          </Button>
        </div>
      </div>

      {/* Tab: Crear/Editar Entrenamiento */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Principal */}
          <div className="lg:col-span-2">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingTraining ? "Editar Entrenamiento" : "Crear Nuevo Entrenamiento"}
                </CardTitle>
                <CardDescription>
                  {editingTraining 
                    ? "Modifica los detalles de tu entrenamiento"
                    : "Escribe tu entrenamiento con todos los detalles"
                  }
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
                      value={trainingTitle}
                      onChange={(e) => setTrainingTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-date">Fecha</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={trainingDate ? trainingDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const dateValue = e.target.value;
                          console.log("Input date value:", dateValue);
                          if (dateValue) {
                            const newDate = new Date(dateValue);
                            console.log("New date created:", newDate);
                            setTrainingDate(newDate);
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const today = new Date();
                          console.log("Setting to today:", today);
                          setTrainingDate(today);
                        }}
                      >
                        Hoy
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fecha seleccionada: {trainingDate ? format(trainingDate, "dd/MM/yyyy", { locale: es }) : "Ninguna"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-location">Ubicación</Label>
                    <Input
                      id="training-location"
                      placeholder="Ej: Piscina Municipal"
                      value={trainingLocation}
                      onChange={(e) => setTrainingLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-coach">Entrenador</Label>
                    <Input
                      id="training-coach"
                      placeholder="Ej: María García"
                      value={trainingCoach}
                      onChange={(e) => setTrainingCoach(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-club">Club</Label>
                    <Select value={selectedClub} onValueChange={handleClubChange}>
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
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubsData[selectedClub as keyof typeof clubsData]?.groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-objective">Objetivo del Entrenamiento</Label>
                    <Select value={trainingObjective} onValueChange={setTrainingObjective}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resistencia">Resistencia</SelectItem>
                        <SelectItem value="velocidad">Velocidad</SelectItem>
                        <SelectItem value="tecnica">Técnica</SelectItem>
                        <SelectItem value="fuerza">Fuerza</SelectItem>
                        <SelectItem value="recuperacion">Recuperación</SelectItem>
                        <SelectItem value="competicion">Competición</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-time-slot">Horario</Label>
                    <Select value={trainingTimeSlot} onValueChange={(value) => setTrainingTimeSlot(value as "AM" | "PM")}>
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

                {/* Volúmenes por zona */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Volúmenes por Zona de Entrenamiento</Label>
                    <div className="text-sm text-muted-foreground">
                      Total: <span className="font-semibold text-foreground">{totalMeters.toLocaleString()}m</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(zoneVolumes).map(([zone, volume]) => (
                      <div key={zone} className="space-y-2">
                        <Label htmlFor={`zone-${zone}`} className="text-sm font-medium">
                          {zone.toUpperCase()}
                        </Label>
                        <Input
                          id={`zone-${zone}`}
                          type="number"
                          min="0"
                          step="50"
                          placeholder="0"
                          value={volume || ""}
                          onChange={(e) => handleZoneVolumeChange(zone as keyof typeof zoneVolumes, e.target.value)}
                          className="text-center"
                        />
                        <div className="text-xs text-muted-foreground text-center">
                          {volume > 0 && `${volume.toLocaleString()}m`}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    💡 <strong>Consejo:</strong> Introduce los metros que nadaste en cada zona de intensidad. 
                    Esto te ayudará a analizar mejor la distribución de tu entrenamiento.
                  </div>
                </div>

                <Separator />

                {/* Editor de contenido */}
                <div className="space-y-2">
                  <Label htmlFor="training-content">Contenido del entrenamiento</Label>
                  <Textarea
                    id="training-content"
                    placeholder="Escribe tu entrenamiento aquí... Ejemplo:&#10;&#10;Calentamiento: 200m libre Z1&#10;Serie principal: 8x100m libre Z3 con 20s descanso&#10;Vuelta a la calma: 200m espalda Z1&#10;&#10;Puedes incluir:&#10;- Distancias (200m, 1.5km)&#10;- Tiempos (45min, 1h 30min)&#10;- Zonas (Z1, Z2, Z3, Z4, Z5)&#10;- Estilos (libre, espalda, pecho, mariposa)"
                    value={trainingContent}
                    onChange={(e) => setTrainingContent(e.target.value)}
                    className="min-h-[400px] resize-none"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between">
                  <div>
                    {editingTraining && (
                      <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Cancelar Edición
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setTrainingContent("")}>
                      Limpiar
                    </Button>
                    <Button onClick={handleSaveTraining} disabled={isLoading} className="gap-2">
                      {isLoading ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {editingTraining ? "Actualizar" : "Guardar"} Entrenamiento
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de Detección de Zonas */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Coach */}
            <AICoach />

            {/* Detector de Zonas Avanzado */}
            <AdvancedZoneDetector 
              content={trainingContent}
              trainingType="Personalizado"
              phase="base" // Esto se podría obtener del contexto de planificación
              competition={false}
            />

            {/* Panel de Ayuda */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Consejos para Escribir
                </CardTitle>
                <CardDescription>
                  Mejores prácticas para crear entrenamientos
                </CardDescription>
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
                        <Badge variant="outline">Z1</Badge>
                        <Badge variant="outline">Z2</Badge>
                        <Badge variant="outline">Z3</Badge>
                        <Badge variant="outline">Z4</Badge>
                        <Badge variant="outline">Z5</Badge>
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
                      <Badge variant="secondary">Libre</Badge>
                      <Badge variant="secondary">Espalda</Badge>
                      <Badge variant="secondary">Pecho</Badge>
                      <Badge variant="secondary">Mariposa</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Entrenamientos Guardados */}
      {activeTab === "saved" && (
        <div className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Entrenamientos Guardados</CardTitle>
              <CardDescription>
                {savedTrainings.length} entrenamientos guardados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Cargando entrenamientos...</p>
                  </div>
                ) : savedTrainings.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No tienes entrenamientos guardados</p>
                    <p className="text-sm text-muted-foreground">Crea tu primer entrenamiento en la pestaña &quot;Crear Entrenamiento&quot;</p>
                  </div>
                ) : (
                  savedTrainings.map((training) => (
                    <div key={training.id} className="border rounded-lg p-4 bg-background/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{training.title}</h3>
                            <Badge variant="outline">{training.type}</Badge>
                            <Badge variant="secondary">{training.stroke}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(training.date), "dd/MM/yyyy", { locale: es })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{training.duration} min</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span>{training.distance}m</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Activity className="h-4 w-4 text-muted-foreground" />
                              <span>RPE {training.rpe}/10</span>
                            </div>
                          </div>

                          {/* Mostrar volúmenes por zona si existen */}
                          {training.zone_volumes && (
                            <div className="mb-3">
                              <div className="text-sm font-medium mb-2">Distribución por Zonas:</div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(training.zone_volumes).map(([zone, volume]) => (
                                  volume > 0 && (
                                    <Badge key={zone} variant="outline" className="text-xs">
                                      {zone.toUpperCase()}: {volume.toLocaleString()}m
                                    </Badge>
                                  )
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{training.location}</span>
                            <Users className="h-4 w-4 ml-4" />
                            <span>{training.coach}</span>
                            {training.club && (
                              <>
                                <Building2 className="h-4 w-4 ml-4" />
                                <span>{training.club}</span>
                              </>
                            )}
                            {training.group_name && (
                              <>
                                <Users className="h-4 w-4 ml-2" />
                                <span>{training.group_name}</span>
                              </>
                            )}
                          </div>

                          <div className="bg-muted/50 rounded-lg p-3">
                            <pre className="text-sm whitespace-pre-wrap font-mono">
                              {training.content}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTraining(training)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTraining(training.id)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function TrainingPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <TrainingContent />
      </SidebarInset>
    </SidebarProvider>
  );
}