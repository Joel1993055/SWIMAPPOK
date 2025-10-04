/**
 * Componente simplificado de gestión de clubes
 * Solo requiere nombre del club
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
import { Skeleton } from '@/components/ui/skeleton';
import { useClubsStore } from '@/core/stores/clubs-store';
import type { ClubWithStats } from '@/core/types/club';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Building2,
    Edit,
    Plus,
    Search,
    Trash2,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// =====================================================
// ESQUEMAS DE VALIDACIÓN SIMPLIFICADOS
// =====================================================

const createClubSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre es muy largo'),
});

const updateClubSchema = createClubSchema.extend({
  id: z.string().min(1, 'ID es requerido'),
});

type CreateClubFormData = z.infer<typeof createClubSchema>;
type UpdateClubFormData = z.infer<typeof updateClubSchema>;

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export function ClubManagement() {
  const {
    clubs,
    navigation,
    isLoading,
    error,
    loadClubs,
    createNewClub,
    updateExistingClub,
    deleteExistingClub,
    setSelectedClub,
  } = useClubsStore();

  const selectedClubId = navigation.selectedClubId;

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<ClubWithStats | null>(null);

  // Cargar clubes al montar el componente
  React.useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  const handleCreateClub = async (data: CreateClubFormData) => {
    try {
      const success = await createNewClub({
        name: data.name,
        location: 'Sin ubicación', // Valor por defecto
        description: null,
        address: null,
        phone: null,
        email: null,
        website: null,
        logo_url: null,
        established_date: null,
      });
      
      if (success) {
        setIsCreateDialogOpen(false);
        // Recargar la lista de clubes
        await loadClubs();
      }
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };

  const handleUpdateClub = async (data: UpdateClubFormData) => {
    if (!editingClub) return;
    
    try {
      const success = await updateExistingClub({
        id: editingClub.id,
        name: data.name,
        location: editingClub.location,
        description: editingClub.description,
        address: editingClub.address,
        phone: editingClub.phone,
        email: editingClub.email,
        website: editingClub.website,
        logo_url: editingClub.logo_url,
        established_date: editingClub.established_date,
      });
      
      if (success) {
        setIsEditDialogOpen(false);
        setEditingClub(null);
        // Recargar la lista de clubes
        await loadClubs();
      }
    } catch (error) {
      console.error('Error updating club:', error);
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este club?')) {
      try {
        const success = await deleteExistingClub(clubId);
        if (success) {
          // Recargar la lista de clubes
          await loadClubs();
        }
      } catch (error) {
        console.error('Error deleting club:', error);
      }
    }
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold">Mis Clubes</h2>
          <p className="text-muted-foreground">
            Gestiona tus clubes de natación
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Club
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Club</DialogTitle>
              <DialogDescription>
                Ingresa el nombre de tu club
              </DialogDescription>
            </DialogHeader>
            <CreateClubForm onSubmit={handleCreateClub} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar clubes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isSelected={selectedClubId === club.id}
              onSelect={() => setSelectedClub(club.id)}
              onEdit={() => {
                setEditingClub(club);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => handleDeleteClub(club.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? 'No se encontraron clubes' : 'No tienes clubes'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Crea tu primer club para comenzar'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Club
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Club</DialogTitle>
            <DialogDescription>
              Modifica el nombre del club
            </DialogDescription>
          </DialogHeader>
          {editingClub && (
            <EditClubForm
              club={editingClub}
              onSubmit={handleUpdateClub}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingClub(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// =====================================================
// COMPONENTE DE TARJETA DE CLUB
// =====================================================

interface ClubCardProps {
  club: ClubWithStats;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ClubCard({ club, isSelected, onSelect, onEdit, onDelete }: ClubCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{club.name}</CardTitle>
              <CardDescription>
                {club.location}
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
              <span>{club.team_count} equipos</span>
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

interface CreateClubFormProps {
  onSubmit: (data: CreateClubFormData) => void;
}

function CreateClubForm({ onSubmit }: CreateClubFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateClubFormData>({
    resolver: zodResolver(createClubSchema),
  });

  const handleFormSubmit = (data: CreateClubFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Club *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: Club Natación Madrid"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => reset()}>
          Limpiar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Club'}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface EditClubFormProps {
  club: ClubWithStats;
  onSubmit: (data: UpdateClubFormData) => void;
  onCancel: () => void;
}

function EditClubForm({ club, onSubmit, onCancel }: EditClubFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateClubFormData>({
    resolver: zodResolver(updateClubSchema),
    defaultValues: {
      id: club.id,
      name: club.name,
    },
  });

  const handleFormSubmit = (data: UpdateClubFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Club *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: Club Natación Madrid"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogFooter>
    </form>
  );
}
