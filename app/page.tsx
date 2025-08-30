import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

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
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Swim APP</p>
      </footer>
    </div>
  );
}
