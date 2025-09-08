'use client';

import { signOutAction } from '@/lib/actions/auth';
import { createClient } from '@/utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
    BellIcon,
    LogOutIcon,
    MoreVerticalIcon,
    SettingsIcon,
    UserCircleIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavUser() {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Obtener usuario actual
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOutAction();
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='h-8 w-8 rounded-lg bg-muted animate-pulse' />
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <div className='h-4 bg-muted animate-pulse rounded' />
              <div className='h-3 bg-muted animate-pulse rounded mt-1' />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = user.email ? user.email.charAt(0).toUpperCase() : 'U';
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || 'Usuario';
  const userEmail = user.email || '';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage 
                  src={user.user_metadata?.avatar_url} 
                  alt={userName} 
                />
                <AvatarFallback className='rounded-lg'>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{userName}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {userEmail}
                </span>
              </div>
              <MoreVerticalIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage 
                    src={user.user_metadata?.avatar_url} 
                    alt={userName} 
                  />
                  <AvatarFallback className='rounded-lg'>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{userName}</span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href='/settings' className='flex items-center'>
                  <SettingsIcon className='mr-2 h-4 w-4' />
                  <span>Configuración</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCircleIcon className='mr-2 h-4 w-4' />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon className='mr-2 h-4 w-4' />
                <span>Notificaciones</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className='text-red-600'>
              <LogOutIcon className='mr-2 h-4 w-4' />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}