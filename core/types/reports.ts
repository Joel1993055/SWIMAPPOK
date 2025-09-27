// =====================================================
// TIPOS DE REPORTES
// =====================================================

export interface ChartData {
  name: string;
  value: number;
  color: string;
  selected: boolean;
}

export interface TrainingReport {
  id: string;
  title: string;
  type: 'performance' | 'volume' | 'intensity' | 'technique';
  data: ChartData[];
  period: string;
  generatedAt: Date;
  filters?: ReportFilters;
}

export interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  stroke?: string;
  sessionType?: string;
  swimmer?: string;
}

export interface ReportsContextType {
  reports: TrainingReport[];
  selectedReport: TrainingReport | null;
  isLoading: boolean;
  error: string | null;
  addReport: (report: Omit<TrainingReport, 'id' | 'generatedAt'>) => void;
  updateReport: (id: string, updates: Partial<TrainingReport>) => void;
  deleteReport: (id: string) => void;
  selectReport: (id: string) => void;
  generateReport: (
    type: TrainingReport['type'],
    filters: ReportFilters
  ) => void;
  clearReports: () => void;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: TrainingReport['type'];
  config: {
    chartType: 'bar' | 'line' | 'pie' | 'area';
    metrics: string[];
    grouping: 'day' | 'week' | 'month';
  };
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportGenerationRequest {
  type: TrainingReport['type'];
  filters: ReportFilters;
  templateId?: string;
}
