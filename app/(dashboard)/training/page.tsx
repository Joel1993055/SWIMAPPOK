'use client';

import { MobileSessionForm } from '@/components/features/mobile';
import { AIZoneDetection } from '@/components/features/training/ai-zone-detection';
import { PDFExportButton, useTrainingPDFData } from '@/components/features/training/pdf-export-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/core/contexts/app-context';
import { useSessionsData } from '@/core/hooks/use-sessions-data';
import type { Session } from '@/core/types/session';
import { createSession, deleteSession, updateSession, type Session as SupabaseSession } from '@/infra/config/actions/sessions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar as CalendarIcon,
    Edit,
    FileText,
    MapPin,
    Plus,
    Save,
    Target,
    Trash2,
    Users
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// =====================================================
// TIPOS DE DATOS
// =====================================================
interface TrainingFormData {
  title: string;
  date: Date;
  location: string;
  coach: string;
  content: string;
  objective: string;
  timeSlot: 'AM' | 'PM';
  club: string;
  group: string;
  zoneVolumes: ZoneVolumeRow[];
}

interface ZoneVolumeRow {
  z1: number;
  z2: number;
  z3: number;
  z4: number;
  z5: number;
}

interface ClubData {
  name: string;
  groups: Array<{ id: string; name: string }>;
}

interface ClubsData {
  [key: string]: ClubData;
}

// =====================================================
// CONSTANTS
// =====================================================
const OBJECTIVE_OPTIONS = [
  { value: 'endurance', label: 'Endurance' },
  { value: 'speed', label: 'Speed' },
  { value: 'technique', label: 'Technique' },
  { value: 'strength', label: 'Strength' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'competition', label: 'Competition' },
  { value: 'test', label: 'Test' },
  { value: 'other', label: 'Other' },
] as const;

// =====================================================
// UTILITIES
// =====================================================
const mapSupabaseToSession = (supabaseSession: SupabaseSession): Session => ({
  id: supabaseSession.id,
  date: supabaseSession.date,
  swimmer: supabaseSession.coach || 'N/A',
  distance: supabaseSession.distance,
  stroke: supabaseSession.stroke as Session['stroke'],
  sessionType: supabaseSession.type as Session['sessionType'],
  mainSet: supabaseSession.content || '',
  notes: supabaseSession.objective || '',
});

const mapSessionToSupabase = (session: Session): SupabaseSession => ({
  id: session.id,
  user_id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  title: session.mainSet || '',
  date: session.date,
  type: session.sessionType || 'Personalizado',
  duration: 0,
  distance: session.distance || 0,
  stroke: session.stroke || 'Libre',
  rpe: 5,
  location: '',
  coach: session.swimmer || '',
  club: '',
  group_name: '',
  objective: session.notes || '',
  time_slot: 'AM',
  content: session.mainSet || '',
  zone_volumes: {
    z1: 0,
    z2: 0,
    z3: 0,
    z4: 0,
    z5: 0,
  },
});

const createEmptyZoneVolumes = (): ZoneVolumeRow[] =>
        Array.from({ length: 10 }, () => ({
          z1: 0,
          z2: 0,
          z3: 0,
          z4: 0,
          z5: 0,
  }));

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function TrainingPage() {
  return <TrainingPageContent />;
}

