import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-bold">Swim APP</h1>
            </div>
            
            <Badge variant="secondary" className="text-base px-4 py-2">
              Swim Training Analytics
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold max-w-3xl">
              Domina tu entrenamiento de natación
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Analiza tu rendimiento, optimiza tu técnica y alcanza tus objetivos 
              con datos precisos y visualizaciones profesionales.
            </p>
          </div>
        </div>
      </section>

      {/* Preview Dashboard CTA */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50 max-w-4xl mx-auto">
            <CardHeader className="text-center pb-8">
              <Badge variant="default" className="mb-6 w-fit mx-auto text-base px-4 py-2">
                👀 Vista Previa
              </Badge>
              <CardTitle className="text-3xl lg:text-4xl font-bold">
                Explora el Dashboard sin Registrarte
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubre todas las funcionalidades de Swim APP con datos de ejemplo. 
                KPIs, gráficos avanzados y análisis detallado de sesiones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">KPIs en Tiempo Real</h3>
                  <p className="text-sm text-muted-foreground">Métricas clave de rendimiento</p>
                </div>
                <div className="text-center">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Gráficos Interactivos</h3>
                  <p className="text-sm text-muted-foreground">Visualizaciones profesionales</p>
                </div>
                <div className="text-center">
                  <Eye className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Análisis Detallado</h3>
                  <p className="text-sm text-muted-foreground">Sesiones y progreso</p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/preview-dashboard">
                    <Eye className="w-5 h-5 mr-2" />
                    Ver Dashboard de Vista Previa
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href="/dashboard-demo">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Dashboard Demo Profesional
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
