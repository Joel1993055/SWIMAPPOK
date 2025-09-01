"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Play, 
  Eye,
  Target,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              La plataforma más avanzada para nadadores
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Swim APP PRO
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Analiza, optimiza y mejora tu entrenamiento con datos precisos, 
              visualizaciones profesionales y insights accionables.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/dashboard">
                  <Play className="w-5 h-5 mr-2" />
                  Probar Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/preview-dashboard">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Características Principales</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para llevar tu natación al siguiente nivel
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Dashboard Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  KPIs en tiempo real, gráficos interactivos y análisis detallado de tu progreso
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Gestión de Entrenamientos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Formularios rápidos, calendario anual y filtros avanzados para tus sesiones
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Analytics Avanzados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Seguimiento completo de sesiones y progreso con insights accionables
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Nadadores Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Sesiones Registradas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfacción</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para mejorar tu natación?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a cientos de nadadores que ya están optimizando su entrenamiento
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/dashboard">
              Comenzar Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-2xl font-bold text-gray-800">Swim APP PRO</span>
          </div>
          <p className="text-gray-600 mb-4">
            La plataforma de análisis de natación más avanzada
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Swim APP PRO. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
