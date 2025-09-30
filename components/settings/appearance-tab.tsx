'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { AppearanceSettings } from '@/core/hooks/use-settings';
import { Palette } from 'lucide-react';
import { useState } from 'react';

interface AppearanceTabProps {
  appearance: AppearanceSettings;
  onSave: (data: AppearanceSettings) => Promise<void>;
  isSaving: boolean;
}

export function AppearanceTab({ appearance, onSave, isSaving }: AppearanceTabProps) {
  const [formData, setFormData] = useState<AppearanceSettings>(appearance);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSelectChange = (field: keyof AppearanceSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value as any }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      setHasChanges(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the application appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={formData.theme} 
                onValueChange={(value) => handleSelectChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => handleSelectChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Time zone</Label>
              <Select 
                value={formData.timezone} 
                onValueChange={(value) => handleSelectChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe-madrid">
                    Madrid (GMT+1)
                  </SelectItem>
                  <SelectItem value="europe-london">
                    London (GMT+0)
                  </SelectItem>
                  <SelectItem value="america-new_york">
                    New York (GMT-5)
                  </SelectItem>
                  <SelectItem value="america-los_angeles">
                    Los Angeles (GMT-8)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Units</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance-unit">Distance</Label>
                <Select 
                  value={formData.distanceUnit} 
                  onValueChange={(value) => handleSelectChange('distanceUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="yards">Yards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature-unit">Temperature</Label>
                <Select 
                  value={formData.temperatureUnit} 
                  onValueChange={(value) => handleSelectChange('temperatureUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              <Palette className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save appearance'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
