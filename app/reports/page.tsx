'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSessions, type Session } from '@/lib/actions/sessions';
import { useReportsPDFExport } from '@/lib/hooks/use-reports-pdf-export';
import { format, subDays, subMonths, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Activity,
    BarChart3,
    Calendar,
    Check,
    ClipboardListIcon,
    Clock,
    Download,
    Eye,
    FileImage,
    FileText,
    Layout,
    Printer,
    Settings,
    Target,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Tipos de datos
interface ChartData {
  id: string;
  type:
    | 'volume'
    | 'sessions'
    | 'progress'
    | 'zones'
    | 'performance'
    | 'intensity'
    | 'weekly';
  title: string;
  description: string;
  category: 'overview' | 'performance' | 'analysis' | 'trends';
  selected: boolean;
}

interface TrainingReport {
  id: string;
  title: string;
  date: string;
  objective: string;
  distance: number;
  duration: number;
  rpe: number;
  stroke: string;
  content: string;
  selected: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'weekly' | 'monthly' | 'performance' | 'custom';
  charts: string[];
  includeTrainings: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
  isCustom: boolean;
}

function ReportsContent() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last-30-days');
  const [selectedCharts, setSelectedCharts] = useState<ChartData[]>([]);
  const [selectedTrainings, setSelectedTrainings] = useState<TrainingReport[]>(
    []
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Hook para exportación PDF
  const { isExporting, exportReport, generateReportData } = useReportsPDFExport();

  // Cargar sesiones reales
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error cargando sesiones:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Gráficos disponibles basados en datos reales
  const availableCharts: ChartData[] = [
    {
      id: 'volume-chart',
      type: 'volume',
      title: 'Total Volume Chart',
      description: 'Training volume evolution by period',
      category: 'overview',
      selected: false,
    },
    {
      id: 'sessions-chart',
      type: 'sessions',
      title: 'Sesiones de Entrenamiento',
      description: 'Distribución de sesiones por tipo y duración',
      category: 'overview',
      selected: false,
    },
    {
      id: 'progress-chart',
      type: 'progress',
      title: 'Weekly Progress',
      description: 'Weekly evolution of distance and RPE',
      category: 'trends',
      selected: false,
    },
    {
      id: 'zones-chart',
      type: 'zones',
      title: 'Zone Distribution',
      description: 'Time spent in each intensity zone',
      category: 'analysis',
      selected: false,
    },
    {
      id: 'intensity-chart',
      type: 'intensity',
      title: 'Intensity Analysis',
      description: 'Distribución de intensidad por períodos',
      category: 'analysis',
      selected: false,
    },
    {
      id: 'weekly-chart',
      type: 'weekly',
      title: 'Weekly Plan',
      description: 'Weekly training schedule',
      category: 'overview',
      selected: false,
    },
  ];

  // Plantillas de reportes
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'weekly-report',
      name: 'Weekly Report',
      description: 'Weekly summary of training and progress',
      category: 'weekly',
      charts: ['volume-chart', 'sessions-chart', 'weekly-chart'],
      includeTrainings: true,
      dateRange: {
        start: subWeeks(new Date(), 1),
        end: new Date(),
      },
      isCustom: false,
    },
    {
      id: 'monthly-report',
      name: 'Monthly Report',
      description: 'Complete monthly performance analysis',
      category: 'monthly',
      charts: [
        'volume-chart',
        'sessions-chart',
        'progress-chart',
        'zones-chart',
      ],
      includeTrainings: true,
      dateRange: {
        start: subMonths(new Date(), 1),
        end: new Date(),
      },
      isCustom: false,
    },
    {
      id: 'performance-report',
      name: 'Reporte de Rendimiento',
      description: 'Detailed performance and metrics analysis',
      category: 'performance',
      charts: ['progress-chart', 'intensity-chart', 'zones-chart'],
      includeTrainings: false,
      dateRange: {
        start: subMonths(new Date(), 3),
        end: new Date(),
      },
      isCustom: false,
    },
    {
      id: 'analysis-report',
      name: 'Advanced Analysis',
      description: 'Complete analysis with all charts',
      category: 'custom',
      charts: [
        'volume-chart',
        'sessions-chart',
        'progress-chart',
        'zones-chart',
        'intensity-chart',
        'weekly-chart',
      ],
      includeTrainings: true,
      dateRange: {
        start: subMonths(new Date(), 6),
        end: new Date(),
      },
      isCustom: false,
    },
  ];

  // Filtrar sesiones por período
  const getFilteredSessions = (period: string) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'last-7-days':
        startDate = subDays(now, 7);
        break;
      case 'last-30-days':
        startDate = subDays(now, 30);
        break;
      case 'last-3-months':
        startDate = subMonths(now, 3);
        break;
      case 'last-6-months':
        startDate = subMonths(now, 6);
        break;
      case 'last-year':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 30);
    }

    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= now;
    });
  };

  const filteredSessions = getFilteredSessions(selectedPeriod);

  // Convertir sesiones a formato de reporte
  const trainingReports: TrainingReport[] = filteredSessions.map(session => ({
    id: session.id,
    title: `Entrenamiento ${session.stroke || 'Libre'}`,
    date: session.date,
    objective: session.objective || 'General',
    distance: session.distance || 0,
    duration: session.duration || 0,
    rpe: session.rpe || 0,
    stroke: session.stroke || 'Libre',
    content: session.content || '',
    selected: false,
  }));

  // Filtrar gráficos
  const filteredCharts = availableCharts.filter(chart => {
    const matchesSearch =
      chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chart.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'all' || chart.category === selectedType;
    return matchesSearch && matchesType;
  });

  // Filtrar entrenamientos
  const filteredTrainings = trainingReports.filter(training => {
    const matchesSearch =
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.stroke.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Funciones de selección
  const handleChartToggle = (chartId: string) => {
    const isSelected = selectedCharts.some(chart => chart.id === chartId);
    if (isSelected) {
      setSelectedCharts(prev => prev.filter(chart => chart.id !== chartId));
    } else {
      const chart = availableCharts.find(c => c.id === chartId);
      if (chart) {
        setSelectedCharts(prev => [...prev, { ...chart, selected: true }]);
      }
    }
  };

  const handleTrainingToggle = (trainingId: string) => {
    const isSelected = selectedTrainings.some(
      training => training.id === trainingId
    );
    if (isSelected) {
      setSelectedTrainings(prev =>
        prev.filter(training => training.id !== trainingId)
      );
    } else {
      const training = trainingReports.find(t => t.id === trainingId);
      if (training) {
        setSelectedTrainings(prev => [
          ...prev,
          { ...training, selected: true },
        ]);
      }
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      const templateCharts = availableCharts.filter(chart =>
        template.charts.includes(chart.id)
      );
      setSelectedCharts(
        templateCharts.map(chart => ({ ...chart, selected: true }))
      );

      if (template.includeTrainings) {
        setSelectedTrainings(
          trainingReports.map(training => ({ ...training, selected: true }))
        );
      } else {
        setSelectedTrainings([]);
      }
    }
  };

  const clearSelection = () => {
    setSelectedCharts([]);
    setSelectedTrainings([]);
    setSelectedTemplate('');
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí iría la lógica real de generación de reporte
      console.log('Generando reporte:', {
        template: selectedTemplate,
        charts: selectedCharts,
        trainings: selectedTrainings,
        period: selectedPeriod,
      });

      alert('Reporte generado exitosamente');
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    try {
      const template = reportTemplates.find(t => t.id === selectedTemplate);
      if (!template) {
        alert('Por favor, selecciona una plantilla de reporte');
        return;
      }

      // Obtener rango de fechas basado en el período seleccionado
      let dateRange = template.dateRange;
      if (selectedPeriod === 'last-7-days') {
        dateRange = { start: subDays(new Date(), 7), end: new Date() };
      } else if (selectedPeriod === 'last-30-days') {
        dateRange = { start: subDays(new Date(), 30), end: new Date() };
      } else if (selectedPeriod === 'last-3-months') {
        dateRange = { start: subMonths(new Date(), 3), end: new Date() };
      }

      // Convertir gráficos seleccionados al formato PDF
      const chartsPDF = selectedCharts.map(chart => ({
        id: chart.id,
        title: chart.title,
        description: chart.description,
        type: chart.type,
        data: {}, // Los datos reales del gráfico se generarían aquí
      }));

      // Convertir entrenamientos seleccionados al formato PDF
      const trainingsPDF = selectedTrainings.map(training => ({
        id: training.id,
        title: training.title,
        date: training.date,
        content: training.content,
        zones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 }, // Se calcularía basado en los datos reales
        totalDistance: training.distance,
        duration: training.duration,
        objective: training.objective,
        stroke: training.stroke,
        rpe: training.rpe,
      }));

      await exportReport({
        title: template.name,
        subtitle: template.description,
        dateRange,
        charts: chartsPDF,
        trainings: trainingsPDF,
        sessions,
      });

    } catch (error) {
      console.error('Error exportando a PDF:', error);
      alert(error instanceof Error ? error.message : 'Error al exportar el PDF');
    }
  };

  const printReport = () => {
    console.log('Imprimiendo reporte:', {
      template: selectedTemplate,
      charts: selectedCharts,
      trainings: selectedTrainings,
    });
    window.print();
  };

  if (isLoading) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <ClipboardListIcon className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground'>Reports</h1>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className='bg-muted/50'>
              <CardHeader className='space-y-0 pb-2'>
                <div className='h-4 w-24 bg-muted animate-pulse rounded'></div>
              </CardHeader>
              <CardContent>
                <div className='h-8 w-16 bg-muted animate-pulse rounded mb-2'></div>
                <div className='h-3 w-32 bg-muted animate-pulse rounded'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <ClipboardListIcon className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground'>Reports</h1>
        </div>
        <p className='text-muted-foreground'>
          Genera reportes personalizados de gráficos y entrenamientos
        </p>
      </div>

      {/* Filtros y plantillas */}
      <div className='flex gap-4 items-center flex-wrap'>
        <div className='flex items-center gap-2'>
          <Calendar className='h-4 w-4' />
          <span className='text-sm font-medium'>Período:</span>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className='w-48'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='last-7-days'>Últimos 7 días</SelectItem>
            <SelectItem value='last-30-days'>Últimos 30 días</SelectItem>
            <SelectItem value='last-3-months'>Últimos 3 meses</SelectItem>
            <SelectItem value='last-6-months'>Últimos 6 meses</SelectItem>
            <SelectItem value='last-year'>Último año</SelectItem>
          </SelectContent>
        </Select>

        <div className='flex items-center gap-2'>
          <Layout className='h-4 w-4' />
          <span className='text-sm font-medium'>Plantilla:</span>
        </div>
        <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Seleccionar plantilla' />
          </SelectTrigger>
          <SelectContent>
            {reportTemplates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selection Summary */}
      <Card className='bg-muted/50'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ClipboardListIcon className='h-5 w-5' />
            Selection Summary
          </CardTitle>
          <CardDescription>
            Elementos seleccionados para tu reporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            {selectedCharts.map(chart => (
              <Card key={chart.id} className='bg-background/50'>
                <CardContent className='p-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium'>{chart.title}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {chart.description}
                      </p>
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleChartToggle(chart.id)}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {selectedTrainings.map(training => (
              <Card key={training.id} className='bg-background/50'>
                <CardContent className='p-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium'>{training.title}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {format(new Date(training.date), 'dd MMM yyyy', {
                          locale: es,
                        })}{' '}
                        - {training.distance}m
                      </p>
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleTrainingToggle(training.id)}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido Principal con Tabs */}
      <Tabs defaultValue='charts' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='charts' className='gap-2'>
            <BarChart3 className='h-4 w-4' />
            Gráficos ({selectedCharts.length})
          </TabsTrigger>
          <TabsTrigger value='trainings' className='gap-2'>
            <FileText className='h-4 w-4' />
            Training Sessions ({selectedTrainings.length})
          </TabsTrigger>
          <TabsTrigger value='templates' className='gap-2'>
            <Layout className='h-4 w-4' />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value='preview' className='gap-2'>
            <Eye className='h-4 w-4' />
            Vista Previa
          </TabsTrigger>
        </TabsList>

        {/* Tab: Gráficos */}
        <TabsContent value='charts' className='space-y-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Panel de Selección de Gráficos */}
            <div className='lg:col-span-2'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Seleccionar Gráficos
                  </CardTitle>
                  <CardDescription>
                    Elige los gráficos que quieres incluir en tu reporte
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Filtros */}
                  <div className='flex gap-4'>
                    <div className='flex-1'>
                      <Input
                        placeholder='Search charts...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className='w-48'>
                        <SelectValue placeholder='Categoría' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>
                          All categories
                        </SelectItem>
                        <SelectItem value='overview'>Overview</SelectItem>
                        <SelectItem value='performance'>Performance</SelectItem>
                        <SelectItem value='analysis'>Analysis</SelectItem>
                        <SelectItem value='trends'>Trends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de gráficos */}
                  <div className='space-y-3'>
                    {filteredCharts.map(chart => {
                      const isSelected = selectedCharts.some(
                        selected => selected.id === chart.id
                      );
                      return (
                        <div
                          key={chart.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-muted-foreground/50'
                          }`}
                          onClick={() => handleChartToggle(chart.id)}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleChartToggle(chart.id)}
                              />
                              <div>
                                <h4 className='font-medium'>{chart.title}</h4>
                                <p className='text-sm text-muted-foreground'>
                                  {chart.description}
                                </p>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Badge variant='outline'>{chart.category}</Badge>
                              {isSelected && (
                                <Check className='h-4 w-4 text-primary' />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className='space-y-4'>
              {/* Panel de acciones */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Settings className='h-5 w-5' />
                    Acciones
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    onClick={generateReport}
                    className='w-full gap-2'
                    disabled={
                      selectedCharts.length === 0 &&
                      selectedTrainings.length === 0
                    }
                  >
                    {isGenerating ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <FileImage className='h-4 w-4' />
                        Generar Reporte
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={exportToPDF}
                    variant='outline'
                    className='w-full gap-2'
                    disabled={
                      isExporting ||
                      (selectedCharts.length === 0 &&
                      selectedTrainings.length === 0)
                    }
                  >
                    {isExporting ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
                        Exportando...
                      </>
                    ) : (
                      <>
                        <Download className='h-4 w-4' />
                        Export to PDF
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={printReport}
                    variant='outline'
                    className='w-full gap-2'
                    disabled={
                      selectedCharts.length === 0 &&
                      selectedTrainings.length === 0
                    }
                  >
                    <Printer className='h-4 w-4' />
                    Imprimir Reporte
                  </Button>

                  <Button
                    onClick={clearSelection}
                    variant='outline'
                    className='w-full gap-2'
                    disabled={
                      selectedCharts.length === 0 &&
                      selectedTrainings.length === 0
                    }
                  >
                    <X className='h-4 w-4' />
                    Clear Selection
                  </Button>
                </CardContent>
              </Card>

              {/* Consejos */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Target className='h-5 w-5' />
                    Consejos
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='text-sm text-muted-foreground'>
                    <p>• Selecciona gráficos relevantes para tu análisis</p>
                    <p>• Usa plantillas predefinidas para reportes estándar</p>
                    <p>• Personaliza tu reporte según tus necesidades</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Training Sessions */}
        <TabsContent value='trainings' className='space-y-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Training Selection Panel */}
            <div className='lg:col-span-2'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Select Training Sessions
                  </CardTitle>
                  <CardDescription>
                    Elige los entrenamientos que quieres incluir en tu reporte
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Filtros */}
                  <div className='flex gap-4'>
                    <div className='flex-1'>
                      <Input
                        placeholder='Search training sessions...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Lista de entrenamientos */}
                  <div className='space-y-3'>
                    {filteredTrainings.map(training => {
                      const isSelected = selectedTrainings.some(
                        selected => selected.id === training.id
                      );
                      return (
                        <div
                          key={training.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-muted-foreground/50'
                          }`}
                          onClick={() => handleTrainingToggle(training.id)}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <Checkbox
                                checked={isSelected}
                                onChange={() =>
                                  handleTrainingToggle(training.id)
                                }
                              />
                              <div>
                                <h4 className='font-medium'>
                                  {training.title}
                                </h4>
                                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                                  <div className='flex items-center gap-1'>
                                    <Calendar className='h-3 w-3' />
                                    {format(
                                      new Date(training.date),
                                      'dd MMM yyyy',
                                      { locale: es }
                                    )}
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <Clock className='h-3 w-3' />
                                    {training.duration}min
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <Activity className='h-3 w-3' />
                                    {training.distance}m
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Badge variant='outline'>
                                {training.objective}
                              </Badge>
                              {isSelected && (
                                <Check className='h-4 w-4 text-primary' />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className='space-y-4'>
              {/* Panel de acciones */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Settings className='h-5 w-5' />
                    Acciones
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    onClick={generateReport}
                    className='w-full gap-2'
                    disabled={
                      selectedCharts.length === 0 &&
                      selectedTrainings.length === 0
                    }
                  >
                    {isGenerating ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <FileImage className='h-4 w-4' />
                        Generar Reporte
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={exportToPDF}
                    variant='outline'
                    className='w-full gap-2'
                    disabled={
                      isExporting ||
                      (selectedCharts.length === 0 &&
                      selectedTrainings.length === 0)
                    }
                  >
                    {isExporting ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
                        Exportando...
                      </>
                    ) : (
                      <>
                        <Download className='h-4 w-4' />
                        Export to PDF
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={printReport}
                    variant='outline'
                    className='w-full gap-2'
                    disabled={
                      selectedCharts.length === 0 &&
                      selectedTrainings.length === 0
                    }
                  >
                    <Printer className='h-4 w-4' />
                    Imprimir Reporte
                  </Button>

                  <Button
                    onClick={clearSelection}
                    variant='outline'
                    className='w-full gap-2'
                    disabled={
                      selectedCharts.length === 0 &&
                      selectedTrainings.length === 0
                    }
                  >
                    <X className='h-4 w-4' />
                    Clear Selection
                  </Button>
                </CardContent>
              </Card>

              {/* Consejos */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Target className='h-5 w-5' />
                    Consejos
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='text-sm text-muted-foreground'>
                    <p>
                      • Incluye entrenamientos del período que quieres analizar
                    </p>
                    <p>• Usa plantillas predefinidas para reportes estándar</p>
                    <p>• Personaliza tu reporte según tus necesidades</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Plantillas */}
        <TabsContent value='templates' className='space-y-4'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {reportTemplates.map(template => (
              <Card key={template.id} className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Layout className='h-5 w-5' />
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='text-sm font-medium'>
                      Gráficos incluidos:
                    </div>
                    <div className='flex flex-wrap gap-1'>
                      {template.charts.map(chartId => {
                        const chart = availableCharts.find(
                          c => c.id === chartId
                        );
                        return (
                          <Badge
                            key={chartId}
                            variant='outline'
                            className='text-xs'
                          >
                            {chart?.title}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className='text-sm text-muted-foreground'>
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4' />
                      {template.includeTrainings
                        ? 'Incluye entrenamientos'
                        : 'Solo gráficos'}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleTemplateSelect(template.id)}
                    className='w-full'
                    variant={
                      selectedTemplate === template.id ? 'default' : 'outline'
                    }
                  >
                    {selectedTemplate === template.id
                      ? 'Seleccionado'
                      : 'Seleccionar'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Vista Previa */}
        <TabsContent value='preview' className='space-y-4'>
          <Card className='bg-muted/50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Eye className='h-5 w-5' />
                Vista Previa del Reporte
              </CardTitle>
              <CardDescription>
                Previsualización de tu reporte antes de generarlo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCharts.length === 0 && selectedTrainings.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>
                    Selecciona gráficos y entrenamientos para ver la vista
                    previa
                  </p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {/* Report Summary */}
                  <div className='grid gap-4 md:grid-cols-3'>
                    <Card className='bg-background/50'>
                      <CardContent className='p-4'>
                        <div className='flex items-center gap-2'>
                          <BarChart3 className='h-5 w-5 text-primary' />
                          <span className='font-medium'>Gráficos</span>
                        </div>
                        <div className='text-2xl font-bold mt-2'>
                          {selectedCharts.length}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='bg-background/50'>
                      <CardContent className='p-4'>
                        <div className='flex items-center gap-2'>
                          <FileText className='h-5 w-5 text-primary' />
                          <span className='font-medium'>Training Sessions</span>
                        </div>
                        <div className='text-2xl font-bold mt-2'>
                          {selectedTrainings.length}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='bg-background/50'>
                      <CardContent className='p-4'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-5 w-5 text-primary' />
                          <span className='font-medium'>Período</span>
                        </div>
                        <div className='text-sm mt-2'>
                          {selectedPeriod
                            .replace('last-', 'Últimos ')
                            .replace('-', ' ')}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Lista de elementos seleccionados */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>
                      Elementos incluidos:
                    </h3>

                    {selectedCharts.length > 0 && (
                      <div>
                        <h4 className='font-medium mb-2'>Gráficos:</h4>
                        <div className='space-y-2'>
                          {selectedCharts.map(chart => (
                            <div
                              key={chart.id}
                              className='flex items-center gap-2 p-2 bg-muted/30 rounded'
                            >
                              <BarChart3 className='h-4 w-4' />
                              <span className='text-sm'>{chart.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTrainings.length > 0 && (
                      <div>
                        <h4 className='font-medium mb-2'>Training Sessions:</h4>
                        <div className='space-y-2'>
                          {selectedTrainings.map(training => (
                            <div
                              key={training.id}
                              className='flex items-center gap-2 p-2 bg-muted/30 rounded'
                            >
                              <FileText className='h-4 w-4' />
                              <span className='text-sm'>{training.title}</span>
                              <span className='text-xs text-muted-foreground'>
                                {format(new Date(training.date), 'dd MMM', {
                                  locale: es,
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <ReportsContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
