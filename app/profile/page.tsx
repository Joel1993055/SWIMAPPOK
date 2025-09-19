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
    joinDate: 'Enero 2024',
    level: 'Nadador Avanzado',
    club: 'Club Natación Madrid',
    group: 'Grupo A - Competición',
  });

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar los datos
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
              Gestiona tu información personal y preferencias
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Nombre completo</Label>
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
                  <Label htmlFor='group'>Grupo</Label>
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

            {/* Información de Cuenta */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Award className='h-5 w-5' />
                  Información de Cuenta
                </CardTitle>
                <CardDescription>
                  Detalles de tu cuenta y membresía
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Email verificado</p>
                    <p className='text-xs text-muted-foreground'>
                      {profileData.email}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Miembro desde</p>
                    <p className='text-xs text-muted-foreground'>
                      {profileData.joinDate}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <Award className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Nivel</p>
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
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Guardar cambios
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Editar perfil
              </Button>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
