"use client";

import { useEffect } from "react";
import { useSessionsStore } from "@/lib/store/sessions";
import { getSeedData } from "@/lib/seed";

export function StoreInitializer() {
  const { sessions, addSession } = useSessionsStore();

  useEffect(() => {
    // Solo cargar datos del seed si no hay sesiones en el store
    if (sessions.length === 0) {
      const seedSessions = getSeedData();
      
      // Cargar todas las sesiones del seed en el store
      seedSessions.forEach(session => {
        const { id, ...sessionData } = session;
        addSession(sessionData);
      });
    }
  }, [sessions.length, addSession]);

  return null; // Este componente no renderiza nada
}
