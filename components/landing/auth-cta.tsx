"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BarChart3, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

const features = [
  "Dashboard personalizado con métricas avanzadas",
  "Seguimiento de objetivos y progreso",
  "Análisis de rendimiento por sesión",
  "Comparativas temporales y tendencias",
  "Exportación de datos en múltiples formatos",
  "Sincronización en la nube con Supabase"
];

export default function AuthCTASection() {
  return (
    <section className="w-full">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50 max-w-5xl mx-auto">
        <CardHeader className="text-center pb-8">
          <Badge variant="default" className="mb-6 w-fit mx-auto text-base px-4 py-2">
            🚀 Comienza Ahora
          </Badge>
          <CardTitle className="text-4xl lg:text-5xl font-bold">
            Únete a Swim APP y transforma tu entrenamiento
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accede a herramientas profesionales de análisis deportivo 
            diseñadas específicamente para nadadores competitivos.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Nadadores activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Sesiones registradas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfacción</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/sign-up">
                <Users className="w-5 h-5 mr-2" />
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/sign-in">
                <BarChart3 className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
