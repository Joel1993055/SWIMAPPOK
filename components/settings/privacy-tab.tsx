'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type { PrivacySettings } from '@/core/hooks/use-settings';
import { Download, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PrivacyTabProps {
  privacy: PrivacySettings;
  onSave: (data: PrivacySettings) => Promise<void>;
  isSaving: boolean;
}

export function PrivacyTab({ privacy, onSave, isSaving }: PrivacyTabProps) {
  const [formData, setFormData] = useState<PrivacySettings>(privacy);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDownloadData = async () => {
    try {
      // Simulate data preparation
      toast.loading('Preparing your data...', { id: 'download' });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock data export
      const userData = {
        profile: {
          name: 'User Profile',
          email: 'user@example.com',
          createdAt: new Date().toISOString()
        },
        sessions: [],
        competitions: [],
        settings: formData,
        exportDate: new Date().toISOString()
      };
      
      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Data downloaded successfully', { id: 'download' });
    } catch (error) {
      toast.error('Failed to download data', { id: 'download' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate account deletion process
      toast.loading('Deleting your account...', { id: 'delete' });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would call the API to delete the account
      toast.success('Account deleted successfully', { id: 'delete' });
      setIsDeleteModalOpen(false);
      
      // Redirect to home page or show confirmation
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      toast.error('Failed to delete account', { id: 'delete' });
    }
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
                onClick={() => setIsDeleteModalOpen(true)}
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

      {/* Delete Account Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Warning: This action is irreversible
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• All your training sessions will be deleted</li>
                <li>• All your competitions will be removed</li>
                <li>• Your profile and settings will be lost</li>
                <li>• You will need to create a new account to use the app again</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
