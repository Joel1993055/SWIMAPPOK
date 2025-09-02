"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Target, 
  Activity, 
  MapPin,
  User,
  Printer,
  Filter,
  Search
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Datos de ejemplo de entrenamientos
const sampleTrainings = [
  {
    id: 1,
    date: "2025-01-15",
    time: "07:00",
    type: "Aeróbico",
    distance: 2000,
    duration: 45,
    stroke: "Libre",
    rpe: 6,
    location: "Piscina Municipal",
    coach: "María González",
    notes: "Entrenamiento de resistencia aeróbica. Buena técnica en el estilo libre."
  },
  {
    id: 2,
    date: "2025-01-15",
    time: "19:30",
    type: "Técnica",
    distance: 1500,
    duration: 30,
    stroke: "Espalda",
    rpe: 4,
    location: "Piscina Municipal",
    coach: "Carlos Ruiz",
    notes: "Trabajo específico de técnica en espalda. Mejora en la rotación del cuerpo."
  },
  {
    id: 3,
    date: "2025-01-16",
    time: "08:00",
    type: "Umbral",
    distance: 3000,
    duration: 60,
    stroke: "Libre",
    rpe: 8,
    location: "Centro Deportivo",
    coach: "Ana Martín",
    notes: "Sesión de umbral láctico. Series de 400m con descanso activo."
  },
  {
    id: 4,
    date: "2025-01-17",
    time: "07:30",
    type: "Velocidad",
    distance: 1200,
    duration: 25,
    stroke: "Mariposa",
    rpe: 9,
    location: "Piscina Municipal",
    coach: "María González",
    notes: "Trabajo de velocidad en mariposa. Series cortas de alta intensidad."
  },
  {
    id: 5,
    date: "2025-01-18",
    time: "18:00",
    type: "Recuperación",
    distance: 800,
    duration: 20,
    stroke: "Pecho",
    rpe: 3,
    location: "Centro Deportivo",
    coach: "Carlos Ruiz",
    notes: "Sesión de recuperación activa. Enfoque en la técnica de pecho."
  }
];

