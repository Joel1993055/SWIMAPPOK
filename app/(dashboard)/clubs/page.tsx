/**
 * Main clubs and teams management page
 * @fileoverview Main interface for managing clubs and teams with better UX
 */

'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { useClubs, useClubsActions, useClubsError, useClubsLoading } from '@/core/stores/entities/club';
import { useNavigationActions, useSelectedClubId, useSelectedTeamId } from '@/core/stores/entities/navigation';
import { useTeams, useTeamsActions } from '@/core/stores/entities/team';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Building2,
    ChevronRight,
    MapPin,
    Plus,
    Search,
    Target
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const createClubSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  location: z.string().min(1, 'Location is required').max(255, 'Location is too long'),
  description: z.string().optional(),
});

const createTeamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  club_id: z.string().min(1, 'You must select a club'),
  description: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Elite', 'Mixed']).default('Mixed'),
});

type CreateClubFormData = z.infer<typeof createClubSchema>;
type CreateTeamFormData = z.infer<typeof createTeamSchema>;

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ClubsPage() {
  // New entity stores
  const clubs = useClubs();
  const clubsActions = useClubsActions();
  const isLoading = useClubsLoading();
  const error = useClubsError();
  
  const teams = useTeams();
  const teamsActions = useTeamsActions();
  
  const navigationActions = useNavigationActions();
  const selectedClubId = useSelectedClubId();
  const selectedTeamId = useSelectedTeamId();
  
  // Get selected club and team objects
  const selectedClub = clubs.find(club => club.id === selectedClubId);
  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [selectedClubForTeam, setSelectedClubForTeam] = useState<string>('');

  // Load data on mount
  useEffect(() => {
    clubsActions.loadClubs();
  }, [clubsActions]);

  // Load teams when a club is selected
  useEffect(() => {
    if (selectedClubId) {
      // Teams are automatically loaded via useTeamsByClub selector
      // No need for manual loadTeamsByClub call
    }
  }, [selectedClubId]);

  // Filter clubs
  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter teams
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formulario para crear club
  const createClubForm = useForm<CreateClubFormData>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
    },
  });

  // Formulario para crear equipo
  const createTeamForm = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      club_id: '',
      description: '',
      level: 'Mixed',
    },
  });

  const handleCreateClub = async (data: CreateClubFormData) => {
    const success = await clubsActions.createNewClub({
      name: data.name,
      location: data.location,
      description: data.description || '',
      contactEmail: '',
      isActive: true,
      category: 'swimming' as const,
    });
    if (success) {
      setIsCreateClubOpen(false);
      createClubForm.reset();
    }
  };

  const handleCreateTeam = async (data: CreateTeamFormData) => {
    const success = await teamsActions.createNewTeam({
      clubId: data.club_id,
      name: data.name,
      description: data.description || '',
      category: 'senior' as const, // Default category
      gender: 'mixto' as const,
      ageRange: '',
      level: data.level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' | 'elite',
      practiceDays: [],
      practiceTimes: [],
      practiceLocation: '',
      isActive: true,
      isAcceptingMembers: true,
    });
    if (success) {
      setIsCreateTeamOpen(false);
      createTeamForm.reset();
      setSelectedClubForTeam('');
    }
  };

  const handleClubSelect = async (clubId: string) => {
    navigationActions.setSelectedClub(clubId);
  };

  const handleTeamSelect = async (teamId: string) => {
    navigationActions.setSelectedTeam(teamId);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Clubs and Teams
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage your clubs, teams and members efficiently
              </p>
            </div>
            
            {/* Acciones rápidas */}
            <div className="flex gap-2">
              <Dialog open={isCreateClubOpen} onOpenChange={setIsCreateClubOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Club
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Club</DialogTitle>
                    <DialogDescription>
                      Complete the basic club information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={createClubForm.handleSubmit(handleCreateClub)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Club Name</Label>
                      <Input
                        id="name"
                        {...createClubForm.register('name')}
                        placeholder="Ex: Madrid Swimming Club"
                      />
                      {createClubForm.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {createClubForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        {...createClubForm.register('location')}
                        placeholder="Ex: Madrid, Spain"
                      />
                      {createClubForm.formState.errors.location && (
                        <p className="text-sm text-destructive">
                          {createClubForm.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        {...createClubForm.register('description')}
                        placeholder="Club description..."
                        rows={3}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createClubForm.formState.isSubmitting}>
                        {createClubForm.formState.isSubmitting ? 'Creating...' : 'Create Club'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Target className="h-4 w-4" />
                    Nuevo Equipo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                      Create a new team in one of your clubs
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={createTeamForm.handleSubmit(handleCreateTeam)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="club_id">Club</Label>
                      <select
                        {...createTeamForm.register('club_id')}
                        className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onChange={(e) => {
                          createTeamForm.setValue('club_id', e.target.value);
                          setSelectedClubForTeam(e.target.value);
                        }}
                      >
                        <option value="">Select club...</option>
                        {clubs.map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name} - {club.location}
                          </option>
                        ))}
                      </select>
                      {createTeamForm.formState.errors.club_id && (
                        <p className="text-sm text-destructive">
                          {createTeamForm.formState.errors.club_id.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Team Name</Label>
                      <Input
                        id="name"
                        {...createTeamForm.register('name')}
                        placeholder="Ex: Team A - Competition"
                      />
                      {createTeamForm.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {createTeamForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <select
                        {...createTeamForm.register('level')}
                        className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Elite">Elite</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        {...createTeamForm.register('description')}
                        placeholder="Team description..."
                        rows={3}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createTeamForm.formState.isSubmitting}>
                        {createTeamForm.formState.isSubmitting ? 'Creating...' : 'Create Team'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs and teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Contenido principal */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Clubs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  My Clubs
                  <Badge variant="secondary">{filteredClubs.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Manage your swimming clubs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted/30 rounded animate-pulse" />
                    ))}
                  </div>
                ) : filteredClubs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You have no clubs created</p>
                    <p className="text-sm">Crea tu primer club para comenzar</p>
                  </div>
                ) : (
                  filteredClubs.map((club) => (
                    <div
                      key={club.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedClub?.id === club.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleClubSelect(club.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{club.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            {club.location}
                          </div>
                          {club.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {club.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {club.teamCount || 0} equipos
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Equipos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mis Equipos
                  <Badge variant="secondary">{filteredTeams.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Manage your clubs' teams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted/30 rounded animate-pulse" />
                    ))}
                  </div>
                ) : filteredTeams.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tienes equipos creados</p>
                    <p className="text-sm">Crea tu primer equipo para comenzar</p>
                  </div>
                ) : (
                  filteredTeams.map((team) => (
                    <div
                      key={team.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTeam?.id === team.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleTeamSelect(team.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building2 className="h-4 w-4" />
                            {clubs.find(club => club.id === team.clubId)?.name || 'Unknown Club'}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                team.level === 'elite' ? 'border-yellow-500 text-yellow-600' :
                                team.level === 'advanced' ? 'border-blue-500 text-blue-600' :
                                team.level === 'intermediate' ? 'border-green-500 text-green-600' :
                                team.level === 'beginner' ? 'border-orange-500 text-orange-600' :
                                'border-gray-500 text-gray-600'
                              }`}
                            >
                              {team.level.charAt(0).toUpperCase() + team.level.slice(1)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {team.memberCount || 0} miembros
                            </Badge>
                          </div>
                          {team.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {team.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Estado de selección */}
          {(selectedClub || selectedTeam) && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-primary">
                      {selectedClub ? selectedClub.name : 'No club selected'}
                    </span>
                  </div>
                  {selectedTeam && (
                    <>
                      <ChevronRight className="h-4 w-4 text-primary/60" />
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-primary/10 rounded">
                          <Target className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-primary">{selectedTeam.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
