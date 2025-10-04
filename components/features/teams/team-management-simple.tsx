/**
 * Componente simplificado de gestión de equipos
 * Solo requiere nombre del equipo y club
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useClubsStore } from '@/core/stores/clubs-store';
import type { TeamWithClub } from '@/core/types/club';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Edit,
    Plus,
    Search,
    Target,
    Trash2,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// =====================================================
// ESQUEMAS DE VALIDACIÓN SIMPLIFICADOS
// =====================================================

const createTeamSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre es muy largo'),
  club_id: z.string().min(1, 'Debes seleccionar un club'),
});

const updateTeamSchema = createTeamSchema.extend({
  id: z.string().min(1, 'ID es requerido'),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;
type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export function TeamManagement() {
  const {
    clubs,
    teams,
    navigation,
    isLoading,
    error,
    loadClubs,
    loadTeamsByClub,
    createNewTeam,
    updateExistingTeam,
    deleteExistingTeam,
    setSelectedClub,
  } = useClubsStore();

  const selectedClubId = navigation.selectedClubId;

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamWithClub | null>(null);

  // Cargar clubes y equipos al montar el componente
  React.useEffect(() => {
    loadClubs();
    if (selectedClubId) {
      loadTeamsByClub(selectedClubId);
    }
  }, [loadClubs, loadTeamsByClub, selectedClubId]);

  const handleCreateTeam = async (data: CreateTeamFormData) => {
    try {
      // Establecer el club seleccionado antes de crear el equipo
      await setSelectedClub(data.club_id);
      
      const success = await createNewTeam({
        name: data.name,
        club_id: data.club_id,
        description: null,
        level: 'Mixto',
        age_range: null,
        max_members: 20,
        coach_name: null,
        coach_email: null,
        coach_phone: null,
        schedule: null,
        focus_area: null,
      });
      
      if (success) {
        setIsCreateDialogOpen(false);
        // Recargar la lista de equipos
        await loadTeamsByClub(data.club_id);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleUpdateTeam = async (data: UpdateTeamFormData) => {
    if (!editingTeam) return;
    
    try {
      const success = await updateExistingTeam({
        id: editingTeam.id,
        name: data.name,
        club_id: data.club_id,
        description: editingTeam.description,
        level: editingTeam.level,
        age_range: editingTeam.age_range,
        max_members: editingTeam.max_members,
        coach_name: editingTeam.coach_name,
        coach_email: editingTeam.coach_email,
        coach_phone: editingTeam.coach_phone,
        schedule: editingTeam.schedule,
        focus_area: editingTeam.focus_area,
      });
      
      if (success) {
        setIsEditDialogOpen(false);
        setEditingTeam(null);
        // Recargar la lista de equipos
        if (selectedClubId) {
          await loadTeamsByClub(selectedClubId);
        }
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        const success = await deleteExistingTeam(teamId);
        if (success) {
          // Recargar la lista de equipos
          if (selectedClubId) {
            await loadTeamsByClub(selectedClubId);
          }
        }
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mis Equipos</h2>
          <p className="text-muted-foreground">
            Gestiona los equipos de tus clubes
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={clubs.length === 0}>
              <Plus className="h-4 w-4" />
              Nuevo Equipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Equipo</DialogTitle>
              <DialogDescription>
                Ingresa el nombre del equipo y selecciona el club
              </DialogDescription>
            </DialogHeader>
            <CreateTeamForm onSubmit={handleCreateTeam} clubs={clubs} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Club Selector */}
      {clubs.length > 0 && (
        <div className="space-y-2">
          <Label>Seleccionar Club</Label>
          <Select value={selectedClubId || ''} onValueChange={setSelectedClub}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Search */}
      {selectedClubId && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Teams Grid */}
      {!selectedClubId ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Selecciona un Club</h3>
          <p className="text-muted-foreground">
            Primero selecciona un club para ver sus equipos
          </p>
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => {
                setEditingTeam(team);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => handleDeleteTeam(team.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? 'No se encontraron equipos' : 'No tienes equipos'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Crea tu primer equipo para comenzar'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Equipo
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
            <DialogDescription>
              Modifica el nombre del equipo
            </DialogDescription>
          </DialogHeader>
          {editingTeam && (
            <EditTeamForm
              team={editingTeam}
              clubs={clubs}
              onSubmit={handleUpdateTeam}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingTeam(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// =====================================================
// COMPONENTE DE TARJETA DE EQUIPO
// =====================================================

interface TeamCardProps {
  team: TeamWithClub;
  onEdit: () => void;
  onDelete: () => void;
}

function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <CardDescription>
                {team.club_name}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{team.member_count || 0} miembros</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>{team.level}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// FORMULARIOS
// =====================================================

interface CreateTeamFormProps {
  onSubmit: (data: CreateTeamFormData) => void;
  clubs: any[];
}

function CreateTeamForm({ onSubmit, clubs }: CreateTeamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
  });

  const selectedClubId = watch('club_id');

  const handleFormSubmit = (data: CreateTeamFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="club_id">Club *</Label>
        <Select onValueChange={(value) => setValue('club_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un club" />
          </SelectTrigger>
          <SelectContent>
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.club_id && (
          <p className="text-sm text-destructive">{errors.club_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Equipo *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: Equipo Elite"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => reset()}>
          Limpiar
        </Button>
        <Button type="submit" disabled={isSubmitting || !selectedClubId}>
          {isSubmitting ? 'Creando...' : 'Crear Equipo'}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface EditTeamFormProps {
  team: TeamWithClub;
  clubs: any[];
  onSubmit: (data: UpdateTeamFormData) => void;
  onCancel: () => void;
}

function EditTeamForm({ team, clubs, onSubmit, onCancel }: EditTeamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UpdateTeamFormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      id: team.id,
      name: team.name,
      club_id: team.club_id,
    },
  });

  const selectedClubId = watch('club_id');

  const handleFormSubmit = (data: UpdateTeamFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="club_id">Club *</Label>
        <Select value={selectedClubId} onValueChange={(value) => setValue('club_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un club" />
          </SelectTrigger>
          <SelectContent>
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.club_id && (
          <p className="text-sm text-destructive">{errors.club_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Equipo *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: Equipo Elite"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !selectedClubId}>
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogFooter>
    </form>
  );
}
