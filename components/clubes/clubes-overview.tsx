"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Target,
  Trophy,
  Activity,
  Calendar,
  MapPin,
  User,
  UserCheck,
  Settings,
  BarChart3
} from "lucide-react";

// Tipos de datos
interface Club {
  id: string;
  name: string;
  location: string;
  description: string;
  founded: string;
  logo?: string;
  groups: Group[];
  totalSwimmers: number;
  totalCoaches: number;
}

interface Group {
  id: string;
  name: string;
  type: "sprinters" | "fondistas" | "medley" | "juvenil" | "senior" | "master";
  description: string;
  ageRange: string;
  level: "iniciacion" | "intermedio" | "avanzado" | "elite";
  coach: string;
  swimmers: Swimmer[];
  trainingDays: string[];
  focus: string[];
}

interface Swimmer {
  id: string;
  name: string;
  age: number;
  level: string;
  specialties: string[];
  joinDate: string;
  personalBest?: Record<string, string>;
}

// Datos de ejemplo
const sampleClubs: Club[] = [
  {
    id: "club-1",
    name: "Club Natación Mallorca",
    location: "Palma de Mallorca, España",
    description: "Club de natación con más de 30 años de historia, especializado en formación de nadadores de élite.",
    founded: "1990",
    totalSwimmers: 45,
    totalCoaches: 6,
    groups: [
      {
        id: "group-1",
        name: "Sprinters",
        type: "sprinters",
        description: "Especialistas en pruebas de velocidad (50m, 100m)",
        ageRange: "16-25 años",
        level: "elite",
        coach: "Carlos Mendoza",
        swimmers: [
          { id: "s1", name: "Joel Sánchez", age: 22, level: "Elite", specialties: ["50m libre", "100m libre"], joinDate: "2020-01-15" },
          { id: "s2", name: "María García", age: 20, level: "Elite", specialties: ["50m mariposa", "100m mariposa"], joinDate: "2019-09-01" }
        ],
        trainingDays: ["Lunes", "Miércoles", "Viernes", "Sábado"],
        focus: ["Velocidad", "Técnica", "Fuerza"]
      },
      {
        id: "group-2",
        name: "Fondistas",
        type: "fondistas",
        description: "Especialistas en pruebas de resistencia (400m, 800m, 1500m)",
        ageRange: "18-30 años",
        level: "avanzado",
        coach: "Ana López",
        swimmers: [
          { id: "s3", name: "David Ruiz", age: 24, level: "Avanzado", specialties: ["400m libre", "800m libre"], joinDate: "2021-03-10" },
          { id: "s4", name: "Laura Martín", age: 26, level: "Avanzado", specialties: ["1500m libre", "400m estilos"], joinDate: "2020-11-20" }
        ],
        trainingDays: ["Martes", "Jueves", "Sábado", "Domingo"],
        focus: ["Resistencia", "Aeróbico", "Técnica"]
      },
      {
        id: "group-3",
        name: "Medley",
        type: "medley",
        description: "Especialistas en pruebas combinadas y estilos",
        ageRange: "16-28 años",
        level: "intermedio",
        coach: "Roberto Silva",
        swimmers: [
          { id: "s5", name: "Sofia Herrera", age: 19, level: "Intermedio", specialties: ["200m estilos", "400m estilos"], joinDate: "2022-01-15" }
        ],
        trainingDays: ["Lunes", "Miércoles", "Viernes"],
        focus: ["Técnica", "Coordinación", "Resistencia"]
      }
    ]
  }
];

const groupTypeColors = {
  sprinters: "bg-red-500",
  fondistas: "bg-blue-500", 
  medley: "bg-purple-500",
  juvenil: "bg-green-500",
  senior: "bg-orange-500",
  master: "bg-gray-500"
};

const levelColors = {
  iniciacion: "bg-green-100 text-green-800",
  intermedio: "bg-yellow-100 text-yellow-800", 
  avanzado: "bg-orange-100 text-orange-800",
  elite: "bg-red-100 text-red-800"
};

