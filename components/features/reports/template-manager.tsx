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
import {
  BarChart3,
  Calendar,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  Settings,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { useState } from 'react';

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

  // Example templates
  const templates: ReportTemplate[] = [
    {
      id: 'perf-coach-prep',
      name: 'Performance Report - Coach',
      description:
        'Comprehensive performance analysis for coaches in preparation phase',
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
      name: 'Team Planning - Competition',
      description: 'Detailed planning for important competitions',
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
      name: 'Training - Swimmer',
      description: 'Personal training summary for swimmers',
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
      name: 'Team Analysis',
      description: 'Comparison and analysis of full team performance',
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
      name: 'Recovery Report',
      description: 'Monitoring of recovery status and fatigue',
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
        return 'Performance';
      case 'planning':
        return 'Planning';
      case 'training':
        return 'Training';
      case 'team':
        return 'Team';
      case 'custom':
        return 'Custom';
      default:
        return category;
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'coach':
        return 'Coach';
      case 'swimmer':
        return 'Swimmer';
      case 'admin':
        return 'Admin';
      case 'all':
        return 'All';
      default:
        return userType;
    }
  };

  const getSeasonLabel = (season: string) => {
    switch (season) {
      case 'preparation':
        return 'Preparation';
      case 'competition':
        return 'Competition';
      case 'recovery':
        return 'Recovery';
      case 'all':
        return 'All';
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
    // Apply the template to the current report
    console.log('Using template:', template.name);
    // Update usage counter
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
    console.log('Preview template:', template.name);
  };

  const handleDownloadTemplate = (template: ReportTemplate) => {
    console.log('Downloading template:', template.name);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Template Management</h2>
          <p className='text-muted-foreground'>
            Select and apply templates to your reports
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' className='gap-2'>
            <Settings className='h-4 w-4' />
            Configure
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className='bg-muted/50 border-muted'>
        <CardHeader>
          <CardTitle className='text-lg'>Filters and Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-6'>
            <div className='lg:col-span-2'>
              <Label htmlFor='search'>Search templates</Label>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='search'
                  placeholder='Search by name or description...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='category'>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='performance'>Performance</SelectItem>
                  <SelectItem value='planning'>Planning</SelectItem>
                  <SelectItem value='training'>Training</SelectItem>
                  <SelectItem value='team'>Team</SelectItem>
                  <SelectItem value='custom'>Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='userType'>User type</Label>
              <Select
                value={selectedUserType}
                onValueChange={setSelectedUserType}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='coach'>Coach</SelectItem>
                  <SelectItem value='swimmer'>Swimmer</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='season'>Season</Label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='preparation'>Preparation</SelectItem>
                  <SelectItem value='competition'>Competition</SelectItem>
                  <SelectItem value='recovery'>Recovery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='sort'>Sort by</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder='Name' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='usage'>Usage</SelectItem>
                  <SelectItem value='lastUsed'>Last used</SelectItem>
                  <SelectItem value='created'>Created date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template list */}
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
                        Default
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
                    <span className='font-medium'>Uses:</span>{' '}
                    {template.usageCount}
                  </div>
                  <div>
                    <span className='font-medium'>Last used:</span>{' '}
                    {new Date(template.lastUsed).toLocaleDateString('en-US')}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={() => handleUseTemplate(template)}
                    className='flex-1'
                  >
                    Use Template
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
                No templates found
              </h3>
              <p className='text-muted-foreground'>
                Try adjusting the filters or create a new template
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
