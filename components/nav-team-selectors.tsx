"use client"

import * as React from "react"
import { Building2, Users, ChevronDown, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para clubes y grupos (mismo que en la página de equipo)
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
  }
}

interface NavTeamSelectorsProps {
  selectedClub: string
  selectedGroup: string
  onClubChange: (clubId: string) => void
  onGroupChange: (groupId: string) => void
}

export function NavTeamSelectors({ 
  selectedClub, 
  selectedGroup, 
  onClubChange, 
  onGroupChange 
}: NavTeamSelectorsProps) {
  const currentClub = sampleData.clubs.find(club => club.id === selectedClub)
  const currentGroups = sampleData.groups[selectedClub as keyof typeof sampleData.groups] || []

  const handleClubChange = (value: string) => {
    onClubChange(value)
    // Reset group selection when club changes
    const newGroups = sampleData.groups[value as keyof typeof sampleData.groups]
    if (newGroups && newGroups.length > 0) {
      onGroupChange(newGroups[0].id)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Avanzado": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
      case "Intermedio": return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      case "Principiante": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Mixto": return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="px-3 py-3">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="px-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Mi Equipo
          </h3>
        </div>

        {/* Selector de Club */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1 bg-primary/10 rounded-sm">
              <Building2 className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">Club</span>
          </div>
          <Select value={selectedClub} onValueChange={handleClubChange}>
            <SelectTrigger className="h-9 text-sm border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={currentClub?.logo} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {currentClub?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium truncate">{currentClub?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{currentClub?.location}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-64">
              {sampleData.clubs.map((club) => (
                <SelectItem key={club.id} value={club.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={club.logo} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {club.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{club.name}</div>
                      <div className="text-xs text-muted-foreground">{club.location}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {club.members} miembros • {club.groups} grupos
                      </div>
                    </div>
                    {selectedClub === club.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector de Grupo */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1 bg-primary/10 rounded-sm">
              <Users className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">Grupo</span>
          </div>
          <Select value={selectedGroup} onValueChange={onGroupChange}>
            <SelectTrigger className="h-9 text-sm border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
              <div className="flex items-center gap-2">
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium truncate">
                    {currentGroups.find(g => g.id === selectedGroup)?.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {currentGroups.find(g => g.id === selectedGroup)?.level} • {currentGroups.find(g => g.id === selectedGroup)?.members} miembros
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-64">
              {currentGroups.map((group) => (
                <SelectItem key={group.id} value={group.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{group.name}</span>
                        <Badge className={`text-xs px-1.5 py-0.5 ${getLevelColor(group.level)}`}>
                          {group.level}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {group.ageRange} • {group.members} miembros
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Entrenador: {group.coach}
                      </div>
                    </div>
                    {selectedGroup === group.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Status Indicator */}
        {currentClub && currentGroups.find(g => g.id === selectedGroup) && (
          <div className="px-1 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Activo • {currentGroups.find(g => g.id === selectedGroup)?.focus}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
