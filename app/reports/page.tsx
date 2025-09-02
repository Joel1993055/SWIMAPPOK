"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar as CalendarIcon,
  Filter,
  Search,
  Clock,
  Target,
  Activity,
  Trophy,
  MapPin,
  Users,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Datos de ejemplo de entrenamientos
const sampleTrainings = [
  {
    id: 1,
    date: "2025-01-15",
    type: "Aeróbico",
    duration: 45,
    distance: 2000,
    stroke: "Libre",
    rpe: 6,
    location: "Piscina Municipal",
    coach: "María García",
    notes: "Entrenamiento enfocado en resistencia aeróbica. Buena técnica en el estilo libre."
  },
  {
    id: 2,
    date: "2025-01-17",
    type: "Técnica",
    duration: 30,
    distance: 1500,
    stroke: "Espalda",
    rpe: 4,
    location: "Piscina Municipal",
    coach: "Carlos López",
    notes: "Trabajo específico en técnica de espalda. Mejoras notables en la rotación."
  },
  {
    id: 3,
    date: "2025-01-20",
    type: "Umbral",
    duration: 60,
    distance: 3000,
    stroke: "Libre",
    rpe: 8,
    location: "Piscina Municipal",
    coach: "María García",
    notes: "Sesión intensa de umbral. Mantenimiento de ritmo constante durante toda la sesión."
  },
  {
    id: 4,
    date: "2025-01-22",
    type: "Velocidad",
    duration: 25,
    distance: 1200,
    stroke: "Mariposa",
    rpe: 9,
    location: "Piscina Municipal",
    coach: "Carlos López",
    notes: "Trabajo de velocidad en mariposa. Series cortas e intensas."
  },
  {
    id: 5,
    date: "2025-01-24",
    type: "Recuperación",
    duration: 20,
    distance: 800,
    stroke: "Pecho",
    rpe: 3,
    location: "Piscina Municipal",
    coach: "María García",
    notes: "Sesión de recuperación activa. Enfoque en la relajación y técnica."
  }
];

function ReportsContent() {
  const [selectedTrainings, setSelectedTrainings] = useState<number[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [trainingType, setTrainingType] = useState<string>("all");
  const [stroke, setStroke] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const trainingTypes = ["all", "Aeróbico", "Técnica", "Umbral", "Velocidad", "Recuperación"];
  const strokes = ["all", "Libre", "Espalda", "Pecho", "Mariposa", "Estilos"];

  const filteredTrainings = sampleTrainings.filter(training => {
    const matchesDate = (!dateFrom || new Date(training.date) >= dateFrom) && 
                       (!dateTo || new Date(training.date) <= dateTo);
    const matchesType = trainingType === "all" || training.type === trainingType;
    const matchesStroke = stroke === "all" || training.stroke === stroke;
    const matchesSearch = searchTerm === "" || 
                         training.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesType && matchesStroke && matchesSearch;
  });

  const handleTrainingSelect = (trainingId: number) => {
    setSelectedTrainings(prev => 
      prev.includes(trainingId) 
        ? prev.filter(id => id !== trainingId)
        : [...prev, trainingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrainings.length === filteredTrainings.length) {
      setSelectedTrainings([]);
    } else {
      setSelectedTrainings(filteredTrainings.map(t => t.id));
    }
  };

  const handleExportPDF = () => {
    // Aquí implementarías la lógica de exportación a PDF
    console.log("Exportando a PDF:", selectedTrainings);
    alert(`Exportando ${selectedTrainings.length} entrenamientos a PDF`);
  };

  const handlePrint = () => {
    // Aquí implementarías la lógica de impresión
    console.log("Imprimiendo:", selectedTrainings);
    alert(`Imprimiendo ${selectedTrainings.length} entrenamientos`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
        </div>
        <p className="text-muted-foreground">
          Genera e imprime reportes de tus entrenamientos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de Filtros */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
              <CardDescription>
                Filtra los entrenamientos para tu reporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Búsqueda */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar en notas o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Rango de fechas */}
              <div className="space-y-4">
                <Label>Rango de fechas</Label>
                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: es }) : "Desde"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: es }) : "Hasta"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Tipo de entrenamiento */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de entrenamiento</Label>
                <Select value={trainingType} onValueChange={setTrainingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {trainingTypes.slice(1).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estilo de natación */}
              <div className="space-y-2">
                <Label htmlFor="stroke">Estilo</Label>
                <Select value={stroke} onValueChange={setStroke}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estilos</SelectItem>
                    {strokes.slice(1).map(strokeType => (
                      <SelectItem key={strokeType} value={strokeType}>{strokeType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Acciones */}
              <div className="space-y-2">
                <Button 
                  onClick={handleSelectAll} 
                  variant="outline" 
                  className="w-full"
                >
                  {selectedTrainings.length === filteredTrainings.length ? "Deseleccionar todo" : "Seleccionar todo"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleExportPDF} 
                    disabled={selectedTrainings.length === 0}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button 
                    onClick={handlePrint} 
                    disabled={selectedTrainings.length === 0}
                    variant="outline"
                    className="gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Entrenamientos */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Entrenamientos</CardTitle>
                  <CardDescription>
                    {filteredTrainings.length} entrenamientos encontrados
                    {selectedTrainings.length > 0 && ` • ${selectedTrainings.length} seleccionados`}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {selectedTrainings.length} seleccionados
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTrainings.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No se encontraron entrenamientos con los filtros seleccionados</p>
                  </div>
                ) : (
                  filteredTrainings.map((training) => (
                    <div
                      key={training.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedTrainings.includes(training.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleTrainingSelect(training.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {format(new Date(training.date), "dd/MM/yyyy", { locale: es })}
                              </span>
                            </div>
                            <Badge variant="outline">{training.type}</Badge>
                            <Badge variant="secondary">{training.stroke}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
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
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{training.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Users className="h-4 w-4" />
                            <span>Entrenador: {training.coach}</span>
                          </div>

                          {training.notes && (
                            <p className="text-sm text-muted-foreground">
                              {training.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedTrainings.includes(training.id)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          }`}>
                            {selectedTrainings.includes(training.id) && (
                              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
