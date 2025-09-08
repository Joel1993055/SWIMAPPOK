'use client';

import {
    ArrowUpCircleIcon,
    BarChartIcon,
    BookOpenIcon,
    CalendarIcon,
    ClipboardListIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    Plus,
    SettingsIcon,
    Target,
    Users,
    Wrench,
} from 'lucide-react';
import * as React from 'react';

import { NavDocuments } from '@/components/navigation/nav-documents';
import { NavMain } from '@/components/navigation/nav-main';
import { NavSecondary } from '@/components/navigation/nav-secondary';
import { NavTeamSelectors } from '@/components/navigation/nav-team-selectors';
import { NavUser } from '@/components/navigation/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Calendario',
      url: '/calendario',
      icon: CalendarIcon,
    },
    {
      title: 'Planificación',
      url: '/planificacion',
      icon: Target,
    },
    {
      title: 'Análisis',
      url: '/analisis',
      icon: BarChartIcon,
    },
    {
      title: 'Equipo',
      url: '/equipo',
      icon: Users,
    },
    {
      title: 'Entrenamientos',
      url: '/entrenamientos',
      icon: Plus,
    },
    {
      title: 'Herramientas',
      url: '/herramientas',
      icon: Wrench,
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
      title: 'Ayuda',
      url: '#',
      icon: HelpCircleIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedClub, setSelectedClub] = React.useState('club-1');
  const [selectedGroup, setSelectedGroup] = React.useState('group-1-1');

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
                <ArrowUpCircleIcon className='h-5 w-5' />
                <span className='text-base font-semibold'>Swim:APP</span>
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