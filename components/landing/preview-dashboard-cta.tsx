"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowRight, Eye, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function PreviewDashboardCTA() {
  return (
    <section className="w-full">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50 max-w-5xl mx-auto">
        <CardHeader className="text-center pb-8">
          <Badge
            variant="default"
            className="mb-6 w-fit mx-auto text-base px-4 py-2"
          >
            👀 Vista Previa
          </Badge>
          <CardTitle className="text-4xl lg:text-5xl font-bold">
            Explora el Dashboard sin Registrarte
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre todas las funcionalidades de Swim APP con datos de ejemplo.
            KPIs, gráficos avanzados y análisis detallado de sesiones.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">KPIs en Tiempo Real</h3>
              <p className="text-sm text-muted-foreground">
                Métricas clave de rendimiento
              </p>
            </div>
            <div className="text-center p-4">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Gráficos Interactivos</h3>
              <p className="text-sm text-muted-foreground">
                Visualizaciones con Recharts
              </p>
            </div>
            <div className="text-center p-4">
              <Users className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Análisis de Sesiones</h3>
              <p className="text-sm text-muted-foreground">
                Tabla con búsqueda y paginación
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link
                href="/preview-dashboard"
                aria-label="Ver dashboard de vista previa"
              >
                <Eye className="w-5 h-5 mr-2" />
                Ver Dashboard de Vista Previa
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link
                href="/dashboard-demo"
                aria-label="Ver dashboard demo profesional"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Dashboard Demo Profesional
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
