/**
 * Hook para inicializar el store de clubes
 * @fileoverview Hook que carga los datos iniciales de clubes y equipos
 */

import { useClubsActions, useClubsError, useClubsLoading } from '@/core/stores/entities/club';
import { useNavigationActions, useSelectedClubId } from '@/core/stores/entities/navigation';
import { useEffect } from 'react';

export function useClubsInit() {
    // New entity stores
    const clubsActions = useClubsActions();
    const navigationActions = useNavigationActions();
    const selectedClubId = useSelectedClubId();
    const isLoading = useClubsLoading();
    const error = useClubsError();

    useEffect(() => {
        // Cargar clubes al inicializar
        clubsActions.loadClubs();
    }, [clubsActions]);

    // Restaurar selección persistida
    useEffect(() => {
        // Check if there's a persisted selection but no current selection
        if (selectedClubId && !selectedClubId) {
            // This effect is mainly for backward compatibility
            // The navigation store already handles persistence
        }
    }, [selectedClubId]);

    return {
        isLoading,
        error,
    };
}
