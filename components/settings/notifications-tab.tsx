'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type { NotificationSettings } from '@/core/hooks/use-settings';
import { Bell } from 'lucide-react';
import { useState } from 'react';

interface NotificationsTabProps {
  notifications: NotificationSettings;
  onSave: (data: NotificationSettings) => Promise<void>;
  isSaving: boolean;
}

export function NotificationsTab({ notifications, onSave, isSaving }: NotificationsTabProps) {
  const [formData, setFormData] = useState<NotificationSettings>(notifications);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
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

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how and when to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Channels */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Communication Channels
            </h4>
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates by email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={formData.email}
                  onCheckedChange={(checked) => handleToggle('email', checked)}
                />
              </div>
              {/* Push */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">
                    Push notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={formData.push}
                  onCheckedChange={(checked) => handleToggle('push', checked)}
                />
              </div>
              {/* SMS */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">
                    SMS notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important reminders by SMS
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={formData.sms}
                  onCheckedChange={(checked) => handleToggle('sms', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Activity and Achievements
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="achievements">
                    Achievements and records
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when you reach new achievements
                  </p>
                </div>
                <Switch
                  id="achievements"
                  checked={formData.achievements}
                  onCheckedChange={(checked) => handleToggle('achievements', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminders">Training reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for your scheduled sessions
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={formData.reminders}
                  onCheckedChange={(checked) => handleToggle('reminders', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Reports */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Reports and Summaries
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-reports">Weekly reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly activity summary
                  </p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={formData.weekly}
                  onCheckedChange={(checked) => handleToggle('weekly', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="monthly-reports">
                    Monthly reports
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Detailed analysis of your monthly progress
                  </p>
                </div>
                <Switch
                  id="monthly-reports"
                  checked={formData.monthly}
                  onCheckedChange={(checked) => handleToggle('monthly', checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              <Bell className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
