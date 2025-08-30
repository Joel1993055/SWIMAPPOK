"use client";

import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { BarChart3, ArrowRight } from "lucide-react";
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Play, 
  Eye
} from "lucide-react";
>>>>>>> cf415e0 (feat: update Home and DashboardContent components - enhance layout and improve readability - remove current month widget from DashboardContent)
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
<<<<<<< HEAD

      {/* Hero central - ajustado para mejor equilibrio */}
      <main className="flex-1 flex items-center justify-center px-4 -mt-16">
        <div className="text-center max-w-lg">
          <h1 className="text-5xl font-bold mb-6">
            Swim APP
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Plataforma de análisis de natación
          </p>
          
          {/* Botones más grandes y equilibrados */}
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full h-14 text-lg px-8">
              <Link href="/dashboard-demo">
                Dashboard Demo
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full h-14 text-lg px-8">
              <Link href="/preview-dashboard">
                Vista Previa
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </Button>
          </div>
=======
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 select-none">
            <div className="w-9 h-9 bg-primary rounded-xl grid place-items-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Swim APP PRO</span>
          </Link>
>>>>>>> cf415e0 (feat: update Home and DashboardContent components - enhance layout and improve readability - remove current month widget from DashboardContent)
        </div>
      </main>

<<<<<<< HEAD
      {/* Footer minimalista */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Swim APP</p>
=======
      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-16">
            Swim APP PRO
          </h1>
          
          {/* Dashboard Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard-demo">
                    <Play className="w-5 h-5 mr-2" />
                    Ir al Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Demo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/preview-dashboard">
                    <Eye className="w-5 h-5 mr-2" />
                    Ver Demo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Swim APP PRO
          </p>
        </div>
>>>>>>> cf415e0 (feat: update Home and DashboardContent components - enhance layout and improve readability - remove current month widget from DashboardContent)
      </footer>
    </div>
  );
}
