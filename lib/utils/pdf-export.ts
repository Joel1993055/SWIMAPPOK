import jsPDF from 'jspdf';

export interface TrainingPDFData {
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

export class TrainingPDFExporter {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  /**
   * Exporta un entrenamiento a PDF con plantilla profesional
   */
  async exportTrainingToPDF(data: TrainingPDFData): Promise<void> {
    const { doc } = this;
    
    // Configuración de página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Colores de las zonas
    const zoneColors = {
      z1: '#10B981', // Verde
      z2: '#3B82F6', // Azul
      z3: '#F59E0B', // Amarillo
      z4: '#F97316', // Naranja
      z5: '#EF4444', // Rojo
    };

    // Header con logo y título
    this.addHeader(data.title, data.date, contentWidth, margin);

    // Información del entrenamiento
    this.addTrainingInfo(data, contentWidth, margin);

    // Contenido del entrenamiento
    this.addTrainingContent(data.content, contentWidth, margin);

    // Tabla de zonas con colores
    this.addZonesTable(data.zones, zoneColors, contentWidth, margin);

    // Footer
    this.addFooter(pageWidth, pageHeight, margin);

    // Guardar PDF
    const fileName = `entrenamiento_${data.date.replace(/\//g, '-')}_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(fileName);
  }

  private addHeader(title: string, date: string, contentWidth: number, margin: number): void {
    const { doc } = this;
    
    // Título principal
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ENTRENAMIENTO DE NATACIÓN', margin, 30);
    
    // Subtítulo
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(title, margin, 45);
    
    // Fecha
    doc.setFontSize(12);
    doc.text(`Fecha: ${date}`, margin, 55);
    
    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 60, margin + contentWidth, 60);
  }

  private addTrainingInfo(data: TrainingPDFData, contentWidth: number, margin: number): void {
    const { doc } = this;
    let yPosition = 75;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL ENTRENAMIENTO', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Información en dos columnas
    const leftColumn = margin;
    const rightColumn = margin + (contentWidth / 2);

    // Columna izquierda
    if (data.duration) {
      doc.text(`Duración: ${data.duration} minutos`, leftColumn, yPosition);
      yPosition += 8;
    }
    if (data.coach) {
      doc.text(`Entrenador: ${data.coach}`, leftColumn, yPosition);
      yPosition += 8;
    }
    if (data.location) {
      doc.text(`Ubicación: ${data.location}`, leftColumn, yPosition);
      yPosition += 8;
    }

    // Columna derecha
    yPosition = 90;
    if (data.stroke) {
      doc.text(`Estilo: ${data.stroke}`, rightColumn, yPosition);
      yPosition += 8;
    }
    if (data.rpe) {
      doc.text(`RPE: ${data.rpe}/10`, rightColumn, yPosition);
      yPosition += 8;
    }
    if (data.objective) {
      doc.text(`Objetivo: ${data.objective}`, rightColumn, yPosition);
      yPosition += 8;
    }

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition + 5, margin + contentWidth, yPosition + 5);
  }

  private addTrainingContent(content: string, contentWidth: number, margin: number): void {
    const { doc } = this;
    let yPosition = 140;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTENIDO DEL ENTRENAMIENTO', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Dividir el contenido en líneas que quepan en la página
    const lines = doc.splitTextToSize(content, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > 250) { // Si se acerca al final de la página
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition + 5, margin + contentWidth, yPosition + 5);
  }

  private addZonesTable(zones: TrainingPDFData['zones'], zoneColors: Record<string, string>, contentWidth: number, margin: number): void {
    const { doc } = this;
    let yPosition = 200;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DISTRIBUCIÓN POR ZONAS', margin, yPosition);
    yPosition += 15;

    // Configuración de la tabla
    const tableWidth = contentWidth;
    const colWidth = tableWidth / 5;
    const rowHeight = 20;

    // Headers de la tabla
    const zoneNames = ['Z1 - Recuperación', 'Z2 - Aeróbico Base', 'Z3 - Tempo', 'Z4 - Velocidad', 'Z5 - VO2 Max'];
    const zoneKeys = ['z1', 'z2', 'z3', 'z4', 'z5'];

    // Dibujar headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    for (let i = 0; i < zoneNames.length; i++) {
      const x = margin + (i * colWidth);
      
      // Fondo de color para el header
      doc.setFillColor(zoneColors[zoneKeys[i]]);
      doc.rect(x, yPosition - 5, colWidth, rowHeight, 'F');
      
      // Texto del header
      doc.setTextColor(255, 255, 255);
      doc.text(zoneNames[i], x + 2, yPosition + 5);
    }

    yPosition += rowHeight;

    // Valores de las zonas
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    for (let i = 0; i < zoneKeys.length; i++) {
      const x = margin + (i * colWidth);
      const value = zones[zoneKeys[i] as keyof typeof zones];
      
      // Fondo gris claro
      doc.setFillColor(245, 245, 245);
      doc.rect(x, yPosition - 5, colWidth, rowHeight, 'F');
      
      // Borde
      doc.setDrawColor(200, 200, 200);
      doc.rect(x, yPosition - 5, colWidth, rowHeight, 'S');
      
      // Texto centrado
      const textWidth = doc.getTextWidth(`${value}m`);
      doc.text(`${value}m`, x + (colWidth - textWidth) / 2, yPosition + 5);
    }

    yPosition += rowHeight + 10;

    // Total
    const total = Object.values(zones).reduce((sum, zone) => sum + zone, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: ${total.toLocaleString()} metros`, margin, yPosition);
  }

  private addFooter(pageWidth: number, pageHeight: number, margin: number): void {
    const { doc } = this;
    
    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    
    // Texto del footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Generado por DECKapp - Sistema de Gestión de Entrenamientos', margin, pageHeight - 15);
    doc.text(new Date().toLocaleString('es-ES'), pageWidth - margin - 50, pageHeight - 15);
  }

  /**
   * Exporta múltiples entrenamientos a un PDF
   */
  async exportMultipleTrainingsToPDF(trainings: TrainingPDFData[]): Promise<void> {
    const { doc } = this;
    
    for (let i = 0; i < trainings.length; i++) {
      if (i > 0) {
        doc.addPage();
      }
      
      const data = trainings[i];
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      this.addHeader(data.title, data.date, contentWidth, margin);
      this.addTrainingInfo(data, contentWidth, margin);
      this.addTrainingContent(data.content, contentWidth, margin);
      this.addZonesTable(data.zones, {
        z1: '#10B981',
        z2: '#3B82F6', 
        z3: '#F59E0B',
        z4: '#F97316',
        z5: '#EF4444',
      }, contentWidth, margin);
      this.addFooter(pageWidth, pageHeight, margin);
    }

    const fileName = `entrenamientos_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
}

/**
 * Función helper para exportar un entrenamiento individual
 */
export async function exportTrainingToPDF(data: TrainingPDFData): Promise<void> {
  const exporter = new TrainingPDFExporter();
  await exporter.exportTrainingToPDF(data);
}

/**
 * Función helper para exportar múltiples entrenamientos
 */
export async function exportMultipleTrainingsToPDF(trainings: TrainingPDFData[]): Promise<void> {
  const exporter = new TrainingPDFExporter();
  await exporter.exportMultipleTrainingsToPDF(trainings);
}
