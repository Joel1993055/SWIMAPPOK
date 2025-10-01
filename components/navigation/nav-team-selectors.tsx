'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { useAppContext } from '@/core/contexts/app-context';
import { Building2, Check, ChevronDown, Users } from 'lucide-react';
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
  const [isMounted, setIsMounted] = React.useState(false);
  const { 
    currentClub, 
    currentGroup, 
    availableGroups, 
    isLoading,
    setSelectedClub,
    setSelectedGroup 
  } = useAppContext();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClubChange = (value: string) => {
    onClubChange(value);
    setSelectedClub(value);
    
    // Reset group selection when club changes
    if (availableGroups.length > 0) {
      const firstGroup = availableGroups[0];
      onGroupChange(firstGroup.id);
      setSelectedGroup(firstGroup.id);
    }
  };

  const handleGroupChange = (value: string) => {
    onGroupChange(value);
    setSelectedGroup(value);
  };

  if (!isMounted || isLoading) {
    return (
      <div className='px-3 py-2'>
        <div className='space-y-3'>
          <div className='h-8 bg-muted/30 rounded animate-pulse' />
          <div className='h-8 bg-muted/30 rounded animate-pulse' />
        </div>
      </div>
    );
  }

  return (
    <div className='px-3 py-2'>
      <div className='space-y-3'>
        {/* Selector de Club - Minimalista */}
        <Select value={selectedClub} onValueChange={handleClubChange}>
          <SelectTrigger className='h-8 text-xs border-0 bg-muted/30 hover:bg-muted/50 transition-colors'>
            <div className='flex items-center gap-2'>
              <Building2 className='h-3 w-3 text-muted-foreground' />
              <span className='text-xs text-muted-foreground truncate'>
                {currentClub?.name || 'Seleccionar Club'}
              </span>
              <ChevronDown className='h-3 w-3 text-muted-foreground ml-auto' />
            </div>
          </SelectTrigger>
          <SelectContent className='w-56'>
            {currentClub ? (
              <SelectItem key={currentClub.id} value={currentClub.id} className='p-2'>
                <div className='flex items-center gap-2'>
                  <Building2 className='h-3 w-3 text-muted-foreground' />
                  <div className='flex-1'>
                    <div className='text-xs font-medium'>{currentClub.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      {currentClub.location}
                    </div>
                  </div>
                  <Check className='h-3 w-3 text-primary' />
                </div>
              </SelectItem>
            ) : (
              <div className='p-2 text-xs text-muted-foreground'>
                No hay clubes disponibles
              </div>
            )}
          </SelectContent>
        </Select>

        {/* Selector de Grupo - Minimalista */}
        {selectedClub && availableGroups.length > 0 && (
          <Select value={selectedGroup} onValueChange={handleGroupChange}>
            <SelectTrigger className='h-8 text-xs border-0 bg-muted/30 hover:bg-muted/50 transition-colors'>
              <div className='flex items-center gap-2'>
                <Users className='h-3 w-3 text-muted-foreground' />
                <span className='text-xs text-muted-foreground truncate'>
                  {currentGroup?.name || 'Seleccionar Grupo'}
                </span>
                <ChevronDown className='h-3 w-3 text-muted-foreground ml-auto' />
              </div>
            </SelectTrigger>
            <SelectContent className='w-56'>
              {availableGroups.map(group => (
                <SelectItem key={group.id} value={group.id} className='p-2'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-3 w-3 text-muted-foreground' />
                    <div className='flex-1'>
                      <div className='text-xs font-medium'>{group.name}</div>
                      <div className='text-xs text-muted-foreground'>
                        {group.level}
                      </div>
                    </div>
                    {selectedGroup === group.id && (
                      <Check className='h-3 w-3 text-primary' />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Mensaje cuando no hay grupos */}
        {selectedClub && availableGroups.length === 0 && (
          <div className='h-8 flex items-center justify-center text-xs text-muted-foreground'>
            No hay grupos disponibles
          </div>
        )}
      </div>
    </div>
  );
}