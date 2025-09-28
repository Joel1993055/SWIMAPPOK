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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useTrainingStore } from '@/core/stores/unified';
import {
  Calendar,
  Edit,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// ==============================
// Data Types
// ==============================
interface TrainingPhase {
  id: string;
  name: string;
  duration: number; // in weeks
  description: string;
  focus: string[];
  intensity: number; // 1-10
  volume: number; // meters per week
  color: string;
  startDate?: string; // Start date (optional)
  endDate?: string; // End date (automatically calculated)
  order: number; // Phase order
  created_at?: string; // Creation date
  updated_at?: string; // Update date
}

// ==============================
// Training Phases Component
// ==============================
export function TrainingPhases() {
  const { 
    phases, 
    addPhase, 
    updatePhase, 
    deletePhase, 
  } = useTrainingStore();

  // State for phase management
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [phaseForm, setPhaseForm] = useState({
    name: '',
    duration: 0,
    description: '',
    focus: [] as string[],
    intensity: 5,
    volume: 0,
    startDate: '',
    order: 1,
  });

  // Initialize selections when data is available
  useEffect(() => {
    if (phases.length > 0 && !selectedPhase) {
      setSelectedPhase(phases[0].id);
    }
  }, [phases, selectedPhase]);

  // Current selections
  const currentPhase = Array.isArray(phases) ? phases.find(phase => phase.id === selectedPhase) : null;

  // Reset phase form when opening add modal
  useEffect(() => {
    if (isAddingPhase && !editingPhase) {
      setPhaseForm({
        name: '',
        duration: 0,
        description: '',
        focus: [],
        intensity: 5,
        volume: 0,
        startDate: '',
        order: phases.length + 1,
      });
    }
  }, [isAddingPhase, editingPhase, phases.length]);

  // ===== Phase editing handlers =====
  const handleEditPhase = (phase: TrainingPhase) => {
    setPhaseForm({
      name: phase.name,
      duration: phase.duration,
      description: phase.description,
      focus: [...phase.focus],
      intensity: phase.intensity,
      volume: phase.volume,
      startDate: phase.startDate || '',
      order: phase.order,
    });
    setEditingPhase(phase.id);
  };

  const handleDeletePhase = (phaseId: string) => {
    deletePhase(phaseId);
    if (selectedPhase === phaseId) {
      setSelectedPhase(phases.length > 1 ? phases.find(p => p.id !== phaseId)?.id || null : null);
    }
  };

  const handleCancelPhase = () => {
    setIsAddingPhase(false);
    setEditingPhase(null);
    setPhaseForm({
      name: '',
      duration: 0,
      description: '',
      focus: [],
      intensity: 5,
      volume: 0,
      startDate: '',
      order: 1,
    });
  };

  const handleSavePhase = () => {
    if (!phaseForm.name || !phaseForm.duration) return;

    const calculateEndDate = (startDate: string, durationWeeks: number): string => {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + durationWeeks * 7);
      return end.toISOString().split('T')[0];
    };

    if (isAddingPhase) {
      const endDate = phaseForm.startDate ? calculateEndDate(phaseForm.startDate, phaseForm.duration) : undefined;

      const newPhase: TrainingPhase = {
        id: `phase-${Date.now()}`,
        name: phaseForm.name,
        duration: phaseForm.duration,
        description: phaseForm.description,
        focus: phaseForm.focus,
        intensity: phaseForm.intensity,
        volume: phaseForm.volume,
        color: 'bg-purple-500',
        startDate: phaseForm.startDate,
        endDate: endDate,
        order: phaseForm.order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      addPhase(newPhase);
      setSelectedPhase(newPhase.id);
    } else if (editingPhase) {
      const updatedPhase: TrainingPhase = {
        id: editingPhase,
        name: phaseForm.name,
        duration: phaseForm.duration,
        description: phaseForm.description,
        focus: phaseForm.focus,
        intensity: phaseForm.intensity,
        volume: phaseForm.volume,
        color: phases.find(p => p.id === editingPhase)?.color || 'bg-purple-500',
        startDate: phaseForm.startDate,
        endDate: phaseForm.startDate ? calculateEndDate(phaseForm.startDate, phaseForm.duration) : undefined,
        order: phaseForm.order,
        created_at: phases.find(p => p.id === editingPhase)?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      updatePhase(editingPhase, {
        name: updatedPhase.name,
        duration: updatedPhase.duration,
        description: updatedPhase.description,
        focus: updatedPhase.focus,
        intensity: updatedPhase.intensity,
        volume: updatedPhase.volume,
        startDate: updatedPhase.startDate,
        endDate: updatedPhase.endDate,
        order: updatedPhase.order,
        updated_at: updatedPhase.updated_at,
      });
    }

    handleCancelPhase();
  };

  // Safe map function
  const safeMap = <T,>(array: T[] | undefined, callback: (item: T, index: number) => React.ReactNode): React.ReactNode[] => {
    if (!Array.isArray(array)) return [];
    return array.map(callback);
  };

  // Debug: Log current phases for troubleshooting
  useEffect(() => {
    console.log('Current phases:', phases);
    console.log('Current date:', new Date().toISOString().split('T')[0]);
    phases.forEach(phase => {
      console.log(`Phase "${phase.name}":`, {
        startDate: phase.startDate,
        endDate: phase.endDate,
        duration: phase.duration
      });
    });
  }, [phases]);

  return (
    <div className="space-y-6">
      {/* Header with better visual hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Training Phases</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Plan and organize your training cycles
          </p>
        </div>
        <div className="flex gap-2">
        <Button
            onClick={() => setIsAddingPhase(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          size="sm"
        >
            <Plus className="h-4 w-4" />
          Add Phase
        </Button>
          <Button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + 28); // 4 weeks
              
              const testPhase: TrainingPhase = {
                id: `test-phase-${Date.now()}`,
                name: 'Test Phase',
                duration: 4,
                description: 'Test phase for debugging',
                focus: ['Aerobic', 'Technique'],
                intensity: 6,
                volume: 20000,
                color: 'bg-blue-500',
                startDate: today,
                endDate: endDate.toISOString().split('T')[0],
                order: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              
              addPhase(testPhase);
            }}
            variant="outline"
            size="sm"
          >
            Add Test Phase
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {phases.length === 0 ? (
        <Card className="bg-muted/30 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">No training phases yet</h4>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
              Create your first training phase to start planning your swimming program
            </p>
            <Button
              onClick={() => setIsAddingPhase(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create First Phase
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Phases grid with better spacing and visual hierarchy */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {safeMap<TrainingPhase>(phases, (phase: TrainingPhase) => (
          <Card 
            key={phase.id} 
                className={`group bg-card border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
                  selectedPhase === phase.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPhase(phase.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{phase.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{phase.duration} weeks</span>
                        <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                  </CardDescription>
                </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleEditPhase(phase);
                        }}
                        className="h-7 w-7 p-0 hover:bg-primary/10"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeletePhase(phase.id);
                        }}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                  {phase.description}
                </p>
                
                  {/* Date range with better styling */}
                  {phase.startDate && phase.endDate && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">Period</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(phase.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}{' '}
                        -{' '}
                        {new Date(phase.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}

                  {/* Metrics with better visual design */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-foreground">{phase.intensity}</div>
                      <div className="text-xs text-muted-foreground">Intensity</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        {phase.volume > 0 ? `${(phase.volume / 1000).toFixed(1)}k` : '0'}
                      </div>
                      <div className="text-xs text-muted-foreground">Volume (m)</div>
                    </div>
                  </div>

                  {/* Focus tags with better styling */}
                  {Array.isArray(phase.focus) && phase.focus.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Focus Areas</p>
                <div className="flex flex-wrap gap-1">
                        {Array.isArray(phase.focus) && phase.focus.slice(0, 3).map((focus, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                      {focus}
                    </Badge>
                  ))}
                        {Array.isArray(phase.focus) && phase.focus.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{Array.isArray(phase.focus) ? phase.focus.length - 3 : 0} more
                    </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
                </div>
                
          {/* Selected phase details with improved design */}
          {currentPhase && (
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${currentPhase.color}`} />
                  <span>{currentPhase.name} - Detailed Overview</span>
                </CardTitle>
                <CardDescription className="text-base">
                  {currentPhase.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key metrics grid */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-background/50 rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {currentPhase.duration}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Weeks Duration</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {currentPhase.intensity}/10
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Target Intensity</div>
                    <Progress value={currentPhase.intensity * 10} className="mt-2 h-2" />
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {(currentPhase?.volume || 0).toLocaleString()}m
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Weekly Volume</div>
                  </div>
                </div>
                
                {/* Training focus with better presentation */}
                {Array.isArray(currentPhase.focus) && currentPhase.focus.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Training Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(currentPhase.focus) && currentPhase.focus.map((focus, index) => (
                        <Badge key={index} variant="default" className="text-sm px-3 py-1">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
          )}
        </>
      )}

      {/* Phase Editing Modal with improved UX */}
      <Dialog open={editingPhase !== null || isAddingPhase} onOpenChange={handleCancelPhase}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">
              {isAddingPhase ? 'Create New Training Phase' : 'Edit Training Phase'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {isAddingPhase 
                ? 'Set up a new training phase with specific goals and parameters' 
                : 'Modify the training phase details and configuration'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information Section */}
          <div className="space-y-4">
              <h4 className="font-semibold text-foreground border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                  <Label htmlFor="phase-name" className="text-sm font-medium">
                    Phase Name *
                  </Label>
              <Input
                id="phase-name"
                    value={phaseForm.name}
                    onChange={e => setPhaseForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Base Training, Competition Prep"
                    className="h-10"
              />
            </div>
            <div className="space-y-2">
                  <Label htmlFor="phase-duration" className="text-sm font-medium">
                    Duration (weeks) *
                  </Label>
                <Input
                  id="phase-duration"
                  type="number"
                  min="1"
                  max="52"
                    value={phaseForm.duration}
                    onChange={e =>
                      setPhaseForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))
                    }
                    placeholder="8"
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phase-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="phase-description"
                  value={phaseForm.description}
                  onChange={e => setPhaseForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the main objectives and focus areas of this training phase..."
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
            
            {/* Training Parameters Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground border-b pb-2">Training Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase-intensity" className="text-sm font-medium">
                    Target Intensity (1-10)
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="phase-intensity"
                      type="number"
                      min="1"
                      max="10"
                      value={phaseForm.intensity}
                      onChange={e =>
                        setPhaseForm(prev => ({ ...prev, intensity: parseInt(e.target.value) || 5 }))
                      }
                      className="h-10"
                    />
                    <div className="flex items-center gap-2">
                      <Progress value={phaseForm.intensity * 10} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">{phaseForm.intensity}/10</span>
                    </div>
                  </div>
                </div>
            <div className="space-y-2">
                  <Label htmlFor="phase-volume" className="text-sm font-medium">
                    Weekly Volume (meters)
                  </Label>
              <Input
                id="phase-volume"
                type="number"
                    min="0"
                    value={phaseForm.volume}
                    onChange={e =>
                      setPhaseForm(prev => ({ ...prev, volume: parseInt(e.target.value) || 0 }))
                    }
                    placeholder="25000"
                    className="h-10"
                  />
                  {phaseForm.volume > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {phaseForm.volume.toLocaleString()}m per week
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Scheduling Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground border-b pb-2">Scheduling</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase-order" className="text-sm font-medium">
                    Phase Order
                  </Label>
                  <Input
                    id="phase-order"
                    type="number"
                    min="1"
                    value={phaseForm.order}
                    onChange={e =>
                      setPhaseForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))
                    }
                    placeholder="1"
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Order in which this phase should be executed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phase-start-date" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="phase-start-date"
                    type="date"
                    value={phaseForm.startDate}
                    onChange={e => setPhaseForm(prev => ({ ...prev, startDate: e.target.value }))}
                    disabled={phaseForm.order > 1}
                    className="h-10"
                  />
                  {phaseForm.order > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Start date will be calculated automatically based on previous phases
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handleCancelPhase}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSavePhase}
              disabled={!phaseForm.name || !phaseForm.duration}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isAddingPhase ? 'Create Phase' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
