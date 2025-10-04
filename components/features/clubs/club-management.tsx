/**
 * Club management component
 * @fileoverview Interface for creating, editing and managing clubs
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
import { Textarea } from '@/components/ui/textarea';
import { useClubsStore } from '@/core/stores/clubs-store';
import type { ClubWithStats } from '@/core/types/club';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Building2,
    Calendar,
    Edit,
    ExternalLink,
    Globe,
    Mail,
    MapPin,
    Plus,
    Search,
    Trash2,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const createClubSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
});

const updateClubSchema = createClubSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

type CreateClubFormData = z.infer<typeof createClubSchema>;
type UpdateClubFormData = z.infer<typeof updateClubSchema>;

// =====================================================
// MAIN COMPONENT
// =====================================================

export function ClubManagement() {
  const {
    clubs,
    selectedClub,
    isLoading,
    error,
    loadClubs,
    createNewClub,
    updateExistingClub,
    deleteExistingClub,
    setSelectedClub,
    clearError,
  } = useClubsStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<ClubWithStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load clubs when component mounts
  useState(() => {
    loadClubs();
  });

  // Filter clubs by search term
  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClub = async (data: CreateClubFormData) => {
    const success = await createNewClub(data);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdateClub = async (data: UpdateClubFormData) => {
    const success = await updateExistingClub(data);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingClub(null);
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    if (confirm('Are you sure you want to delete this club?')) {
      const success = await deleteExistingClub(clubId);
      if (success && selectedClub?.id === clubId) {
        setSelectedClub(null);
      }
    }
  };

  const handleEditClub = (club: ClubWithStats) => {
    setEditingClub(club);
    setIsEditDialogOpen(true);
  };

  if (isLoading && clubs.length === 0) {
    return <ClubManagementSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Club Management</h2>
          <p className="text-muted-foreground">
            Administra tus clubes y equipos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Club
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Club</DialogTitle>
              <DialogDescription>
                Complete the information to create a new club
              </DialogDescription>
            </DialogHeader>
            <CreateClubForm onSubmit={handleCreateClub} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={clearError}
            >
              Close
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clubs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClubs.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
            isSelected={selectedClub?.id === club.id}
            onSelect={() => setSelectedClub(club.id)}
            onEdit={() => handleEditClub(club)}
            onDelete={() => handleDeleteClub(club.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredClubs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? 'No clubs found' : 'You have no clubs'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? 'Try other search terms'
              : 'Create your first club to get started'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Club
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Club</DialogTitle>
            <DialogDescription>
              Modify club information
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
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
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
      <CardContent className="pt-0">
        {club.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {club.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span>{club.team_count} equipos</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span>{club.total_members} miembros</span>
            </div>
          </div>
          
          {club.established_date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Desde {new Date(club.established_date).getFullYear()}</span>
            </div>
          )}
          
          {(club.email || club.website) && (
            <div className="flex items-center gap-4 text-sm">
              {club.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{club.email}</span>
                </div>
              )}
              {club.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <ExternalLink className="h-3 w-3" />
                </div>
              )}
            </div>
          )}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Club Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Ex: Madrid Swimming Club"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="Ex: Madrid, Spain"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="info@club.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+34 123 456 789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Sitio Web</Label>
          <Input
            id="website"
            {...register('website')}
            placeholder="https://club.com"
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="established_date">Foundation Date</Label>
          <Input
            id="established_date"
            type="date"
            {...register('established_date')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe tu club..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Complete club address"
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Club'}
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
      description: club.description || '',
      location: club.location,
      address: club.address || '',
      phone: club.phone || '',
      email: club.email || '',
      website: club.website || '',
      established_date: club.established_date || '',
    },
  });

  const handleFormSubmit = (data: UpdateClubFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nombre del Club *</Label>
          <Input
            id="edit-name"
            {...register('name')}
            placeholder="Ex: Madrid Swimming Club"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-location">Location *</Label>
          <Input
            id="edit-location"
            {...register('location')}
            placeholder="Ex: Madrid, Spain"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            {...register('email')}
            placeholder="info@club.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            {...register('phone')}
            placeholder="+34 123 456 789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-website">Sitio Web</Label>
          <Input
            id="edit-website"
            {...register('website')}
            placeholder="https://club.com"
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-established_date">Foundation Date</Label>
          <Input
            id="edit-established_date"
            type="date"
            {...register('established_date')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          {...register('description')}
          placeholder="Describe tu club..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-address">Address</Label>
        <Textarea
          id="edit-address"
          {...register('address')}
          placeholder="Complete club address"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Club'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// =====================================================
// COMPONENTE DE CARGA
// =====================================================

function ClubManagementSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <Skeleton className="h-10 w-full" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
