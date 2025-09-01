"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function VisitorsChart() {
  return (
    <Card className="col-span-4 bg-muted/50 border-muted">
      <CardHeader>
        <CardTitle>Progreso Semanal</CardTitle>
        <CardDescription>
          Distancia y tiempo por semana
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[200px] flex items-center justify-center text-muted-foreground border rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p>Gráfico de progreso semanal</p>
            <p className="text-sm">Evolución de distancia y tiempo por semana</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
