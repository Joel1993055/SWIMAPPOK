"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, Target, TrendingUp, Clock, Info, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SpeedResult {
  relativeSpeed: number;
  category: string;
  color: string;
  pace: string;
  improvement: string;
}

export function RelativeSpeedCalculator() {
  const [distance, setDistance] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [result, setResult] = useState<SpeedResult | null>(null);

  // Tabla de referencia para test de 20 minutos (distancia en metros)
  // const referenceTable = {
  //   "1000": { pace: "02:00", level: "Principiante" },
  //   "1200": { pace: "01:40", level: "Intermedio" },
  //   "1400": { pace: "01:26", level: "Avanzado" },
  //   "1600": { pace: "01:15", level: "Élite" },
  //   "1800": { pace: "01:07", level: "Profesional" },
  //   "2000": { pace: "01:00", level: "Mundial" }
  // };

  const calculateRelativeSpeed = () => {
    if (!distance || !time) {
      return;
    }

    const distanceNum = parseFloat(distance);
    const timeParts = time.split(":");
    const timeInSeconds =
      parseInt(timeParts[0]) * 60 + parseFloat(timeParts[1]);

    // Calcular velocidad en m/s (no usado actualmente)
    // const speedMs = distanceNum / timeInSeconds;

    // Calcular ritmo por 100m
    const pacePer100m = (timeInSeconds / distanceNum) * 100;
    const minutes = Math.floor(pacePer100m / 60);
    const seconds = Math.round(pacePer100m % 60);
    const pace = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Determinar nivel basado en la distancia cubierta en 20 minutos
    let category = "";
    let color = "";
    let relativeSpeed = 0;
    let improvement = "";

    if (distanceNum >= 2000) {
      category = "Nivel Mundial";
      color = "bg-purple-500";
      relativeSpeed = 100;
      improvement = "Mantén tu nivel excepcional";
    } else if (distanceNum >= 1800) {
      category = "Nivel Profesional";
      color = "bg-red-500";
      relativeSpeed = 90;
      improvement = "Excelente rendimiento";
    } else if (distanceNum >= 1600) {
      category = "Nivel Élite";
      color = "bg-orange-500";
      relativeSpeed = 80;
      improvement = "Muy buen nivel competitivo";
    } else if (distanceNum >= 1400) {
      category = "Nivel Avanzado";
      color = "bg-blue-500";
      relativeSpeed = 70;
      improvement = "Buen nivel, sigue mejorando";
    } else if (distanceNum >= 1200) {
      category = "Nivel Intermedio";
      color = "bg-green-500";
      relativeSpeed = 60;
      improvement = "Nivel intermedio, hay margen de mejora";
    } else if (distanceNum >= 1000) {
      category = "Nivel Principiante";
      color = "bg-yellow-500";
      relativeSpeed = 50;
      improvement = "Enfócate en la técnica y resistencia";
    } else {
      category = "Necesita Mejora";
      color = "bg-gray-500";
      relativeSpeed = 30;
      improvement = "Trabaja en la base aeróbica";
    }

    setResult({
      relativeSpeed,
      category,
      color,
      pace,
      improvement,
    });
  };

  const resetCalculator = () => {
    setDistance("");
    setTime("");
    setResult(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Calculadora */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Calculador de Velocidad Relativa
          </CardTitle>
          <CardDescription>
            Calcula tu velocidad relativa basada en un test de 20 minutos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="distance">Distancia cubierta (metros)</Label>
            <Input
              id="distance"
              type="number"
              placeholder="Ej: 1500"
              value={distance}
              onChange={e => setDistance(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Distancia total nadada en 20 minutos
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Tiempo total (mm:ss)</Label>
            <Input
              id="time"
              type="text"
              placeholder="20:00"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Tiempo del test (normalmente 20:00)
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateRelativeSpeed} className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              Calcular
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resultados del Test
          </CardTitle>
          <CardDescription>
            Tu nivel de rendimiento y velocidad relativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.relativeSpeed}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Velocidad Relativa
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Badge className={`${result.color} text-white mb-2`}>
                    {result.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {result.improvement}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {result.pace}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ritmo por 100m
                    </p>
                  </div>

                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {distance}m
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Distancia total
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso del nivel</span>
                  <span>{result.relativeSpeed}%</span>
                </div>
                <Progress value={result.relativeSpeed} className="h-2" />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ingresa los datos del test de 20 minutos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del test */}
      <Card className="md:col-span-2 bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cómo realizar el Test de 20 Minutos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Preparación
              </h4>
              <p className="text-sm text-muted-foreground">
                Calienta 10-15 minutos antes del test. Nada a máxima velocidad
                sostenible durante exactamente 20 minutos.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Durante el Test
              </h4>
              <p className="text-sm text-muted-foreground">
                Mantén un ritmo constante y sostenible. No empieces demasiado
                rápido. Cuenta las vueltas o usa un dispositivo de seguimiento.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Interpretación
              </h4>
              <p className="text-sm text-muted-foreground">
                La distancia cubierta indica tu nivel aeróbico. Repite el test
                cada 4-6 semanas para ver tu progreso.
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Referencias de nivel:</strong> 1000m = Principiante, 1200m
              = Intermedio, 1400m = Avanzado, 1600m = Élite, 1800m =
              Profesional, 2000m+ = Nivel Mundial.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
