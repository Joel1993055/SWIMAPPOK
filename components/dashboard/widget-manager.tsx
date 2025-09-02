"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Settings, 
  X,
  BarChart3,
  Calendar,
  Target,
  Activity,
  TrendingUp,
  Clock,
  Users,
  Heart,
  Zap
} from "lucide-react";

// Tipos de widgets disponibles
export interface Widget {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: any;
  size: "small" | "medium" | "large" | "full";
  category: string;
}

// Widgets disponibles (solo los que realmente tenemos implementados)
export const availableWidgets: Widget[] = [
  {
    id: "kpi-cards",
    type: "kpi-cards",
    title: "KPIs Principales",
    description: "Métricas clave de rendimiento",
    icon: BarChart3,
    size: "full",
    category: "Métricas"
  },
  {
    id: "visitors-chart",
    type: "visitors-chart", 
    title: "Gráfico de Visitantes",
    description: "Progreso semanal de visitas",
    icon: TrendingUp,
    size: "medium",
    category: "Gráficos"
  },
  {
    id: "dashboard-calendar",
    type: "dashboard-calendar",
    title: "Calendario",
    description: "Vista del calendario con entrenamientos",
    icon: Calendar,
    size: "medium", 
    category: "Calendario"
  },
  {
    id: "swimming-charts",
    type: "swimming-charts",
    title: "Gráficos de Natación",
    description: "Análisis de entrenamientos de natación",
    icon: Activity,
    size: "full",
    category: "Gráficos"
  }
];

// Hook para gestionar widgets
export function useWidgetManager() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);

  // Cargar configuración guardada
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-widgets');
    if (saved) {
      const { active } = JSON.parse(saved);
      setActiveWidgets(active || []);
    } else {
      // Widgets por defecto
      setActiveWidgets(['kpi-cards', 'visitors-chart', 'dashboard-calendar', 'swimming-charts']);
    }
  }, []);

  // Guardar configuración
  const saveConfiguration = (active: string[]) => {
    localStorage.setItem('dashboard-widgets', JSON.stringify({ active }));
    setActiveWidgets(active);
  };

  // Agregar widget
  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      const newActive = [...activeWidgets, widgetId];
      saveConfiguration(newActive);
    }
  };

  // Remover widget
  const removeWidget = (widgetId: string) => {
    const newActive = activeWidgets.filter(id => id !== widgetId);
    saveConfiguration(newActive);
  };

  // Reordenar widgets
  const reorderWidgets = (newOrder: string[]) => {
    saveConfiguration(newOrder);
  };

  return {
    activeWidgets,
    addWidget,
    removeWidget,
    reorderWidgets
  };
}

// Componente para gestionar widgets
export function WidgetManager() {
  const { activeWidgets, addWidget, removeWidget } = useWidgetManager();
  const [isOpen, setIsOpen] = useState(false);

  const getWidgetById = (id: string) => availableWidgets.find(w => w.id === id);
  const getAvailableWidgets = () => availableWidgets.filter(w => !activeWidgets.includes(w.id));

  const handleAddWidget = (widgetId: string) => {
    addWidget(widgetId);
  };

  const handleRemoveWidget = (widgetId: string) => {
    removeWidget(widgetId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Personalizar Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Personalizar Dashboard
          </DialogTitle>
          <DialogDescription>
            Agrega, quita y reorganiza los widgets de tu dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Widgets Activos */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Widgets Activos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeWidgets.map(widgetId => {
                const widget = getWidgetById(widgetId);
                if (!widget) return null;
                
                const Icon = widget.icon;
                return (
                  <Card key={widgetId} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <CardTitle className="text-sm">{widget.title}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveWidget(widgetId)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs">
                        {widget.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {widget.size}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {widget.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Widgets Disponibles */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Widgets Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getAvailableWidgets().map(widget => {
                const Icon = widget.icon;
                return (
                  <Card key={widget.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardHeader 
                      className="pb-2"
                      onClick={() => handleAddWidget(widget.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <CardTitle className="text-sm">{widget.title}</CardTitle>
                        <Plus className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs">
                        {widget.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {widget.size}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {widget.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">💡 Consejos</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Haz clic en el botón "+" para agregar widgets</li>
              <li>• Usa el icono "X" para quitar widgets</li>
              <li>• <strong>Arrastra y suelta</strong> los widgets para reorganizarlos</li>
              <li>• Usa el icono de arrastrar (⋮⋮) que aparece al pasar el mouse</li>
              <li>• Tu configuración se guarda automáticamente</li>
              <li>• Los KPIs siempre aparecen en la primera fila</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
