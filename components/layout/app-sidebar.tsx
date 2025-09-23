'use client';

import {
    ArrowUpCircleIcon,
    BarChartIcon,
    BookOpenIcon,
    Building2,
    CalendarIcon,
    ClipboardListIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    MessageCircle,
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
import { NavTeamSelectors } from '@/components/navigation/nav-team-selectors-real';
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
import { useClubsStore } from '@/lib/store/clubs-store';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Calendario',
      url: '/calendar',
      icon: CalendarIcon,
    },
    {
      title: 'Planificación',
      url: '/planning',
      icon: Target,
    },
    {
      title: 'Análisis',
      url: '/analysis',
      icon: BarChartIcon,
    },
    {
      title: 'Entrenamientos',
      url: '/training',
      icon: Plus,
    },
    {
      title: 'Herramientas',
      url: '/tools',
      icon: Wrench,
    },
    {
      title: 'Chat con IA',
      url: '/ai-chat',
      icon: MessageCircle,
    },
    {
      title: 'Recursos Entrenadores',
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
      title: 'Clubes y Equipos',
      url: '/settings?tab=clubes',
      icon: Building2,
    },
    {
      title: 'Ayuda',
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
