/**
 * Hook para inicializar el store de clubes
 * @fileoverview Hook que carga los datos iniciales de clubes y equipos
 */

import { useClubsStore } from '@/core/stores/clubs-store';
import { useEffect } from 'react';

export function useClubsInit() {
    const { loadClubs, selectedClub, setSelectedClub } = useClubsStore();

    useEffect(() => {
        // Cargar clubes al inicializar
        loadClubs();
    }, [loadClubs]);

    // Restaurar selección persistida
    useEffect(() => {
        const { navigation } = useClubsStore.getState();
        if (navigation.selectedClubId && !selectedClub) {
            setSelectedClub(navigation.selectedClubId);
        }
    }, [selectedClub, setSelectedClub]);

    return {
        isLoading: useClubsStore((state) => state.isLoading),
        error: useClubsStore((state) => state.error),
    };
}
