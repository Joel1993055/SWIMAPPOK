"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Building2, 
  UserPlus, 
  Settings, 
  Trophy,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Star,
  Crown,
  Shield,
  Search,
  Filter,
  Download,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

// Datos de ejemplo para clubes y grupos
const sampleData = {
  clubs: [
    {
      id: "club-1",
      name: "Club Natación Madrid",
      location: "Madrid, España",
      members: 45,
      groups: 6,
      established: "2015",
      logo: "/api/placeholder/40/40"
    },
    {
      id: "club-2", 
      name: "Aqua Barcelona",
      location: "Barcelona, España",
      members: 32,
      groups: 4,
      established: "2018",
      logo: "/api/placeholder/40/40"
    },
    {
      id: "club-3",
      name: "Swim Valencia",
      location: "Valencia, España", 
      members: 28,
      groups: 3,
      established: "2020",
      logo: "/api/placeholder/40/40"
    }
  ],
  groups: {
    "club-1": [
      {
        id: "group-1-1",
        name: "Grupo Elite",
        level: "Avanzado",
        ageRange: "16-25 años",
        members: 12,
        coach: "María González",
        schedule: "Lun, Mié, Vie 18:00-20:00",
        focus: "Competición"
      },
      {
        id: "group-1-2", 
        name: "Grupo Desarrollo",
        level: "Intermedio",
        ageRange: "14-18 años",
        members: 15,
        coach: "Carlos Ruiz",
        schedule: "Mar, Jue 17:00-19:00",
        focus: "Técnica"
      },
      {
        id: "group-1-3",
        name: "Grupo Iniciación",
        level: "Principiante", 
        ageRange: "8-14 años",
        members: 18,
        coach: "Ana Martín",
        schedule: "Lun, Mié 16:00-17:30",
        focus: "Aprendizaje"
      }
    ],
    "club-2": [
      {
        id: "group-2-1",
        name: "Grupo Master",
        level: "Avanzado",
        ageRange: "25+ años",
        members: 8,
        coach: "David López",
        schedule: "Lun, Mié, Vie 19:00-21:00",
        focus: "Fitness"
      },
      {
        id: "group-2-2",
        name: "Grupo Juvenil",
        level: "Intermedio",
        ageRange: "12-16 años", 
        members: 12,
        coach: "Laura Sánchez",
        schedule: "Mar, Jue 16:30-18:30",
        focus: "Competición"
      }
    ],
    "club-3": [
      {
        id: "group-3-1",
        name: "Grupo Open",
        level: "Mixto",
        ageRange: "Todas las edades",
        members: 20,
        coach: "Roberto García",
        schedule: "Lun, Mié, Vie 18:30-20:00",
        focus: "Recreativo"
      }
    ]
  },
  teamMembers: {
    "group-1-1": [
      {
        id: "member-1",
        name: "Alejandro Torres",
        role: "Capitán",
        level: "Elite",
        joinDate: "2023-01-15",
        achievements: 8,
        avatar: "/api/placeholder/32/32"
      },
      {
        id: "member-2",
        name: "Sofia Rodríguez",
        role: "Miembro",
        level: "Elite", 
        joinDate: "2023-03-20",
        achievements: 5,
        avatar: "/api/placeholder/32/32"
      },
      {
        id: "member-3",
        name: "Diego Martín",
        role: "Miembro",
        level: "Elite",
        joinDate: "2023-02-10",
        achievements: 3,
        avatar: "/api/placeholder/32/32"
      }
    ]
  },
  teamStats: {
    "group-1-1": {
      totalMembers: 12,
      activeMembers: 11,
      totalDistance: 125000,
      totalSessions: 156,
      avgRPE: 7.2,
      achievements: 24,
      upcomingEvents: 3
    }
  }
};

