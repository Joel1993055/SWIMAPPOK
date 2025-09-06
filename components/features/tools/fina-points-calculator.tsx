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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Trophy, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FinaResult {
  points: number;
  relativeSpeed: number;
  category: string;
  color: string;
}

export function FinaPointsCalculator() {
  const [distance, setDistance] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [stroke, setStroke] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [poolType, setPoolType] = useState<string>("");
  const [result, setResult] = useState<FinaResult | null>(null);

  // Tabla de puntos FINA completa con género, piscina y todos los estilos
  const finaPointsTable = {
    hombre: {
      "25m": {
        libre: {
          "50": {
            "00:20.24": 1000,
            "00:21.50": 950,
            "00:22.80": 900,
            "00:24.10": 850,
            "00:25.40": 800,
          },
          "100": {
            "00:44.94": 1000,
            "00:47.20": 950,
            "00:49.50": 900,
            "00:51.80": 850,
            "00:54.10": 800,
          },
          "200": {
            "01:40.14": 1000,
            "01:45.20": 950,
            "01:50.30": 900,
            "01:55.40": 850,
            "02:00.50": 800,
          },
          "400": {
            "03:32.25": 1000,
            "03:40.00": 950,
            "03:47.80": 900,
            "03:55.60": 850,
            "04:03.40": 800,
          },
          "800": {
            "07:23.42": 1000,
            "07:40.00": 950,
            "07:56.60": 900,
            "08:13.20": 850,
            "08:29.80": 800,
          },
          "1500": {
            "14:06.88": 1000,
            "14:30.00": 950,
            "14:53.20": 900,
            "15:16.40": 850,
            "15:39.60": 800,
          },
        },
        espalda: {
          "50": {
            "00:22.22": 1000,
            "00:23.50": 950,
            "00:24.80": 900,
            "00:26.10": 850,
            "00:27.40": 800,
          },
          "100": {
            "00:48.33": 1000,
            "00:50.60": 950,
            "00:52.90": 900,
            "00:55.20": 850,
            "00:57.50": 800,
          },
          "200": {
            "01:48.24": 1000,
            "01:53.30": 950,
            "01:58.40": 900,
            "02:03.50": 850,
            "02:08.60": 800,
          },
        },
        braza: {
          "50": {
            "00:25.95": 1000,
            "00:27.20": 950,
            "00:28.50": 900,
            "00:29.80": 850,
            "00:31.10": 800,
          },
          "100": {
            "00:55.41": 1000,
            "00:57.70": 950,
            "01:00.00": 900,
            "01:02.30": 850,
            "01:04.60": 800,
          },
          "200": {
            "02:00.16": 1000,
            "02:05.20": 950,
            "02:10.30": 900,
            "02:15.40": 850,
            "02:20.50": 800,
          },
        },
        mariposa: {
          "50": {
            "00:21.75": 1000,
            "00:23.00": 950,
            "00:24.30": 900,
            "00:25.60": 850,
            "00:26.90": 800,
          },
          "100": {
            "00:48.08": 1000,
            "00:50.30": 950,
            "00:52.60": 900,
            "00:54.90": 850,
            "00:57.20": 800,
          },
          "200": {
            "01:48.24": 1000,
            "01:53.30": 950,
            "01:58.40": 900,
            "02:03.50": 850,
            "02:08.60": 800,
          },
        },
        combinado: {
          "100": {
            "00:50.26": 1000,
            "00:52.50": 950,
            "00:54.80": 900,
            "00:57.10": 850,
            "00:59.40": 800,
          },
          "200": {
            "01:51.55": 1000,
            "01:56.60": 950,
            "02:01.70": 900,
            "02:06.80": 850,
            "02:11.90": 800,
          },
          "400": {
            "03:58.11": 1000,
            "04:05.80": 950,
            "04:13.50": 900,
            "04:21.20": 850,
            "04:28.90": 800,
          },
        },
      },
      "50m": {
        libre: {
          "50": {
            "00:20.91": 1000,
            "00:22.20": 950,
            "00:23.50": 900,
            "00:24.80": 850,
            "00:26.10": 800,
          },
          "100": {
            "00:46.86": 1000,
            "00:49.10": 950,
            "00:51.40": 900,
            "00:53.70": 850,
            "00:56.00": 800,
          },
          "200": {
            "01:42.96": 1000,
            "01:48.00": 950,
            "01:53.10": 900,
            "01:58.20": 850,
            "02:03.30": 800,
          },
          "400": {
            "03:40.07": 1000,
            "03:47.80": 950,
            "03:55.60": 900,
            "04:03.40": 850,
            "04:11.20": 800,
          },
          "800": {
            "07:32.12": 1000,
            "07:48.70": 950,
            "08:05.30": 900,
            "08:21.90": 850,
            "08:38.50": 800,
          },
          "1500": {
            "14:31.02": 1000,
            "14:54.20": 950,
            "15:17.40": 900,
            "15:40.60": 850,
            "16:03.80": 800,
          },
        },
        espalda: {
          "50": {
            "00:23.71": 1000,
            "00:25.00": 950,
            "00:26.30": 900,
            "00:27.60": 850,
            "00:28.90": 800,
          },
          "100": {
            "00:51.85": 1000,
            "00:54.10": 950,
            "00:56.40": 900,
            "00:58.70": 850,
            "01:01.00": 800,
          },
          "200": {
            "01:53.17": 1000,
            "01:58.20": 950,
            "02:03.30": 900,
            "02:08.40": 850,
            "02:13.50": 800,
          },
        },
        braza: {
          "50": {
            "00:26.67": 1000,
            "00:27.90": 950,
            "00:29.20": 900,
            "00:30.50": 850,
            "00:31.80": 800,
          },
          "100": {
            "00:57.13": 1000,
            "00:59.40": 950,
            "01:01.70": 900,
            "01:04.00": 850,
            "01:06.30": 800,
          },
          "200": {
            "02:05.48": 1000,
            "02:10.50": 950,
            "02:15.60": 900,
            "02:20.70": 850,
            "02:25.80": 800,
          },
        },
        mariposa: {
          "50": {
            "00:22.27": 1000,
            "00:23.50": 950,
            "00:24.80": 900,
            "00:26.10": 850,
            "00:27.40": 800,
          },
          "100": {
            "00:49.45": 1000,
            "00:51.70": 950,
            "00:54.00": 900,
            "00:56.30": 850,
            "00:58.60": 800,
          },
          "200": {
            "01:51.51": 1000,
            "01:56.60": 950,
            "02:01.70": 900,
            "02:06.80": 850,
            "02:11.90": 800,
          },
        },
        combinado: {
          "200": {
            "01:54.00": 1000,
            "01:59.10": 950,
            "02:04.20": 900,
            "02:09.30": 850,
            "02:14.40": 800,
          },
          "400": {
            "04:02.50": 1000,
            "04:10.20": 950,
            "04:17.90": 900,
            "04:25.60": 850,
            "04:33.30": 800,
          },
        },
      },
    },
    mujer: {
      "25m": {
        libre: {
          "50": {
            "00:22.93": 1000,
            "00:24.20": 950,
            "00:25.50": 900,
            "00:26.80": 850,
            "00:28.10": 800,
          },
          "100": {
            "00:50.25": 1000,
            "00:52.50": 950,
            "00:54.80": 900,
            "00:57.10": 850,
            "00:59.40": 800,
          },
          "200": {
            "01:50.43": 1000,
            "01:55.50": 950,
            "02:00.60": 900,
            "02:05.70": 850,
            "02:10.80": 800,
          },
          "400": {
            "03:51.30": 1000,
            "03:59.00": 950,
            "04:06.80": 900,
            "04:14.60": 850,
            "04:22.40": 800,
          },
          "800": {
            "07:59.34": 1000,
            "08:16.00": 950,
            "08:32.60": 900,
            "08:49.20": 850,
            "09:05.80": 800,
          },
          "1500": {
            "15:20.48": 1000,
            "15:43.60": 950,
            "16:06.80": 900,
            "16:30.00": 850,
            "16:53.20": 800,
          },
        },
        espalda: {
          "50": {
            "00:25.10": 1000,
            "00:26.40": 950,
            "00:27.70": 900,
            "00:29.00": 850,
            "00:30.30": 800,
          },
          "100": {
            "00:52.08": 1000,
            "00:54.40": 950,
            "00:56.70": 900,
            "00:59.00": 850,
            "01:01.30": 800,
          },
          "200": {
            "01:58.94": 1000,
            "02:04.00": 950,
            "02:09.10": 900,
            "02:14.20": 850,
            "02:19.30": 800,
          },
        },
        braza: {
          "50": {
            "00:28.37": 1000,
            "00:29.60": 950,
            "00:30.90": 900,
            "00:32.20": 850,
            "00:33.50": 800,
          },
          "100": {
            "01:02.36": 1000,
            "01:04.70": 950,
            "01:07.00": 900,
            "01:09.30": 850,
            "01:11.60": 800,
          },
          "200": {
            "02:14.26": 1000,
            "02:19.30": 950,
            "02:24.40": 900,
            "02:29.50": 850,
            "02:34.60": 800,
          },
        },
        mariposa: {
          "50": {
            "00:24.38": 1000,
            "00:25.60": 950,
            "00:26.90": 900,
            "00:28.20": 850,
            "00:29.50": 800,
          },
          "100": {
            "00:52.80": 1000,
            "00:55.10": 950,
            "00:57.40": 900,
            "00:59.70": 850,
            "01:02.00": 800,
          },
          "200": {
            "01:58.73": 1000,
            "02:03.80": 950,
            "02:08.90": 900,
            "02:14.00": 850,
            "02:19.10": 800,
          },
        },
        combinado: {
          "100": {
            "00:56.51": 1000,
            "00:58.80": 950,
            "01:01.10": 900,
            "01:03.40": 850,
            "01:05.70": 800,
          },
          "200": {
            "02:01.86": 1000,
            "02:06.90": 950,
            "02:12.00": 900,
            "02:17.10": 850,
            "02:22.20": 800,
          },
          "400": {
            "04:18.94": 1000,
            "04:26.60": 950,
            "04:34.30": 900,
            "04:42.00": 850,
            "04:49.70": 800,
          },
        },
      },
      "50m": {
        libre: {
          "50": {
            "00:23.67": 1000,
            "00:24.90": 950,
            "00:26.20": 900,
            "00:27.50": 850,
            "00:28.80": 800,
          },
          "100": {
            "00:51.71": 1000,
            "00:54.00": 950,
            "00:56.30": 900,
            "00:58.60": 850,
            "01:00.90": 800,
          },
          "200": {
            "01:52.98": 1000,
            "01:58.00": 950,
            "02:03.10": 900,
            "02:08.20": 850,
            "02:13.30": 800,
          },
          "400": {
            "03:56.08": 1000,
            "04:03.80": 950,
            "04:11.60": 900,
            "04:19.40": 850,
            "04:27.20": 800,
          },
          "800": {
            "08:04.79": 1000,
            "08:21.40": 950,
            "08:38.00": 900,
            "08:54.60": 850,
            "09:11.20": 800,
          },
          "1500": {
            "15:25.48": 1000,
            "15:48.60": 950,
            "16:11.80": 900,
            "16:35.00": 850,
            "16:58.20": 800,
          },
        },
        espalda: {
          "50": {
            "00:26.06": 1000,
            "00:27.30": 950,
            "00:28.60": 900,
            "00:29.90": 850,
            "00:31.20": 800,
          },
          "100": {
            "00:55.48": 1000,
            "00:57.80": 950,
            "01:00.10": 900,
            "01:02.40": 850,
            "01:04.70": 800,
          },
          "200": {
            "02:01.98": 1000,
            "02:07.00": 950,
            "02:12.10": 900,
            "02:17.20": 850,
            "02:22.30": 800,
          },
        },
        braza: {
          "50": {
            "00:29.30": 1000,
            "00:30.60": 950,
            "00:31.90": 900,
            "00:33.20": 850,
            "00:34.50": 800,
          },
          "100": {
            "01:04.13": 1000,
            "01:06.40": 950,
            "01:08.70": 900,
            "01:11.00": 850,
            "01:13.30": 800,
          },
          "200": {
            "02:17.55": 1000,
            "02:22.60": 950,
            "02:27.70": 900,
            "02:32.80": 850,
            "02:37.90": 800,
          },
        },
        mariposa: {
          "50": {
            "00:24.43": 1000,
            "00:25.70": 950,
            "00:27.00": 900,
            "00:28.30": 850,
            "00:29.60": 800,
          },
          "100": {
            "00:55.48": 1000,
            "00:57.80": 950,
            "01:00.10": 900,
            "01:02.40": 850,
            "01:04.70": 800,
          },
          "200": {
            "02:01.81": 1000,
            "02:06.90": 950,
            "02:12.00": 900,
            "02:17.10": 850,
            "02:22.20": 800,
          },
        },
        combinado: {
          "200": {
            "02:06.12": 1000,
            "02:11.20": 950,
            "02:16.30": 900,
            "02:21.40": 850,
            "02:26.50": 800,
          },
          "400": {
            "04:26.36": 1000,
            "04:34.00": 950,
            "04:41.70": 900,
            "04:49.40": 850,
            "04:57.10": 800,
          },
        },
      },
    },
  };

  const calculateFinaPoints = () => {
    if (!distance || !time || !stroke || !gender || !poolType) {
      return;
    }

    const genderData = finaPointsTable[gender as keyof typeof finaPointsTable];
    if (!genderData) return;

    const poolData = genderData[poolType as keyof typeof genderData];
    if (!poolData) return;

    const strokeData = poolData[stroke as keyof typeof poolData];
    if (!strokeData) return;

    const distanceData = strokeData[distance as keyof typeof strokeData];
    if (!distanceData) return;

    // Convertir tiempo a segundos para comparación
    const timeParts = time.split(":");
    const timeInSeconds =
      parseInt(timeParts[0]) * 60 + parseFloat(timeParts[1]);

    // Buscar el tiempo más cercano en la tabla
    let closestPoints = 0;
    let minDifference = Infinity;

    for (const [tableTime, points] of Object.entries(distanceData)) {
      const tableTimeParts = tableTime.split(":");
      const tableTimeInSeconds =
        parseInt(tableTimeParts[0]) * 60 + parseFloat(tableTimeParts[1]);
      const difference = Math.abs(timeInSeconds - tableTimeInSeconds);

      if (difference < minDifference) {
        minDifference = difference;
        closestPoints = points;
      }
    }

    // Calcular velocidad relativa (aproximada)
    const relativeSpeed = (closestPoints / 1000) * 100;

    // Determinar categoría
    let category = "";
    let color = "";
    if (closestPoints >= 950) {
      category = "Excelente";
      color = "bg-green-500";
    } else if (closestPoints >= 850) {
      category = "Muy Bueno";
      color = "bg-blue-500";
    } else if (closestPoints >= 750) {
      category = "Bueno";
      color = "bg-yellow-500";
    } else if (closestPoints >= 650) {
      category = "Regular";
      color = "bg-orange-500";
    } else {
      category = "Necesita Mejora";
      color = "bg-red-500";
    }

    setResult({
      points: closestPoints,
      relativeSpeed: Math.round(relativeSpeed),
      category,
      color,
    });
  };

  const resetCalculator = () => {
    setDistance("");
    setTime("");
    setStroke("");
    setGender("");
    setPoolType("");
    setResult(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Calculadora */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculador de Puntos FINA
          </CardTitle>
          <CardDescription>
            Calcula tu puntuación FINA basada en tu tiempo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hombre">Hombre</SelectItem>
                  <SelectItem value="mujer">Mujer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poolType">Tipo de Piscina</Label>
              <Select value={poolType} onValueChange={setPoolType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar piscina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25m">25 metros</SelectItem>
                  <SelectItem value="50m">50 metros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stroke">Estilo</Label>
              <Select value={stroke} onValueChange={setStroke}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estilo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="libre">Libre</SelectItem>
                  <SelectItem value="espalda">Espalda</SelectItem>
                  <SelectItem value="braza">Braza</SelectItem>
                  <SelectItem value="mariposa">Mariposa</SelectItem>
                  <SelectItem value="combinado">Combinado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distancia (m)</Label>
              <Select value={distance} onValueChange={setDistance}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar distancia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50m</SelectItem>
                  <SelectItem value="100">100m</SelectItem>
                  <SelectItem value="200">200m</SelectItem>
                  <SelectItem value="400">400m</SelectItem>
                  <SelectItem value="800">800m</SelectItem>
                  <SelectItem value="1500">1500m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Tiempo (mm:ss.ss)</Label>
            <Input
              id="time"
              type="text"
              placeholder="Ej: 01:45.30"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateFinaPoints} className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
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
            <Trophy className="h-5 w-5" />
            Resultados
          </CardTitle>
          <CardDescription>
            Tu puntuación FINA y velocidad relativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.points}
                </div>
                <p className="text-sm text-muted-foreground">Puntos FINA</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {result.relativeSpeed}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Velocidad Relativa
                  </p>
                </div>

                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Badge className={`${result.color} text-white`}>
                    {result.category}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Categoría
                  </p>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Interpretación:</strong> Los puntos FINA te permiten
                  comparar tu rendimiento con nadadores de diferentes géneros,
                  edades y categorías. Una puntuación de 1000 puntos representa
                  el récord mundial. Los cálculos se basan en los récords
                  oficiales FINA para piscinas de 25m y 50m.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ingresa los datos para calcular tu puntuación FINA</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
