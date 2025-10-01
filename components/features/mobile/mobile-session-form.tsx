'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createSession } from '@/infra/config/actions/sessions';
import { Calendar, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MobileSessionFormProps {
  defaultDate?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MobileSessionForm({ 
  defaultDate, 
  onSuccess, 
  onCancel 
}: MobileSessionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState({
    date: defaultDate || new Date().toISOString().split('T')[0],
    distance: '',
    stroke: 'Libre',
    rpe: '5',
    content: '',
  });

  const STROKE_OPTIONS = [
    { value: 'Libre', label: 'Libre' },
    { value: 'Espalda', label: 'Espalda' },
    { value: 'Pecho', label: 'Pecho' },
    { value: 'Mariposa', label: 'Mariposa' },
  ];

  const RPE_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} - ${getRPEDescription(i + 1)}`
  }));

  function getRPEDescription(rpe: number): string {
    if (rpe <= 2) return 'Muy fácil';
    if (rpe <= 4) return 'Fácil';
    if (rpe <= 6) return 'Moderado';
    if (rpe <= 8) return 'Difícil';
    return 'Muy difícil';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', `${session.stroke} Training - ${session.distance}m`);
      formData.append('date', session.date);
      formData.append('type', 'Personalizado');
      formData.append('distance', session.distance);
      formData.append('stroke', session.stroke);
      formData.append('rpe', session.rpe);
      formData.append('content', session.content || 'Training session');
      formData.append('duration', '60');
      formData.append('location', 'No especificado');
      formData.append('coach', 'No especificado');
      formData.append('club', 'No especificado');
      formData.append('group_name', 'No especificado');
      
      // Zone volumes (simplified for mobile)
      formData.append('z1', '0');
      formData.append('z2', '0');
      formData.append('z3', '0');
      formData.append('z4', '0');
      formData.append('z5', '0');

      await createSession(formData);
      
      toast.success('¡Sesión creada exitosamente!');
      onSuccess?.();
    } catch (error) {
      toast.error('Error al crear la sesión');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Nueva Sesión</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" />
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={session.date}
              onChange={(e) => setSession({ ...session, date: e.target.value })}
              required
              className="h-12 text-base"
            />
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-base">
              Distancia (metros)
            </Label>
            <Input
              id="distance"
              type="number"
              placeholder="ej: 2000"
              value={session.distance}
              onChange={(e) => setSession({ ...session, distance: e.target.value })}
              required
              className="h-12 text-base"
            />
          </div>

          {/* Stroke */}
          <div className="space-y-2">
            <Label className="text-base">Estilo</Label>
            <Select
              value={session.stroke}
              onValueChange={(value) => setSession({ ...session, stroke: value })}
            >
              <SelectTrigger className="h-12 text-base">
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

          {/* RPE */}
          <div className="space-y-2">
            <Label className="text-base">Esfuerzo Percibido (RPE)</Label>
            <Select
              value={session.rpe}
              onValueChange={(value) => setSession({ ...session, rpe: value })}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base">
              Descripción (opcional)
            </Label>
            <Textarea
              id="content"
              placeholder="Describe tu entrenamiento..."
              value={session.content}
              onChange={(e) => setSession({ ...session, content: e.target.value })}
              className="min-h-[100px] text-base"
            />
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="p-4 border-t bg-background">
        <Button 
          type="submit" 
          form="session-form"
          className="w-full h-12 text-base"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            'Guardando...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Sesión
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
