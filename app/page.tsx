import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-12">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <BarChart3 className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold">Swim:APP</span>
        </div>
        
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
  );
}