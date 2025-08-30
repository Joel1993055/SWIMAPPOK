import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Play, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 select-none">
            <div className="w-9 h-9 bg-primary rounded-xl grid place-items-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Swim APP</span>
            </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/preview-dashboard">Demo</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard-demo">Comenzar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative w-full py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-5 px-3 py-1.5">🏊‍♂️ Analítica de natación</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Entrena mejor con <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">datos claros</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Registra tus sesiones, visualiza métricas esenciales y toma decisiones rápidas. Sin ruido.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-auto px-7 py-5 text-base">
                <Link href="/dashboard-demo">
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-auto px-7 py-5 text-base">
                <Link href="/preview-dashboard">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skinny highlights (minimal) */}
      <section className="w-full py-14 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{
              title: "KPIs al instante",
              desc: "Tiempo, volumen, ritmo y RPE en una vista simple.",
            }, {
              title: "Registro ágil",
              desc: "Añade sesiones sin abandonar tu flujo de trabajo.",
            }, {
              title: "Gráficos limpios",
              desc: "Evolución clara para decisiones rápidas.",
            }].map((item, i) => (
              <Card key={i} className="border bg-background/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.desc}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview CTA */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border bg-gradient-to-br from-background to-muted/40">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold">Prueba la demo con datos de ejemplo</h2>
              <p className="mt-2 text-muted-foreground">
                Explora el dashboard antes de empezar. Sin registro.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/preview-dashboard">Abrir Demo</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard-demo">Ir al Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-10 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Swim APP</p>
        </div>
      </footer>
    </div>
  );
}