function TeamContent() {
  const [selectedClub, setSelectedClub] = useState("club-1");
  const [selectedGroup, setSelectedGroup] = useState("group-1-1");
  const [searchTerm, setSearchTerm] = useState("");

  const currentClub = sampleData.clubs.find(club => club.id === selectedClub);
  const currentGroups = sampleData.groups[selectedClub as keyof typeof sampleData.groups] || [];
  const currentGroup = currentGroups.find(group => group.id === selectedGroup);
  const currentMembers = sampleData.teamMembers[selectedGroup as keyof typeof sampleData.teamMembers] || [];
  const currentStats = sampleData.teamStats[selectedGroup as keyof typeof sampleData.teamStats];

  const filteredMembers = currentMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Elite": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Avanzado": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Intermedio": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Principiante": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Capitán": return <Crown className="h-4 w-4 text-yellow-600" />;
      case "Vice-Capitán": return <Star className="h-4 w-4 text-blue-600" />;
      case "Miembro": return <Shield className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Equipo</h1>
        </div>
        <p className="text-muted-foreground">
          Gestiona tu club, grupos y miembros del equipo
        </p>
        
        {/* Selectores de Club y Grupo */}
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <Select value={selectedClub} onValueChange={(value) => {
              setSelectedClub(value);
              // Reset group selection when club changes
              const newGroups = sampleData.groups[value as keyof typeof sampleData.groups];
              if (newGroups && newGroups.length > 0) {
                setSelectedGroup(newGroups[0].id);
              }
            }}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sampleData.clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={club.logo} />
                        <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{club.name}</div>
                        <div className="text-xs text-muted-foreground">{club.location}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {group.level} • {group.members} miembros
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invitar Miembro
          </Button>
        </div>
      </div>

      {/* Información del Club y Grupo Seleccionado */}
      {currentClub && currentGroup && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {currentClub.name}
              </CardTitle>
              <CardDescription>Información del club</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{currentClub.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{currentClub.members} miembros totales</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span>Desde {currentClub.established}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {currentGroup.name}
              </CardTitle>
              <CardDescription>Información del grupo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nivel:</span>
                  <Badge className={getLevelColor(currentGroup.level)}>
                    {currentGroup.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{currentGroup.members} miembros</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{currentGroup.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>Entrenador: {currentGroup.coach}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentStats && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estadísticas del Grupo
                </CardTitle>
                <CardDescription>Rendimiento actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Miembros Activos:</span>
                    <span className="font-bold">{currentStats.activeMembers}/{currentStats.totalMembers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Distancia Total:</span>
                    <span className="font-bold">{currentStats.totalDistance.toLocaleString()}m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Sesiones:</span>
                    <span className="font-bold">{currentStats.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>RPE Promedio:</span>
                    <span className="font-bold">{currentStats.avgRPE}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tabs de Gestión */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="schedule">Horarios</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Tab: Miembros */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar miembros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        {getRoleIcon(member.role)}
                        <Badge className={getLevelColor(member.level)}>
                          {member.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Miembro desde: {new Date(member.joinDate).toLocaleDateString('es-ES')}</span>
                        <span>•</span>
                        <span>{member.achievements} logros</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Horarios */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Horarios del Grupo
              </CardTitle>
              <CardDescription>Planificación semanal de entrenamientos</CardDescription>
            </CardHeader>
            <CardContent>
              {currentGroup && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{currentGroup.name}</h4>
                      <Badge variant="outline">{currentGroup.level}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{currentGroup.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Entrenador: {currentGroup.coach}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>Enfoque: {currentGroup.focus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Eventos */}
        <TabsContent value="events" className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Próximos Eventos
              </CardTitle>
              <CardDescription>Competiciones y actividades del grupo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Campeonato Regional</h4>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Próximo
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>📅 15 de Marzo, 2024</div>
                    <div>📍 Piscina Municipal Madrid</div>
                    <div>👥 8 participantes del grupo</div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Entrenamiento Especial</h4>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Confirmado
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>📅 22 de Marzo, 2024</div>
                    <div>📍 Piscina del Club</div>
                    <div>👥 Todos los miembros</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configuración */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración del Grupo
                </CardTitle>
                <CardDescription>Gestiona la configuración del grupo seleccionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="group-name">Nombre del Grupo</Label>
                    <Input id="group-name" defaultValue={currentGroup?.name} />
                  </div>
                  <div>
                    <Label htmlFor="coach">Entrenador</Label>
                    <Input id="coach" defaultValue={currentGroup?.coach} />
                  </div>
                  <div>
                    <Label htmlFor="schedule">Horario</Label>
                    <Input id="schedule" defaultValue={currentGroup?.schedule} />
                  </div>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Gestión de Miembros
                </CardTitle>
                <CardDescription>Invitar y gestionar miembros del grupo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invitar Nuevo Miembro
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Notificación Grupal
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Lista de Miembros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TeamPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <TeamContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