// =====================================================
// MAIN CONTENT COMPONENT
// =====================================================
function TrainingPageContent() {
  // Main states
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [editingTraining, setEditingTraining] = useState<Session | null>(null);
  const [showMobileForm, setShowMobileForm] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Device detection
  const deviceType = useDeviceType();

  // App context for club/group selection
  const { 
    selectedClub, 
    selectedGroup, 
    currentClub, 
    currentGroup, 
    availableGroups,
    isLoading: contextLoading 
  } = useAppContext();

  // Data hook
  const { sessions, isLoading: dataLoading, loadSessions } = useSessionsData();

  // =====================================================
  // EFECTOS
  // =====================================================
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // =====================================================
  // FUNCIONES DE MANEJO
  // =====================================================
  const handleEditTraining = useCallback((training: Session) => {
    setEditingTraining(training);
    setActiveTab('create');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTraining(null);
    setError(null);
    setSuccess(null);
  }, []);

  const handleSaveSuccess = useCallback((message: string) => {
    setSuccess(message);
    setEditingTraining(null);
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  const handleSaveError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleMobileFormSuccess = useCallback(async () => {
    setShowMobileForm(false);
    setSuccess('Sesión creada exitosamente');
    setTimeout(() => setSuccess(null), 3000);
    
    // Reload sessions to show changes
    setIsRefreshing(true);
    try {
      await loadSessions(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadSessions]);

  const handleMobileFormCancel = useCallback(() => {
    setShowMobileForm(false);
  }, []);

  const handleDeleteTraining = useCallback(
    async (id: string) => {
    if (!confirm('Are you sure you want to delete this training?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteSession(id);
        
        // Reload sessions to show changes
        setIsRefreshing(true);
        try {
          await loadSessions(true);
        } finally {
          setIsRefreshing(false);
        }
        
        handleSaveSuccess('Training deleted successfully');
    } catch (error) {
      // Error handling is done in the hook
        handleSaveError('Error deleting training');
    } finally {
      setIsLoading(false);
    }
    },
    [handleSaveSuccess, handleSaveError, loadSessions]
  );

  // =====================================================
  // RENDERIZADO
  // =====================================================
  if (!isHydrated) {
    return <TrainingPageSkeleton />;
  }

  // Show mobile form if requested
  if (showMobileForm && deviceType === 'mobile') {
    return (
      <MobileSessionForm
        defaultDate={new Date().toISOString().split('T')[0]}
        onSuccess={handleMobileFormSuccess}
        onCancel={handleMobileFormCancel}
      />
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Training</h1>
        </div>
        <p className="text-muted-foreground">
          Create and manage your personalized training sessions
        </p>

        {/* Status messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex gap-2 mt-6">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => {
              if (deviceType === 'mobile') {
                setShowMobileForm(true);
              } else {
                setActiveTab('create');
              }
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {editingTraining ? 'Editing' : 'Create Training'}
          </Button>
          <Button
            variant={activeTab === 'saved' ? 'default' : 'outline'}
            onClick={() => setActiveTab('saved')}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Saved Training ({sessions.length})
          </Button>
        </div>
      </div>

      {/* Main content */}
      {activeTab === 'create' ? (
        <TrainingForm
          editingTraining={editingTraining}
          onSaveSuccess={handleSaveSuccess}
          onSaveError={handleSaveError}
          onCancelEdit={handleCancelEdit}
          objectiveOptions={OBJECTIVE_OPTIONS}
          onRefresh={async () => {
            setIsRefreshing(true);
            try {
              await loadSessions(true);
            } finally {
              setIsRefreshing(false);
            }
          }}
        />
      ) : (
        <TrainingList
          sessions={sessions}
          isLoading={dataLoading || isRefreshing}
          onEdit={handleEditTraining}
          onDelete={handleDeleteTraining}
        />
      )}
    </div>
  );
}

// =====================================================
// TRAINING FORM COMPONENT
// =====================================================
interface TrainingFormProps {
  editingTraining: Session | null;
  onSaveSuccess: (message: string) => void;
  onSaveError: (message: string) => void;
  onCancelEdit: () => void;
  objectiveOptions: Array<{ value: string; label: string }>;
  onRefresh: () => Promise<void>;
}

function TrainingForm({
  editingTraining,
  onSaveSuccess,
  onSaveError,
  onCancelEdit,
  objectiveOptions,
  onRefresh,
}: TrainingFormProps) {
  // App context for club/group selection
  const { 
    selectedClub, 
    selectedGroup, 
    currentClub, 
    currentGroup, 
    availableGroups 
  } = useAppContext();

  // Form states
  const [formData, setFormData] = useState<TrainingFormData>(() => ({
    title: '',
    date: new Date(),
    location: '',
    coach: '',
    content: '',
    objective: '',
    timeSlot: 'AM',
    club: currentClub?.name || '',
    group: currentGroup?.name || '',
    zoneVolumes: createEmptyZoneVolumes(),
  }));

  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // EFECTOS
  // =====================================================
  useEffect(() => {
    if (editingTraining) {
      const supabaseTraining = mapSessionToSupabase(editingTraining);
      setFormData({
        title: supabaseTraining.title || '',
        date: new Date(editingTraining.date),
        location: supabaseTraining.location || '',
        coach: supabaseTraining.coach || '',
        content: supabaseTraining.content || '',
        objective: supabaseTraining.objective || '',
        timeSlot: (supabaseTraining.time_slot as 'AM' | 'PM') || 'AM',
        club: currentClub?.name || '',
        group: currentGroup?.name || '',
        zoneVolumes: createEmptyZoneVolumes(),
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        date: new Date(),
        location: '',
        coach: '',
        content: '',
        objective: '',
        timeSlot: 'AM',
        club: currentClub?.name || '',
        group: currentGroup?.name || '',
        zoneVolumes: createEmptyZoneVolumes(),
      });
    }
  }, [editingTraining, currentClub, currentGroup]);

  // =====================================================
  // FUNCIONES DE MANEJO
  // =====================================================
  const handleInputChange = useCallback((field: keyof TrainingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClubChange = useCallback((clubId: string) => {
    const club = availableGroups.find(g => g.club_id === clubId);
    if (club) {
      setFormData(prev => ({ ...prev, club: club.club_name }));
    }
  }, [availableGroups]);

  const handleZoneVolumeChange = useCallback((
    rowIndex: number,
    zone: keyof ZoneVolumeRow,
    value: string
  ) => {
    const numericValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      zoneVolumes: prev.zoneVolumes.map((row, index) =>
        index === rowIndex ? { ...row, [zone]: numericValue } : row
      ),
    }));
  }, []);

  // Function to apply AI-detected zones
  const setZoneTotals = useCallback((zones: { z1: number; z2: number; z3: number; z4: number; z5: number }) => {
    // Create a new volume matrix with zones detected in the first row
    const newZoneVolumes = [...formData.zoneVolumes];
    newZoneVolumes[0] = {
      z1: zones.z1,
      z2: zones.z2,
      z3: zones.z3,
      z4: zones.z4,
      z5: zones.z5,
    };
    
    setFormData(prev => ({
      ...prev,
      zoneVolumes: newZoneVolumes,
    }));
  }, [formData.zoneVolumes]);

  const handleSave = useCallback(async () => {
    if (!formData.title || !formData.content) {
      onSaveError('Please complete the title and content of the training');
      return;
    }

    try {
      setIsLoading(true);

      const selectedClubData = clubsData[formData.club];
      const selectedGroupData = selectedClubData?.groups.find(g => g.id === formData.group);

      // Calculate total meters by zone
      const zoneTotals = {
        z1: formData.zoneVolumes.reduce((sum, row) => sum + row.z1, 0),
        z2: formData.zoneVolumes.reduce((sum, row) => sum + row.z2, 0),
        z3: formData.zoneVolumes.reduce((sum, row) => sum + row.z3, 0),
        z4: formData.zoneVolumes.reduce((sum, row) => sum + row.z4, 0),
        z5: formData.zoneVolumes.reduce((sum, row) => sum + row.z5, 0),
      };

      const totalMeters = Object.values(zoneTotals).reduce((sum, volume) => sum + volume, 0);

      // Create FormData with all data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date.toISOString().split('T')[0]);
      formDataToSend.append('type', 'Personalizado');
      formDataToSend.append('duration', '90');
      formDataToSend.append('distance', totalMeters.toString());
      formDataToSend.append('stroke', 'Libre');
      formDataToSend.append('rpe', '5');
      formDataToSend.append('location', formData.location || 'No especificado');
      formDataToSend.append('coach', formData.coach || 'No especificado');
      formDataToSend.append('club', selectedClubData?.name || 'No especificado');
      formDataToSend.append('group_name', selectedGroupData?.name || 'No especificado');
      formDataToSend.append('content', formData.content);

      // Add volumes by zone (this is what gets saved to the database)
      formDataToSend.append('z1', zoneTotals.z1.toString());
      formDataToSend.append('z2', zoneTotals.z2.toString());
      formDataToSend.append('z3', zoneTotals.z3.toString());
      formDataToSend.append('z4', zoneTotals.z4.toString());
      formDataToSend.append('z5', zoneTotals.z5.toString());

      console.log('Saving training with data:', {
        title: formData.title,
        date: formData.date.toISOString().split('T')[0],
        type: 'Personalizado',
        stroke: 'Libre',
        totalMeters,
        zoneTotals,
        club: selectedClubData?.name,
        group: selectedGroupData?.name,
        content: formData.content,
      });

      if (editingTraining) {
        await updateSession(editingTraining.id, formDataToSend);
        onSaveSuccess('Training updated successfully');
      } else {
        await createSession(formDataToSend);
        onSaveSuccess('Training saved successfully');
      }

      // Reload sessions to show changes
      await onRefresh();


      // Reset form only if we're not editing
      if (!editingTraining) {
        setFormData({
          title: '',
          date: new Date(),
          location: '',
          coach: '',
          content: '',
          objective: '',
          timeSlot: 'AM',
          club: 'club-1',
          group: 'group-1-1',
          zoneVolumes: createEmptyZoneVolumes(),
        });
      }

    } catch (error) {
      console.error('Error saving training:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', {
        error: errorMessage,
        formData: {
          title: formData.title,
          content: formData.content,
          totalMeters,
          zoneTotals,
        }
      });
      onSaveError(`Error saving training: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [formData, editingTraining, clubsData, onSaveSuccess, onSaveError, onRefresh]);

  // =====================================================
  // DERIVED CALCULATIONS
  // =====================================================
  const totalMeters = useMemo(() => {
    return formData.zoneVolumes.reduce((total, row) => {
      return total + Object.values(row).reduce((sum, volume) => sum + volume, 0);
    }, 0);
  }, [formData.zoneVolumes]);

  const selectedClubGroups = useMemo(() => {
    return availableGroups.filter(group => group.club_id === selectedClub);
  }, [availableGroups, selectedClub]);

  // =====================================================
  // RENDERIZADO
  // =====================================================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
      <div className="lg:col-span-2">
        <Card className="bg-muted/50">
              <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingTraining ? 'Edit Training' : 'Create New Training'}
                </CardTitle>
                <CardDescription>
                  {editingTraining
                    ? 'Modify your training details'
                    : 'Write your training with all the details'}
                </CardDescription>
              </CardHeader>
          <CardContent className="space-y-6">
                {/* Basic information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="training-title">Training Title</Label>
                    <Input
                  id="training-title"
                  placeholder="Ex: Endurance training"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-date">Date</Label>
                <div className="flex gap-2">
                      <Input
                    type="date"
                    value={formData.date.toISOString().split('T')[0]}
                        onChange={e => {
                          const dateValue = e.target.value;
                          if (dateValue) {
                        handleInputChange('date', new Date(dateValue));
                          }
                        }}
                    className="flex-1"
                      />
                      <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleInputChange('date', new Date())}
                      >
                        Today
                      </Button>
                    </div>
                <div className="text-sm text-muted-foreground">
                  Selected date: {format(formData.date, 'dd/MM/yyyy', { locale: es })}
                    </div>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-location">Location</Label>
                    <Input
                  id="training-location"
                  placeholder="Ex: Municipal Pool"
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-coach">Coach</Label>
                    <Input
                  id="training-coach"
                  placeholder="Ex: Maria Garcia"
                  value={formData.coach}
                  onChange={e => handleInputChange('coach', e.target.value)}
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-club">Club</Label>
                <Select value={formData.club} onValueChange={handleClubChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select club" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentClub && (
                      <SelectItem key={currentClub.id} value={currentClub.name}>
                        {currentClub.name}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="training-group">Group</Label>
                    <Select
                  value={formData.group}
                  onValueChange={value => handleInputChange('group', value)}
                    >
                      <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                    {selectedClubGroups.map(group => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name}
                      </SelectItem>
                    ))}
                      </SelectContent>
                    </Select>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-objective">Training Objective</Label>
                    <Select
                  value={formData.objective}
                  onValueChange={value => handleInputChange('objective', value)}
                    >
                      <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                      <SelectContent>
                    {objectiveOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                        </SelectItem>
                    ))}
                      </SelectContent>
                    </Select>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="training-time-slot">Schedule</Label>
                    <Select
                  value={formData.timeSlot}
                  onValueChange={value => handleInputChange('timeSlot', value as 'AM' | 'PM')}
                    >
                      <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                    <SelectItem value="AM">AM (Morning)</SelectItem>
                    <SelectItem value="PM">PM (Afternoon/Evening)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

            {/* Content editor */}
            <div className="space-y-2">
              <Label htmlFor="training-content">Training Content</Label>
              <Textarea
                id="training-content"
                placeholder="Write your training here... Example:&#10;&#10;Warm-up: 200m freestyle Z1&#10;Main set: 8x100m freestyle Z3 with 20s rest&#10;Cool-down: 200m backstroke Z1&#10;&#10;You can include:&#10;- Distances (200m, 1.5km)&#10;- Times (45min, 1h 30min)&#10;- Zones (Z1, Z2, Z3, Z4, Z5)&#10;- Styles (freestyle, backstroke, breaststroke, butterfly)"
                value={formData.content}
                onChange={e => handleInputChange('content', e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </div>

            {/* Volumes by zone - Below content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Volumes by Zone</Label>
                <div className="text-sm text-muted-foreground">
                  Total: <span className="font-semibold text-foreground">{totalMeters.toLocaleString()}m</span>
                </div>
              </div>

              {/* Single row with 5 cells for zones */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { zone: 'Z1', color: 'bg-green-100 dark:bg-green-900/20', name: 'Recovery', key: 'z1' },
                  { zone: 'Z2', color: 'bg-blue-100 dark:bg-blue-900/20', name: 'Aerobic Base', key: 'z2' },
                  { zone: 'Z3', color: 'bg-yellow-100 dark:bg-yellow-900/20', name: 'Aerobic Threshold', key: 'z3' },
                  { zone: 'Z4', color: 'bg-orange-100 dark:bg-orange-900/20', name: 'Anaerobic Lactic', key: 'z4' },
                  { zone: 'Z5', color: 'bg-red-100 dark:bg-red-900/20', name: 'Anaerobic Alactic', key: 'z5' },
                ].map(({ zone, color, name, key }) => {
                  const total = formData.zoneVolumes.reduce(
                    (sum, row) => sum + row[key as keyof ZoneVolumeRow],
                    0
                  );
                  
                  return (
                    <div key={zone} className={`p-4 rounded-lg border ${color} hover:shadow-md transition-shadow`}>
                      <div className="text-center mb-3">
                        <div className="font-bold text-xl">{zone}</div>
                        <div className="text-xs text-muted-foreground">{name}</div>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        step="50"
                        placeholder="0"
                        value={total || ''}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          setFormData(prev => ({
                            ...prev,
                            zoneVolumes: prev.zoneVolumes.map((row, index) =>
                              index === 0 ? { ...row, [key]: value } : { ...row, [key]: 0 }
                            ),
                          }));
                        }}
                        className="text-center font-mono text-sm h-10"
                      />
                      <div className="text-xs text-muted-foreground text-center mt-2 font-medium">
                        {total > 0 ? `${total.toLocaleString()}m` : '0m'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Utility buttons */}
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      zoneVolumes: createEmptyZoneVolumes(),
                    }));
                  }}
                  className="text-xs"
                >
                  Clear Zones
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Fill with example data
                    setFormData(prev => ({
                      ...prev,
                      zoneVolumes: [
                        { z1: 200, z2: 400, z3: 600, z4: 200, z5: 100 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                        { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
                      ],
                    }));
                  }}
                  className="text-xs"
                >
                  Example
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 text-center">
                <div>💡 <strong>Tip:</strong> Enter the meters you swam in each intensity zone.</div>
                <div>📊 <strong>Calculated total:</strong> {totalMeters.toLocaleString()} meters</div>
              </div>
            </div>

                {/* Action buttons */}
            <div className="flex justify-between">
                  <div>
                    {editingTraining && (
                  <Button variant="outline" onClick={onCancelEdit} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                        Cancel Edit
                      </Button>
                    )}
                  </div>
              <div className="flex gap-2">
                    <Button
                  variant="outline"
                  onClick={() => handleInputChange('content', '')}
                    >
                      Clear
                    </Button>
                <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                      {isLoading ? (
                        <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                      <Save className="h-4 w-4" />
                      {editingTraining ? 'Update' : 'Save'} Training
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Side panel */}
      <div className="lg:col-span-1 space-y-6">
            {/* Automatic AI Detection */}
            <AIZoneDetection
              content={formData.content}
              objective={formData.objective}
              timeSlot={formData.timeSlot}
              onZonesDetected={(zones) => {
                setZoneTotals(zones);
              }}
              disabled={isLoading}
            />

            {/* Help Panel */}
        <Card className="bg-muted/50">
              <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
                  Writing Tips
                </CardTitle>
            <CardDescription>Best practices for creating training sessions</CardDescription>
              </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                  <div>
                <h4 className="font-medium mb-2">Recommended structure:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Warm-up:</strong> 200-400m Z1</li>
                  <li>• <strong>Main set:</strong> Specific exercises</li>
                  <li>• <strong>Cool-down:</strong> 200-300m Z1</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                <h4 className="font-medium mb-2">Distance format:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 200m, 400m, 800m</li>
                      <li>• 1km, 1.5km, 2km</li>
                      <li>• 2000 meters</li>
                    </ul>
                  </div>

                  <div>
                <h4 className="font-medium mb-2">Intensity zones:</h4>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {['Z1', 'Z2', 'Z3', 'Z4', 'Z5'].map(zone => (
                      <Badge key={zone} variant="outline">{zone}</Badge>
                    ))}
                      </div>
                  <div className="text-xs text-muted-foreground">
                    <div>• <strong>Z1:</strong> Active recovery</div>
                    <div>• <strong>Z2:</strong> Aerobic base</div>
                    <div>• <strong>Z3:</strong> Aerobic threshold</div>
                    <div>• <strong>Z4:</strong> Anaerobic lactic</div>
                    <div>• <strong>Z5:</strong> Anaerobic alactic</div>
                        </div>
                    </div>
                  </div>

                  <div>
                <h4 className="font-medium mb-2">Swimming styles:</h4>
                <div className="flex flex-wrap gap-1">
                  {['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly'].map(style => (
                    <Badge key={style} variant="secondary">{style}</Badge>
                  ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
  );
}

// =====================================================
// TRAINING LIST COMPONENT
// =====================================================
interface TrainingListProps {
  sessions: Session[];
  isLoading: boolean;
  onEdit: (training: Session) => void;
  onDelete: (id: string) => void;
}

function TrainingList({ sessions, isLoading, onEdit, onDelete }: TrainingListProps) {
  const { convertSessionToPDFData } = useTrainingPDFData();
  
  if (isLoading) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="text-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent mx-auto mb-4" />
          <p>Updating training...</p>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">You have no saved training sessions</p>
          <p className="text-sm text-muted-foreground">
            Create your first training session in the "Create Training" tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Saved Training Sessions</CardTitle>
              <CardDescription>{sessions.length} saved training sessions</CardDescription>
            </CardHeader>
            <CardContent>
        <div className="space-y-4">
          {sessions.map(training => (
            <div key={training.id} className="border rounded-lg p-4 bg-background/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{training.mainSet}</h3>
                    <Badge variant="outline">{training.sessionType}</Badge>
                    <Badge variant="secondary">{training.stroke}</Badge>
                          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(training.date), 'dd/MM/yyyy', { locale: es })}</span>
                            </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                              <span>{training.distance}m</span>
                            </div>
                          </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                            <span>N/A</span>
                    <Users className="h-4 w-4 ml-4" />
                            <span>{training.swimmer}</span>
                          </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <pre className="text-sm whitespace-pre-wrap font-mono">{training.mainSet}</pre>
                          </div>
                        </div>

                <div className="ml-4 flex gap-2">
                          <PDFExportButton
                    training={convertSessionToPDFData(training)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    PDF
                  </PDFExportButton>
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(training)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(training.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
          ))}
              </div>
            </CardContent>
          </Card>
  );
}

// =====================================================
// LOADING COMPONENT
// =====================================================
function TrainingPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Training</h1>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Initializing form...
        </div>
      </div>
    </div>
  );
}