'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
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
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Award, Calendar, Mail, User } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Joel Subirana',
    email: 'joel.subirana@gmail.com',
    joinDate: 'January 2024',
    level: 'Advanced Swimmer',
    club: 'Madrid Swimming Club',
    group: 'Group A - Competition',
  });

  const handleSave = () => {
    // Here the logic to save the data would be implemented
    setIsEditing(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <User className='h-6 w-6 text-primary' />
              </div>
              <h1 className='text-3xl font-bold text-foreground'>Perfil</h1>
            </div>
            <p className='text-muted-foreground'>
              Manage your personal information and preferences
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Full name</Label>
                  <Input
                    id='name'
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='club'>Club</Label>
                  <Input
                    id='club'
                    value={profileData.club}
                    onChange={(e) =>
                      setProfileData({ ...profileData, club: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='group'>Group</Label>
                  <Input
                    id='group'
                    value={profileData.group}
                    onChange={(e) =>
                      setProfileData({ ...profileData, group: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Award className='h-5 w-5' />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Account and membership details
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Email verified</p>
                    <p className='text-xs text-muted-foreground'>
                      {profileData.email}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Member since</p>
                    <p className='text-xs text-muted-foreground'>
                      {profileData.joinDate}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <Award className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Level</p>
                    <p className='text-xs text-muted-foreground'>
                      {profileData.level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botones de Acción */}
          <div className='flex justify-end gap-3'>
            {isEditing ? (
              <>
                <Button
                  variant='outline'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit profile
              </Button>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
