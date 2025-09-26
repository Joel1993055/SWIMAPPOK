'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { Building2, Check, ChevronDown, Users } from 'lucide-react';
import * as React from 'react';

// Datos de ejemplo para clubes y grupos (mismo que en la página de equipo)
const sampleData = {
  clubs: [
    {
      id: 'club-1',
      name: 'Club Natación Madrid',
      location: 'Madrid, España',
      members: 45,
      groups: 6,
      established: '2015',
      logo: '/api/placeholder/40/40',
    },
    {
      id: 'club-2',
      name: 'Aqua Barcelona',
      location: 'Barcelona, España',
      members: 32,
      groups: 4,
      established: '2018',
      logo: '/api/placeholder/40/40',
    },
    {
      id: 'club-3',
      name: 'Swim Valencia',
      location: 'Valencia, España',
      members: 28,
      groups: 3,
      established: '2020',
      logo: '/api/placeholder/40/40',
    },
  ],
  groups: {
    'club-1': [
      {
        id: 'group-1-1',
        name: 'Elite Group',
        level: 'Advanced',
        ageRange: '16-25 years',
        members: 12,
        coach: 'Maria Gonzalez',
        schedule: 'Mon, Wed, Fri 18:00-20:00',
        focus: 'Competition',
      },
      {
        id: 'group-1-2',
        name: 'Development Group',
        level: 'Intermediate',
        ageRange: '14-18 years',
        members: 15,
        coach: 'Carlos Ruiz',
        schedule: 'Tue, Thu 17:00-19:00',
        focus: 'Technique',
      },
      {
        id: 'group-1-3',
        name: 'Beginner Group',
        level: 'Beginner',
        ageRange: '8-14 years',
        members: 18,
        coach: 'Ana Martin',
        schedule: 'Mon, Wed 16:00-17:30',
        focus: 'Learning',
      },
    ],
    'club-2': [
      {
        id: 'group-2-1',
        name: 'Master Group',
        level: 'Advanced',
        ageRange: '25+ years',
        members: 8,
        coach: 'David Lopez',
        schedule: 'Mon, Wed, Fri 19:00-21:00',
        focus: 'Fitness',
      },
      {
        id: 'group-2-2',
        name: 'Youth Group',
        level: 'Intermediate',
        ageRange: '12-16 years',
        members: 12,
        coach: 'Laura Sanchez',
        schedule: 'Tue, Thu 16:30-18:30',
        focus: 'Competition',
      },
    ],
    'club-3': [
      {
        id: 'group-3-1',
        name: 'Grupo Open',
        level: 'Mixto',
        ageRange: 'Todas las edades',
        members: 20,
        coach: 'Roberto García',
        schedule: 'Lun, Mié, Vie 18:30-20:00',
        focus: 'Recreativo',
      },
    ],
  },
};

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

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentClub = sampleData.clubs.find(club => club.id === selectedClub);
  const currentGroups =
    sampleData.groups[selectedClub as keyof typeof sampleData.groups] || [];

  const handleClubChange = (value: string) => {
    onClubChange(value);
    // Reset group selection when club changes
    const newGroups =
      sampleData.groups[value as keyof typeof sampleData.groups];
    if (newGroups && newGroups.length > 0) {
      onGroupChange(newGroups[0].id);
    }
  };

  if (!isMounted) {
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
                {currentClub?.name}
              </span>
              <ChevronDown className='h-3 w-3 text-muted-foreground ml-auto' />
            </div>
          </SelectTrigger>
          <SelectContent className='w-56'>
            {sampleData.clubs.map(club => (
              <SelectItem key={club.id} value={club.id} className='p-2'>
                <div className='flex items-center gap-2'>
                  <Building2 className='h-3 w-3 text-muted-foreground' />
                  <div className='flex-1'>
                    <div className='text-xs font-medium'>{club.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      {club.location}
                    </div>
                  </div>
                  {selectedClub === club.id && (
                    <Check className='h-3 w-3 text-primary' />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Selector de Grupo - Minimalista */}
        <Select value={selectedGroup} onValueChange={onGroupChange}>
          <SelectTrigger className='h-8 text-xs border-0 bg-muted/30 hover:bg-muted/50 transition-colors'>
            <div className='flex items-center gap-2'>
              <Users className='h-3 w-3 text-muted-foreground' />
              <span className='text-xs text-muted-foreground truncate'>
                {currentGroups.find(g => g.id === selectedGroup)?.name}
              </span>
              <ChevronDown className='h-3 w-3 text-muted-foreground ml-auto' />
            </div>
          </SelectTrigger>
          <SelectContent className='w-56'>
            {currentGroups.map(group => (
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
      </div>
    </div>
  );
}
