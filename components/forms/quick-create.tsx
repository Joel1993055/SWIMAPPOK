"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  X,
} from "lucide-react";
import { createSession } from "@/lib/actions/sessions";

// Tipos de datos
interface QuickSession {
  date: string;
  distance: number;
  objective: string;
  time_slot: "AM" | "PM";
  content: string;
  zone_volumes: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
}

// Opciones predefinidas
const OBJECTIVE_OPTIONS = [
  { value: "Resistencia", label: "Resistencia", color: "bg-blue-500" },
  { value: "Velocidad", label: "Velocidad", color: "bg-red-500" },
  { value: "Técnica", label: "Técnica", color: "bg-purple-500" },
  { value: "Fuerza", label: "Fuerza", color: "bg-orange-500" },
  { value: "Recuperación", label: "Recuperación", color: "bg-green-500" },
  { value: "Competición", label: "Competición", color: "bg-yellow-500" },
];

export function QuickCreate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<QuickSession>({
    date: new Date().toISOString().split("T")[0],
    distance: 0,
    objective: "",
    time_slot: "AM",
    content: "",
    zone_volumes: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
  });

  const handleZoneVolumeChange = (
    zone: "z1" | "z2" | "z3" | "z4" | "z5",
    value: string
  ) => {
    const numericValue = parseInt(value) || 0;
    setSession(prev => ({
      ...prev,
      zone_volumes: {
        ...prev.zone_volumes,
        [zone]: numericValue,
      },
    }));
  };

  const calculateTotalMeters = () => {
    return Object.values(session.zone_volumes).reduce(
      (sum, volume) => sum + volume,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("date", session.date);
      formData.append("distance", session.distance.toString());
      formData.append("stroke", "Libre"); // Default stroke
      formData.append("rpe", "5"); // Default RPE
      formData.append("objective", session.objective);
      formData.append("time_slot", session.time_slot);
      formData.append("content", session.content);

      // Agregar volúmenes por zona
      formData.append("z1", session.zone_volumes.z1.toString());
      formData.append("z2", session.zone_volumes.z2.toString());
      formData.append("z3", session.zone_volumes.z3.toString());
      formData.append("z4", session.zone_volumes.z4.toString());
      formData.append("z5", session.zone_volumes.z5.toString());

      await createSession(formData);

      // Reset form
      setSession({
        date: new Date().toISOString().split("T")[0],
        distance: 0,
        objective: "",
        time_slot: "AM",
        content: "",
        zone_volumes: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
      });
      setIsOpen(false);

      // Recargar la página para mostrar el nuevo entrenamiento
      window.location.reload();
    } catch (error) {
      console.error("Error guardando entrenamiento:", error);
      alert(
        "Error al guardar el entrenamiento. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedObjective = OBJECTIVE_OPTIONS.find(
    s => s.value === session.objective
  );
  const totalMeters = calculateTotalMeters();

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

        <div className="space-y-6">
          {/* Formulario principal */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Detalles del Entrenamiento
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Información básica de la sesión
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Fecha, Horario, Distancia y Objetivo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={session.date}
                    onChange={e =>
                      setSession({ ...session, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-slot">Horario</Label>
                  <Select
                    value={session.time_slot}
                    onValueChange={value =>
                      setSession({
                        ...session,
                        time_slot: value as "AM" | "PM",
                      })
                    }
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
                <div className="space-y-2">
                  <Label htmlFor="distance" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Distancia (m)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    value={session.distance || ""}
                    onChange={e =>
                      setSession({
                        ...session,
                        distance: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="2000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Objetivo del Entrenamiento</Label>
                  <Select
                    value={session.objective}
                    onValueChange={value =>
                      setSession({ ...session, objective: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {OBJECTIVE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${option.color}`}
                            ></div>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contenido del entrenamiento - MÁS GRANDE */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-medium">
                  Contenido del entrenamiento
                </Label>
                <Textarea
                  id="content"
                  value={session.content}
                  onChange={e =>
                    setSession({ ...session, content: e.target.value })
                  }
                  placeholder="Escribe tu entrenamiento aquí... Ejemplo:&#10;&#10;Calentamiento: 200m libre Z1&#10;Serie principal: 8x100m libre Z3 con 20s descanso&#10;Vuelta a la calma: 200m espalda Z1&#10;&#10;Puedes incluir:&#10;- Distancias (200m, 1.5km)&#10;- Tiempos (45min, 1h 30min)&#10;- Zonas (Z1, Z2, Z3, Z4, Z5)&#10;- Estilos (libre, espalda, pecho, mariposa)"
                  rows={8}
                  className="min-h-[200px] resize-none"
                />
              </div>
            </form>
          </div>

          {/* Volúmenes por zona - Minimalista */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">
                Volúmenes por Zona
              </Label>
              <div className="text-xs text-muted-foreground">
                Total:{" "}
                <span className="font-medium text-foreground">
                  {totalMeters.toLocaleString()}m
                </span>
              </div>
            </div>

            {/* Grid compacto de zonas */}
            <div className="grid grid-cols-5 gap-2">
              {[
                {
                  zone: "z1",
                  label: "Z1",
                  color:
                    "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
                },
                {
                  zone: "z2",
                  label: "Z2",
                  color:
                    "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
                },
                {
                  zone: "z3",
                  label: "Z3",
                  color:
                    "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                },
                {
                  zone: "z4",
                  label: "Z4",
                  color:
                    "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
                },
                {
                  zone: "z5",
                  label: "Z5",
                  color:
                    "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                },
              ].map(({ zone, label, color }) => (
                <div key={zone} className={`p-2 rounded border ${color}`}>
                  <div className="text-xs text-muted-foreground text-center mb-1">
                    {label}
                  </div>
                  <Input
                    id={zone}
                    type="number"
                    min="0"
                    step="50"
                    placeholder="0"
                    value={
                      session.zone_volumes[
                        zone as keyof typeof session.zone_volumes
                      ] || ""
                    }
                    onChange={e =>
                      handleZoneVolumeChange(
                        zone as "z1" | "z2" | "z3" | "z4" | "z5",
                        e.target.value
                      )
                    }
                    className="text-center text-xs font-mono h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen visual */}
        {(session.distance > 0 || session.objective) && (
          <Card className="bg-muted/50 border-muted mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Resumen del Entrenamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Distancia:</span>
                  <Badge variant="outline">{session.distance}m</Badge>
                </div>
                {selectedObjective && (
                  <div className="flex items-center justify-between">
                    <span>Objetivo:</span>
                    <Badge
                      variant="outline"
                      className={`${selectedObjective.color} text-white`}
                    >
                      {selectedObjective.label}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Horario:</span>
                  <Badge variant="outline">{session.time_slot}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Zonas:</span>
                  <Badge variant="outline">
                    {totalMeters.toLocaleString()}m
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar Entrenamiento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
