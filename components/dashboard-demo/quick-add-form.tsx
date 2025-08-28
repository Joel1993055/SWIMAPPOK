"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSessionsStore } from "@/lib/store/sessions";
import { getCurrentDate } from "@/lib/date";
import { Session } from "@/lib/types/session";
import { toast } from "sonner";
import { Plus, Calendar, Clock, Target, FileText, Star } from "lucide-react";

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

export function QuickAddForm() {
  const { addSession } = useSessionsStore();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Formulario rápido
  const [quickForm, setQuickForm] = useState({
    date: getCurrentDate(),
    distance: "",
    stroke: "freestyle" as Session["stroke"],
    sessionType: "aerobic" as Session["sessionType"]
  });

  // Formulario avanzado
  const [advancedForm, setAdvancedForm] = useState({
    date: getCurrentDate(),
    distance: "",
    durationMin: "",
    stroke: "freestyle" as Session["stroke"],
    sessionType: "aerobic" as Session["sessionType"],
    mainSet: "",
    RPE: 5 as Session["RPE"],
    notes: ""
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickForm.distance || parseInt(quickForm.distance) <= 0) {
      toast.error("Por favor ingresa una distancia válida");
      return;
    }

    const newSession: Omit<Session, "id"> = {
      date: quickForm.date,
      swimmer: "Yo", // Por defecto
      distance: parseInt(quickForm.distance),
      durationMin: 0, // Se puede editar después
      stroke: quickForm.stroke,
      sessionType: quickForm.sessionType,
      mainSet: "",
      RPE: 5
    };

    addSession(newSession);
    toast.success(`Entrenamiento registrado: ${quickForm.distance}m ${quickForm.stroke}`);
    
    // Reset form
    setQuickForm({
      date: getCurrentDate(),
      distance: "",
      stroke: "freestyle",
      sessionType: "aerobic"
    });
  };

  const handleAdvancedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!advancedForm.distance || parseInt(advancedForm.distance) <= 0) {
      toast.error("Por favor ingresa una distancia válida");
      return;
    }

    const newSession: Omit<Session, "id"> = {
      date: advancedForm.date,
      swimmer: "Yo",
      distance: parseInt(advancedForm.distance),
      durationMin: parseInt(advancedForm.durationMin) || 0,
      stroke: advancedForm.stroke,
      sessionType: advancedForm.sessionType,
      mainSet: advancedForm.mainSet,
      RPE: advancedForm.RPE,
      notes: advancedForm.notes
    };

    addSession(newSession);
    toast.success(`Entrenamiento avanzado registrado: ${advancedForm.distance}m ${advancedForm.stroke}`);
    
    // Reset form y cerrar dialog
    setAdvancedForm({
      date: getCurrentDate(),
      distance: "",
      durationMin: "",
      stroke: "freestyle",
      sessionType: "aerobic",
      mainSet: "",
      RPE: 5,
      notes: ""
    });
    setIsAdvancedOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Formulario Rápido */}
      <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            type="date"
            value={quickForm.date}
            onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="distance">Distancia (m)</Label>
          <Input
            id="distance"
            type="number"
            placeholder="2000"
            value={quickForm.distance}
            onChange={(e) => setQuickForm({ ...quickForm, distance: e.target.value })}
            required
            min="1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stroke">Estilo</Label>
          <Select value={quickForm.stroke} onValueChange={(value: Session["stroke"]) => setQuickForm({ ...quickForm, stroke: value })}>
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
          <Label htmlFor="sessionType">Tipo</Label>
          <Select value={quickForm.sessionType} onValueChange={(value: Session["sessionType"]) => setQuickForm({ ...quickForm, sessionType: value })}>
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
        
        <div className="md:col-span-3 flex gap-2">
          <Button type="submit" className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Añadir Entrenamiento
          </Button>
          
          <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                <FileText className="w-4 h-4 mr-2" />
                Avanzado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Entrenamiento Avanzado</DialogTitle>
                <DialogDescription>
                  Registra tu entrenamiento con todos los detalles
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAdvancedSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adv-date">Fecha</Label>
                    <Input
                      id="adv-date"
                      type="date"
                      value={advancedForm.date}
                      onChange={(e) => setAdvancedForm({ ...advancedForm, date: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adv-distance">Distancia (m)</Label>
                    <Input
                      id="adv-distance"
                      type="number"
                      placeholder="2000"
                      value={advancedForm.distance}
                      onChange={(e) => setAdvancedForm({ ...advancedForm, distance: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adv-duration">Duración (min)</Label>
                    <Input
                      id="adv-duration"
                      type="number"
                      placeholder="45"
                      value={advancedForm.durationMin}
                      onChange={(e) => setAdvancedForm({ ...advancedForm, durationMin: e.target.value })}
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adv-rpe">RPE (1-10)</Label>
                    <Select value={advancedForm.RPE.toString()} onValueChange={(value) => setAdvancedForm({ ...advancedForm, RPE: parseInt(value) as Session["RPE"] })}>
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
                    <Label htmlFor="adv-stroke">Estilo</Label>
                    <Select value={advancedForm.stroke} onValueChange={(value: Session["stroke"]) => setAdvancedForm({ ...advancedForm, stroke: value })}>
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
                    <Label htmlFor="adv-sessionType">Tipo</Label>
                    <Select value={advancedForm.sessionType} onValueChange={(value: Session["sessionType"]) => setAdvancedForm({ ...advancedForm, sessionType: value })}>
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
                  <Label htmlFor="adv-mainSet">Serie Principal</Label>
                  <Input
                    id="adv-mainSet"
                    placeholder="10x200m @2:30"
                    value={advancedForm.mainSet}
                    onChange={(e) => setAdvancedForm({ ...advancedForm, mainSet: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adv-notes">Notas</Label>
                  <Textarea
                    id="adv-notes"
                    placeholder="Observaciones del entrenamiento..."
                    value={advancedForm.notes}
                    onChange={(e) => setAdvancedForm({ ...advancedForm, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAdvancedOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Guardar Entrenamiento
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
}
