/**
 * Componente de gestión de equipos
 * @fileoverview Interfaz para crear, editar y gestionar equipos
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useClubsStore } from '@/lib/store/clubs-store';
import type { TeamWithClub } from '@/lib/types/club';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Clock,
    Edit,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Target,
    Trash2,
    UserCheck,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// =====================================================
// ESQUEMAS DE VALIDACIÓN
// =====================================================

const createTeamSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre es muy largo'),
    description: z.string().optional(),
    level: z.enum(['Principiante', 'Intermedio', 'Avanzado', 'Elite', 'Mixto'], {
        required_error: 'El nivel es requerido',
    }),
    age_range: z.string().optional(),
    max_members: z.number().min(1, 'Mínimo 1 miembro').max(100, 'Máximo 100 miembros'),
    coach_name: z.string().optional(),
    coach_email: z.string().email('Email inválido').optional().or(z.literal('')),
    coach_phone: z.string().optional(),
    schedule: z.string().optional(),
    focus_area: z.string().optional(),
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
        selectedClub,
        teams,
        selectedTeam,
        isLoading,
        error,
        loadTeamsByClub,
        createNewTeam,
        updateExistingTeam,
        deleteExistingTeam,
        setSelectedTeam,
        clearError,
    } = useClubsStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<TeamWithClub | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState<string>('all');

    // Cargar equipos cuando se selecciona un club
    useEffect(() => {
        if (selectedClub) {
            loadTeamsByClub(selectedClub.id);
        }
    }, [selectedClub, loadTeamsByClub]);

    // Filtrar equipos por término de búsqueda y nivel
    const filteredTeams = teams.filter(team => {
        const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === 'all' || team.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const handleCreateTeam = async (data: CreateTeamFormData) => {
        if (!selectedClub) return;
        
        const teamData = {
            ...data,
            club_id: selectedClub.id,
        };
        
        const success = await createNewTeam(teamData);
        if (success) {
            setIsCreateDialogOpen(false);
        }
    };

    const handleUpdateTeam = async (data: UpdateTeamFormData) => {
        const success = await updateExistingTeam(data);
        if (success) {
            setIsEditDialogOpen(false);
            setEditingTeam(null);
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
            const success = await deleteExistingTeam(teamId);
            if (success && selectedTeam?.id === teamId) {
                setSelectedTeam(null);
            }
        }
    };

    const handleEditTeam = (team: TeamWithClub) => {
        setEditingTeam(team);
        setIsEditDialogOpen(true);
    };

    if (!selectedClub) {
        return (
            <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona un Club</h3>
                <p className="text-muted-foreground">
                    Primero debes seleccionar un club para gestionar sus equipos
                </p>
            </div>
        );
    }

    if (isLoading && teams.length === 0) {
        return <TeamManagementSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Gestión de Equipos</h2>
                    <p className="text-muted-foreground">
                        Administra los equipos de {selectedClub.name}
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Equipo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Equipo</DialogTitle>
                            <DialogDescription>
                                Completa la información para crear un nuevo equipo
                            </DialogDescription>
                        </DialogHeader>
                        <CreateTeamForm onSubmit={handleCreateTeam} />
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
                            Cerrar
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar equipos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por nivel" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los niveles</SelectItem>
                        <SelectItem value="Principiante">Principiante</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                        <SelectItem value="Elite">Elite</SelectItem>
                        <SelectItem value="Mixto">Mixto</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Teams Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        isSelected={selectedTeam?.id === team.id}
                        onSelect={() => setSelectedTeam(team.id)}
                        onEdit={() => handleEditTeam(team)}
                        onDelete={() => handleDeleteTeam(team.id)}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredTeams.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        {searchTerm || levelFilter !== 'all' ? 'No se encontraron equipos' : 'No hay equipos'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm || levelFilter !== 'all'
                            ? 'Intenta con otros términos de búsqueda'
                            : 'Crea el primer equipo para comenzar'}
                    </p>
                    {!searchTerm && levelFilter === 'all' && (
                        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Crear Primer Equipo
                        </Button>
                    )}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Equipo</DialogTitle>
                        <DialogDescription>
                            Modifica la información del equipo
                        </DialogDescription>
                    </DialogHeader>
                    {editingTeam && (
                        <EditTeamForm
                            team={editingTeam}
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
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function TeamCard({ team, isSelected, onSelect, onEdit, onDelete }: TeamCardProps) {
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Principiante':
                return 'bg-green-100 text-green-800';
            case 'Intermedio':
                return 'bg-blue-100 text-blue-800';
            case 'Avanzado':
                return 'bg-orange-100 text-orange-800';
            case 'Elite':
                return 'bg-purple-100 text-purple-800';
            case 'Mixto':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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
                            <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
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
            <CardContent className="pt-0">
                {team.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {team.description}
                    </p>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Badge className={getLevelColor(team.level)}>
                            {team.level}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{team.member_count} miembros</span>
                        </div>
                    </div>

                    {team.age_range && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <UserCheck className="h-3 w-3" />
                            <span>{team.age_range}</span>
                        </div>
                    )}

                    {team.coach_name && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>Entrenador: {team.coach_name}</span>
                        </div>
                    )}

                    {team.schedule && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{team.schedule}</span>
                        </div>
                    )}

                    {team.focus_area && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Target className="h-3 w-3" />
                            <span>{team.focus_area}</span>
                        </div>
                    )}

                    {team.coach_email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{team.coach_email}</span>
                        </div>
                    )}

                    {team.coach_phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{team.coach_phone}</span>
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

interface CreateTeamFormProps {
    onSubmit: (data: CreateTeamFormData) => void;
}

function CreateTeamForm({ onSubmit }: CreateTeamFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<CreateTeamFormData>({
        resolver: zodResolver(createTeamSchema),
        defaultValues: {
            max_members: 20,
            level: 'Intermedio',
        },
    });

    const handleFormSubmit = (data: CreateTeamFormData) => {
        onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Equipo *</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder="Ej: Grupo Elite"
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="level">Nivel *</Label>
                    <Select
                        value={watch('level')}
                        onValueChange={(value) => setValue('level', value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Principiante">Principiante</SelectItem>
                            <SelectItem value="Intermedio">Intermedio</SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                            <SelectItem value="Elite">Elite</SelectItem>
                            <SelectItem value="Mixto">Mixto</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.level && (
                        <p className="text-sm text-destructive">{errors.level.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="age_range">Rango de Edad</Label>
                    <Input
                        id="age_range"
                        {...register('age_range')}
                        placeholder="Ej: 16-25 años"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="max_members">Máximo de Miembros</Label>
                    <Input
                        id="max_members"
                        type="number"
                        {...register('max_members', { valueAsNumber: true })}
                        min="1"
                        max="100"
                    />
                    {errors.max_members && (
                        <p className="text-sm text-destructive">{errors.max_members.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="coach_name">Nombre del Entrenador</Label>
                    <Input
                        id="coach_name"
                        {...register('coach_name')}
                        placeholder="Ej: María González"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="coach_email">Email del Entrenador</Label>
                    <Input
                        id="coach_email"
                        type="email"
                        {...register('coach_email')}
                        placeholder="entrenador@club.com"
                    />
                    {errors.coach_email && (
                        <p className="text-sm text-destructive">{errors.coach_email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="coach_phone">Teléfono del Entrenador</Label>
                    <Input
                        id="coach_phone"
                        {...register('coach_phone')}
                        placeholder="+34 123 456 789"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="focus_area">Área de Enfoque</Label>
                    <Input
                        id="focus_area"
                        {...register('focus_area')}
                        placeholder="Ej: Competición, Técnica"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe el equipo..."
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="schedule">Horario</Label>
                <Textarea
                    id="schedule"
                    {...register('schedule')}
                    placeholder="Ej: Lun, Mié, Vie 18:00-20:00"
                />
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Equipo'}
                </Button>
            </DialogFooter>
        </form>
    );
}

interface EditTeamFormProps {
    team: TeamWithClub;
    onSubmit: (data: UpdateTeamFormData) => void;
    onCancel: () => void;
}

function EditTeamForm({ team, onSubmit, onCancel }: EditTeamFormProps) {
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
            description: team.description || '',
            level: team.level,
            age_range: team.age_range || '',
            max_members: team.max_members,
            coach_name: team.coach_name || '',
            coach_email: team.coach_email || '',
            coach_phone: team.coach_phone || '',
            schedule: team.schedule || '',
            focus_area: team.focus_area || '',
        },
    });

    const handleFormSubmit = (data: UpdateTeamFormData) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-name">Nombre del Equipo *</Label>
                    <Input
                        id="edit-name"
                        {...register('name')}
                        placeholder="Ej: Grupo Elite"
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-level">Nivel *</Label>
                    <Select
                        value={watch('level')}
                        onValueChange={(value) => setValue('level', value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Principiante">Principiante</SelectItem>
                            <SelectItem value="Intermedio">Intermedio</SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                            <SelectItem value="Elite">Elite</SelectItem>
                            <SelectItem value="Mixto">Mixto</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.level && (
                        <p className="text-sm text-destructive">{errors.level.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-age_range">Rango de Edad</Label>
                    <Input
                        id="edit-age_range"
                        {...register('age_range')}
                        placeholder="Ej: 16-25 años"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-max_members">Máximo de Miembros</Label>
                    <Input
                        id="edit-max_members"
                        type="number"
                        {...register('max_members', { valueAsNumber: true })}
                        min="1"
                        max="100"
                    />
                    {errors.max_members && (
                        <p className="text-sm text-destructive">{errors.max_members.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-coach_name">Nombre del Entrenador</Label>
                    <Input
                        id="edit-coach_name"
                        {...register('coach_name')}
                        placeholder="Ej: María González"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-coach_email">Email del Entrenador</Label>
                    <Input
                        id="edit-coach_email"
                        type="email"
                        {...register('coach_email')}
                        placeholder="entrenador@club.com"
                    />
                    {errors.coach_email && (
                        <p className="text-sm text-destructive">{errors.coach_email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-coach_phone">Teléfono del Entrenador</Label>
                    <Input
                        id="edit-coach_phone"
                        {...register('coach_phone')}
                        placeholder="+34 123 456 789"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-focus_area">Área de Enfoque</Label>
                    <Input
                        id="edit-focus_area"
                        {...register('focus_area')}
                        placeholder="Ej: Competición, Técnica"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                    id="edit-description"
                    {...register('description')}
                    placeholder="Describe el equipo..."
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="edit-schedule">Horario</Label>
                <Textarea
                    id="edit-schedule"
                    {...register('schedule')}
                    placeholder="Ej: Lun, Mié, Vie 18:00-20:00"
                />
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Equipo'}
                </Button>
            </DialogFooter>
        </form>
    );
}

// =====================================================
// COMPONENTE DE CARGA
// =====================================================

function TeamManagementSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-48" />
            </div>
            
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
