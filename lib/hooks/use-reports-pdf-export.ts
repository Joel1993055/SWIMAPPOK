import type { Session } from '@/lib/types/session';
import { exportReportToPDF, type ChartPDFData, type ReportPDFData, type ReportSummary, type TrainingPDFData } from '@/lib/utils/reports-pdf-export';
import { useState } from 'react';

interface UseReportsPDFExportReturn {
  isExporting: boolean;
  exportReport: (data: {
    title: string;
    subtitle?: string;
    dateRange: { start: Date; end: Date };
    charts: ChartPDFData[];
    trainings: TrainingPDFData[];
    sessions: Session[];
  }) => Promise<void>;
  generateReportData: (sessions: Session[], dateRange: { start: Date; end: Date }) => {
    summary: ReportSummary;
    trainings: TrainingPDFData[];
  };
}

export function useReportsPDFExport(): UseReportsPDFExportReturn {
  const [isExporting, setIsExporting] = useState(false);

  const generateReportData = (sessions: Session[], dateRange: { start: Date; end: Date }) => {
    // Filtrar sesiones por rango de fechas
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= dateRange.start && sessionDate <= dateRange.end;
    });

    // Calcular resumen
    const totalSessions = filteredSessions.length;
    const totalDistance = filteredSessions.reduce((sum, session) => sum + (session.distance || 0), 0);
    const totalDuration = filteredSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageRPE = filteredSessions.length > 0 
      ? filteredSessions.reduce((sum, session) => sum + (session.rpe || 0), 0) / filteredSessions.length 
      : 0;

    // Calcular distribución de zonas
    const zoneDistribution = filteredSessions.reduce(
      (zones, session) => {
        const sessionZones = session.zone_volumes || { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
        return {
          z1: zones.z1 + sessionZones.z1,
          z2: zones.z2 + sessionZones.z2,
          z3: zones.z3 + sessionZones.z3,
          z4: zones.z4 + sessionZones.z4,
          z5: zones.z5 + sessionZones.z5,
        };
      },
      { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 }
    );

    // Encontrar objetivo más frecuente
    const objectiveCounts = filteredSessions.reduce((counts, session) => {
      const objective = session.objective || 'Otro';
      counts[objective] = (counts[objective] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    const topObjective = Object.entries(objectiveCounts).reduce((a, b) => 
      objectiveCounts[a[0]] > objectiveCounts[b[0]] ? a : b, 
      ['Otro', 0]
    )[0];

    // Encontrar estilo más utilizado
    const strokeCounts = filteredSessions.reduce((counts, session) => {
      const stroke = session.stroke || 'Libre';
      counts[stroke] = (counts[stroke] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    const mostUsedStroke = Object.entries(strokeCounts).reduce((a, b) => 
      strokeCounts[a[0]] > strokeCounts[b[0]] ? a : b, 
      ['Libre', 0]
    )[0];

    const summary: ReportSummary = {
      totalSessions,
      totalDistance,
      totalDuration,
      averageRPE,
      zoneDistribution,
      topObjective,
      mostUsedStroke,
    };

    // Convertir sesiones a formato PDF
    const trainings: TrainingPDFData[] = filteredSessions.map(session => ({
      id: session.id,
      title: session.title || 'Entrenamiento',
      date: new Date(session.date).toLocaleDateString('es-ES'),
      content: session.content || '',
      zones: session.zone_volumes || { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
      totalDistance: session.distance || 0,
      duration: session.duration,
      coach: session.coach,
      location: session.location,
      objective: session.objective,
      stroke: session.stroke,
      rpe: session.rpe,
    }));

    return { summary, trainings };
  };

  const exportReport = async (data: {
    title: string;
    subtitle?: string;
    dateRange: { start: Date; end: Date };
    charts: ChartPDFData[];
    trainings: TrainingPDFData[];
    sessions: Session[];
  }) => {
    setIsExporting(true);
    
    try {
      const { summary, trainings } = generateReportData(data.sessions, data.dateRange);
      
      const reportData: ReportPDFData = {
        title: data.title,
        subtitle: data.subtitle,
        dateRange: data.dateRange,
        charts: data.charts,
        trainings: data.trainings.length > 0 ? data.trainings : trainings,
        summary,
        generatedAt: new Date(),
      };

      await exportReportToPDF(reportData);
    } catch (error) {
      console.error('Error exportando reporte a PDF:', error);
      throw new Error('Error al exportar el reporte. Por favor, inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportReport,
    generateReportData,
  };
}
