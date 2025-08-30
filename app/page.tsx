"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Play, 
  Eye
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-16">
            Swim APP PRO
          </h1>
          
          {/* Dashboard Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard-demo">
                    <Play className="w-5 h-5 mr-2" />
                    Ir al Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Demo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/preview-dashboard">
                    <Eye className="w-5 h-5 mr-2" />
                    Ver Demo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Swim APP PRO
          </p>
        </div>
      </footer>
    </div>
  );
}
