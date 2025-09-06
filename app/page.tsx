import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LandingHeader } from "@/components/layout/landing-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header superior */}
      <LandingHeader />
      
      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-12">
          {/* Título principal */}
          <h1 className="text-5xl font-bold text-white">
            Swim APP PRO
          </h1>
          
          {/* Botones de navegación */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <Link href="/preview-dashboard">
                Preview
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
