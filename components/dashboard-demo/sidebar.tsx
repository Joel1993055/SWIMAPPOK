"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Home, Users, Target, Settings, LogOut, Calendar, Activity, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useSessionsStore } from "@/lib/store/sessions";
import { useDashboardTabsStore } from "@/lib/store/dashboard-tabs";
import { getAggregations } from "@/lib/aggregations";
import { getCurrentYear } from "@/lib/date";

export function Sidebar() {
  const { sessions } = useSessionsStore();
  const { activeTab, setActiveTab } = useDashboardTabsStore();
  const currentYear = getCurrentYear();
  
  // Calcular métricas del mes actual para el widget
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  const currentMonthSessions = sessions.filter(s => s.date.startsWith(currentMonthStr));
  const currentMonthDistance = currentMonthSessions.reduce((sum, s) => sum + s.distance, 0);
  const currentMonthCount = currentMonthSessions.length;

  return (
    <div className="flex h-full w-80 flex-col border-r bg-card shadow-sm">
      {/* Header del Sidebar */}
      <div className="flex h-16 items-center border-b px-6 bg-gradient-to-r from-primary/5 to-primary/10">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground">Swim APP</span>
        </Link>
      </div>
      
      {/* Navegación Principal - Overview, Log y Analytics */}
      <div className="flex-1 space-y-6 p-6">
        <div className="space-y-3">
          <h3 className="px-2 text-sm font-semibold text-foreground uppercase tracking-wider">
            Dashboard
          </h3>
          
          {/* Overview Tab */}
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            className={`w-full justify-start h-12 text-base font-medium transition-all duration-200 ${
              activeTab === 'overview' 
                ? 'shadow-md bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <div className={`p-1.5 rounded-md mr-3 transition-colors ${
              activeTab === 'overview' ? 'bg-primary-foreground/20' : 'bg-primary/10'
            }`}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <span>Overview</span>
          </Button>
          
          {/* Log Tab */}
          <Button 
            variant={activeTab === 'log' ? 'default' : 'ghost'}
            className={`w-full justify-start h-12 text-base font-medium transition-all duration-200 ${
              activeTab === 'log' 
                ? 'shadow-md bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setActiveTab('log')}
          >
            <div className={`p-1.5 rounded-md mr-3 transition-colors ${
              activeTab === 'log' ? 'bg-primary-foreground/20' : 'bg-primary/10'
            }`}>
              <Calendar className="h-5 w-5" />
            </div>
            <span>Log</span>
          </Button>

          {/* Insights Tab - NUEVA PESTAÑA */}
          <Button 
            variant={activeTab === 'insights' ? 'default' : 'ghost'}
            className={`w-full justify-start h-12 text-base font-medium transition-all duration-200 ${
              activeTab === 'insights' 
                ? 'shadow-md bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setActiveTab('insights')}
          >
            <div className={`p-1.5 rounded-md mr-3 transition-colors ${
              activeTab === 'insights' ? 'bg-primary-foreground/20' : 'bg-primary/10'
            }`}>
              <Zap className="h-5 w-5" />
            </div>
            <span>Insights</span>
          </Button>

          {/* Analytics Tab */}
          <Button 
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            className={`w-full justify-start h-12 text-base font-medium transition-all duration-200 ${
              activeTab === 'analytics' 
                ? 'shadow-md bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            <div className={`p-1.5 rounded-md mr-3 transition-colors ${
              activeTab === 'analytics' ? 'bg-primary-foreground/20' : 'bg-primary/10'
            }`}>
              <TrendingUp className="h-5 w-5" />
            </div>
            <span>Analytics</span>
          </Button>
        </div>

        {/* Widget de Métricas del Mes */}
        <div className="space-y-3">
          <h3 className="px-2 text-sm font-semibold text-foreground uppercase tracking-wider">
            Este Mes
          </h3>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(currentMonthDistance / 1000 * 10) / 10}k
                  </div>
                  <p className="text-xs text-muted-foreground">km total</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary">
                    {currentMonthCount}
                  </div>
                  <p className="text-xs text-muted-foreground">sesiones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación Secundaria */}
        <div className="space-y-3">
          <h3 className="px-2 text-sm font-semibold text-foreground uppercase tracking-wider">
            Navegación
          </h3>
          
          <Button asChild variant="ghost" className="w-full justify-start h-11 hover:bg-primary/10 hover:text-primary transition-colors">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full justify-start h-11 hover:bg-primary/10 hover:text-primary transition-colors">
            <Link href="/preview-dashboard" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Preview</span>
            </Link>
          </Button>
        </div>
        
        {/* Configuración */}
        <div className="space-y-3">
          <h3 className="px-2 text-sm font-semibold text-foreground uppercase tracking-wider">
            Configuración
          </h3>
          <Button asChild variant="ghost" className="w-full justify-start h-11 hover:bg-primary/10 hover:text-primary transition-colors">
            <Link href="#" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full justify-start h-11 hover:bg-primary/10 hover:text-primary transition-colors">
            <Link href="#" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Footer del Sidebar */}
      <div className="border-t p-4 bg-muted/30">
        <Button asChild variant="ghost" className="w-full justify-start h-11 hover:bg-primary/10 hover:text-primary transition-colors">
          <Link href="/" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Volver a Inicio</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
