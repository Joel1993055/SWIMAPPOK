'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    BarChart3,
    Calendar,
    Copy,
    Eye,
    FileText,
    Image,
    Layout,
    Plus,
    Save,
    Table,
    Target,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface TemplateElement {
  id: string;
  type: 'header' | 'chart' | 'table' | 'text' | 'image' | 'kpi' | 'calendar';
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, unknown>;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'planning' | 'training' | 'team' | 'custom';
  userType: 'coach' | 'swimmer' | 'admin' | 'all';
  season: 'preparation' | 'competition' | 'recovery' | 'all';
  elements: TemplateElement[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState<string>('');
  const [templateUserType, setTemplateUserType] = useState<string>('');
  const [templateSeason, setTemplateSeason] = useState<string>('');
  const [templateElements, setTemplateElements] = useState<TemplateElement[]>(
    []
  );

  // Predefined templates
  const defaultTemplates: ReportTemplate[] = [
    {
      id: 'perf-coach-prep',
      name: 'Performance Report - Coach',
      description:
        'Comprehensive performance analysis for coaches in preparation phase',
      category: 'performance',
      userType: 'coach',
      season: 'preparation',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: 'header-1',
          type: 'header',
          title: 'Performance Report',
          content: 'Team performance analysis',
          position: { x: 0, y: 0 },
          size: { width: 12, height: 2 },
          config: { fontSize: 24, alignment: 'center', color: '#1f2937' },
        },
        {
          id: 'kpi-1',
          type: 'kpi',
          title: 'Main KPIs',
          content: 'Key performance metrics',
          position: { x: 0, y: 2 },
          size: { width: 6, height: 4 },
          config: {
            metrics: ['distance', 'time', 'intensity', 'frequency'],
          },
        },
        {
          id: 'chart-1',
          type: 'chart',
          title: 'Performance Evolution',
          content: 'Progress over time chart',
          position: { x: 6, y: 2 },
          size: { width: 6, height: 4 },
          config: { chartType: 'line', dataSource: 'performance' },
        },
        {
          id: 'table-1',
          type: 'table',
          title: 'Swimmer Comparison',
          content: 'Results comparison table',
          position: { x: 0, y: 6 },
          size: { width: 12, height: 4 },
          config: { columns: ['name', 'time', 'improvement', 'category'] },
        },
      ],
    },
    {
      id: 'plan-team-comp',
      name: 'Team Planning - Competition',
      description: 'Detailed planning for important competitions',
      category: 'planning',
      userType: 'coach',
      season: 'competition',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: 'header-2',
          type: 'header',
          title: 'Competition Planning',
          content: 'Strategy and preparation for competition',
          position: { x: 0, y: 0 },
          size: { width: 12, height: 2 },
          config: { fontSize: 24, alignment: 'center', color: '#dc2626' },
        },
        {
          id: 'calendar-1',
          type: 'calendar',
          title: 'Training Schedule',
          content: 'Preparation calendar',
          position: { x: 0, y: 2 },
          size: { width: 8, height: 6 },
          config: { view: 'month', showTraining: true },
        },
        {
          id: 'kpi-2',
          type: 'kpi',
          title: 'Competition Goals',
          content: 'Specific goals and objectives',
          position: { x: 8, y: 2 },
          size: { width: 4, height: 6 },
          config: { metrics: ['goal', 'progress', 'days_remaining'] },
        },
      ],
    },
    {
      id: 'train-swimmer',
      name: 'Training - Swimmer',
      description: 'Personal training summary for swimmers',
      category: 'training',
      userType: 'swimmer',
      season: 'all',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: 'header-3',
          type: 'header',
          title: 'My Trainings',
          content: 'Personal training summary',
          position: { x: 0, y: 0 },
          size: { width: 12, height: 2 },
          config: { fontSize: 24, alignment: 'center', color: '#059669' },
        },
        {
          id: 'chart-2',
          type: 'chart',
          title: 'Personal Progress',
          content: 'My performance evolution',
          position: { x: 0, y: 2 },
          size: { width: 8, height: 4 },
          config: { chartType: 'area', dataSource: 'personal' },
        },
        {
          id: 'kpi-3',
          type: 'kpi',
          title: 'My Stats',
          content: 'Personal metrics',
          position: { x: 8, y: 2 },
          size: { width: 4, height: 4 },
          config: { metrics: ['total_meters', 'sessions', 'best_time'] },
        },
        {
          id: 'table-2',
          type: 'table',
          title: 'Latest Trainings',
          content: 'Recent history',
          position: { x: 0, y: 6 },
          size: { width: 12, height: 4 },
          config: {
            columns: ['date', 'type', 'distance', 'time', 'notes'],
          },
        },
      ],
    },
  ];

  const [templates, setTemplates] =
    useState<ReportTemplate[]>(defaultTemplates);

  const elementTypes = [
    {
      type: 'header',
      label: 'Header',
      icon: FileText,
      description: 'Report title or header',
    },
    {
      type: 'chart',
      label: 'Chart',
      icon: BarChart3,
      description: 'Data and statistics charts',
    },
    {
      type: 'table',
      label: 'Table',
      icon: Table,
      description: 'Structured data tables',
    },
    {
      type: 'kpi',
      label: 'KPI',
      icon: Target,
      description: 'Key metrics and indicators',
    },
    {
      type: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      description: 'Calendar and events view',
    },
    {
      type: 'text',
      label: 'Text',
      icon: FileText,
      description: 'Free text blocks',
    },
    {
      type: 'image',
      label: 'Image',
      icon: Image,
      description: 'Images and logos',
    },
  ];

  const handleCreateTemplate = () => {
    setIsEditing(true);
    setSelectedTemplate(null);
    setTemplateName('');
    setTemplateDescription('');
    setTemplateCategory('');
    setTemplateUserType('');
    setTemplateSeason('');
    setTemplateElements([]);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateCategory(template.category);
    setTemplateUserType(template.userType);
    setTemplateSeason(template.season);
    setTemplateElements([...template.elements]);
  };

  const handleSaveTemplate = () => {
    const newTemplate: ReportTemplate = {
      id: selectedTemplate?.id || `template-${Date.now()}`,
      name: templateName,
      description: templateDescription,
      category: templateCategory as
        | 'performance'
        | 'planning'
        | 'training'
        | 'team'
        | 'custom',
      userType: templateUserType as 'coach' | 'swimmer' | 'admin' | 'all',
      season: templateSeason as
        | 'preparation'
        | 'competition'
        | 'recovery'
        | 'all',
      elements: templateElements,
      isDefault: false,
      createdAt: selectedTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedTemplate) {
      setTemplates(prev =>
        prev.map(t => (t.id === selectedTemplate.id ? newTemplate : t))
      );
    } else {
      setTemplates(prev => [...prev, newTemplate]);
    }

    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleAddElement = (elementType: string) => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type: elementType as
        | 'header'
        | 'chart'
        | 'table'
        | 'text'
        | 'image'
        | 'kpi'
        | 'calendar',
      title: `New ${elementType}`,
      content: `Content of ${elementType}`,
      position: { x: 0, y: templateElements.length * 2 },
      size: { width: 6, height: 3 },
      config: {},
    };

    setTemplateElements(prev => [...prev, newElement]);
  };

  const handleDeleteElement = (elementId: string) => {
    setTemplateElements(prev => prev.filter(el => el.id !== elementId));
  };

  const handleDuplicateTemplate = (template: ReportTemplate) => {
    const duplicatedTemplate: ReportTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev => [...prev, duplicatedTemplate]);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Template Editor</h2>
          <p className='text-muted-foreground'>
            Create and customize report templates for different users and
            seasons
          </p>
        </div>
        <Button onClick={handleCreateTemplate} className='gap-2'>
          <Plus className='h-4 w-4' />
          New Template
        </Button>
      </div>

      <Tabs defaultValue='templates' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='templates'>Templates</TabsTrigger>
          <TabsTrigger value='editor' disabled={!isEditing}>
            Editor
          </TabsTrigger>
          <TabsTrigger value='preview' disabled={!isEditing}>
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Templates list */}
        <TabsContent value='templates' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {templates.map(template => (
              <Card key={template.id} className='bg-muted/50 border-muted'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <CardTitle className='text-lg'>{template.name}</CardTitle>
                      <CardDescription className='text-sm'>
                        {template.description}
                      </CardDescription>
                    </div>
                    {template.isDefault && (
                      <Badge variant='secondary'>Default</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex flex-wrap gap-2'>
                    <Badge variant='outline'>{template.category}</Badge>
                    <Badge variant='outline'>{template.userType}</Badge>
                    <Badge variant='outline'>{template.season}</Badge>
                  </div>

                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Layout className='h-4 w-4' />
                    {template.elements.length} elements
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleEditTemplate(template)}
                      className='flex-1'
                    >
                      <Eye className='h-3 w-3 mr-1' />
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className='h-3 w-3' />
                    </Button>
                    {!template.isDefault && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() =>
                          setTemplates(prev =>
                            prev.filter(t => t.id !== template.id)
                          )
                        }
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Template editor */}
        <TabsContent value='editor' className='space-y-4'>
          <div className='grid gap-6 lg:grid-cols-3'>
            {/* Settings panel */}
            <div className='lg:col-span-1 space-y-4'>
              <Card className='bg-muted/50 border-muted'>
                <CardHeader>
                  <CardTitle className='text-lg'>Settings</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='template-name'>Template name</Label>
                    <Input
                      id='template-name'
                      value={templateName}
                      onChange={e => setTemplateName(e.target.value)}
                      placeholder='My custom template'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='template-description'>Description</Label>
                    <Textarea
                      id='template-description'
                      value={templateDescription}
                      onChange={e => setTemplateDescription(e.target.value)}
                      placeholder='Describe the purpose of this template'
                      rows={3}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='template-category'>Category</Label>
                      <Select
                        value={templateCategory}
                        onValueChange={setTemplateCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='performance'>Performance</SelectItem>
                          <SelectItem value='planning'>Planning</SelectItem>
                          <SelectItem value='training'>Training</SelectItem>
                          <SelectItem value='team'>Team</SelectItem>
                          <SelectItem value='custom'>Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='template-user'>User type</Label>
                      <Select
                        value={templateUserType}
                        onValueChange={setTemplateUserType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='coach'>Coach</SelectItem>
                          <SelectItem value='swimmer'>Swimmer</SelectItem>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='all'>All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='template-season'>Season</Label>
                    <Select
                      value={templateSeason}
                      onValueChange={setTemplateSeason}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='preparation'>Preparation</SelectItem>
                        <SelectItem value='competition'>Competition</SelectItem>
                        <SelectItem value='recovery'>Recovery</SelectItem>
                        <SelectItem value='all'>All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex gap-2'>
                    <Button onClick={handleSaveTemplate} className='flex-1'>
                      <Save className='h-4 w-4 mr-2' />
                      Save
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Available elements */}
              <Card className='bg-muted/50 border-muted'>
                <CardHeader>
                  <CardTitle className='text-lg'>Elements</CardTitle>
                  <CardDescription>Drag elements to the editor</CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {elementTypes.map(element => {
                    const Icon = element.icon;
                    return (
                      <Button
                        key={element.type}
                        variant='outline'
                        className='w-full justify-start h-auto p-3'
                        onClick={() => handleAddElement(element.type)}
                      >
                        <Icon className='h-4 w-4 mr-2' />
                        <div className='text-left'>
                          <div className='font-medium'>{element.label}</div>
                          <div className='text-xs text-muted-foreground'>
                            {element.description}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Visual editor */}
            <div className='lg:col-span-2'>
              <Card className='bg-muted/50 border-muted'>
                <CardHeader>
                  <CardTitle className='text-lg'>Visual Editor</CardTitle>
                  <CardDescription>
                    Design your template by dragging elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='min-h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-4'>
                    {templateElements.length === 0 ? (
                      <div className='flex items-center justify-center h-full text-muted-foreground'>
                        <div className='text-center'>
                          <Layout className='h-12 w-12 mx-auto mb-4 opacity-50' />
                          <p>Drag elements here to create your template</p>
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-12 gap-4'>
                        {templateElements.map(element => {
                          const Icon =
                            elementTypes.find(et => et.type === element.type)
                              ?.icon || FileText;
                          return (
                            <div
                              key={element.id}
                              className={`col-span-${element.size.width} row-span-${element.size.height} border border-muted-foreground/25 rounded-lg p-3 bg-background/50 relative group`}
                            >
                              <div className='flex items-center justify-between mb-2'>
                                <div className='flex items-center gap-2'>
                                  <Icon className='h-4 w-4' />
                                  <span className='font-medium text-sm'>
                                    {element.title}
                                  </span>
                                </div>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100'
                                  onClick={() =>
                                    handleDeleteElement(element.id)
                                  }
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              </div>
                              <div className='text-xs text-muted-foreground'>
                                {element.content}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Preview */}
        <TabsContent value='preview' className='space-y-4'>
          <Card className='bg-muted/50 border-muted'>
            <CardHeader>
              <CardTitle className='text-lg'>Preview</CardTitle>
              <CardDescription>
                This is how your report will look with real data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='min-h-[600px] bg-white rounded-lg p-6 shadow-sm'>
                {templateElements.length === 0 ? (
                  <div className='flex items-center justify-center h-full text-muted-foreground'>
                    <div className='text-center'>
                      <Eye className='h-12 w-12 mx-auto mb-4 opacity-50' />
                      <p>Add elements to see the preview</p>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {templateElements.map(element => {
                      const Icon =
                        elementTypes.find(et => et.type === element.type)
                          ?.icon || FileText;
                      return (
                        <div
                          key={element.id}
                          className='border border-gray-200 rounded-lg p-4'
                        >
                          <div className='flex items-center gap-2 mb-2'>
                            <Icon className='h-4 w-4' />
                            <span className='font-medium'>{element.title}</span>
                          </div>
                          <div className='text-sm text-gray-600'>
                            {element.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
