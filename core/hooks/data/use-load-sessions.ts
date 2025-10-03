// =====================================================
// DATA LOADING HOOK - SESSIONS FROM SUPABASE
// =====================================================

'use client';

import { useSessionsActions } from '@/core/stores/entities/session';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useRef, useState } from 'react';

// =====================================================
// SUPABASE SESSION TYPE (MATCHES DATABASE SCHEMA)
// =====================================================

interface SupabaseSession {
  id: string;
  user_id: string;
  date: string;
  swimmer: string;
  distance: number;
  stroke: string;
  session_type: string;
  main_set: string;
  notes?: string;
  location?: string;
  coach?: string;
  objective?: string;
  time_slot?: string;
  rpe?: number;
  duration?: number;
  zone_volumes?: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
  created_at: string;
  updated_at: string;
}

// =====================================================
// MAIN HOOK IMPLEMENTATION
// =====================================================

export function useLoadSessionsFromSupabase() {
  const supabase = createClient();
  const sessionsActions = useSessionsActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const loadSessions = async () => {
      // Prevent multiple loads
      if (hasLoaded.current || isLoading) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error(`Authentication error: ${userError.message}`);
        }

        if (!user) {
          // User not authenticated, no sessions to load
          hasLoaded.current = true;
          return;
        }

        // Fetch sessions from Supabase
        const { data: sessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (sessionsError) {
          throw new Error(`Database error: ${sessionsError.message}`);
        }

        // Transform Supabase data to normalized store format
        const normalizedSessions = sessions?.map((session: SupabaseSession) => ({
          id: session.id,
          date: session.date,
          swimmer: session.swimmer,
          distance: session.distance,
          stroke: session.stroke as 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed',
          sessionType: session.session_type as 'aerobic' | 'threshold' | 'speed' | 'technique' | 'recovery',
          mainSet: session.main_set,
          notes: session.notes,
          location: session.location,
          coach: session.coach,
          objective: session.objective,
          timeSlot: session.time_slot as 'AM' | 'PM',
          zoneVolumes: session.zone_volumes ? {
            z1: session.zone_volumes.z1 || 0,
            z2: session.zone_volumes.z2 || 0,
            z3: session.zone_volumes.z3 || 0,
            z4: session.zone_volumes.z4 || 0,
            z5: session.zone_volumes.z5 || 0,
          } : undefined,
          totalVolume: session.duration || session.distance,
          averageRPE: session.rpe,
          createdAt: new Date(session.created_at).getTime(),
          updatedAt: new Date(session.updated_at).getTime(),
        })) || [];

        // Store in normalized store
        sessionsActions.setEntities(normalizedSessions);
        
        // Mark as loaded
        hasLoaded.current = true;

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading sessions';
        setError(errorMessage);
        sessionsActions.setError(errorMessage);
        console.error('Error loading sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Load sessions
    loadSessions();
  }, [supabase, sessionsActions, isLoading]);

  return {
    isLoading,
    error,
    hasLoaded: hasLoaded.current,
  };
}
