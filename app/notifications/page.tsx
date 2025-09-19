'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Bell, CheckCircle, Info, Settings } from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nuevo entrenamiento programado',
      message: 'Tienes un entrenamiento de técnica programado para mañana a las 7:00 AM',
      type: 'info',
      read: false,
      date: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      title: 'Competición próxima',
      message: 'La competición "Copa de Invierno" está programada para el 20 de enero',
      type: 'warning',
      read: false,
      date: '2024-01-14T15:45:00Z',
    },
    {
      id: 3,
      title: 'Objetivo alcanzado',
      message: '¡Felicitaciones! Has alcanzado tu objetivo semanal de 15km',
      type: 'success',
      read: true,
      date: '2024-01-13T09:15:00Z',
    },
    {
      id: 4,
      title: 'Recordatorio de hidratación',
      message: 'No olvides mantenerte hidratado durante tus entrenamientos',
      type: 'info',
      read: true,
      date: '2024-01-12T14:20:00Z',
    },
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    trainingReminders: true,
    competitionAlerts: true,
    weeklyReports: true,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'warning':
        return <AlertCircle className='h-4 w-4 text-orange-500' />;
      case 'info':
      default:
        return <Info className='h-4 w-4 text-blue-500' />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Bell className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-foreground'>Notificaciones</h1>
                  <p className='text-muted-foreground'>
                    Gestiona tus notificaciones y preferencias
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant='outline'>
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>

          <div className='grid gap-6 lg:grid-cols-3'>
            {/* Lista de Notificaciones */}
            <div className='lg:col-span-2 space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Bell className='h-5 w-5' />
                    Notificaciones Recientes
                    {unreadCount > 0 && (
                      <Badge variant='secondary'>{unreadCount}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notification.read
                          ? 'bg-muted/50 border-muted'
                          : 'bg-primary/5 border-primary/20'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className='flex items-start gap-3'>
                        {getNotificationIcon(notification.type)}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <h4 className='font-medium text-sm'>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className='h-2 w-2 bg-primary rounded-full' />
                            )}
                          </div>
                          <p className='text-sm text-muted-foreground mb-2'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {new Date(notification.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Configuración de Notificaciones */}
            <div className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Settings className='h-5 w-5' />
                    Configuración
                  </CardTitle>
                  <CardDescription>
                    Personaliza tus notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Notificaciones por email</p>
                      <p className='text-xs text-muted-foreground'>
                        Recibe notificaciones en tu email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Notificaciones push</p>
                      <p className='text-xs text-muted-foreground'>
                        Notificaciones en el navegador
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, pushNotifications: checked })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Recordatorios de entrenamiento</p>
                      <p className='text-xs text-muted-foreground'>
                        Avisos antes de entrenamientos
                      </p>
                    </div>
                    <Switch
                      checked={settings.trainingReminders}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, trainingReminders: checked })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Alertas de competiciones</p>
                      <p className='text-xs text-muted-foreground'>
                        Notificaciones sobre competiciones
                      </p>
                    </div>
                    <Switch
                      checked={settings.competitionAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, competitionAlerts: checked })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Reportes semanales</p>
                      <p className='text-xs text-muted-foreground'>
                        Resumen semanal de progreso
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, weeklyReports: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
