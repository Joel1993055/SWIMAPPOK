"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinaPointsCalculator } from "@/components/herramientas/fina-points-calculator";
import { RelativeSpeedCalculator } from "@/components/herramientas/relative-speed-calculator";
import { Wrench, Calculator, Timer } from "lucide-react";

export default function HerramientasPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Herramientas
              </h1>
              <p className="text-muted-foreground">
                Calculadoras y herramientas para análisis de rendimiento
              </p>
            </div>
            <Wrench className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Tabs de herramientas */}
          <Tabs defaultValue="fina-points" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="fina-points"
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Puntos FINA
              </TabsTrigger>
              <TabsTrigger
                value="relative-speed"
                className="flex items-center gap-2"
              >
                <Timer className="h-4 w-4" />
                Velocidad Relativa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fina-points" className="space-y-4">
              <FinaPointsCalculator />
            </TabsContent>

            <TabsContent value="relative-speed" className="space-y-4">
              <RelativeSpeedCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
