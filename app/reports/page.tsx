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
import { TemplateManager } from "@/components/reports/template-manager";
import { TemplateEditor } from "@/components/reports/template-editor";
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
  Settings,
  Layout,
  Wrench
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function ReportsContent() {
  const {
    selectedCharts,
    selectedTrainings,
    addChart,
    removeChart,
    addTraining,
    removeTraining,
    clearSelection
  } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedTemplate] = useState<string>("default");

  // Filtrar datos
  const filteredCharts = sampleCharts.filter(chart => {
    const matchesSearch = chart.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || chart.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredTrainings = sampleTrainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por período basado en la fecha
    let matchesPeriod = true;
    if (selectedPeriod !== "all") {
      const trainingDate = new Date(training.date);
      const now = new Date();
      
      switch (selectedPeriod) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = trainingDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesPeriod = trainingDate >= monthAgo;
          break;
        case "quarter":
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          matchesPeriod = trainingDate >= quarterAgo;
          break;
      }
    }
    
    return matchesSearch && matchesPeriod;
  });

  const handleChartToggle = (chartId: string) => {
    const isSelected = selectedCharts.some(chart => chart.id === chartId);
    if (isSelected) {
      removeChart(chartId);
    } else {
      const chart = sampleCharts.find(c => c.id === chartId);
      if (chart) addChart(chart);
    }
  };

  const handleTrainingToggle = (trainingId: string) => {
    const isSelected = selectedTrainings.some(training => training.id === trainingId);
    if (isSelected) {
      removeTraining(trainingId);
    } else {
      const training = sampleTrainings.find(t => t.id === trainingId);
      if (training) addTraining(training);
    }
  };

  const exportToPDF = () => {
    console.log('Exportando a PDF:', { selectedCharts, selectedTrainings, selectedTemplate });
  };

  const printReport = () => {
    console.log('Imprimiendo reporte:', { selectedCharts, selectedTrainings, selectedTemplate });
  };



  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">
            Genera reportes personalizados de gráficos y entrenamientos
          </p>
        </div>
      </div>

      {/* Resumen de selección */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardListIcon className="h-5 w-5" />
            Resumen de Selección
          </CardTitle>
          <CardDescription>
            Elementos seleccionados para tu reporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {selectedCharts.map((chart) => (
              <Card key={chart.id} className="bg-background/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{chart.title}</h4>
                      <p className="text-sm text-muted-foreground">{chart.type}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeChart(chart.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {selectedTrainings.map((training) => (
              <Card key={training.id} className="bg-background/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{training.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(training.date), "dd MMM yyyy", { locale: es })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeTraining(training.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido Principal con Tabs */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="charts" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Gráficos ({selectedCharts.length})
          </TabsTrigger>
          <TabsTrigger value="trainings" className="gap-2">
            <FileText className="h-4 w-4" />
            Entrenamientos ({selectedTrainings.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <Layout className="h-4 w-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="editor" className="gap-2">
            <Wrench className="h-4 w-4" />
            Editor
          </TabsTrigger>
        </TabsList>

        {/* Tab: Gráficos */}
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de Selección de Gráficos */}
            <div className="lg:col-span-2">
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
                      />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Tipo de gráfico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="line">Línea</SelectItem>
                        <SelectItem value="bar">Barras</SelectItem>
                        <SelectItem value="area">Área</SelectItem>
                        <SelectItem value="pie">Circular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de gráficos */}
                  <div className="space-y-3">
                    {filteredCharts.map((chart) => {
                      const isSelected = selectedCharts.some(selected => selected.id === chart.id);
                      return (
                        <div
                          key={chart.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                          }`}
                          onClick={() => handleChartToggle(chart.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleChartToggle(chart.id)}
                              />
                              <div>
                                <h4 className="font-medium">{chart.title}</h4>
                                <p className="text-sm text-muted-foreground">{chart.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{chart.type}</Badge>
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className="space-y-4">
              {/* Panel de acciones */}
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
                    <p>• Usa plantillas predefinidas para reportes estándar</p>
                    <p>• Personaliza tu reporte según tus necesidades</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Entrenamientos */}
        <TabsContent value="trainings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de Selección de Entrenamientos */}
            <div className="lg:col-span-2">
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
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los períodos</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="month">Este mes</SelectItem>
                        <SelectItem value="quarter">Este trimestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de entrenamientos */}
                  <div className="space-y-3">
                    {filteredTrainings.map((training) => {
                      const isSelected = selectedTrainings.some(selected => selected.id === training.id);
                      return (
                        <div
                          key={training.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                          }`}
                          onClick={() => handleTrainingToggle(training.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleTrainingToggle(training.id)}
                              />
                              <div>
                                <h4 className="font-medium">{training.title}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(training.date), "dd MMM yyyy", { locale: es })}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {training.duration}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    {training.distance}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{training.type}</Badge>
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className="space-y-4">
              {/* Panel de acciones */}
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
                    <p>• Incluye entrenamientos del período que quieres analizar</p>
                    <p>• Usa plantillas predefinidas para reportes estándar</p>
                    <p>• Personaliza tu reporte según tus necesidades</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Plantillas */}
        <TabsContent value="templates" className="space-y-4">
          <TemplateManager />
        </TabsContent>

        {/* Tab: Editor */}
        <TabsContent value="editor" className="space-y-4">
          <TemplateEditor />
        </TabsContent>
      </Tabs>
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