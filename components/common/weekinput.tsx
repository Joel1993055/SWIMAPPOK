"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WeekInput() {
  const [week, setWeek] = React.useState("1");
  const [kilometers, setKilometers] = React.useState("");
  const [trainingType, setTrainingType] = React.useState("general");

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏃‍♂️ Plan de Kilómetros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selección de Semana */}
        <div className="space-y-2">
          <Label htmlFor="week">Selecciona la semana</Label>
          <Select value={week} onValueChange={setWeek}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semana" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 52 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Semana {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Entrenamiento */}
        <div className="space-y-2">
          <Label htmlFor="trainingType">Tipo de entrenamiento</Label>
          <Select value={trainingType} onValueChange={setTrainingType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="especifico">Específico</SelectItem>
              <SelectItem value="competitivo">Competitivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Entrada de Kilómetros */}
        <div className="space-y-2">
          <Label htmlFor="kilometers">Kilómetros</Label>
          <Input
            id="kilometers"
            type="number"
            min="0"
            placeholder="Introduce los kilómetros"
            value={kilometers}
            onChange={e => setKilometers(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
