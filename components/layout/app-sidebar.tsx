'use client';

import {
    BarChartIcon,
    BookOpenIcon,
    Building2,
    CalendarIcon,
    ClipboardListIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    Plus,
    SettingsIcon,
    Users,
    Wrench
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { NavTeamSelectors } from '@/components/features/navigation/nav-team-selectors-real';
import { NavUser } from '@/components/features/navigation/nav-user';
import { NavDocuments } from '@/components/navigation/nav-documents';
import { NavMain } from '@/components/navigation/nav-main';
import { NavSecondary } from '@/components/navigation/nav-secondary';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useClubsStore } from '@/core/stores/clubs-store';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Calendar & Planning',
      url: '/calendar',
      icon: CalendarIcon,
    },
    {
      title: 'Analysis',
      url: '/analysis',
      icon: BarChartIcon,
    },
    {
      title: 'Training',
      url: '/training',
      icon: Plus,
    },
    {
      title: 'Tools',
      url: '/tools',
      icon: Wrench,
    },
    {
      title: 'Coach Resources',
      url: '/coach-resources',
      icon: Users,
    },
  ],
  navTools: [
    {
      name: 'Reports',
      url: '/reports',
      icon: ClipboardListIcon,
    },
    {
      name: 'Log',
      url: '/log',
      icon: BookOpenIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: SettingsIcon,
    },
    {
      title: 'Clubs and Teams',
      url: '/settings?tab=clubes',
      icon: Building2,
    },
    {
      title: 'Help',
      url: '#',
      icon: HelpCircleIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { navigation } = useClubsStore();
  const [selectedClub, setSelectedClub] = React.useState(navigation.selectedClubId || 'none');
  const [selectedGroup, setSelectedGroup] = React.useState(navigation.selectedTeamId || 'none');

  // Sincronizar con el store
  React.useEffect(() => {
    setSelectedClub(navigation.selectedClubId || 'none');
  }, [navigation.selectedClubId]);

  React.useEffect(() => {
    setSelectedGroup(navigation.selectedTeamId || 'none');
  }, [navigation.selectedTeamId]);

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <a href='#'>
                 <Image 
                   className="w-auto h-32" 
                   src="/DECKapp.svg" 
                   width={400} 
                   height={120} 
                   alt="DeckAPP" 
                   priority
                 />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        {/* Selectores de Club y Grupo */}
        <div className='mt-6'>
          <NavTeamSelectors
            selectedClub={selectedClub}
            selectedGroup={selectedGroup}
            onClubChange={setSelectedClub}
            onGroupChange={setSelectedGroup}
          />
        </div>

        <NavDocuments items={data.navTools} />

        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