export default function ReportsPage() {
  const [selectedTrainings, setSelectedTrainings] = useState<number[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTrainings = sampleTrainings.filter(training => {
    const matchesType = filterType === "all" || training.type === filterType;
    const matchesDate = !filterDate || training.date === filterDate;
    const matchesSearch = !searchTerm || 
      training.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.stroke.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesDate && matchesSearch;
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

  const generatePDF = async () => {
    if (selectedTrainings.length === 0) {
      alert("Por favor selecciona al menos un entrenamiento para exportar");
      return;
    }

    const selectedTrainingData = sampleTrainings.filter(t => selectedTrainings.includes(t.id));
    
    // Crear el contenido del PDF
    const pdf = new jsPDF();
    
    // Configuración del PDF
    pdf.setFontSize(20);
    pdf.text('Reporte de Entrenamientos', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 45);
    pdf.text(`Total de entrenamientos: ${selectedTrainingData.length}`, 20, 55);
    
    let yPosition = 75;
    
    selectedTrainingData.forEach((training, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Título del entrenamiento
      pdf.setFontSize(14);
      pdf.text(`Entrenamiento ${index + 1}`, 20, yPosition);
      yPosition += 10;
      
      // Detalles del entrenamiento
      pdf.setFontSize(10);
      pdf.text(`Fecha: ${training.date}`, 20, yPosition);
      pdf.text(`Hora: ${training.time}`, 100, yPosition);
      yPosition += 8;
      
      pdf.text(`Tipo: ${training.type}`, 20, yPosition);
      pdf.text(`Estilo: ${training.stroke}`, 100, yPosition);
      yPosition += 8;
      
      pdf.text(`Distancia: ${training.distance}m`, 20, yPosition);
      pdf.text(`Duración: ${training.duration}min`, 100, yPosition);
      yPosition += 8;
      
      pdf.text(`RPE: ${training.rpe}/10`, 20, yPosition);
      pdf.text(`Ubicación: ${training.location}`, 100, yPosition);
      yPosition += 8;
      
      pdf.text(`Entrenador: ${training.coach}`, 20, yPosition);
      yPosition += 8;
      
      if (training.notes) {
        pdf.text(`Notas: ${training.notes}`, 20, yPosition);
        yPosition += 8;
      }
      
      yPosition += 10;
    });
    
    // Guardar el PDF
    pdf.save(`reporte-entrenamientos-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printReport = () => {
    if (selectedTrainings.length === 0) {
      alert("Por favor selecciona al menos un entrenamiento para imprimir");
      return;
    }
    
    const printContent = document.getElementById('print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Reporte de Entrenamientos</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .training { margin-bottom: 30px; border: 1px solid #ccc; padding: 15px; }
              .training h3 { margin-top: 0; }
              .training-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              .notes { margin-top: 10px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          </div>
          <p className="text-muted-foreground">
            Exporta e imprime tus entrenamientos en formato PDF
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filtros y Selección */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
                <CardDescription>
                  Filtra y selecciona los entrenamientos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Búsqueda */}
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Buscar entrenamientos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtro por tipo */}
                <div className="space-y-2">
                  <Label htmlFor="type-filter">Tipo de entrenamiento</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Aeróbico">Aeróbico</SelectItem>
                      <SelectItem value="Técnica">Técnica</SelectItem>
                      <SelectItem value="Umbral">Umbral</SelectItem>
                      <SelectItem value="Velocidad">Velocidad</SelectItem>
                      <SelectItem value="Recuperación">Recuperación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por fecha */}
                <div className="space-y-2">
                  <Label htmlFor="date-filter">Fecha</Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>

                <Separator />

                {/* Selección */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Selección</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedTrainings.length === filteredTrainings.length ? "Deseleccionar" : "Seleccionar"} todos
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {selectedTrainings.length} de {filteredTrainings.length} entrenamientos seleccionados
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Exportar</CardTitle>
                <CardDescription>
                  Genera reportes en PDF o imprime
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={generatePDF} 
                  className="w-full gap-2"
                  disabled={selectedTrainings.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={printReport}
                  className="w-full gap-2"
                  disabled={selectedTrainings.length === 0}
                >
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Entrenamientos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrenamientos Disponibles</CardTitle>
                <CardDescription>
                  Selecciona los entrenamientos que deseas incluir en el reporte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTrainings.map((training) => (
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
                            <input
                              type="checkbox"
                              checked={selectedTrainings.includes(training.id)}
                              onChange={() => handleTrainingSelect(training.id)}
                              className="rounded"
                            />
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{training.type}</Badge>
                              <Badge variant="outline">{training.stroke}</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{training.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{training.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span>{training.distance}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-muted-foreground" />
                              <span>{training.duration}min</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{training.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{training.coach}</span>
                            </div>
                            <div>
                              RPE: {training.rpe}/10
                            </div>
                          </div>
                          
                          {training.notes && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <strong>Notas:</strong> {training.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredTrainings.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No se encontraron entrenamientos con los filtros aplicados
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contenido para impresión (oculto) */}
        <div id="print-content" className="hidden">
          <div className="header">
            <h1>Reporte de Entrenamientos</h1>
            <p>Fecha de generación: {new Date().toLocaleDateString('es-ES')}</p>
            <p>Total de entrenamientos: {selectedTrainings.length}</p>
          </div>
          
          {selectedTrainings.map((trainingId, index) => {
            const training = sampleTrainings.find(t => t.id === trainingId);
            if (!training) return null;
            
            return (
              <div key={trainingId} className="training">
                <h3>Entrenamiento {index + 1}</h3>
                <div className="training-details">
                  <div>
                    <p><strong>Fecha:</strong> {training.date}</p>
                    <p><strong>Hora:</strong> {training.time}</p>
                    <p><strong>Tipo:</strong> {training.type}</p>
                    <p><strong>Estilo:</strong> {training.stroke}</p>
                  </div>
                  <div>
                    <p><strong>Distancia:</strong> {training.distance}m</p>
                    <p><strong>Duración:</strong> {training.duration}min</p>
                    <p><strong>RPE:</strong> {training.rpe}/10</p>
                    <p><strong>Ubicación:</strong> {training.location}</p>
                  </div>
                </div>
                <p><strong>Entrenador:</strong> {training.coach}</p>
                {training.notes && (
                  <div className="notes">
                    <p><strong>Notas:</strong> {training.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
