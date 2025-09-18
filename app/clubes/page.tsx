/**
 * Página principal de gestión de clubes y equipos
 * @fileoverview Interfaz principal para administrar clubes y equipos
 */

'use client';

import { ClubManagement } from '@/components/features/clubs/club-management-simple';
import { TeamManagement } from '@/components/features/teams/team-management-simple';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { ClubTeamSelector } from '@/components/navigation/club-team-selector';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClubsInit } from '@/lib/hooks/use-clubs-init';
import { Building2, Target } from 'lucide-react';

export default function ClubesPage() {
    // Inicializar datos de clubes
    useClubsInit();

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Clubes y Equipos
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            Gestiona tus clubes, equipos y miembros de manera eficiente
                        </p>
                    </div>

                    {/* Navigation Selector */}
                    <div className="mb-6">
                        <ClubTeamSelector />
                    </div>

                    {/* Main Content */}
                    <Tabs defaultValue="clubs" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="clubs" className="gap-2">
                                <Building2 className="h-4 w-4" />
                                Clubes
                            </TabsTrigger>
                            <TabsTrigger value="teams" className="gap-2">
                                <Target className="h-4 w-4" />
                                Equipos
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="clubs" className="space-y-6">
                            <ClubManagement />
                        </TabsContent>

                        <TabsContent value="teams" className="space-y-6">
                            <TeamManagement />
                        </TabsContent>
                    </Tabs>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
