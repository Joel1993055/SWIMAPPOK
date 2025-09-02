"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Upload,
  Trash2,
  Download,
  Settings as SettingsIcon
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    weekly: true,
    monthly: false,
    achievements: true,
    reminders: true
  });

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "privacy", label: "Privacidad", icon: Shield },
    { id: "appearance", label: "Apariencia", icon: Palette },
    { id: "account", label: "Cuenta", icon: Lock }
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          </div>
          <p className="text-muted-foreground">
            Gestiona tu cuenta, preferencias y configuraciones de la aplicación
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </CardTitle>
                    <CardDescription>
                      Actualiza tu información personal y foto de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/avatars/user.jpg" alt="Profile" />
                        <AvatarFallback className="text-lg">JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Cambiar foto
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG o GIF. Máximo 2MB
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" defaultValue="Joel" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input id="lastName" defaultValue="Díaz" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="joel@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" type="tel" defaultValue="+34 123 456 789" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Cuéntanos sobre ti..."
                        defaultValue="Nadador profesional con más de 10 años de experiencia. Especializado en estilo libre y mariposa."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Guardar cambios
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Preferencias de Notificaciones
                    </CardTitle>
                    <CardDescription>
                      Configura cómo y cuándo recibir notificaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Communication Channels */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Canales de Comunicación</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">Notificaciones por email</Label>
                            <p className="text-sm text-muted-foreground">
                              Recibe actualizaciones importantes por correo
                            </p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={notifications.email}
                            onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="push-notifications">Notificaciones push</Label>
                            <p className="text-sm text-muted-foreground">
                              Recibe notificaciones en tiempo real
                            </p>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={notifications.push}
                            onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sms-notifications">Notificaciones SMS</Label>
                            <p className="text-sm text-muted-foreground">
                              Recibe recordatorios importantes por SMS
                            </p>
                          </div>
                          <Switch
                            id="sms-notifications"
                            checked={notifications.sms}
                            onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Activity Notifications */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Actividad y Logros</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="achievements">Logros y récords</Label>
                            <p className="text-sm text-muted-foreground">
                              Notificaciones cuando alcances nuevos logros
                            </p>
                          </div>
                          <Switch
                            id="achievements"
                            checked={notifications.achievements}
                            onCheckedChange={(checked) => handleNotificationChange("achievements", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="reminders">Recordatorios de entrenamiento</Label>
                            <p className="text-sm text-muted-foreground">
                              Recuerdos para tus sesiones programadas
                            </p>
                          </div>
                          <Switch
                            id="reminders"
                            checked={notifications.reminders}
                            onCheckedChange={(checked) => handleNotificationChange("reminders", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Reports */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Reportes y Resúmenes</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="weekly-reports">Reportes semanales</Label>
                            <p className="text-sm text-muted-foreground">
                              Resumen de tu actividad semanal
                            </p>
                          </div>
                          <Switch
                            id="weekly-reports"
                            checked={notifications.weekly}
                            onCheckedChange={(checked) => handleNotificationChange("weekly", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="monthly-reports">Reportes mensuales</Label>
                            <p className="text-sm text-muted-foreground">
                              Análisis detallado de tu progreso mensual
                            </p>
                          </div>
                          <Switch
                            id="monthly-reports"
                            checked={notifications.monthly}
                            onCheckedChange={(checked) => handleNotificationChange("monthly", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacidad y Seguridad
                    </CardTitle>
                    <CardDescription>
                      Controla quién puede ver tu información y actividad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-visibility">Perfil público</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite que otros usuarios vean tu perfil
                          </p>
                        </div>
                        <Switch id="profile-visibility" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="activity-sharing">Compartir actividad</Label>
                          <p className="text-sm text-muted-foreground">
                            Comparte tus entrenamientos con la comunidad
                          </p>
                        </div>
                        <Switch id="activity-sharing" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="data-analytics">Análisis de datos</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite el uso de tus datos para mejorar la app
                          </p>
                        </div>
                        <Switch id="data-analytics" defaultChecked />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Datos Personales</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="gap-2">
                          <Download className="h-4 w-4" />
                          Descargar mis datos
                        </Button>
                        <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Eliminar cuenta
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Apariencia
                    </CardTitle>
                    <CardDescription>
                      Personaliza la apariencia de la aplicación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Tema</Label>
                        <Select defaultValue="system">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Oscuro</SelectItem>
                            <SelectItem value="system">Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Idioma</Label>
                        <Select defaultValue="es">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Zona horaria</Label>
                        <Select defaultValue="europe-madrid">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe-madrid">Madrid (GMT+1)</SelectItem>
                            <SelectItem value="europe-london">Londres (GMT+0)</SelectItem>
                            <SelectItem value="america-new_york">Nueva York (GMT-5)</SelectItem>
                            <SelectItem value="america-los_angeles">Los Ángeles (GMT-8)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Unidades de Medida</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="distance-unit">Distancia</Label>
                          <Select defaultValue="meters">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meters">Metros</SelectItem>
                              <SelectItem value="yards">Yardas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="temperature-unit">Temperatura</Label>
                          <Select defaultValue="celsius">
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
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Seguridad de la Cuenta
                    </CardTitle>
                    <CardDescription>
                      Gestiona la seguridad de tu cuenta y contraseña
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Contraseña actual</Label>
                        <div className="relative">
                          <Input 
                            id="current-password" 
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña actual"
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
                        <Label htmlFor="new-password">Nueva contraseña</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          placeholder="Ingresa tu nueva contraseña"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          placeholder="Confirma tu nueva contraseña"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Actualizar contraseña
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Sesiones Activas</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">iPhone 15 Pro</p>
                              <p className="text-sm text-muted-foreground">Madrid, España</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Activa</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Chrome - Windows</p>
                              <p className="text-sm text-muted-foreground">Barcelona, España</p>
                            </div>
                          </div>
                          <Badge variant="outline">Activa</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
