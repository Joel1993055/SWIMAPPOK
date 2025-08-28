import { getSeedData, getAggregations } from "@/lib/seed";
import { Sidebar } from "@/components/dashboard-demo/sidebar";
import { Navbar } from "@/components/dashboard-demo/navbar";
import { KPICards } from "@/components/dashboard-demo/kpi-cards";
import { ChartCardWrapper } from "@/components/dashboard-demo/chart-card-wrapper";
import VolumeBarchart from "@/components/barchart";
import ChartComponent from "@/components/chartcomponent";
import { SessionsTable } from "@/components/dashboard-demo/sessions-table";

export default async function DashboardDemoPage() {
  const sessions = getSeedData();
  const stats = getAggregations(sessions);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Demo</h1>
            <p className="text-muted-foreground">
              Vista previa del dashboard con tus gráficos existentes
            </p>
          </div>
          
          {/* KPIs */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Métricas Clave</h2>
            <KPICards stats={stats} />
          </section>
          
          {/* Charts - REUTILIZANDO TUS COMPONENTES EXISTENTES */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Gráficos de Rendimiento</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartCardWrapper 
                title="Volumen Semanal" 
                description="Distancia por semana en kilómetros"
              >
                <VolumeBarchart />
              </ChartCardWrapper>
              
              <ChartCardWrapper 
                title="Progreso GA1 vs GA2" 
                description="Análisis temporal de intensidades"
              >
                <ChartComponent />
              </ChartCardWrapper>
            </div>
          </section>
          
          {/* Sessions Table */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Sesiones Recientes</h2>
            <SessionsTable sessions={sessions} />
          </section>
        </main>
      </div>
    </div>
  );
}
