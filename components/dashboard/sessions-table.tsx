"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSeedData } from "@/lib/seed";
import { Search, Edit, Trash2, Plus, Eye, Calendar, Activity } from "lucide-react";

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

// Función para formatear fechas
function formatDate(dateString: string, format: string = 'dd/MM/yyyy'): string {
  const date = new Date(dateString);
  if (format === 'dd/MM/yyyy') {
    return date.toLocaleDateString('es-ES');
  }
  return date.toLocaleDateString();
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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const itemsPerPage = 10;

  const filteredSessions = sessions.filter(session =>
    session.swimmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.stroke.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.sessionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.mainSet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.notes && session.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

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

    // Aquí se implementaría la lógica para actualizar la sesión
    console.log("Actualizando sesión:", editingSession);
    setIsEditDialogOpen(false);
    setEditingSession(null);
  };

  const handleDeleteConfirm = () => {
    if (!sessionToDelete) return;

    // Aquí se implementaría la lógica para eliminar la sesión
    console.log("Eliminando sesión:", sessionToDelete);
    setIsDeleteDialogOpen(false);
    setSessionToDelete(null);
    
    // Ajustar página si es necesario
    if (paginatedSessions.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header con búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Historial de Sesiones</h3>
          <p className="text-sm text-muted-foreground">
            {filteredSessions.length} de {sessions.length} sesiones
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar sesiones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          {searchTerm && (
            <Button variant="outline" size="sm" onClick={resetSearch}>
              Limpiar
            </Button>
          )}
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
                        {searchTerm ? "No se encontraron sesiones con esa búsqueda" : "No hay sesiones registradas"}
                      </p>
                      {searchTerm && (
                        <Button variant="outline" size="sm" onClick={resetSearch}>
                          Limpiar búsqueda
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
                        <Calendar className="w-4 h-4 text-muted-foreground" />
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
                        {session.stroke}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={session.sessionType === 'technique' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {session.sessionType}
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
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSessions.length)} de {filteredSessions.length} sesiones
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
                
                // Lógica para mostrar páginas con elipsis
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
                      <p className="font-medium">{sessionToDelete.distance}m {sessionToDelete.stroke}</p>
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
