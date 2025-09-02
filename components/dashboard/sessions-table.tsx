"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getSeedData } from "@/lib/seed";
import { 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  Calendar as CalendarIcon, 
  Activity, 
  Filter, 
  Download, 
  SortAsc, 
  SortDesc,
  X,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Tipos de datos para las sesiones
interface Session {
  id: string;
  date: string;
  swimmer: string;
  distance: number;
  durationMin: number;
  stroke: "freestyle" | "backstroke" | "breaststroke" | "butterfly" | "mixed";
  sessionType: "aerobic" | "threshold" | "speed" | "technique" | "recovery";
  RPE: number;
  mainSet: string;
  notes?: string;
}

// Opciones para filtros
const STROKE_OPTIONS = [
  { value: "freestyle", label: "Libre" },
  { value: "backstroke", label: "Espalda" },
  { value: "breaststroke", label: "Pecho" },
  { value: "butterfly", label: "Mariposa" },
  { value: "mixed", label: "Mixto" }
];

const SESSION_TYPE_OPTIONS = [
  { value: "aerobic", label: "Aeróbico" },
  { value: "threshold", label: "Umbral" },
  { value: "speed", label: "Velocidad" },
  { value: "technique", label: "Técnica" },
  { value: "recovery", label: "Recuperación" }
];

const RPE_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const SORT_OPTIONS = [
  { value: "date-desc", label: "Fecha (más reciente)" },
  { value: "date-asc", label: "Fecha (más antigua)" },
  { value: "distance-desc", label: "Distancia (mayor)" },
  { value: "distance-asc", label: "Distancia (menor)" },
  { value: "duration-desc", label: "Duración (mayor)" },
  { value: "duration-asc", label: "Duración (menor)" },
  { value: "rpe-desc", label: "RPE (mayor)" },
  { value: "rpe-asc", label: "RPE (menor)" }
];

// Función para formatear fechas
function formatDate(dateString: string, formatStr: string = 'dd/MM/yyyy'): string {
  const date = new Date(dateString);
  if (formatStr === 'dd/MM/yyyy') {
    return date.toLocaleDateString('es-ES');
  }
  return format(date, formatStr, { locale: es });
}

export function SessionsTable() {
  // Obtener datos de sesiones desde el seed
  const seedSessions = getSeedData();
  
  // Convertir datos del seed al formato de Session
  const sessions: Session[] = seedSessions.map((session, index) => ({
    id: `session-${index + 1}`,
    date: session.date,
    swimmer: session.swimmer,
    distance: session.distance,
    durationMin: session.durationMin,
    stroke: session.stroke as Session["stroke"],
    sessionType: session.sessionType as Session["sessionType"],
    RPE: session.RPE,
    mainSet: session.mainSet,
    notes: session.notes
  }));

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date-desc");
  
  // Estados para filtros
  const [selectedStrokes, setSelectedStrokes] = useState<string[]>([]);
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>([]);
  const [selectedRPEs, setSelectedRPEs] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [distanceRange, setDistanceRange] = useState<{ min?: number; max?: number }>({});
  
  // Estados para diálogos
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Función para filtrar y ordenar sesiones
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions.filter(session => {
      // Búsqueda por texto
      const matchesSearch = !searchTerm || 
        session.swimmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.stroke.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.sessionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.mainSet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.notes && session.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtros por estilo
      const matchesStroke = selectedStrokes.length === 0 || selectedStrokes.includes(session.stroke);

      // Filtros por tipo de sesión
      const matchesSessionType = selectedSessionTypes.length === 0 || selectedSessionTypes.includes(session.sessionType);

      // Filtros por RPE
      const matchesRPE = selectedRPEs.length === 0 || selectedRPEs.includes(session.RPE);

      // Filtros por fecha
      const sessionDate = new Date(session.date);
      const matchesDate = (!dateRange.from || sessionDate >= dateRange.from) && 
                         (!dateRange.to || sessionDate <= dateRange.to);

      // Filtros por distancia
      const matchesDistance = (!distanceRange.min || session.distance >= distanceRange.min) &&
                             (!distanceRange.max || session.distance <= distanceRange.max);

      return matchesSearch && matchesStroke && matchesSessionType && matchesRPE && matchesDate && matchesDistance;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      const [field, direction] = sortBy.split('-');
      const isAsc = direction === 'asc';
      
      switch (field) {
        case 'date':
          return isAsc ? 
            new Date(a.date).getTime() - new Date(b.date).getTime() :
            new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'distance':
          return isAsc ? a.distance - b.distance : b.distance - a.distance;
        case 'duration':
          return isAsc ? a.durationMin - b.durationMin : b.durationMin - a.durationMin;
        case 'rpe':
          return isAsc ? a.RPE - b.RPE : b.RPE - a.RPE;
        default:
          return 0;
      }
    });

    return filtered;
  }, [sessions, searchTerm, selectedStrokes, selectedSessionTypes, selectedRPEs, dateRange, distanceRange, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredAndSortedSessions.slice(startIndex, startIndex + itemsPerPage);

  // Funciones para manejar filtros
  const toggleStrokeFilter = (stroke: string) => {
    setSelectedStrokes(prev => 
      prev.includes(stroke) 
        ? prev.filter(s => s !== stroke)
        : [...prev, stroke]
    );
    setCurrentPage(1);
  };

  const toggleSessionTypeFilter = (type: string) => {
    setSelectedSessionTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleRPEFilter = (rpe: number) => {
    setSelectedRPEs(prev => 
      prev.includes(rpe) 
        ? prev.filter(r => r !== rpe)
        : [...prev, rpe]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedStrokes([]);
    setSelectedSessionTypes([]);
    setSelectedRPEs([]);
    setDateRange({});
    setDistanceRange({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedStrokes.length > 0 || 
                          selectedSessionTypes.length > 0 || 
                          selectedRPEs.length > 0 || 
                          dateRange.from || 
                          dateRange.to || 
                          distanceRange.min || 
                          distanceRange.max;

  // Funciones para manejar sesiones
  const handleEdit = (session: Session) => {
    setEditingSession({ ...session });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (session: Session) => {
    setSessionToDelete(session);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    console.log("Actualizando sesión:", editingSession);
    setIsEditDialogOpen(false);
    setEditingSession(null);
  };

  const handleDeleteConfirm = () => {
    if (!sessionToDelete) return;
    console.log("Eliminando sesión:", sessionToDelete);
    setIsDeleteDialogOpen(false);
    setSessionToDelete(null);
    
    if (paginatedSessions.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Nadador', 'Distancia (m)', 'Duración (min)', 'Estilo', 'Tipo', 'RPE', 'Serie Principal', 'Notas'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedSessions.map(session => [
        formatDate(session.date),
        session.swimmer,
        session.distance,
        session.durationMin,
        STROKE_OPTIONS.find(s => s.value === session.stroke)?.label || session.stroke,
        SESSION_TYPE_OPTIONS.find(s => s.value === session.sessionType)?.label || session.sessionType,
        session.RPE,
        `"${session.mainSet}"`,
        `"${session.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sesiones_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header con búsqueda y controles */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Historial de Sesiones</h3>
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedSessions.length} de {sessions.length} sesiones
            {hasActiveFilters && " (filtradas)"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar sesiones..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 w-full sm:w-64"
            />
          </div>

          {/* Botones de control */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary text-primary-foreground" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {selectedStrokes.length + selectedSessionTypes.length + selectedRPEs.length + 
                   (dateRange.from ? 1 : 0) + (dateRange.to ? 1 : 0) + 
                   (distanceRange.min ? 1 : 0) + (distanceRange.max ? 1 : 0)}
                </Badge>
              )}
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <Card className="bg-muted/50 border-muted">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filtros Avanzados</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpiar todo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por estilo */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estilo</Label>
                <div className="space-y-1">
                  {STROKE_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`stroke-${option.value}`}
                        checked={selectedStrokes.includes(option.value)}
                        onCheckedChange={() => toggleStrokeFilter(option.value)}
                      />
                      <Label htmlFor={`stroke-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por tipo de sesión */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Sesión</Label>
                <div className="space-y-1">
                  {SESSION_TYPE_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${option.value}`}
                        checked={selectedSessionTypes.includes(option.value)}
                        onCheckedChange={() => toggleSessionTypeFilter(option.value)}
                      />
                      <Label htmlFor={`type-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por RPE */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">RPE</Label>
                <div className="grid grid-cols-2 gap-1">
                  {RPE_OPTIONS.map((rpe) => (
                    <div key={rpe} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rpe-${rpe}`}
                        checked={selectedRPEs.includes(rpe)}
                        onCheckedChange={() => toggleRPEFilter(rpe)}
                      />
                      <Label htmlFor={`rpe-${rpe}`} className="text-sm">
                        {rpe}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por distancia */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Distancia (m)</Label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={distanceRange.min || ""}
                    onChange={(e) => setDistanceRange(prev => ({ 
                      ...prev, 
                      min: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                  />
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={distanceRange.max || ""}
                    onChange={(e) => setDistanceRange(prev => ({ 
                      ...prev, 
                      max: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Filtro por fecha */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rango de Fechas</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : "Desde"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "Hasta"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles de ordenamiento y paginación */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Ordenar por:</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm">Mostrar:</Label>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg bg-muted/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-sm">Fecha</th>
                <th className="text-left p-3 font-medium text-sm">Nadador</th>
                <th className="text-left p-3 font-medium text-sm">Distancia</th>
                <th className="text-left p-3 font-medium text-sm">Duración</th>
                <th className="text-left p-3 font-medium text-sm">Estilo</th>
                <th className="text-left p-3 font-medium text-sm">Tipo</th>
                <th className="text-left p-3 font-medium text-sm">RPE</th>
                <th className="text-left p-3 font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Activity className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {searchTerm || hasActiveFilters ? "No se encontraron sesiones con esos criterios" : "No hay sesiones registradas"}
                      </p>
                      {(searchTerm || hasActiveFilters) && (
                        <Button variant="outline" size="sm" onClick={clearAllFilters}>
                          Limpiar filtros
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSessions.map((session) => (
                  <tr key={session.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        {formatDate(session.date, 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{session.swimmer}</td>
                    <td className="p-3">
                      <Badge variant="outline">{session.distance}m</Badge>
                    </td>
                    <td className="p-3">
                      {session.durationMin > 0 ? `${session.durationMin}min` : '-'}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {STROKE_OPTIONS.find(s => s.value === session.stroke)?.label || session.stroke}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={session.sessionType === 'technique' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {SESSION_TYPE_OPTIONS.find(s => s.value === session.sessionType)?.label || session.sessionType}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">RPE {session.RPE}/10</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(session)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(session)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedSessions.length)} de {filteredAndSortedSessions.length} sesiones
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                if (totalPages <= 5) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                }
                
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                }
                
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Sesión</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la sesión de entrenamiento
            </DialogDescription>
          </DialogHeader>
          
          {editingSession && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Fecha</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingSession.date}
                    onChange={(e) => setEditingSession({ ...editingSession, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-distance">Distancia (m)</Label>
                  <Input
                    id="edit-distance"
                    type="number"
                    value={editingSession.distance}
                    onChange={(e) => setEditingSession({ ...editingSession, distance: parseInt(e.target.value) })}
                    required
                    min="1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duración (min)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={editingSession.durationMin}
                    onChange={(e) => setEditingSession({ ...editingSession, durationMin: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-rpe">RPE (1-10)</Label>
                  <Select 
                    value={editingSession.RPE.toString()} 
                    onValueChange={(value) => setEditingSession({ ...editingSession, RPE: parseInt(value) as Session["RPE"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RPE_OPTIONS.map((rpe) => (
                        <SelectItem key={rpe} value={rpe.toString()}>
                          {rpe}/10
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stroke">Estilo</Label>
                  <Select 
                    value={editingSession.stroke} 
                    onValueChange={(value: Session["stroke"]) => setEditingSession({ ...editingSession, stroke: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STROKE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-sessionType">Tipo</Label>
                  <Select 
                    value={editingSession.sessionType} 
                    onValueChange={(value: Session["sessionType"]) => setEditingSession({ ...editingSession, sessionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-mainSet">Serie Principal</Label>
                <Input
                  id="edit-mainSet"
                  value={editingSession.mainSet}
                  onChange={(e) => setEditingSession({ ...editingSession, mainSet: e.target.value })}
                  placeholder="10x200m @2:30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notas</Label>
                <Textarea
                  id="edit-notes"
                  value={editingSession.notes || ""}
                  onChange={(e) => setEditingSession({ ...editingSession, notes: e.target.value })}
                  placeholder="Observaciones del entrenamiento..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Edit className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          {sessionToDelete && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{sessionToDelete.distance}m {STROKE_OPTIONS.find(s => s.value === sessionToDelete.stroke)?.label || sessionToDelete.stroke}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(sessionToDelete.date, 'dd/MM/yyyy')} - {sessionToDelete.swimmer}
                      </p>
                    </div>
                    <Badge variant="outline">RPE {sessionToDelete.RPE}/10</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}