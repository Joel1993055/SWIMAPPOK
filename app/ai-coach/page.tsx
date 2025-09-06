"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AICoach } from "@/components/ai-coach";
import { useAICoach } from "@/lib/contexts/ai-coach-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  TrendingUp, 
  Target, 
  Heart, 
  Lightbulb,
  Sparkles,
  Settings,
  BarChart3,
  Activity
} from "lucide-react";

function AICoachContent() {
  const { isEnabled, currentAnalysis, adviceHistory, toggleAICoach } = useAICoach();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Coach</h1>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {isEnabled ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Tu entrenador personal inteligente para optimizar tu rendimiento en natación
        </p>
      </div>

      {/* Controles principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel principal del AI Coach */}
        <div className="lg:col-span-2">
          <AICoach />
        </div>

        {/* Panel lateral con estadísticas */}
        <div className="lg:col-span-1 space-y-6">
          {/* Estadísticas del AI Coach */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estadísticas
              </CardTitle>
              <CardDescription>
                Tu progreso con el AI Coach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-primary">
                    {currentAnalysis ? currentAnalysis.overallScore : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Puntuación Promedio</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-primary">
                    {adviceHistory.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Consejos Seguidos</div>
                </div>
              </div>
              
              <div className="text-center p-3 border rounded-lg bg-background/50">
                <div className="text-2xl font-bold text-primary">
                  {currentAnalysis ? currentAnalysis.recommendations.length : 0}
                </div>
                <div className="text-xs text-muted-foreground">Recomendaciones Activas</div>
              </div>
            </CardContent>
          </Card>

          {/* Estado del AI Coach */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Coach</span>
                <Badge variant={isEnabled ? "default" : "secondary"}>
                  {isEnabled ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Análisis Automático</span>
                <Badge variant={isEnabled ? "default" : "secondary"}>
                  {isEnabled ? "Habilitado" : "Deshabilitado"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recomendaciones</span>
                <Badge variant={isEnabled ? "default" : "secondary"}>
                  {isEnabled ? "Activas" : "Pausadas"}
                </Badge>
              </div>

              <Button 
                onClick={toggleAICoach} 
                variant={isEnabled ? "outline" : "default"}
                className="w-full gap-2"
              >
                <Settings className="h-4 w-4" />
                {isEnabled ? "Desactivar AI Coach" : "Activar AI Coach"}
              </Button>
            </CardContent>
          </Card>

          {/* Consejos rápidos */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Consejos Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Entrenamiento</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Incluye siempre calentamiento, trabajo principal y vuelta a la calma
                </p>
              </div>
              
              <div className="p-3 border rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Recuperación</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Descansa adecuadamente entre entrenamientos intensos
                </p>
              </div>
              
              <div className="p-3 border rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Progreso</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Aumenta el volumen gradualmente para evitar lesiones
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AICoachPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <AICoachContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
