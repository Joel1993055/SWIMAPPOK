import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Target, 
  Eye, 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Star,
  Play,
  ArrowUpRight,
  Calendar,
  Activity,
  Target as TargetIcon,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Swim APP</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Acerca de
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/preview-dashboard">Demo</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard-demo">Comenzar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-24 lg:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
            <Badge variant="secondary" className="text-sm px-4 py-2 mb-4">
              🏊‍♂️ La plataforma de análisis de natación más avanzada
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Domina tu
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}rendimiento{" "}
              </span>
              en natación
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Analiza, optimiza y mejora tu entrenamiento con datos precisos, 
              visualizaciones profesionales y insights accionables.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
                <Link href="/dashboard-demo">
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                <Link href="/preview-dashboard">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Demo
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-muted rounded-full border-2 border-background" />
                  ))}
                </div>
                <span>+500 nadadores confían en nosotros</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              ✨ Características
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Todo lo que necesitas para mejorar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas profesionales diseñadas específicamente para nadadores 
              que quieren llevar su rendimiento al siguiente nivel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Análisis Avanzado",
                description: "KPIs en tiempo real, métricas personalizadas y seguimiento del progreso a largo plazo.",
                color: "text-blue-500"
              },
              {
                icon: Target,
                title: "Objetivos Inteligentes",
                description: "Establece metas realistas y recibe recomendaciones personalizadas para alcanzarlas.",
                color: "text-green-500"
              },
              {
                icon: Activity,
                title: "Seguimiento de Sesiones",
                description: "Registra cada entrenamiento con detalles completos: distancia, tiempo, técnica y RPE.",
                color: "text-purple-500"
              },
              {
                icon: Calendar,
                title: "Calendario Anual",
                description: "Visualiza tu volumen de entrenamiento con un calendario interactivo tipo heatmap.",
                color: "text-orange-500"
              },
              {
                icon: TrendingUp,
                title: "Progreso Visual",
                description: "Gráficos interactivos que muestran tu evolución en el tiempo de forma clara.",
                color: "text-red-500"
              },
              {
                icon: Shield,
                title: "Datos Seguros",
                description: "Tus datos están protegidos y sincronizados en la nube de forma segura.",
                color: "text-indigo-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Dashboard Section */}
      <section className="w-full py-24">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50 max-w-6xl mx-auto overflow-hidden">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary/5 to-primary/10">
              <Badge variant="default" className="mb-6 w-fit mx-auto text-base px-4 py-2">
                🚀 Vista Previa del Dashboard
              </Badge>
              <CardTitle className="text-3xl lg:text-4xl font-bold">
                Explora todas las funcionalidades
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubre el poder de Swim APP con datos de ejemplo. 
                KPIs en tiempo real, gráficos interactivos y análisis detallado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg bg-muted/30">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-lg">KPIs en Tiempo Real</h3>
                  <p className="text-sm text-muted-foreground">Métricas clave de rendimiento actualizadas al instante</p>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/30">
                  <TargetIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-lg">Gráficos Interactivos</h3>
                  <p className="text-sm text-muted-foreground">Visualizaciones profesionales con Recharts</p>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/30">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-lg">Análisis Detallado</h3>
                  <p className="text-sm text-muted-foreground">Seguimiento completo de sesiones y progreso</p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
                  <Link href="/preview-dashboard">
                    <Eye className="w-5 h-5 mr-2" />
                    Ver Dashboard de Vista Previa
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                  <Link href="/dashboard-demo">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Dashboard Demo Profesional
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Confían en Swim APP
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nadadores de todos los niveles han mejorado su rendimiento 
              con nuestras herramientas de análisis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                role: "Nadadora Competitiva",
                content: "Swim APP me ha ayudado a mejorar mi técnica y establecer objetivos realistas. Los gráficos son increíbles.",
                rating: 5
              },
              {
                name: "Carlos Rodríguez",
                role: "Entrenador Personal",
                content: "Como entrenador, necesito datos precisos. Swim APP me da todo lo que necesito para seguir el progreso de mis atletas.",
                rating: 5
              },
              {
                name: "Ana Martínez",
                role: "Nadadora Recreativa",
                content: "Me encanta poder ver mi progreso a lo largo del tiempo. La interfaz es muy intuitiva y fácil de usar.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="text-center border-0 bg-background/50 backdrop-blur">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              ¿Listo para mejorar tu natación?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a cientos de nadadores que ya están optimizando su entrenamiento 
              con Swim APP. Comienza gratis hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
                <Link href="/dashboard-demo">
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                <Link href="/preview-dashboard">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Swim APP</span>
              </div>
              <p className="text-muted-foreground">
                La plataforma de análisis de natación más avanzada para nadadores de todos los niveles.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/preview-dashboard" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/dashboard-demo" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="#features" className="hover:text-foreground transition-colors">Características</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#about" className="hover:text-foreground transition-colors">Acerca de</Link></li>
                <li><Link href="/README.md" className="hover:text-foreground transition-colors">Documentación</Link></li>
                <li><Link href="#support" className="hover:text-foreground transition-colors">Soporte</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#privacy" className="hover:text-foreground transition-colors">Privacidad</Link></li>
                <li><Link href="#terms" className="hover:text-foreground transition-colors">Términos</Link></li>
                <li><Link href="#cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Swim APP. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
