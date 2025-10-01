'use client';

import { useClubsStore } from '@/core/stores/clubs-store';
import { createContext, useContext, useEffect, useState } from 'react';

// =====================================================
// TIPOS DEL CONTEXTO
// =====================================================
interface AppContextType {
  // Estado actual
  selectedClub: string | null;
  selectedGroup: string | null;
  isLoading: boolean;
  
  // Acciones
  setSelectedClub: (clubId: string | null) => void;
  setSelectedGroup: (groupId: string | null) => void;
  clearSelection: () => void;
  
  // Datos del contexto actual
  currentClub: any | null;
  currentGroup: any | null;
  availableGroups: any[];
}

// =====================================================
// CONTEXTO
// =====================================================
const AppContext = createContext<AppContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================
interface AppContextProviderProps {
  children: React.ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [selectedClub, setSelectedClubState] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroupState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    clubs,
    teams,
    selectedClub: storeSelectedClub,
    selectedTeam: storeSelectedTeam,
    setSelectedClub: storeSetSelectedClub,
    setSelectedTeam: storeSetSelectedTeam,
    loadClubs,
    loadTeamsByClub,
  } = useClubsStore();

  // =====================================================
  // CARGAR DATOS INICIALES
  // =====================================================
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar clubes
        await loadClubs();
        
        // Restaurar selección desde localStorage
        const savedClub = localStorage.getItem('selectedClub');
        const savedGroup = localStorage.getItem('selectedGroup');
        
        if (savedClub && clubs.length > 0) {
          const clubExists = clubs.find(club => club.id === savedClub);
          if (clubExists) {
            setSelectedClubState(savedClub);
            await storeSetSelectedClub(savedClub);
            
            // Cargar equipos del club seleccionado
            await loadTeamsByClub(savedClub);
            
            if (savedGroup) {
              setSelectedGroupState(savedGroup);
              await storeSetSelectedTeam(savedGroup);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing app context:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [clubs.length, loadClubs, storeSetSelectedClub, storeSetSelectedTeam, loadTeamsByClub]);

  // =====================================================
  // MANEJAR CAMBIO DE CLUB
  // =====================================================
  const setSelectedClub = async (clubId: string | null) => {
    try {
      setSelectedClubState(clubId);
      
      if (clubId) {
        // Guardar en localStorage
        localStorage.setItem('selectedClub', clubId);
        
        // Actualizar store
        await storeSetSelectedClub(clubId);
        
        // Cargar equipos del club
        await loadTeamsByClub(clubId);
        
        // Resetear grupo si cambia el club
        setSelectedGroupState(null);
        await storeSetSelectedTeam(null);
        localStorage.removeItem('selectedGroup');
      } else {
        // Limpiar selección
        localStorage.removeItem('selectedClub');
        localStorage.removeItem('selectedGroup');
        await storeSetSelectedClub(null);
        await storeSetSelectedTeam(null);
      }
    } catch (error) {
      console.error('Error setting selected club:', error);
    }
  };

  // =====================================================
  // MANEJAR CAMBIO DE GRUPO
  // =====================================================
  const setSelectedGroup = async (groupId: string | null) => {
    try {
      setSelectedGroupState(groupId);
      
      if (groupId) {
        // Guardar en localStorage
        localStorage.setItem('selectedGroup', groupId);
        
        // Actualizar store
        await storeSetSelectedTeam(groupId);
      } else {
        // Limpiar selección
        localStorage.removeItem('selectedGroup');
        await storeSetSelectedTeam(null);
      }
    } catch (error) {
      console.error('Error setting selected group:', error);
    }
  };

  // =====================================================
  // LIMPIAR SELECCIÓN
  // =====================================================
  const clearSelection = () => {
    setSelectedClub(null);
    setSelectedGroup(null);
  };

  // =====================================================
  // DATOS DEL CONTEXTO ACTUAL
  // =====================================================
  const currentClub = clubs.find(club => club.id === selectedClub) || null;
  const currentGroup = teams.find(team => team.id === selectedGroup) || null;
  const availableGroups = teams.filter(team => team.club_id === selectedClub);

  // =====================================================
  // VALOR DEL CONTEXTO
  // =====================================================
  const value: AppContextType = {
    selectedClub,
    selectedGroup,
    isLoading,
    setSelectedClub,
    setSelectedGroup,
    clearSelection,
    currentClub,
    currentGroup,
    availableGroups,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// =====================================================
// HOOK PARA USAR EL CONTEXTO
// =====================================================
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}

// =====================================================
// HOOKS ESPECÍFICOS
// =====================================================
export function useSelectedClub() {
  const { selectedClub, currentClub } = useAppContext();
  return { selectedClub, currentClub };
}

export function useSelectedGroup() {
  const { selectedGroup, currentGroup, availableGroups } = useAppContext();
  return { selectedGroup, currentGroup, availableGroups };
}

export function useClubGroupSelection() {
  const { 
    selectedClub, 
    selectedGroup, 
    setSelectedClub, 
    setSelectedGroup, 
    clearSelection,
    isLoading 
  } = useAppContext();
  
  return {
    selectedClub,
    selectedGroup,
    setSelectedClub,
    setSelectedGroup,
    clearSelection,
    isLoading,
  };
}
