// =====================================================
// EJEMPLO DE USO DEL NUEVO STORE - SIN ROMPER NADA
// =====================================================

"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionsStore } from '@/lib/store/unified';

export function SessionsExample() {
  const {
    sessions,
    isLoading,
    error,
    addSession,
    updateSession,
    deleteSession,
    getTotalDistance,
    getTotalSessions,
  } = useSessionsStore();

  const handleAddSession = () => {
    addSession({
      date: new Date().toISOString().split('T')[0],
      swimmer: "Ejemplo",
      distance: 1000,
      durationMin: 30,
      stroke: "freestyle",
      sessionType: "aerobic",
      mainSet: "10x100m",
      RPE: 6,
      notes: "Sesión de ejemplo",
    });
  };

  if (isLoading) {
    return <div>Cargando sesiones...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ejemplo de Sessions Store</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleAddSession}>
              Agregar Sesión de Ejemplo
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Sesiones:</p>
              <p className="text-2xl font-bold">{getTotalSessions()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Distancia Total:</p>
              <p className="text-2xl font-bold">{getTotalDistance()}m</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sesiones Recientes:</h3>
            <div className="space-y-2">
              {sessions.slice(0, 3).map((session) => (
                <div key={session.id} className="p-2 border rounded">
                  <p className="font-medium">{session.swimmer}</p>
                  <p className="text-sm text-gray-600">
                    {session.distance}m - {session.durationMin}min
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
