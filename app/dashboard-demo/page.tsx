"use client";

import { Sidebar } from "@/components/dashboard-demo/sidebar";
import { Navbar } from "@/components/dashboard-demo/navbar";
import { DashboardContent } from "@/components/dashboard-demo/dashboard-content";
import { StoreInitializer } from "@/components/dashboard-demo/store-initializer";

export default function DashboardDemoPage() {
  return (
    <div className="flex h-screen bg-background">
      <StoreInitializer />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard Demo</h1>
            <p className="text-muted-foreground">
              Vista previa del dashboard con tus gráficos existentes y nueva pestaña de Log
            </p>
          </div>
          
          {/* Contenido del Dashboard */}
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
