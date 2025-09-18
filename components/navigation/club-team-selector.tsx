/**
 * Selector de club y equipo
 * @fileoverview Componente para navegar entre clubes y equipos
 */

'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClubsStore } from '@/lib/store/clubs-store';
import { Building2, ChevronDown, Target, Users } from 'lucide-react';

export function ClubTeamSelector() {
    const {
        clubs,
        teams,
        selectedClub,
        selectedTeam,
        setSelectedClub,
        setSelectedTeam,
        isLoading,
    } = useClubsStore();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
        );
    }

    if (!selectedClub) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Selecciona un club</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* Club Selector */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="max-w-32 truncate">
                            {selectedClub.name}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>Clubes</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {clubs.map((club) => (
                        <DropdownMenuItem
                            key={club.id}
                            onClick={() => setSelectedClub(club.id)}
                            className={selectedClub.id === club.id ? 'bg-accent' : ''}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <Building2 className="h-4 w-4" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {club.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {club.location}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {club.team_count} equipos
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Team Selector */}
            {teams.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Target className="h-4 w-4" />
                            <span className="max-w-32 truncate">
                                {selectedTeam?.name || 'Seleccionar equipo'}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                        <DropdownMenuLabel>Equipos</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setSelectedTeam(null)}
                            className={!selectedTeam ? 'bg-accent' : ''}
                        >
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Todos los equipos</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {teams.map((team) => (
                            <DropdownMenuItem
                                key={team.id}
                                onClick={() => setSelectedTeam(team.id)}
                                className={selectedTeam?.id === team.id ? 'bg-accent' : ''}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <Target className="h-4 w-4" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">
                                            {team.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {team.level}
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {team.member_count} miembros
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
