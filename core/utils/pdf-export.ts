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
   * Export a training session to PDF with a professional template
   */
  async exportTrainingToPDF(data: TrainingPDFData): Promise<void> {
    const { doc } = this;
    
    // Page configuration
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Zone colors
    const zoneColors = {
      z1: '#10B981', // Green
      z2: '#3B82F6', // Blue
      z3: '#F59E0B', // Yellow
      z4: '#F97316', // Orange
      z5: '#EF4444', // Red
    };

    // Header with logo and title
    this.addHeader(data.title, data.date, contentWidth, margin);

    // Training info
    this.addTrainingInfo(data, contentWidth, margin);

    // Training content
    this.addTrainingContent(data.content, contentWidth, margin);

    // Zones table with colors
    this.addZonesTable(data.zones, zoneColors, contentWidth, margin);

    // Footer
    this.addFooter(pageWidth, pageHeight, margin);

    // Save PDF
    const fileName = `training_${data.date.replace(/\//g, '-')}_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(fileName);
  }

  private addHeader(title: string, date: string, contentWidth: number, margin: number): void {
    const { doc } = this;
    
    // Main title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SWIMMING TRAINING SESSION', margin, 30);
    
    // Subtitle
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(title, margin, 45);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, margin, 55);
    
    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 60, margin + contentWidth, 60);
  }

  private addTrainingInfo(data: TrainingPDFData, contentWidth: number, margin: number): void {
    const { doc } = this;
    let yPosition = 75;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TRAINING INFORMATION', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Two columns
    const leftColumn = margin;
    const rightColumn = margin + contentWidth / 2;

    // Left column
    if (data.duration) {
      doc.text(`Duration: ${data.duration} minutes`, leftColumn, yPosition);
      yPosition += 8;
    }
    if (data.coach) {
      doc.text(`Coach: ${data.coach}`, leftColumn, yPosition);
      yPosition += 8;
    }
    if (data.location) {
      doc.text(`Location: ${data.location}`, leftColumn, yPosition);
      yPosition += 8;
    }

    // Right column
    yPosition = 90;
    if (data.stroke) {
      doc.text(`Stroke: ${data.stroke}`, rightColumn, yPosition);
      yPosition += 8;
    }
    if (data.rpe) {
      doc.text(`RPE: ${data.rpe}/10`, rightColumn, yPosition);
      yPosition += 8;
    }
    if (data.objective) {
      doc.text(`Objective: ${data.objective}`, rightColumn, yPosition);
      yPosition += 8;
    }

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition + 5, margin + contentWidth, yPosition + 5);
  }

  private addTrainingContent(content: string, contentWidth: number, margin: number): void {
    const { doc } = this;
    let yPosition = 140;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TRAINING CONTENT', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Split content into lines that fit the page
    const lines = doc.splitTextToSize(content, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > 250) {
        // If close to end of page
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition + 5, margin + contentWidth, yPosition + 5);
  }

  private addZonesTable(
    zones: TrainingPDFData['zones'], 
    zoneColors: Record<string, string>, 
    contentWidth: number, 
    margin: number
  ): void {
    const { doc } = this;
    let yPosition = 200;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ZONE DISTRIBUTION', margin, yPosition);
    yPosition += 15;

    // Table configuration
    const tableWidth = contentWidth;
    const colWidth = tableWidth / 5;
    const rowHeight = 20;

    // Table headers
    const zoneNames = ['Z1 - Recovery', 'Z2 - Aerobic Base', 'Z3 - Tempo', 'Z4 - Speed', 'Z5 - VO2 Max'];
    const zoneKeys = ['z1', 'z2', 'z3', 'z4', 'z5'];

    // Draw headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    for (let i = 0; i < zoneNames.length; i++) {
      const x = margin + i * colWidth;
      
      // Colored header background
      doc.setFillColor(zoneColors[zoneKeys[i]]);
      doc.rect(x, yPosition - 5, colWidth, rowHeight, 'F');
      
      // Header text
      doc.setTextColor(255, 255, 255);
      doc.text(zoneNames[i], x + 2, yPosition + 5);
    }

    yPosition += rowHeight;

    // Zone values
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    for (let i = 0; i < zoneKeys.length; i++) {
      const x = margin + i * colWidth;
      const value = zones[zoneKeys[i] as keyof typeof zones];
      
      // Light gray background
      doc.setFillColor(245, 245, 245);
      doc.rect(x, yPosition - 5, colWidth, rowHeight, 'F');
      
      // Border
      doc.setDrawColor(200, 200, 200);
      doc.rect(x, yPosition - 5, colWidth, rowHeight, 'S');
      
      // Centered text
      const textWidth = doc.getTextWidth(`${value}m`);
      doc.text(`${value}m`, x + (colWidth - textWidth) / 2, yPosition + 5);
    }

    yPosition += rowHeight + 10;

    // Total
    const total = Object.values(zones).reduce((sum, zone) => sum + zone, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: ${total.toLocaleString()} meters`, margin, yPosition);
  }

  private addFooter(pageWidth: number, pageHeight: number, margin: number): void {
    const { doc } = this;
    
    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by DECKapp - Training Management System', margin, pageHeight - 15);
    doc.text(new Date().toLocaleString('en-GB'), pageWidth - margin - 50, pageHeight - 15);
  }

  /**
   * Export multiple training sessions to a single PDF
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
      const contentWidth = pageWidth - margin * 2;

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

    const fileName = `trainings_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
}

/**
 * Helper function to export a single training
 */
export async function exportTrainingToPDF(data: TrainingPDFData): Promise<void> {
  const exporter = new TrainingPDFExporter();
  await exporter.exportTrainingToPDF(data);
}

/**
 * Helper function to export multiple trainings
 */
export async function exportMultipleTrainingsToPDF(trainings: TrainingPDFData[]): Promise<void> {
  const exporter = new TrainingPDFExporter();
  await exporter.exportMultipleTrainingsToPDF(trainings);
}
