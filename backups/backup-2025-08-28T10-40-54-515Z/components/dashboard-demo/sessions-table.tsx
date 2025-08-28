"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Session } from "@/lib/types/session";
import { useState } from "react";

interface SessionsTableProps {
  sessions: Session[];
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredSessions = sessions.filter(session =>
    session.swimmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.stroke.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones de Entrenamiento</CardTitle>
        <CardDescription>
          Últimas {sessions.length} sesiones registradas
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar por nadador, estilo o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Fecha</th>
                <th className="text-left p-2 font-medium">Nadador</th>
                <th className="text-left p-2 font-medium">Distancia</th>
                <th className="text-left p-2 font-medium">Duración</th>
                <th className="text-left p-2 font-medium">Estilo</th>
                <th className="text-left p-2 font-medium">Tipo</th>
                <th className="text-left p-2 font-medium">RPE</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.map((session) => (
                <tr key={session.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{session.date}</td>
                  <td className="p-2">{session.swimmer}</td>
                  <td className="p-2">{session.distance}m</td>
                  <td className="p-2">{session.durationMin}min</td>
                  <td className="p-2">
                    <Badge variant="outline" className="capitalize">
                      {session.stroke}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <Badge 
                      variant={session.sessionType === 'technique' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {session.sessionType}
                    </Badge>
                  </td>
                  <td className="p-2">{session.RPE}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSessions.length)} de {filteredSessions.length} sesiones
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded hover:bg-muted disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded hover:bg-muted disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
