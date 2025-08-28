"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
      <Button variant="outline" size="icon" className="md:hidden">
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <div className="flex flex-1 items-center gap-4">
        {/* Search */}
        <form className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8"
            />
          </div>
        </form>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificaciones</span>
          </Button>
          
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              Volver a Inicio
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
