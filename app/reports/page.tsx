"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReports, sampleCharts, sampleTrainings } from "@/lib/contexts/reports-context";
import { 
  ClipboardListIcon, 
  Download, 
  Printer,
  Calendar,
  Clock,
  Target,
  Activity,
  BarChart3,
  FileText,
  X,
  Check,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function ReportsContent() {
  const {
    selectedCharts,
    selectedTrainings,
    reportTemplates,
    currentTemplate,
    addChart,
    removeChart,
    addTraining,
    removeTraining,
    createReport,
    exportToPDF,
    printReport,
    clearSelection
  } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");


  const filteredCharts = sampleCharts.filter(chart => 
    chart.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === "all" || chart.type === selectedType)
  );

  const filteredTrainings = sampleTrainings.filter(training => 
    training.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === "all" || training.type === selectedType)
  );

  const handleChartToggle = (chart: typeof sampleCharts[0]) => {
    if (selectedCharts.find(c => c.id === chart.id)) {
      removeChart(chart.id);
    } else {
      addChart(chart);
    }
  };

  const handleTrainingToggle = (training: typeof sampleTrainings[0]) => {
    if (selectedTrainings.find(t => t.id === training.id)) {
      removeTraining(training.id);
    } else {
      addTraining(training);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ClipboardListIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          <Badge variant="secondary" className="gap-1">
            <FileText className="h-3 w-3" />
            {selectedCharts.length + selectedTrainings.length} elementos
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Crea reportes personalizados con gráficos y entrenamientos
        </p>
      </div>

      {/* Plantillas de Reportes */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Plantillas de Reportes
          </CardTitle>
          <CardDescription>
            Selecciona una plantilla predefinida o crea tu propio reporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  currentTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => createReport(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    {currentTemplate?.id === template.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BarChart3 className="h-3 w-3" />
                    <span>{template.charts.length} gráficos</span>
                    {template.trainings && (
                      <>
                        <span>•</span>
                        <FileText className="h-3 w-3" />
                        <span>Entrenamientos</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de Selección */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="charts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="charts" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Gráficos ({selectedCharts.length})
              </TabsTrigger>
              <TabsTrigger value="trainings" className="gap-2">
                <FileText className="h-4 w-4" />
                Entrenamientos ({selectedTrainings.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab: Gráficos */}
            <TabsContent value="charts" className="space-y-4">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Seleccionar Gráficos
                  </CardTitle>
                  <CardDescription>
                    Elige los gráficos que quieres incluir en tu reporte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filtros */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar gráficos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="gap-2"
                      />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Tipo de gráfico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="volume">Volumen</SelectItem>
                        <SelectItem value="sessions">Sesiones</SelectItem>
                        <SelectItem value="progress">Progreso</SelectItem>
                        <SelectItem value="zones">Zonas</SelectItem>
                        <SelectItem value="performance">Rendimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de Gráficos */}
                  <div className="space-y-3">
                    {filteredCharts.map((chart) => (
                      <div 
                        key={chart.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedCharts.find(c => c.id === chart.id) 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-background/50'
                        }`}
                        onClick={() => handleChartToggle(chart)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              checked={selectedCharts.find(c => c.id === chart.id) !== undefined}
                              onChange={() => handleChartToggle(chart)}
                            />
                            <div>
                              <h3 className="font-medium">{chart.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {chart.description}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {chart.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Entrenamientos */}
            <TabsContent value="trainings" className="space-y-4">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Seleccionar Entrenamientos
                  </CardTitle>
                  <CardDescription>
                    Elige los entrenamientos que quieres incluir en tu reporte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filtros */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar entrenamientos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Tipo de entrenamiento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="Aeróbico">Aeróbico</SelectItem>
                        <SelectItem value="Técnica">Técnica</SelectItem>
                        <SelectItem value="Velocidad">Velocidad</SelectItem>
                        <SelectItem value="Umbral">Umbral</SelectItem>
                        <SelectItem value="Recuperación">Recuperación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de Entrenamientos */}
                  <div className="space-y-3">
                    {filteredTrainings.map((training) => (
                      <div 
                        key={training.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedTrainings.find(t => t.id === training.id) 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-background/50'
                        }`}
                        onClick={() => handleTrainingToggle(training)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              checked={selectedTrainings.find(t => t.id === training.id) !== undefined}
                              onChange={() => handleTrainingToggle(training)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{training.title}</h3>
                                <Badge variant="outline">{training.type}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(training.date), "dd/MM/yyyy", { locale: es })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{training.duration}min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span>{training.distance}m</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  <span>RPE {training.rpe}/10</span>
                                </div>
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
          </Tabs>
        </div>

        {/* Panel de Acciones */}
        <div className="lg:col-span-1 space-y-6">
          {/* Resumen del Reporte */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen del Reporte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gráficos seleccionados:</span>
                  <Badge variant="secondary">{selectedCharts.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Entrenamientos seleccionados:</span>
                  <Badge variant="secondary">{selectedTrainings.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Plantilla activa:</span>
                  <Badge variant={currentTemplate ? "default" : "outline"}>
                    {currentTemplate ? currentTemplate.name : "Personalizado"}
                  </Badge>
                </div>
              </div>

              {(selectedCharts.length > 0 || selectedTrainings.length > 0) && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Elementos incluidos:</h4>
                  <div className="space-y-2">
                    {selectedCharts.map((chart) => (
                      <div key={chart.id} className="flex items-center gap-2 text-sm">
                        <BarChart3 className="h-3 w-3 text-blue-500" />
                        <span>{chart.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChart(chart.id)}
                          className="h-6 w-6 p-0 ml-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {selectedTrainings.map((training) => (
                      <div key={training.id} className="flex items-center gap-2 text-sm">
                        <FileText className="h-3 w-3 text-green-500" />
                        <span>{training.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTraining(training.id)}
                          className="h-6 w-6 p-0 ml-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Acciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={exportToPDF} 
                className="w-full gap-2"
                disabled={selectedCharts.length === 0 && selectedTrainings.length === 0}
              >
                <Download className="h-4 w-4" />
                Exportar a PDF
              </Button>
              
              <Button 
                onClick={printReport} 
                variant="outline" 
                className="w-full gap-2"
                disabled={selectedCharts.length === 0 && selectedTrainings.length === 0}
              >
                <Printer className="h-4 w-4" />
                Imprimir Reporte
              </Button>
              
              <Button 
                onClick={clearSelection} 
                variant="outline" 
                className="w-full gap-2"
                disabled={selectedCharts.length === 0 && selectedTrainings.length === 0}
              >
                <X className="h-4 w-4" />
                Limpiar Selección
              </Button>
            </CardContent>
          </Card>

          {/* Consejos */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Consejos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Selecciona gráficos relevantes para tu análisis</p>
                <p>• Incluye entrenamientos del período que quieres analizar</p>
                <p>• Usa las plantillas predefinidas para reportes estándar</p>
                <p>• Personaliza tu reporte según tus necesidades</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <ReportsContent />
      </SidebarInset>
    </SidebarProvider>
  );
}