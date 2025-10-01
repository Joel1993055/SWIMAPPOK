'use client';

import {
    BarChartIcon,
    BookOpenIcon,
    CalendarIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    Plus,
    Wrench
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { NavTeamSelectors } from '@/components/navigation/nav-team-selectors';
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
import { AppContextProvider, useAppContext } from '@/core/contexts/app-context';

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
  ],
  navTools: [
    {
      name: 'Log',
      url: '/log',
      icon: BookOpenIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Help',
      url: '#',
      icon: HelpCircleIcon,
    },
  ],
};

// Wrapper component with provider
export function AppSidebarWithProvider({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <AppContextProvider>
      <AppSidebar {...props} />
    </AppContextProvider>
  );
}

// Internal component that uses the context
function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedClub, selectedGroup, setSelectedClub, setSelectedGroup } = useAppContext();

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
            selectedClub={selectedClub || 'none'}
            selectedGroup={selectedGroup || 'none'}
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
