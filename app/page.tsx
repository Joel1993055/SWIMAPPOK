import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <BarChart3 className="w-12 h-12 text-blue-500" />
          <span className="text-3xl font-bold">Swim:APP</span>
        </div>
        
        {/* Título principal */}
        <h1 className="text-6xl font-bold text-white">
          Swim APP PRO
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl text-gray-400 max-w-md mx-auto">
          Plataforma de análisis de natación
        </p>
        
        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800">
            <Link href="/preview-dashboard">
              Preview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}