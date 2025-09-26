'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useClubsStore } from '@/lib/store/clubs-store';
import { useTrainingStore } from '@/lib/store/unified';
import { TrainingZones } from '@/lib/types/training';
import {
    Activity,
    Bell,
    Building2,
    Download,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Palette,
    Plus,
    RotateCcw,
    Save,
    Settings as SettingsIcon,
    Shield,
    Smartphone,
    Trash2,
    Upload,
    User,
} from 'lucide-react';
import React, { useState } from 'react';
// NEW: Import unified store

function SettingsContent() {
  // Get tab from URL if it exists - Only on client
  const [activeTab, setActiveTab] = useState('profile');
  
  // Use useEffect to access window only on client
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get('tab') || 'profile';
      setActiveTab(tab);
    }
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    weekly: true,
    monthly: false,
    achievements: true,
    reminders: true,
  });

  // MAINTAIN: Existing context
  const {
    selectedMethodology,
    zones: currentZones,
    methodologies,
    setMethodology,
    updateZones,
  } = useTrainingStore();

  // NEW: Clubs store
  const { clubs, teams, addClub, addTeam, deleteClub, deleteTeam } = useClubsStore();

  // OPTIMIZED: Only use what's needed from the store
  const { phases: storePhases } = useTrainingStore();

  // NEW: Sync context data to store
  React.useEffect(() => {
    if (storePhases.length === 0) {
      // If store is empty, do nothing for now
      // Synchronization is handled in the parent component
    }
  }, [storePhases]);

  const [trainingZones, setTrainingZones] = useState(currentZones);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'training', label: 'Training', icon: Activity },
    { id: 'clubes', label: 'Clubs and Teams', icon: Building2 },
    { id: 'account', label: 'Account', icon: Lock },
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleZoneChange = (zone: string, value: string) => {
    setTrainingZones(prev => ({ ...prev, [zone]: value }));
  };

  const resetZonesToDefault = () => {
    const defaultZones = methodologies.standard
      .zones as unknown as TrainingZones;
    setTrainingZones(defaultZones);
    setMethodology('standard');
  };

  const applyMethodology = (methodologyKey: keyof typeof methodologies) => {
    setMethodology(methodologyKey);
    setTrainingZones(
      methodologies[methodologyKey].zones as unknown as TrainingZones
    );
  };

  const handleSaveZones = () => {
    updateZones(trainingZones as unknown as Record<string, string>);
  };

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <SettingsIcon className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground'>Settings</h1>
        </div>
        <p className='text-muted-foreground'>
          Manage your account, preferences and application settings
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Sidebar Navigation */}
        <div className='lg:col-span-1'>
          <Card className='sticky top-8 bg-muted/50'>
            <CardContent className='p-0'>
              <nav className='space-y-1 p-4'>
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-3 space-y-6'>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className='space-y-6'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Profile Picture */}
                  <div className='flex items-center gap-6'>
                    <Avatar className='h-20 w-20'>
                      <AvatarImage src='/avatars/user.jpg' alt='Profile' />
                      <AvatarFallback className='text-lg'>JD</AvatarFallback>
                    </Avatar>
                    <div className='space-y-2'>
                      <Button variant='outline' size='sm' className='gap-2'>
                        <Upload className='h-4 w-4' />
                        Change photo
                      </Button>
                      <p className='text-xs text-muted-foreground'>
                        JPG, PNG or GIF. Maximum 2MB
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='firstName'>First Name</Label>
                      <Input id='firstName' defaultValue='Joel' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='lastName'>Last Name</Label>
                      <Input id='lastName' defaultValue='Díaz' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        defaultValue='joel@example.com'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Phone</Label>
                      <Input
                        id='phone'
                        type='tel'
                        defaultValue='+34 123 456 789'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='bio'>Biography</Label>
                    <Textarea
                      id='bio'
                      placeholder='Tell us about yourself...'
                      defaultValue='Professional swimmer with over 10 years of experience. Specialized in freestyle and butterfly.'
                      className='min-h-[100px]'
                    />
                  </div>

                  <div className='flex justify-end'>
                    <Button className='gap-2'>
                      <Save className='h-4 w-4' />
                      Save changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className='space-y-6'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Bell className='h-5 w-5' />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how and when to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Communication Channels */}
                  <div className='space-y-4'>
                    <h4 className='font-medium text-foreground'>
                      Communication Channels
                    </h4>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                          <Label htmlFor='email-notifications'>
                            Email notifications
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Receive important updates by email
                          </p>
                        </div>
                        <Switch
                          id='email-notifications'
                          checked={notifications.email}
                          onCheckedChange={checked =>
                            handleNotificationChange('email', checked)
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                          <Label htmlFor='push-notifications'>
                            Push notifications
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Receive real-time notifications
                          </p>
                        </div>
                        <Switch
                          id='push-notifications'
                          checked={notifications.push}
                          onCheckedChange={checked =>
                            handleNotificationChange('push', checked)
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                          <Label htmlFor='sms-notifications'>
                            SMS notifications
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Receive important reminders by SMS
                          </p>
                        </div>
                        <Switch
                          id='sms-notifications'
                          checked={notifications.sms}
                          onCheckedChange={checked =>
                            handleNotificationChange('sms', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Activity Notifications */}
                  <div className='space-y-4'>
                    <h4 className='font-medium text-foreground'>
                      Activity and Achievements
                    </h4>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                          <Label htmlFor='achievements'>Achievements and records</Label>
                          <p className='text-sm text-muted-foreground'>
                            Notifications when you reach new achievements
                          </p>
                        </div>
                        <Switch
                          id='achievements'
                          checked={notifications.achievements}
                          onCheckedChange={checked =>
                            handleNotificationChange('achievements', checked)
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                          <Label htmlFor='reminders'>
                            Training reminders
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Recuerdos para tus sesiones programadas
                          </p>
                        </div>
                        <Switch
                          id='reminders'
                          checked={notifications.reminders}
                          onCheckedChange={checked =>
                            handleNotificationChange('reminders', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Reports */}
                  <div className='space-y-4'>
                    <h4 className='font-medium text-foreground'>
                      Reports and Summaries
                    </h4>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                          <Label htmlFor='weekly-reports'>
                            Weekly reports
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Weekly activity summary
                          </p>
                        </div>
                        <Switch
                          id='weekly-reports'
                          checked={notifications.weekly}
                          onCheckedChange={checked =>
                            handleNotificationChange('weekly', checked)
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                          <Label htmlFor='monthly-reports'>
                            Monthly reports
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Detailed analysis of your monthly progress
                          </p>
                        </div>
                        <Switch
                          id='monthly-reports'
                          checked={notifications.monthly}
                          onCheckedChange={checked =>
                            handleNotificationChange('monthly', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className='space-y-6'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5' />
                    Privacidad y Seguridad
                  </CardTitle>
                  <CardDescription>
                    Controla quién puede ver tu información y actividad
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='profile-visibility'>
                          Public profile
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                          Permite que otros usuarios vean tu perfil
                        </p>
                      </div>
                      <Switch id='profile-visibility' defaultChecked />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='activity-sharing'>
                          Share activity
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                          Share your workouts with the community
                        </p>
                      </div>
                      <Switch id='activity-sharing' defaultChecked />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='data-analytics'>
                          Data analysis
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                          Allow use of your data to improve the app
                        </p>
                      </div>
                      <Switch id='data-analytics' defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <h4 className='font-medium text-foreground'>
                      Personal Data
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <Button variant='outline' className='gap-2'>
                        <Download className='h-4 w-4' />
                        Download my data
                      </Button>
                      <Button
                        variant='outline'
                        className='gap-2 text-destructive hover:text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                        Delete account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className='space-y-6'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Palette className='h-5 w-5' />
                    Apariencia
                  </CardTitle>
                  <CardDescription>
                    Customize the application appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='theme'>Tema</Label>
                      <Select defaultValue='system'>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='light'>Claro</SelectItem>
                          <SelectItem value='dark'>Oscuro</SelectItem>
                          <SelectItem value='system'>Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='language'>Idioma</Label>
                      <Select defaultValue='es'>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='es'>Spanish</SelectItem>
                          <SelectItem value='en'>English</SelectItem>
                          <SelectItem value='fr'>Français</SelectItem>
                          <SelectItem value='de'>Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='timezone'>Time zone</Label>
                      <Select defaultValue='europe-madrid'>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='europe-madrid'>
                            Madrid (GMT+1)
                          </SelectItem>
                          <SelectItem value='europe-london'>
                            London (GMT+0)
                          </SelectItem>
                          <SelectItem value='america-new_york'>
                            New York (GMT-5)
                          </SelectItem>
                          <SelectItem value='america-los_angeles'>
                            Los Angeles (GMT-8)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <h4 className='font-medium text-foreground'>
                      Unidades de Medida
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='distance-unit'>Distance</Label>
                        <Select defaultValue='meters'>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='meters'>Metros</SelectItem>
                            <SelectItem value='yards'>Yardas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='temperature-unit'>Temperatura</Label>
                        <Select defaultValue='celsius'>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='celsius'>Celsius</SelectItem>
                            <SelectItem value='fahrenheit'>
                              Fahrenheit
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className='space-y-6'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Activity className='h-5 w-5' />
                    Training Configuration
                  </CardTitle>
                  <CardDescription>
                    Personaliza los nombres de las zonas de entrenamiento según
                    tu metodología
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium text-foreground'>
                          Intensity Zones
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          Customize zone names according to your training system
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={resetZonesToDefault}
                        className='gap-2'
                      >
                        <RotateCcw className='h-4 w-4' />
                        Restore default
                      </Button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='zone1'>Zone 1 (Recovery)</Label>
                        <Input
                          id='zone1'
                          value={trainingZones.z1?.name || ''}
                          onChange={e => handleZoneChange('z1', e.target.value)}
                          placeholder='Ex: Recovery, Regenerative'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='zone2'>Zone 2 (Aerobic Base)</Label>
                        <Input
                          id='zone2'
                          value={trainingZones.z2?.name || ''}
                          onChange={e => handleZoneChange('z2', e.target.value)}
                          placeholder='Ex: Aerobic Base, Endurance'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='zone3'>Zone 3 (Aerobic Threshold)</Label>
                        <Input
                          id='zone3'
                          value={trainingZones.z3?.name || ''}
                          onChange={e => handleZoneChange('z3', e.target.value)}
                          placeholder='Ex: Aerobic Threshold, Tempo'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='zone4'>Zone 4 (VO2 Max)</Label>
                        <Input
                          id='zone4'
                          value={trainingZones.z4?.name || ''}
                          onChange={e => handleZoneChange('z4', e.target.value)}
                          placeholder='Ex: VO2 Max, Intervals'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='zone5'>Zone 5 (Neuromuscular)</Label>
                        <Input
                          id='zone5'
                          value={trainingZones.z5?.name || ''}
                          onChange={e => handleZoneChange('z5', e.target.value)}
                          placeholder='Ex: Neuromuscular, Speed'
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <h4 className='font-medium text-foreground'>
                      Preview
                    </h4>
                    <div className='p-4 bg-muted/30 rounded-lg'>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-medium'>Z1:</span>
                          <span className='text-muted-foreground'>
                            {trainingZones.z1?.name || 'Zone 1'}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-medium'>Z2:</span>
                          <span className='text-muted-foreground'>
                            {trainingZones.z2?.name || 'Zone 2'}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-medium'>Z3:</span>
                          <span className='text-muted-foreground'>
                            {trainingZones.z3?.name || 'Zone 3'}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-medium'>Z4:</span>
                          <span className='text-muted-foreground'>
                            {trainingZones.z4?.name || 'Zone 4'}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-medium'>Z5:</span>
                          <span className='text-muted-foreground'>
                            {trainingZones.z5?.name || 'Zone 5'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <Button onClick={handleSaveZones} className='gap-2'>
                      <Save className='h-4 w-4' />
                      Save configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Activity className='h-5 w-5' />
                    Scientific Methodologies
                  </CardTitle>
                  <CardDescription>
                    Select a training methodology based on scientific research
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {Object.entries(methodologies).map(([key, methodology]) => (
                      <Button
                        key={key}
                        variant={
                          selectedMethodology === key ? 'default' : 'outline'
                        }
                        className='h-auto p-4 flex flex-col items-start gap-2'
                        onClick={() =>
                          applyMethodology(key as keyof typeof methodologies)
                        }
                      >
                        <div className='font-medium'>{methodology.label}</div>
                        <div className='text-xs text-muted-foreground text-left'>
                          {methodology.description}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Clubes Tab */}
          {activeTab === 'clubes' && (
            <div className='space-y-6'>
              {/* Clubes */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Building2 className='h-5 w-5' />
                    Clubes
                  </CardTitle>
                  <CardDescription>
                    Gestiona los clubes de natación
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-lg font-semibold'>Clubes Registrados</h3>
                    <Button size='sm' className='gap-2'>
                      <Plus className='h-4 w-4' />
                      Nuevo Club
                    </Button>
                  </div>
                  
                  <div className='space-y-3'>
                    {clubs.length === 0 ? (
                      <div className='text-center py-8 text-muted-foreground'>
                        <Building2 className='h-12 w-12 mx-auto mb-4 opacity-50' />
                        <p>No hay clubes registrados</p>
                        <p className='text-sm'>Crea tu primer club para comenzar</p>
                      </div>
                    ) : (
                      clubs.map((club) => (
                        <div key={club.id} className='flex items-center justify-between p-3 border rounded-lg'>
                          <div>
                            <h4 className='font-medium'>{club.name}</h4>
                            <p className='text-sm text-muted-foreground'>{club.location}</p>
                          </div>
                          <Button variant='outline' size='sm'>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Equipos */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Equipos
                  </CardTitle>
                  <CardDescription>
                    Gestiona los equipos de cada club
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-lg font-semibold'>Equipos Registrados</h3>
                    <Button size='sm' className='gap-2'>
                      <Plus className='h-4 w-4' />
                      Nuevo Equipo
                    </Button>
                  </div>
                  
                  <div className='space-y-3'>
                    {teams.length === 0 ? (
                      <div className='text-center py-8 text-muted-foreground'>
                        <User className='h-12 w-12 mx-auto mb-4 opacity-50' />
                        <p>No teams registered</p>
                        <p className='text-sm'>Create teams to organize swimmers</p>
                      </div>
                    ) : (
                      teams.map((team) => (
                        <div key={team.id} className='flex items-center justify-between p-3 border rounded-lg'>
                          <div>
                            <h4 className='font-medium'>{team.name}</h4>
                            <p className='text-sm text-muted-foreground'>{team.category}</p>
                          </div>
                          <Button variant='outline' size='sm'>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className='space-y-6'>
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Lock className='h-5 w-5' />
                    Seguridad de la Cuenta
                  </CardTitle>
                  <CardDescription>
                    Gestiona la seguridad de tu cuenta y contraseña
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='current-password'>
                        Contraseña actual
                      </Label>
                      <div className='relative'>
                        <Input
                          id='current-password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Ingresa tu contraseña actual'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='new-password'>New password</Label>
                      <Input
                        id='new-password'
                        type='password'
                        placeholder='Enter your new password'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='confirm-password'>
                        Confirm password
                      </Label>
                      <Input
                        id='confirm-password'
                        type='password'
                        placeholder='Confirm your new password'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <Button className='gap-2'>
                      <Save className='h-4 w-4' />
                      Update password
                    </Button>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <h4 className='font-medium text-foreground'>
                      Active Sessions
                    </h4>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between p-3 border rounded-lg'>
                        <div className='flex items-center gap-3'>
                          <Smartphone className='h-5 w-5 text-muted-foreground' />
                          <div>
                            <p className='font-medium'>iPhone 15 Pro</p>
                            <p className='text-sm text-muted-foreground'>
                              Madrid, Spain
                            </p>
                          </div>
                        </div>
                        <Badge variant='secondary'>Active</Badge>
                      </div>
                      <div className='flex items-center justify-between p-3 border rounded-lg'>
                        <div className='flex items-center gap-3'>
                          <Globe className='h-5 w-5 text-muted-foreground' />
                          <div>
                            <p className='font-medium'>Chrome - Windows</p>
                            <p className='text-sm text-muted-foreground'>
                              Barcelona, Spain
                            </p>
                          </div>
                        </div>
                        <Badge variant='outline'>Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <SettingsContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
