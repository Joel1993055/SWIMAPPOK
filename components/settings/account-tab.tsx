'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Globe, Lock, Save, Smartphone } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';

export const AccountTab = memo(function AccountTab() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = useCallback((field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const handleSavePassword = useCallback(async () => {
    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.new.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    try {
      setIsSaving(true);
      
      // Simulate API call - replace with actual password update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setPasswords({ current: '', new: '', confirm: '' });
      setHasChanges(false);
      
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={passwords.current}
                  onChange={e => handlePasswordChange('current', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                value={passwords.new}
                onChange={e => handlePasswordChange('new', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your new password"
                value={passwords.confirm}
                onChange={e => handlePasswordChange('confirm', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSavePassword} 
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Updating...' : 'Update password'}
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Active Sessions
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">iPhone 15 Pro</p>
                    <p className="text-sm text-muted-foreground">
                      Madrid, Spain
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Chrome - Windows</p>
                    <p className="text-sm text-muted-foreground">
                      Barcelona, Spain
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
