import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard Oficial</h1>
              <p className="text-sm text-muted-foreground">Layout oficial de shadcn/ui</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Volver a Inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido al Dashboard Oficial</CardTitle>
              <CardDescription>
                Esta es la página del dashboard oficial instalado por shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Este dashboard fue instalado automáticamente y puede ser personalizado según tus necesidades.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Navigation Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Navegación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Demo</CardTitle>
                <CardDescription>Tu diseño personalizado</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard-demo">Ver Dashboard Demo</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preview Dashboard</CardTitle>
                <CardDescription>Dashboard público de vista previa</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/preview-dashboard">Ver Preview</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Landing Page</CardTitle>
                <CardDescription>Página principal</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Ir a Inicio</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
