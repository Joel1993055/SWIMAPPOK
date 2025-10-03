'use client';

import { AccountTab } from '@/components/settings/account-tab';
import { AppearanceTab } from '@/components/settings/appearance-tab';
import { ClubsTab } from '@/components/settings/clubs-tab';
import { NotificationsTab } from '@/components/settings/notifications-tab';
import { PrivacyTab } from '@/components/settings/privacy-tab';
import { ProfileTab } from '@/components/settings/profile-tab';
import { TrainingTab } from '@/components/settings/training-tab';
import { ZoneCustomizationTab } from '@/components/settings/zone-customization-tab';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/core/hooks/use-settings';
import { Activity, Bell, Building2, Lock, Palette, Settings as SettingsIcon, Shield, User, Zap } from 'lucide-react';
import React, { useState } from 'react';

function SettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Use our custom hook for settings management
  const {
    isLoading,
    isSaving,
    error,
    profileData,
    notifications,
    appearance,
    privacy,
    trainingZones,
    saveProfile,
    saveNotifications,
    saveAppearance,
    savePrivacy,
    saveTrainingZones,
    applyMethodology,
  } = useSettings();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'training', label: 'Training', icon: Activity },
    { id: 'zones', label: 'Zone Customization', icon: Zap },
    { id: 'clubs', label: 'Clubs and Teams', icon: Building2 },
    { id: 'account', label: 'Account', icon: Lock },
  ];

  // Handle URL tab parameter
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get('tab') || 'profile';
      setActiveTab(tab);
    }
  }, []);

  if (isLoading) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
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
          <div className='lg:col-span-1'>
            <Card className='sticky top-8 bg-muted/50'>
              <CardContent className='p-4'>
                <div className='space-y-2'>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className='h-10 w-full' />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='lg:col-span-3'>
            <Card className='bg-muted/50'>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <Skeleton className='h-8 w-48' />
                  <Skeleton className='h-4 w-96' />
                  <div className='space-y-2'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className='h-10 w-full' />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
        {error && (
          <div className='mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
            <p className='text-destructive text-sm'>{error}</p>
          </div>
        )}
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
            <ProfileTab
              profileData={profileData}
              onSave={saveProfile}
              isSaving={isSaving}
            />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              onSave={saveNotifications}
              isSaving={isSaving}
            />
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <PrivacyTab
              privacy={privacy}
              onSave={savePrivacy}
              isSaving={isSaving}
            />
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <AppearanceTab
              appearance={appearance}
              onSave={saveAppearance}
              isSaving={isSaving}
            />
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <TrainingTab
              trainingZones={trainingZones}
              onSaveZones={saveTrainingZones}
              onApplyMethodology={applyMethodology}
              isSaving={isSaving}
            />
          )}

          {/* Zone Customization Tab */}
          {activeTab === 'zones' && <ZoneCustomizationTab />}

          {/* Clubs Tab */}
          {activeTab === 'clubs' && <ClubsTab />}

          {/* Account Tab */}
          {activeTab === 'account' && <AccountTab />}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}
