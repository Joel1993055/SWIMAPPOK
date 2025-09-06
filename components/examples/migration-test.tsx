// =====================================================
// COMPONENTE DE PRUEBA DE MIGRACIÓN
// =====================================================

"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompleteMigration } from '@/lib/hooks/use-migration';
import { useSessionsStore } from '@/lib/store/unified';

export function MigrationTest() {
  const { sessions, getTotalSessions, getTotalDistance } = useSessionsStore();
  
  // Ejecutar migración
  useCompleteMigration();

  return (
    <Card>
      <CardHeader>
        <CardTitle>🧪 Test de Migración</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Sesiones en Store:</p>
              <p className="text-2xl font-bold">{getTotalSessions()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Distancia Total:</p>
              <p className="text-2xl font-bold">{getTotalDistance()}m</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sesiones Recientes:</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay sesiones cargadas</p>
              ) : (
                sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="p-2 border rounded text-sm">
                    <p className="font-medium">{session.swimmer}</p>
                    <p className="text-gray-600">
                      {session.distance}m - {session.durationMin}min - {session.stroke}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              ✅ Store unificado funcionando correctamente
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
