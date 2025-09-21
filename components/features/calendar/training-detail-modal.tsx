'use client';

import { PDFExportButton, useTrainingPDFData } from '@/components/features/training/pdf-export-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Session } from '@/lib/types/session';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    Edit,
    FileText,
    Target,
    User,
    Zap
} from 'lucide-react';

interface TrainingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: Session | null;
  onEdit?: (training: Session) => void;
}

export function TrainingDetailModal({ 
  isOpen, 
  onClose, 
  training, 
  onEdit 
}: TrainingDetailModalProps) {
  const { convertSessionToPDFData } = useTrainingPDFData();

  if (!training) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(training);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles del Entrenamiento
          </DialogTitle>
          <DialogDescription>
            Información completa del entrenamiento seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con información básica */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{training.mainSet}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(training.date), 'dd/MM/yyyy', { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{training.distance}m</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <PDFExportButton
                  training={convertSessionToPDFData(training)}
                  variant="outline"
                  size="sm"
                >
                  PDF
                </PDFExportButton>
                {onEdit && (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </div>

            {/* Badges de información */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                {training.sessionType}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Target className="h-3 w-3" />
                {training.stroke}
              </Badge>
              {training.swimmer && (
                <Badge variant="outline" className="gap-1">
                  <User className="h-3 w-3" />
                  {training.swimmer}
                </Badge>
              )}
            </div>
          </div>

          {/* Contenido del entrenamiento */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contenido del Entrenamiento
            </h4>
            <div className="bg-muted/30 rounded-lg p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {training.mainSet}
              </pre>
            </div>
          </div>

          {/* Notas adicionales */}
          {training.notes && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notas
              </h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">{training.notes}</p>
              </div>
            </div>
          )}

          {/* Información técnica */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Información Técnica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Distancia Total</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {training.distance.toLocaleString()}m
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Tipo de Sesión</span>
                </div>
                <p className="text-lg font-semibold capitalize">
                  {training.sessionType}
                </p>
              </div>
            </div>
          </div>

          {/* Zonas de entrenamiento (si están disponibles) */}
          {training.zone_volumes && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Distribución por Zonas
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { zone: 'Z1', name: 'Recuperación', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200', key: 'z1' },
                  { zone: 'Z2', name: 'Aeróbico Base', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200', key: 'z2' },
                  { zone: 'Z3', name: 'Tempo', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200', key: 'z3' },
                  { zone: 'Z4', name: 'Velocidad', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200', key: 'z4' },
                  { zone: 'Z5', name: 'VO2 Max', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200', key: 'z5' },
                ].map(({ zone, name, color, key }) => {
                  const value = training.zone_volumes?.[key as keyof typeof training.zone_volumes] || 0;
                  return (
                    <div key={zone} className={`rounded-lg p-3 text-center ${color}`}>
                      <div className="text-xs font-medium mb-1">{zone}</div>
                      <div className="text-lg font-bold">{value}m</div>
                      <div className="text-xs opacity-75">{name}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Total de metros por zonas */}
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total por Zonas</div>
                <div className="text-xl font-bold">
                  {Object.values(training.zone_volumes || {}).reduce((sum, zone) => sum + zone, 0).toLocaleString()}m
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Footer con acciones */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {onEdit && (
              <Button onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Editar Entrenamiento
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
