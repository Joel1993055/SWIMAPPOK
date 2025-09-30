'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type { PrivacySettings } from '@/core/hooks/use-settings';
import { Download, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PrivacyTabProps {
  privacy: PrivacySettings;
  onSave: (data: PrivacySettings) => Promise<void>;
  isSaving: boolean;
}

export function PrivacyTab({ privacy, onSave, isSaving }: PrivacyTabProps) {
  const [formData, setFormData] = useState<PrivacySettings>(privacy);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof PrivacySettings, value: boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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

  const handleDownloadData = () => {
    // TODO: Implement data download functionality
    console.log('Download data requested');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    console.log('Delete account requested');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy and Security
          </CardTitle>
          <CardDescription>
            Control who can see your information and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-visibility">
                  Public profile
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow other users to view your profile
                </p>
              </div>
              <Switch 
                id="profile-visibility" 
                checked={formData.publicProfile}
                onCheckedChange={(checked) => handleToggle('publicProfile', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activity-sharing">
                  Share activity
                </Label>
                <p className="text-sm text-muted-foreground">
                  Share your workouts with the community
                </p>
              </div>
              <Switch 
                id="activity-sharing" 
                checked={formData.shareActivity}
                onCheckedChange={(checked) => handleToggle('shareActivity', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-analytics">
                  Data analysis
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow use of your data to improve the app
                </p>
              </div>
              <Switch 
                id="data-analytics" 
                checked={formData.dataAnalytics}
                onCheckedChange={(checked) => handleToggle('dataAnalytics', checked)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Personal Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleDownloadData}
              >
                <Download className="h-4 w-4" />
                Download my data
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save privacy settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
