'use client';

import { Button } from '@/components/ui/button';
import { exportMultipleTrainingsToPDF, exportTrainingToPDF, type TrainingPDFData } from '@/core/utils/pdf-export';
import { Download, FileText, Loader2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface PDFExportButtonProps {
  training?: TrainingPDFData;
  trainings?: TrainingPDFData[];
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export const PDFExportButton = memo(function PDFExportButton({ 
  training, 
  trainings, 
  variant = 'outline',
  size = 'sm',
  className = '',
  children 
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!training && !trainings) return;

    setIsExporting(true);
    try {
      if (training) {
        await exportTrainingToPDF(training);
      } else if (trainings && trainings.length > 0) {
        await exportMultipleTrainingsToPDF(trainings);
      }
    } catch (error) {
      toast.error('Error exporting PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [training, trainings]);

  const getButtonText = () => {
    if (isExporting) return 'Exportando...';
    if (trainings && trainings.length > 1) return `Exportar ${trainings.length} entrenamientos`;
    return 'Exportar PDF';
  };

  const getIcon = () => {
    if (isExporting) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (trainings && trainings.length > 1) return <FileText className="h-4 w-4" />;
    return <Download className="h-4 w-4" />;
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || (!training && (!trainings || trainings.length === 0))}
      variant={variant}
      size={size}
      className={className}
    >
      {getIcon()}
      {children || getButtonText()}
    </Button>
  );
});

/**
 * Hook para convertir datos de sesión a formato PDF
 */
export function useTrainingPDFData() {
  const convertSessionToPDFData = (session: any): TrainingPDFData => {
    return {
      title: session.title || session.mainSet || 'Entrenamiento',
      date: session.date ? new Date(session.date).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'),
      content: session.content || '',
      zones: session.zone_volumes || { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
      totalDistance: session.distance || 0,
      duration: session.duration || session.durationMin,
      coach: session.coach,
      location: session.location,
      objective: session.objective || session.sessionType,
      stroke: session.stroke,
      rpe: session.rpe || session.RPE,
    };
  };

  const convertSessionsToPDFData = (sessions: any[]): TrainingPDFData[] => {
    return sessions.map(convertSessionToPDFData);
  };

  return {
    convertSessionToPDFData,
    convertSessionsToPDFData,
  };
}