export function ClubesOverview() {
  const [clubs, setClubs] = useState<Club[]>(sampleClubs);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const handleCreateClub = (clubData: Partial<Club>) => {
    const newClub: Club = {
      id: `club-${Date.now()}`,
      name: clubData.name || "",
      location: clubData.location || "",
      description: clubData.description || "",
      founded: clubData.founded || new Date().getFullYear().toString(),
      groups: [],
      totalSwimmers: 0,
      totalCoaches: 0
    };
    setClubs([...clubs, newClub]);
    setIsCreateClubOpen(false);
  };

  const handleCreateGroup = (groupData: Partial<Group>) => {
    if (!selectedClub) return;
    
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: groupData.name || "",
      type: groupData.type || "sprinters",
      description: groupData.description || "",
      ageRange: groupData.ageRange || "",
      level: groupData.level || "iniciacion",
      coach: groupData.coach || "",
      swimmers: [],
      trainingDays: groupData.trainingDays || [],
      focus: groupData.focus || []
    };

    const updatedClub = {
      ...selectedClub,
      groups: [...selectedClub.groups, newGroup]
    };

    setClubs(clubs.map(club => club.id === selectedClub.id ? updatedClub : club));
    setSelectedClub(updatedClub);
    setIsCreateGroupOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubes</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clubs.length}</div>
            <p className="text-xs text-muted-foreground">Clubes registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grupos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clubs.reduce((total, club) => total + club.groups.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Grupos activos</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nadadores</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clubs.reduce((total, club) => total + club.totalSwimmers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Nadadores registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entrenadores</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clubs.reduce((total, club) => total + club.totalCoaches, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Entrenadores activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="clubes" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="clubes">Clubes</TabsTrigger>
            <TabsTrigger value="grupos">Grupos</TabsTrigger>
            <TabsTrigger value="nadadores">Nadadores</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Dialog open={isCreateClubOpen} onOpenChange={setIsCreateClubOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Club
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Club</DialogTitle>
                  <DialogDescription>
                    Añade un nuevo club de natación al sistema
                  </DialogDescription>
                </DialogHeader>
                <CreateClubForm onSubmit={handleCreateClub} />
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={!selectedClub}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Grupo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Grupo</DialogTitle>
                  <DialogDescription>
                    Añade un nuevo grupo al club seleccionado
                  </DialogDescription>
                </DialogHeader>
                <CreateGroupForm onSubmit={handleCreateGroup} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tab: Clubes */}
        <TabsContent value="clubes" className="space-y-4">
          <div className="grid gap-4">
            {clubs.map((club) => (
              <Card 
                key={club.id} 
                className={`bg-muted/50 border-muted cursor-pointer transition-all hover:shadow-md ${
                  selectedClub?.id === club.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedClub(club)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Building className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-semibold">{club.name}</h3>
                        <Badge variant="outline">{club.founded}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{club.location}</span>
                      </div>
                      <p className="text-muted-foreground">{club.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{club.groups.length} grupos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          <span>{club.totalSwimmers} nadadores</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>{club.totalCoaches} entrenadores</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Grupos */}
        <TabsContent value="grupos" className="space-y-4">
          {selectedClub ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Grupos de {selectedClub.name}</h2>
              </div>
              
              <div className="grid gap-4">
                {selectedClub.groups.map((group) => (
                  <Card key={group.id} className="bg-muted/50 border-muted">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <Badge className={`${groupTypeColors[group.type]} text-white`}>
                              {group.name}
                            </Badge>
                            <Badge variant="outline" className={levelColors[group.level]}>
                              {group.level}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {group.ageRange}
                            </span>
                          </div>
                          
                          <p className="text-muted-foreground">{group.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4" />
                              <span>Entrenador: {group.coach}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{group.swimmers.length} nadadores</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{group.trainingDays.join(", ")}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Enfoque:</span>
                            <div className="flex gap-1">
                              {group.focus.map((focus, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {focus}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-8 text-center">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">Selecciona un Club</h4>
                <p className="text-sm text-muted-foreground">
                  Haz click en un club de la pestaña anterior para ver sus grupos
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Nadadores */}
        <TabsContent value="nadadores" className="space-y-4">
          {selectedClub ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Nadadores de {selectedClub.name}</h2>
              </div>
              
              <div className="grid gap-4">
                {selectedClub.groups.map((group) => (
                  <Card key={group.id} className="bg-muted/50 border-muted">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className={`${groupTypeColors[group.type]} text-white`}>
                          {group.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ({group.swimmers.length} nadadores)
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {group.swimmers.map((swimmer) => (
                          <div key={swimmer.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium">{swimmer.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {swimmer.age} años
                                </Badge>
                                <Badge variant="outline" className={levelColors[swimmer.level as keyof typeof levelColors]}>
                                  {swimmer.level}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Especialidades:</span>
                                <div className="flex gap-1">
                                  {swimmer.specialties.map((specialty, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-8 text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">Selecciona un Club</h4>
                <p className="text-sm text-muted-foreground">
                  Haz click en un club para ver todos sus nadadores
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para crear club
function CreateClubForm({ onSubmit }: { onSubmit: (data: Partial<Club>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    founded: new Date().getFullYear().toString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Club</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Club Natación Mallorca"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Ubicación</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Palma de Mallorca, España"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="founded">Año de Fundación</Label>
        <Input
          id="founded"
          type="number"
          value={formData.founded}
          onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del club..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Crear Club
        </Button>
      </div>
    </form>
  );
}

// Componente para crear grupo
function CreateGroupForm({ onSubmit }: { onSubmit: (data: Partial<Group>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "sprinters" as const,
    description: "",
    ageRange: "",
    level: "iniciacion" as const,
    coach: "",
    focus: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Grupo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sprinters"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Grupo</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="sprinters">Sprinters</option>
            <option value="fondistas">Fondistas</option>
            <option value="medley">Medley</option>
            <option value="juvenil">Juvenil</option>
            <option value="senior">Senior</option>
            <option value="master">Master</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Especialistas en pruebas de velocidad..."
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ageRange">Rango de Edad</Label>
          <Input
            id="ageRange"
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
            placeholder="16-25 años"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="level">Nivel</Label>
          <select
            id="level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="iniciacion">Iniciación</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
            <option value="elite">Élite</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="coach">Entrenador</Label>
        <Input
          id="coach"
          value={formData.coach}
          onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
          placeholder="Nombre del entrenador"
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Crear Grupo
        </Button>
      </div>
    </form>
  );
}
