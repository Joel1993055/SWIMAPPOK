'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { TrainingZones } from '@/core/hooks/use-settings';
import { useTrainingStore } from '@/core/stores/unified';
import { Activity, RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';

interface TrainingTabProps {
  trainingZones: TrainingZones | null;
  onSaveZones: (zones: TrainingZones) => Promise<void>;
  onApplyMethodology: (methodology: string) => Promise<void>;
  isSaving: boolean;
}

export function TrainingTab({ 
  trainingZones, 
  onSaveZones, 
  onApplyMethodology, 
  isSaving 
}: TrainingTabProps) {
  const { methodologies, selectedMethodology } = useTrainingStore();
  const [localZones, setLocalZones] = useState<TrainingZones | null>(trainingZones);
  const [hasChanges, setHasChanges] = useState(false);

  const handleZoneChange = (zone: keyof TrainingZones, field: 'name' | 'min' | 'max', value: string) => {
    if (!localZones) return;
    
    setLocalZones(prev => ({
      ...prev!,
      [zone]: {
        ...prev![zone],
        [field]: field === 'name' ? value : Number(value)
      }
    }));
    setHasChanges(true);
  };

  const resetZonesToDefault = () => {
    const defaultZones = methodologies.standard.zones as unknown as TrainingZones;
    setLocalZones(defaultZones);
    setHasChanges(true);
  };

  const handleSaveZones = async () => {
    if (!localZones) return;
    
    try {
      await onSaveZones(localZones);
      setHasChanges(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleApplyMethodology = async (methodologyKey: string) => {
    try {
      await onApplyMethodology(methodologyKey);
      // Update local zones after applying methodology
      const newZones = methodologies[methodologyKey as keyof typeof methodologies]?.zones as unknown as TrainingZones;
      if (newZones) {
        setLocalZones(newZones);
        setHasChanges(false);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (!localZones) {
    return (
      <div className="space-y-6">
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Loading training configuration...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zones Configuration */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Training Configuration
          </CardTitle>
          <CardDescription>
            Customize training zone names according to your methodology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">
                  Intensity Zones
                </h4>
                <p className="text-sm text-muted-foreground">
                  Customize zone names according to your training system
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetZonesToDefault}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restore default
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zone1">Zone 1 (Recovery)</Label>
                <Input
                  id="zone1"
                  value={localZones.z1?.name || ''}
                  onChange={(e) => handleZoneChange('z1', 'name', e.target.value)}
                  placeholder="Ex: Recovery, Regenerative"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone2">Zone 2 (Aerobic Base)</Label>
                <Input
                  id="zone2"
                  value={localZones.z2?.name || ''}
                  onChange={(e) => handleZoneChange('z2', 'name', e.target.value)}
                  placeholder="Ex: Aerobic Base, Endurance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone3">Zone 3 (Aerobic Threshold)</Label>
                <Input
                  id="zone3"
                  value={localZones.z3?.name || ''}
                  onChange={(e) => handleZoneChange('z3', 'name', e.target.value)}
                  placeholder="Ex: Aerobic Threshold, Tempo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone4">Zone 4 (VO2 Max)</Label>
                <Input
                  id="zone4"
                  value={localZones.z4?.name || ''}
                  onChange={(e) => handleZoneChange('z4', 'name', e.target.value)}
                  placeholder="Ex: VO2 Max, Intervals"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone5">Zone 5 (Neuromuscular)</Label>
                <Input
                  id="zone5"
                  value={localZones.z5?.name || ''}
                  onChange={(e) => handleZoneChange('z5', 'name', e.target.value)}
                  placeholder="Ex: Neuromuscular, Speed"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Preview */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Preview</h4>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                {Object.entries(localZones).map(([key, zone]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{key.toUpperCase()}:</span>
                    <span className="text-muted-foreground">
                      {zone?.name || `Zone ${key.slice(1)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveZones} 
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Methodologies */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Scientific Methodologies
          </CardTitle>
          <CardDescription>
            Select a training methodology based on scientific research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(methodologies).map(([key, methodology]) => (
              <Button
                key={key}
                variant={selectedMethodology === key ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => handleApplyMethodology(key)}
                disabled={isSaving}
              >
                <div className="font-medium">{methodology.label}</div>
                <div className="text-xs text-muted-foreground text-left">
                  {methodology.description}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
