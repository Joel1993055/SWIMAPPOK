import jsPDF from 'jspdf';

export interface ReportPDFData {
  title: string;
  subtitle?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  charts: ChartPDFData[];
  trainings: TrainingPDFData[];
  summary: ReportSummary;
  generatedAt: Date;
}

export interface ChartPDFData {
  id: string;
  title: string;
  description: string;
  type: string;
  data: any;
  imageData?: string; // Base64 image data
}

export interface TrainingPDFData {
  id: string;
  title: string;
  date: string;
  content: string;
  zones: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
  totalDistance: number;
  duration?: number;
  coach?: string;
  location?: string;
  objective?: string;
  stroke?: string;
  rpe?: number;
}

export interface ReportSummary {
  totalSessions: number;
  totalDistance: number;
  totalDuration: number;
  averageRPE: number;
  zoneDistribution: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
  topObjective: string;
  mostUsedStroke: string;
}

export class ReportsPDFExporter {
  private doc: jsPDF;
  private currentY: number;
  private readonly pageHeight: number;
  private readonly pageWidth: number;
  private readonly margin: number;
  private readonly contentWidth: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.currentY = 20;
  }

  /**
   * Exporta un reporte completo a PDF
   */
  async exportReportToPDF(data: ReportPDFData): Promise<void> {
    // Portada
    this.addCoverPage(data);
    
    // Índice
    this.addTableOfContents(data);
    
    // Resumen ejecutivo
    this.addExecutiveSummary(data.summary, data.dateRange);
    
    // Gráficos
    if (data.charts.length > 0) {
      this.addChartsSection(data.charts);
    }
    
    // Entrenamientos detallados
    if (data.trainings.length > 0) {
      this.addTrainingsSection(data.trainings);
    }
    
    // Análisis y conclusiones
    this.addAnalysisSection(data);
    
    // Footer en todas las páginas
    this.addFooterToAllPages();
    
    // Guardar PDF
    const fileName = `reporte_${data.title.toLowerCase().replace(/\s+/g, '_')}_${format(data.generatedAt, 'yyyy-MM-dd')}.pdf`;
    this.doc.save(fileName);
  }

  private addCoverPage(data: ReportPDFData): void {
    // Fondo con gradiente sutil
    this.doc.setFillColor(240, 248, 255);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Logo/Título principal
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30, 58, 138);
    this.doc.text('DECKapp', this.margin, 60);
    
    // Subtítulo
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(71, 85, 105);
    this.doc.text('Sistema de Gestión de Entrenamientos', this.margin, 80);
    
    // Línea decorativa
    this.doc.setDrawColor(59, 130, 246);
    this.doc.setLineWidth(3);
    this.doc.line(this.margin, 90, this.margin + 100, 90);
    
    // Título del reporte
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text(data.title, this.margin, 120);
    
    if (data.subtitle) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(data.subtitle, this.margin, 140);
    }
    
    // Período del reporte
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30, 58, 138);
    this.doc.text('Período:', this.margin, 180);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(15, 23, 42);
    const periodText = `${format(data.dateRange.start, 'dd/MM/yyyy', { locale: { code: 'es' } })} - ${format(data.dateRange.end, 'dd/MM/yyyy', { locale: { code: 'es' } })}`;
    this.doc.text(periodText, this.margin + 30, 180);
    
    // Fecha de generación
    this.doc.setFontSize(10);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(`Generado el ${format(data.generatedAt, 'dd/MM/yyyy HH:mm', { locale: { code: 'es' } })}`, this.margin, this.pageHeight - 30);
    
    this.currentY = this.pageHeight - 50;
  }

  private addTableOfContents(data: ReportPDFData): void {
    this.doc.addPage();
    this.currentY = 30;
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Índice', this.margin, this.currentY);
    this.currentY += 20;
    
    const sections = [
      { title: 'Resumen Ejecutivo', page: 3 },
      { title: 'Gráficos y Análisis', page: 4 },
    ];
    
    if (data.trainings.length > 0) {
      sections.push({ title: 'Entrenamientos Detallados', page: 5 });
    }
    
    sections.push({ title: 'Análisis y Conclusiones', page: sections.length + 3 });
    
    sections.forEach((section, index) => {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(section.title, this.margin, this.currentY);
      
      // Puntos de guía
      const dots = '.'.repeat(50);
      const dotsWidth = this.doc.getTextWidth(dots);
      this.doc.text(dots, this.pageWidth - this.margin - dotsWidth - 20, this.currentY);
      
      this.doc.text(`${section.page}`, this.pageWidth - this.margin - 10, this.currentY);
      this.currentY += 15;
    });
  }

  private addExecutiveSummary(summary: ReportSummary, dateRange: { start: Date; end: Date }): void {
    this.doc.addPage();
    this.currentY = 30;
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Resumen Ejecutivo', this.margin, this.currentY);
    this.currentY += 25;
    
    // Métricas principales en tarjetas
    const metrics = [
      { label: 'Total de Sesiones', value: summary.totalSessions.toString(), icon: '🏊' },
      { label: 'Distancia Total', value: `${summary.totalDistance.toLocaleString()}m`, icon: '📏' },
      { label: 'Duración Total', value: `${summary.totalDuration} min`, icon: '⏱️' },
      { label: 'RPE Promedio', value: summary.averageRPE.toFixed(1), icon: '💪' },
    ];
    
    // Primera fila de métricas
    metrics.forEach((metric, index) => {
      const x = this.margin + (index * (this.contentWidth / 4));
      const y = this.currentY;
      
      // Fondo de la tarjeta
      this.doc.setFillColor(248, 250, 252);
      this.doc.roundedRect(x, y, (this.contentWidth / 4) - 5, 40, 5, 5, 'F');
      
      // Borde
      this.doc.setDrawColor(226, 232, 240);
      this.doc.roundedRect(x, y, (this.contentWidth / 4) - 5, 40, 5, 5, 'S');
      
      // Icono
      this.doc.setFontSize(16);
      this.doc.text(metric.icon, x + 10, y + 15);
      
      // Valor
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(metric.value, x + 10, y + 30);
      
      // Etiqueta
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(metric.label, x + 10, y + 35);
    });
    
    this.currentY += 60;
    
    // Distribución de zonas
    this.addZonesDistribution(summary.zoneDistribution);
    
    // Objetivos y estilos más utilizados
    this.currentY += 20;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Estadísticas Adicionales', this.margin, this.currentY);
    this.currentY += 15;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`• Objetivo más frecuente: ${summary.topObjective}`, this.margin, this.currentY);
    this.currentY += 12;
    this.doc.text(`• Estilo más utilizado: ${summary.mostUsedStroke}`, this.margin, this.currentY);
  }

  private addZonesDistribution(zones: ReportSummary['zoneDistribution']): void {
    this.currentY += 20;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Distribución por Zonas', this.margin, this.currentY);
    this.currentY += 15;
    
    const zoneColors = {
      z1: '#10B981', // Verde
      z2: '#3B82F6', // Azul
      z3: '#F59E0B', // Amarillo
      z4: '#F97316', // Naranja
      z5: '#EF4444', // Rojo
    };
    
    const zoneNames = ['Z1 - Recuperación', 'Z2 - Aeróbico Base', 'Z3 - Tempo', 'Z4 - Velocidad', 'Z5 - VO2 Max'];
    const zoneKeys = ['z1', 'z2', 'z3', 'z4', 'z5'];
    
    const total = Object.values(zones).reduce((sum, zone) => sum + zone, 0);
    
    zoneKeys.forEach((key, index) => {
      const value = zones[key as keyof typeof zones];
      const percentage = total > 0 ? (value / total) * 100 : 0;
      
      const x = this.margin + (index * (this.contentWidth / 5));
      const y = this.currentY;
      
      // Barra de progreso
      const barWidth = (this.contentWidth / 5) - 10;
      const barHeight = 20;
      const fillWidth = (percentage / 100) * barWidth;
      
      // Fondo de la barra
      this.doc.setFillColor(240, 244, 248);
      this.doc.rect(x, y, barWidth, barHeight, 'F');
      
      // Relleno de la barra
      this.doc.setFillColor(zoneColors[key as keyof typeof zoneColors]);
      this.doc.rect(x, y, fillWidth, barHeight, 'F');
      
      // Borde
      this.doc.setDrawColor(226, 232, 240);
      this.doc.rect(x, y, barWidth, barHeight, 'S');
      
      // Texto de la zona
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(zoneNames[index], x + 2, y - 5);
      
      // Porcentaje
      this.doc.setFontSize(10);
      this.doc.text(`${percentage.toFixed(1)}%`, x + barWidth/2 - 10, y + barHeight/2 + 3);
    });
  }

  private addChartsSection(charts: ChartPDFData[]): void {
    this.doc.addPage();
    this.currentY = 30;
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Gráficos y Análisis', this.margin, this.currentY);
    this.currentY += 25;
    
    charts.forEach((chart, index) => {
      if (this.currentY > this.pageHeight - 100) {
        this.doc.addPage();
        this.currentY = 30;
      }
      
      // Título del gráfico
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(chart.title, this.margin, this.currentY);
      this.currentY += 15;
      
      // Descripción
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(chart.description, this.margin, this.currentY);
      this.currentY += 20;
      
      // Placeholder para el gráfico (en una implementación real, aquí iría la imagen del gráfico)
      this.doc.setFillColor(248, 250, 252);
      this.doc.rect(this.margin, this.currentY, this.contentWidth, 120, 'F');
      
      this.doc.setDrawColor(226, 232, 240);
      this.doc.rect(this.margin, this.currentY, this.contentWidth, 120, 'S');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 116, 139);
      this.doc.text(`[Gráfico: ${chart.title}]`, this.margin + 10, this.currentY + 60);
      
      this.currentY += 140;
    });
  }

  private addTrainingsSection(trainings: TrainingPDFData[]): void {
    this.doc.addPage();
    this.currentY = 30;
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Entrenamientos Detallados', this.margin, this.currentY);
    this.currentY += 25;
    
    trainings.forEach((training, index) => {
      if (this.currentY > this.pageHeight - 150) {
        this.doc.addPage();
        this.currentY = 30;
      }
      
      // Título del entrenamiento
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(`${index + 1}. ${training.title}`, this.margin, this.currentY);
      this.currentY += 12;
      
      // Información básica
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(71, 85, 105);
      
      const info = [
        `Fecha: ${training.date}`,
        `Duración: ${training.duration || 0} min`,
        `Distancia: ${training.totalDistance.toLocaleString()}m`,
        training.rpe ? `RPE: ${training.rpe}/10` : '',
        training.stroke ? `Estilo: ${training.stroke}` : '',
        training.objective ? `Objetivo: ${training.objective}` : '',
      ].filter(Boolean);
      
      info.forEach((item, i) => {
        const x = this.margin + (i % 2) * (this.contentWidth / 2);
        const y = this.currentY + Math.floor(i / 2) * 10;
        this.doc.text(item, x, y);
      });
      
      this.currentY += 30;
      
      // Contenido del entrenamiento
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(15, 23, 42);
      
      const lines = this.doc.splitTextToSize(training.content, this.contentWidth);
      lines.forEach((line: string) => {
        if (this.currentY > this.pageHeight - 50) {
          this.doc.addPage();
          this.currentY = 30;
        }
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += 6;
      });
      
      this.currentY += 15;
      
      // Zonas del entrenamiento
      this.addTrainingZones(training.zones);
      
      this.currentY += 20;
    });
  }

  private addTrainingZones(zones: TrainingPDFData['zones']): void {
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Distribución por Zonas:', this.margin, this.currentY);
    this.currentY += 10;
    
    const zoneNames = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'];
    const zoneKeys = ['z1', 'z2', 'z3', 'z4', 'z5'];
    
    zoneKeys.forEach((key, index) => {
      const value = zones[key as keyof typeof zones];
      const x = this.margin + (index * 30);
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(zoneNames[index], x, this.currentY);
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(`${value}m`, x, this.currentY + 8);
    });
    
    this.currentY += 20;
  }

  private addAnalysisSection(data: ReportPDFData): void {
    this.doc.addPage();
    this.currentY = 30;
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Análisis y Conclusiones', this.margin, this.currentY);
    this.currentY += 25;
    
    // Análisis basado en los datos
    const analysis = this.generateAnalysis(data);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(15, 23, 42);
    
    analysis.forEach((paragraph) => {
      const lines = this.doc.splitTextToSize(paragraph, this.contentWidth);
      lines.forEach((line: string) => {
        if (this.currentY > this.pageHeight - 50) {
          this.doc.addPage();
          this.currentY = 30;
        }
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += 6;
      });
      this.currentY += 10;
    });
  }

  private generateAnalysis(data: ReportPDFData): string[] {
    const { summary, trainings } = data;
    
    const analysis = [];
    
    // Análisis de volumen
    if (summary.totalSessions > 0) {
      const avgDistancePerSession = summary.totalDistance / summary.totalSessions;
      analysis.push(`Durante el período analizado, se completaron ${summary.totalSessions} sesiones de entrenamiento con una distancia promedio de ${avgDistancePerSession.toFixed(0)} metros por sesión.`);
    }
    
    // Análisis de intensidad
    if (summary.averageRPE > 0) {
      const intensityLevel = summary.averageRPE >= 7 ? 'alta' : summary.averageRPE >= 5 ? 'moderada' : 'baja';
      analysis.push(`La intensidad promedio del entrenamiento fue ${intensityLevel} (RPE: ${summary.averageRPE.toFixed(1)}/10), lo que indica un enfoque ${intensityLevel === 'alta' ? 'intenso' : intensityLevel === 'moderada' ? 'equilibrado' : 'conservador'} en el desarrollo.`);
    }
    
    // Análisis de distribución de zonas
    const totalZones = Object.values(summary.zoneDistribution).reduce((sum, zone) => sum + zone, 0);
    if (totalZones > 0) {
      const z1Percentage = (summary.zoneDistribution.z1 / totalZones) * 100;
      const z4z5Percentage = ((summary.zoneDistribution.z4 + summary.zoneDistribution.z5) / totalZones) * 100;
      
      if (z1Percentage > 30) {
        analysis.push(`Se observa una alta proporción de entrenamiento en zona de recuperación (${z1Percentage.toFixed(1)}%), lo que sugiere un enfoque en la base aeróbica y la recuperación activa.`);
      }
      
      if (z4z5Percentage > 20) {
        analysis.push(`El entrenamiento incluye un componente significativo de alta intensidad (${z4z5Percentage.toFixed(1)}% en zonas Z4-Z5), indicando un desarrollo de la capacidad anaeróbica.`);
      }
    }
    
    // Recomendaciones
    analysis.push('');
    analysis.push('Recomendaciones:');
    analysis.push('• Mantener la consistencia en el entrenamiento para continuar el progreso');
    analysis.push('• Considerar ajustar la distribución de zonas según los objetivos específicos');
    analysis.push('• Monitorear el RPE para evitar el sobreentrenamiento');
    analysis.push('• Evaluar periódicamente el progreso y ajustar el plan de entrenamiento');
    
    return analysis;
  }

  private addFooterToAllPages(): void {
    const totalPages = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      
      // Línea separadora
      this.doc.setDrawColor(226, 232, 240);
      this.doc.line(this.margin, this.pageHeight - 25, this.pageWidth - this.margin, this.pageHeight - 25);
      
      // Texto del footer
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 116, 139);
      this.doc.text('DECKapp - Sistema de Gestión de Entrenamientos', this.margin, this.pageHeight - 15);
      this.doc.text(`Página ${i} de ${totalPages}`, this.pageWidth - this.margin - 30, this.pageHeight - 15);
    }
  }
}

/**
 * Función helper para exportar un reporte
 */
export async function exportReportToPDF(data: ReportPDFData): Promise<void> {
  const exporter = new ReportsPDFExporter();
  await exporter.exportReportToPDF(data);
}

// Helper para formatear fechas
function format(date: Date, formatStr: string, options?: { locale: { code: string } }): string {
  // Implementación simplificada - en producción usar date-fns
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return formatStr
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year.toString())
    .replace('HH', hours)
    .replace('mm', minutes);
}
