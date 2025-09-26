/**
 * Club & Team Selectors
 * @fileoverview Component to navigate between clubs and teams
 */

'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useClubsStore } from '@/lib/store/clubs-store';
import { Building2, Check, Target } from 'lucide-react';
import * as React from 'react';

interface NavTeamSelectorsProps {
  selectedClub: string;
  selectedGroup: string;
  onClubChange: (clubId: string) => void;
  onGroupChange: (groupId: string) => void;
}

export function NavTeamSelectors({
  selectedClub,
  selectedGroup,
  onClubChange,
  onGroupChange,
}: NavTeamSelectorsProps) {
  const {
    clubs,
    teams,
    navigation,
    loadClubs,
    loadTeamsByClub,
    setSelectedClub,
    setSelectedTeam,
  } = useClubsStore();

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    // Load clubs on mount
    loadClubs();
  }, [loadClubs]);

  // Load teams when the selected club changes
  React.useEffect(() => {
    if (selectedClub && selectedClub !== 'none') {
      loadTeamsByClub(selectedClub);
    }
  }, [selectedClub, loadTeamsByClub]);

  const currentClub = clubs.find((club) => club.id === selectedClub);
  const currentTeams = teams.filter((team) => team.club_id === selectedClub);

  const handleClubChange = async (value: string) => {
    if (value === 'none') {
      onClubChange('none');
      onGroupChange('none');
      return;
    }

    onClubChange(value);
    // Set the selected club in the store
    await setSelectedClub(value);

    // Reset team selection when the club changes
    const newTeams = teams.filter((team) => team.club_id === value);
    if (newTeams && newTeams.length > 0) {
      onGroupChange(newTeams[0].id);
      await setSelectedTeam(newTeams[0].id);
    } else {
      onGroupChange('none');
    }
  };

  const handleTeamChange = async (value: string) => {
    if (value === 'none') {
      onGroupChange('none');
      return;
    }

    onGroupChange(value);
    // Set the selected team in the store
    await setSelectedTeam(value);
  };

  if (!isMounted) {
    return (
      <div className="px-3 py-2">
        <div className="space-y-3">
          <div className="h-8 bg-muted/30 rounded animate-pulse" />
          <div className="h-8 bg-muted/30 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <div className="space-y-2">
        {/* Club Selector — Improved */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground px-1">
            Club
          </label>
          <Select value={selectedClub} onValueChange={handleClubChange}>
            <SelectTrigger className="h-9 text-sm border border-border/50 bg-background hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">
                  {currentClub?.name || 'Select Club'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="w-64">
              <SelectItem value="none" className="p-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">No Club</div>
                    <div className="text-xs text-muted-foreground">
                      Not selected
                    </div>
                  </div>
                </div>
              </SelectItem>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{club.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {club.location}
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

        {/* Team Selector — Improved */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground px-1">
            Team
          </label>
          <Select value={selectedGroup} onValueChange={handleTeamChange}>
            <SelectTrigger className="h-9 text-sm border border-border/50 bg-background hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">
                  {currentTeams.find((t) => t.id === selectedGroup)?.name ||
                    'Select Team'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="w-64">
              <SelectItem value="none" className="p-3">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">No Team</div>
                    <div className="text-xs text-muted-foreground">
                      Not selected
                    </div>
                  </div>
                </div>
              </SelectItem>
              {currentTeams.map((team) => (
                <SelectItem key={team.id} value={team.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {team.level}
                      </div>
                    </div>
                    {selectedGroup === team.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
