'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReportsPDFExport } from '@/core/hooks/use-reports-pdf-export';
import { getSessions, type Session } from '@/infra/config/actions/sessions';
import { format, subDays, subMonths, subWeeks } from 'date-fns';
import {
    BarChart3,
    Calendar,
    ClipboardListIcon,
    Eye,
    FileText,
    Layout,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Data types
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

  // Hook for PDF export
  const { isExporting, exportReport } = useReportsPDFExport();

  // Load sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        // Error handling is done in the hook
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Available charts
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
      title: 'Training Sessions',
      description: 'Distribution of sessions by type and duration',
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
      description: 'Intensity distribution by periods',
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

  // Report templates
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
      name: 'Performance Report',
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

  // Filter sessions by period
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

  // Convert sessions into reports
  const trainingReports: TrainingReport[] = filteredSessions.map(session => ({
    id: session.id,
    title: `Training ${session.stroke || 'Free'}`,
    date: session.date,
    objective: session.objective || 'General',
    distance: session.distance || 0,
    duration: session.duration || 0,
    rpe: session.rpe || 0,
    stroke: session.stroke || 'Free',
    content: session.content || '',
    selected: false,
  }));

  // Filter charts
  const filteredCharts = availableCharts.filter(chart => {
    const matchesSearch =
      chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chart.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'all' || chart.category === selectedType;
    return matchesSearch && matchesType;
  });

  // Filter trainings
  const filteredTrainings = trainingReports.filter(training => {
    const matchesSearch =
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.stroke.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Selection handlers
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Generating report:', {
        template: selectedTemplate,
        charts: selectedCharts,
        trainings: selectedTrainings,
        period: selectedPeriod,
      });
      toast.success('Report generated successfully');
    } catch (error) {
      // Error handling is done in the hook
      toast.error('Error generating the report');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    try {
      const template = reportTemplates.find(t => t.id === selectedTemplate);
      if (!template) {
        toast.error('Please select a report template');
        return;
      }

      // Date range
      let dateRange = template.dateRange;
      if (selectedPeriod === 'last-7-days') {
        dateRange = { start: subDays(new Date(), 7), end: new Date() };
      } else if (selectedPeriod === 'last-30-days') {
        dateRange = { start: subDays(new Date(), 30), end: new Date() };
      } else if (selectedPeriod === 'last-3-months') {
        dateRange = { start: subMonths(new Date(), 3), end: new Date() };
      }

      const chartsPDF = selectedCharts.map(chart => ({
        id: chart.id,
        title: chart.title,
        description: chart.description,
        type: chart.type,
        data: {},
      }));

      const trainingsPDF = selectedTrainings.map(training => ({
        id: training.id,
        title: training.title,
        date: training.date,
        content: training.content,
        zones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
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
      // Error handling is done in the hook
      toast.error(error instanceof Error ? error.message : 'Error exporting PDF');
    }
  };

  const printReport = () => {
    console.log('Printing report:', {
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
          Generate custom reports with charts and training sessions
        </p>
      </div>

      {/* Filters and templates */}
      <div className='flex gap-4 items-center flex-wrap'>
        <div className='flex items-center gap-2'>
          <Calendar className='h-4 w-4' />
          <span className='text-sm font-medium'>Period:</span>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className='w-48'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='last-7-days'>Last 7 days</SelectItem>
            <SelectItem value='last-30-days'>Last 30 days</SelectItem>
            <SelectItem value='last-3-months'>Last 3 months</SelectItem>
            <SelectItem value='last-6-months'>Last 6 months</SelectItem>
            <SelectItem value='last-year'>Last year</SelectItem>
          </SelectContent>
        </Select>

        <div className='flex items-center gap-2'>
          <Layout className='h-4 w-4' />
          <span className='text-sm font-medium'>Template:</span>
        </div>
        <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Select template' />
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
            Items selected for your report
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
                        {format(new Date(training.date), 'dd MMM yyyy')} -{' '}
                        {training.distance}m
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

      {/* Main Content with Tabs */}
      <Tabs defaultValue='charts' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='charts' className='gap-2'>
            <BarChart3 className='h-4 w-4' />
            Charts ({selectedCharts.length})
          </TabsTrigger>
          <TabsTrigger value='trainings' className='gap-2'>
            <FileText className='h-4 w-4' />
            Training Sessions ({selectedTrainings.length})
          </TabsTrigger>
          <TabsTrigger value='templates' className='gap-2'>
            <Layout className='h-4 w-4' />
            Templates
          </TabsTrigger>
          <TabsTrigger value='preview' className='gap-2'>
            <Eye className='h-4 w-4' />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Tab: Charts */}
        <TabsContent value='charts' className='space-y-4'>
          {/* ... charts tab content translated ... */}
        </TabsContent>

        {/* Tab: Training Sessions */}
        <TabsContent value='trainings' className='space-y-4'>
          {/* ... trainings tab content translated ... */}
        </TabsContent>

        {/* Tab: Templates */}
        <TabsContent value='templates' className='space-y-4'>
          {/* ... templates tab content translated ... */}
        </TabsContent>

        {/* Tab: Preview */}
        <TabsContent value='preview' className='space-y-4'>
          {/* ... preview tab content translated ... */}
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
