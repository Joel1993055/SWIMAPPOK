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
import { useDynamicTheme } from '@/core/hooks/use-dynamic-theme';
import type { Session } from '@/lib/types/session';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
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
  // Usar tema dinámico
  const { zoneConfig } = useDynamicTheme();
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
            Training Details
          </DialogTitle>
          <DialogDescription>
            Full information of the selected training
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with basic information */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{training.mainSet}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(training.date), 'MM/dd/yyyy', { locale: enUS })}</span>
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
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Info badges */}
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

          {/* Training content */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Training Content
            </h4>
            <div className="bg-muted/30 rounded-lg p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {training.mainSet}
              </pre>
            </div>
          </div>

          {/* Additional notes */}
          {training.notes && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">{training.notes}</p>
              </div>
            </div>
          )}

          {/* Technical information */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Technical Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Distance</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {training.distance.toLocaleString()}m
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Session Type</span>
                </div>
                <p className="text-lg font-semibold capitalize">
                  {training.sessionType}
                </p>
              </div>
            </div>
          </div>

          {/* Training zones (if available) */}
          {training.zone_volumes && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Zone Distribution
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { zone: 'Z1', key: 'z1' },
                  { zone: 'Z2', key: 'z2' },
                  { zone: 'Z3', key: 'z3' },
                  { zone: 'Z4', key: 'z4' },
                  { zone: 'Z5', key: 'z5' },
                ].map(({ zone, key }) => {
                  const zoneData = zoneConfig[zone as keyof typeof zoneConfig];
                  const backgroundColor = `${zoneData.hex}20`; // 20% opacity
                  const borderColor = `${zoneData.hex}40`; // 40% opacity
                  const textColor = zoneData.hex;
                  
                  const value = training.zone_volumes?.[key as keyof typeof training.zone_volumes] || 0;
                  return (
                    <div 
                      key={zone} 
                      className="rounded-lg p-3 text-center border"
                      style={{ 
                        backgroundColor: backgroundColor,
                        borderColor: borderColor
                      }}
                    >
                      <div className="text-xs font-medium mb-1">{zone}</div>
                      <div className="text-lg font-bold">{value}m</div>
                      <div className="text-xs opacity-75" style={{ color: textColor }}>
                        {zoneData.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Total meters by zones */}
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total by Zones</div>
                <div className="text-xl font-bold">
                  {Object.values(training.zone_volumes || {}).reduce((sum, zone) => sum + zone, 0).toLocaleString()}m
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Footer with actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Training
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
