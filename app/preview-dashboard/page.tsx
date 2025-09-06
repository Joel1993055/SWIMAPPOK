import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, TrendingUp, Users, Target, Activity } from "lucide-react";
import Link from "next/link";
import { getSeedData, getAggregations } from "@/lib/seed";
import VolumeBarchart from "@/components/charts/barchart";
import ChartComponent from "@/components/charts/chartcomponent";

export default async function PreviewDashboardPage() {
  const sessions = getSeedData();
  const stats = getAggregations(sessions);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard (Preview)</h1>
              <p className="text-sm text-muted-foreground">Datos de ejemplo para demostración</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* KPIs */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Métricas Clave</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDistance}m</div>
                <p className="text-xs text-muted-foreground">+20.1% vs mes anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distancia Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgDistance}m</div>
                <p className="text-xs text-muted-foreground">Por sesión</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sesiones</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">% Técnica</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.techniquePercentage}%</div>
                <p className="text-xs text-muted-foreground">vs Aeróbico</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Gráficos de Rendimiento</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VolumeBarchart />
            <ChartComponent />
          </div>
        </section>

        {/* Sessions Table */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Sesiones Recientes</h2>
          <Card>
            <CardHeader>
              <CardTitle>Sesiones de Entrenamiento</CardTitle>
              <CardDescription>
                Últimas {sessions.length} sesiones registradas
              </CardDescription>
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
                    {sessions.map((session) => (
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
            </CardContent>
          </Card>
        </section>

        {/* Add More Charts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Añadir Más Gráficos</h2>
          <Card>
            <CardHeader>
              <CardTitle>Próximas Funcionalidades</CardTitle>
              <CardDescription>
                Placeholders para futuros gráficos y análisis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-medium">Análisis por Estilo</h4>
                  <p className="text-sm text-muted-foreground">Comparativa entre estilos</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-medium">Progreso Temporal</h4>
                  <p className="text-sm text-muted-foreground">Evolución del rendimiento</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-medium">Comparativa de Nadadores</h4>
                  <p className="text-sm text-muted-foreground">Análisis grupal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
