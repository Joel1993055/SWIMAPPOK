"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Home, Users, Target, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-bold">Swim APP</span>
        </Link>
      </div>
      
      <div className="flex-1 space-y-4 p-4">
        <nav className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard-demo" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/preview-dashboard" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Preview</span>
            </Link>
          </Button>
        </nav>
        
        <div className="space-y-2">
          <h4 className="px-2 text-sm font-medium text-muted-foreground">Configuración</h4>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="#" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="#" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="border-t p-4">
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Volver a Inicio</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
