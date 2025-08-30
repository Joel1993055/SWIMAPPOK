"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSessionsStore } from "@/lib/store/sessions";
import { getFilteredAggregations } from "@/lib/aggregations";
import { getCurrentYear, getYearRange } from "@/lib/date";
import { Session } from "@/lib/types/session";
import { Download, Filter, BarChart3, Target, Clock, TrendingUp } from "lucide-react";

const STROKE_OPTIONS = [
  { value: "all", label: "Todos los estilos" },
  { value: "freestyle", label: "Libre" },
  { value: "backstroke", label: "Espalda" },
  { value: "breaststroke", label: "Pecho" },
  { value: "butterfly", label: "Mariposa" },
  { value: "mixed", label: "Mixto" }
];

const SESSION_TYPE_OPTIONS = [
  { value: "all", label: "Todos los tipos" },
  { value: "aerobic", label: "Aeróbico" },
  { value: "threshold", label: "Umbral" },
  { value: "speed", label: "Velocidad" },
  { value: "technique", label: "Técnica" },
  { value: "recovery", label: "Recuperación" }
];

export function TotalsFilters() {
  const { sessions } = useSessionsStore();
  const currentYear = getCurrentYear();
  const yearRange = getYearRange(new Date());
  
  // Estado de filtros
  const [filters, setFilters] = useState({
    dateRange: {
      start: yearRange.start,
      end: yearRange.end
    },
    stroke: "all",
    sessionType: "all",
    searchTerm: ""
  });

  // Aplicar filtros
  const filteredData = useMemo(() => {
    let filtered = sessions.filter(session => 
      session.date >= filters.dateRange.start && 
      session.date <= filters.dateRange.end
    );

    if (filters.stroke !== "all") {
      filtered = filtered.filter(session => session.stroke === filters.stroke);
    }

    if (filters.sessionType !== "all") {
      filtered = filtered.filter(session => session.sessionType === filters.sessionType);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(session =>
        session.mainSet.toLowerCase().includes(searchLower) ||
        session.notes?.toLowerCase().includes(searchLower) ||
        session.swimmer.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [sessions, filters]);

  // Calcular métricas filtradas
  const filteredStats = getFilteredAggregations(
    filteredData,
    filters.dateRange.start,
    filters.dateRange.end
  );

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const headers = ["Fecha", "Nadador", "Distancia (m)", "Duración (min)", "Estilo", "Tipo", "Serie Principal", "RPE", "Notas"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(session => [
        session.date,
        session.swimmer,
        session.distance,
        session.durationMin,
        session.stroke,
        session.sessionType,
        session.mainSet,
        session.RPE,
        session.notes || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `swim-sessions-${filters.dateRange.start}-${filters.dateRange.end}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      dateRange: yearRange,
      stroke: "all",
      sessionType: "all",
      searchTerm: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h4 className="font-medium">Filtros</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rango de fechas */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Desde</Label>
            <Input
              id="start-date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">Hasta</Label>
            <Input
              id="end-date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
            />
          </div>
          
          {/* Filtro de estilo */}
          <div className="space-y-2">
            <Label htmlFor="stroke-filter">Estilo</Label>
            <Select value={filters.stroke} onValueChange={(value) => setFilters({ ...filters, stroke: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STROKE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Filtro de tipo */}
          <div className="space-y-2">
            <Label htmlFor="type-filter">Tipo</Label>
            <Select value={filters.sessionType} onValueChange={(value) => setFilters({ ...filters, sessionType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Búsqueda por texto */}
        <div className="space-y-2">
          <Label htmlFor="search">Búsqueda</Label>
          <Input
            id="search"
            placeholder="Buscar por serie principal, notas o nadador..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
        
        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Limpiar Filtros
          </Button>
          <Button size="sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Métricas filtradas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <h4 className="font-medium">Métricas del Período</h4>
          <Badge variant="secondary">
            {filteredData.length} sesiones
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total distancia */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Total Distancia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredStats.totalDistance}m</div>
              <p className="text-xs text-muted-foreground">
                Promedio: {filteredStats.avgDistance}m/sesión
              </p>
            </CardContent>
          </Card>
          
          {/* Total sesiones */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Total Sesiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredStats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                {filteredStats.techniquePercentage}% técnica
              </p>
            </CardContent>
          </Card>
          
          {/* Promedio por sesión */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Promedio/Sesión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredStats.avgDistance}m</div>
              <p className="text-xs text-muted-foreground">
                Por entrenamiento
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resumen de filtros aplicados */}
      {(filters.stroke !== "all" || filters.sessionType !== "all" || filters.searchTerm) && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-800 dark:text-orange-200">
                Filtros aplicados:
              </span>
              {filters.stroke !== "all" && (
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  Estilo: {STROKE_OPTIONS.find(s => s.value === filters.stroke)?.label}
                </Badge>
              )}
              {filters.sessionType !== "all" && (
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  Tipo: {SESSION_TYPE_OPTIONS.find(s => s.value === filters.sessionType)?.label}
                </Badge>
              )}
              {filters.searchTerm && (
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  Búsqueda: &ldquo;{filters.searchTerm}&rdquo;
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
