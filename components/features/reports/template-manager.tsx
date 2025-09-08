'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
  Eye,
  Star,
  Users,
  Calendar,
  BarChart3,
  Target,
  FileText,
  Settings,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'planning' | 'training' | 'team' | 'custom';
  userType: 'coach' | 'swimmer' | 'admin' | 'all';
  season: 'preparation' | 'competition' | 'recovery' | 'all';
  isDefault: boolean;
  isFavorite: boolean;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
}

export function TemplateManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Plantillas de ejemplo
  const templates: ReportTemplate[] = [
    {
      id: 'perf-coach-prep',
      name: 'Reporte de Rendimiento - Entrenador',
      description:
        'Análisis completo de rendimiento para entrenadores en fase de preparación',
      category: 'performance',
      userType: 'coach',
      season: 'preparation',
      isDefault: true,
      isFavorite: true,
      usageCount: 45,
      lastUsed: '2024-01-15',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
    },
    {
      id: 'plan-team-comp',
      name: 'Planificación de Equipo - Competición',
      description: 'Planificación detallada para competiciones importantes',
      category: 'planning',
      userType: 'coach',
      season: 'competition',
      isDefault: true,
      isFavorite: false,
      usageCount: 32,
      lastUsed: '2024-01-14',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-14',
    },
    {
      id: 'train-swimmer',
      name: 'Entrenamientos - Nadador',
      description: 'Resumen personal de entrenamientos para nadadores',
      category: 'training',
      userType: 'swimmer',
      season: 'all',
      isDefault: true,
      isFavorite: true,
      usageCount: 78,
      lastUsed: '2024-01-16',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-16',
    },
    {
      id: 'team-analysis',
      name: 'Análisis de Equipo',
      description: 'Comparativa y análisis del rendimiento del equipo completo',
      category: 'team',
      userType: 'coach',
      season: 'all',
      isDefault: false,
      isFavorite: false,
      usageCount: 12,
      lastUsed: '2024-01-10',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10',
    },
    {
      id: 'recovery-report',
      name: 'Reporte de Recuperación',
      description: 'Seguimiento del estado de recuperación y fatiga',
      category: 'performance',
      userType: 'all',
      season: 'recovery',
      isDefault: false,
      isFavorite: true,
      usageCount: 23,
      lastUsed: '2024-01-12',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
    },
  ];

  const [templateList, setTemplateList] = useState<ReportTemplate[]>(templates);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return BarChart3;
      case 'planning':
        return Calendar;
      case 'training':
        return Target;
      case 'team':
        return Users;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance':
        return 'bg-blue-500';
      case 'planning':
        return 'bg-green-500';
      case 'training':
        return 'bg-orange-500';
      case 'team':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'performance':
        return 'Rendimiento';
      case 'planning':
        return 'Planificación';
      case 'training':
        return 'Entrenamiento';
      case 'team':
        return 'Equipo';
      case 'custom':
        return 'Personalizada';
      default:
        return category;
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'coach':
        return 'Entrenador';
      case 'swimmer':
        return 'Nadador';
      case 'admin':
        return 'Administrador';
      case 'all':
        return 'Todos';
      default:
        return userType;
    }
  };

  const getSeasonLabel = (season: string) => {
    switch (season) {
      case 'preparation':
        return 'Preparación';
      case 'competition':
        return 'Competición';
      case 'recovery':
        return 'Recuperación';
      case 'all':
        return 'Todas';
      default:
        return season;
    }
  };

  const filteredTemplates = templateList.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    const matchesUserType =
      selectedUserType === 'all' || template.userType === selectedUserType;
    const matchesSeason =
      selectedSeason === 'all' || template.season === selectedSeason;

    return matchesSearch && matchesCategory && matchesUserType && matchesSeason;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'usage':
        return b.usageCount - a.usageCount;
      case 'lastUsed':
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      case 'created':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const handleUseTemplate = (template: ReportTemplate) => {
    // Aquí se aplicaría la plantilla al reporte actual
    console.log('Usando plantilla:', template.name);
    // Actualizar contador de uso
    setTemplateList(prev =>
      prev.map(t =>
        t.id === template.id
          ? {
              ...t,
              usageCount: t.usageCount + 1,
              lastUsed: new Date().toISOString().split('T')[0],
            }
          : t
      )
    );
  };

  const handleToggleFavorite = (templateId: string) => {
    setTemplateList(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  };

  const handlePreviewTemplate = (template: ReportTemplate) => {
    console.log('Vista previa de plantilla:', template.name);
  };

  const handleDownloadTemplate = (template: ReportTemplate) => {
    console.log('Descargando plantilla:', template.name);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Gestión de Plantillas</h2>
          <p className='text-muted-foreground'>
            Selecciona y aplica plantillas a tus reportes
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' className='gap-2'>
            <Settings className='h-4 w-4' />
            Configurar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className='bg-muted/50 border-muted'>
        <CardHeader>
          <CardTitle className='text-lg'>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-6'>
            <div className='lg:col-span-2'>
              <Label htmlFor='search'>Buscar plantillas</Label>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='search'
                  placeholder='Buscar por nombre o descripción...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='category'>Categoría</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Todas' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas</SelectItem>
                  <SelectItem value='performance'>Rendimiento</SelectItem>
                  <SelectItem value='planning'>Planificación</SelectItem>
                  <SelectItem value='training'>Entrenamiento</SelectItem>
                  <SelectItem value='team'>Equipo</SelectItem>
                  <SelectItem value='custom'>Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='userType'>Tipo de usuario</Label>
              <Select
                value={selectedUserType}
                onValueChange={setSelectedUserType}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Todos' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos</SelectItem>
                  <SelectItem value='coach'>Entrenador</SelectItem>
                  <SelectItem value='swimmer'>Nadador</SelectItem>
                  <SelectItem value='admin'>Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='season'>Temporada</Label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder='Todas' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas</SelectItem>
                  <SelectItem value='preparation'>Preparación</SelectItem>
                  <SelectItem value='competition'>Competición</SelectItem>
                  <SelectItem value='recovery'>Recuperación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='sort'>Ordenar por</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder='Nombre' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Nombre</SelectItem>
                  <SelectItem value='usage'>Uso</SelectItem>
                  <SelectItem value='lastUsed'>Último uso</SelectItem>
                  <SelectItem value='created'>Fecha creación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de plantillas */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {sortedTemplates.map(template => {
          const CategoryIcon = getCategoryIcon(template.category);
          const categoryColor = getCategoryColor(template.category);

          return (
            <Card
              key={template.id}
              className='bg-muted/50 border-muted hover:shadow-md transition-shadow'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className={`p-2 rounded-lg ${categoryColor}`}>
                      <CategoryIcon className='h-4 w-4 text-white' />
                    </div>
                    <div>
                      <CardTitle className='text-lg'>{template.name}</CardTitle>
                      <CardDescription className='text-sm'>
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className='flex items-center gap-1'>
                    {template.isDefault && (
                      <Badge variant='secondary' className='text-xs'>
                        Predefinida
                      </Badge>
                    )}
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-6 w-6 p-0'
                      onClick={() => handleToggleFavorite(template.id)}
                    >
                      <Star
                        className={`h-3 w-3 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='outline' className='text-xs'>
                    {getCategoryLabel(template.category)}
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    {getUserTypeLabel(template.userType)}
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    {getSeasonLabel(template.season)}
                  </Badge>
                </div>

                <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
                  <div>
                    <span className='font-medium'>Usos:</span>{' '}
                    {template.usageCount}
                  </div>
                  <div>
                    <span className='font-medium'>Último uso:</span>{' '}
                    {new Date(template.lastUsed).toLocaleDateString('es-ES')}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={() => handleUseTemplate(template)}
                    className='flex-1'
                  >
                    Usar Plantilla
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    <Eye className='h-3 w-3' />
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleDownloadTemplate(template)}
                  >
                    <Download className='h-3 w-3' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedTemplates.length === 0 && (
        <Card className='bg-muted/50 border-muted'>
          <CardContent className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <Filter className='h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50' />
              <h3 className='text-lg font-semibold mb-2'>
                No se encontraron plantillas
              </h3>
              <p className='text-muted-foreground'>
                Intenta ajustar los filtros o crear una nueva plantilla
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
