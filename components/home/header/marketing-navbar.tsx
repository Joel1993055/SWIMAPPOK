'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthModals } from "./auth-modals";

interface Props {
  user: any;
}

export function MarketingNavbar({ user }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Inicio", href: "#hero" },
    { name: "Características", href: "#features" },
    { name: "Precios", href: "#pricing" },
    { name: "Contacto", href: "#contact" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      {/* Fondo con malla/grid igual que el resto de la página */}
      <div className="absolute inset-0 -z-10">
        <div className="grain-blur background-base" />
        <div className="grain-background background-base" />
        <div className="grid-bg background-base" />
        <div className="large-blur background-base" />
        <div className="small-blur background-base" />
      </div>
      
      <div className="mx-auto max-w-7xl relative px-[32px] py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link className="flex items-center" href={"/"}>
              <Image 
                className="w-auto block" 
                src="/DECKapp-removebg-preview (1).png" 
                width={180} 
                height={54} 
                alt="DeckAPP" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.id ? (
              <Button 
                variant="secondary" 
                asChild 
                size="lg" 
                className="rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 font-medium px-6 py-2.5 transition-all duration-200"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <AuthModals user={user} />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800/50">
            <div className="flex flex-col space-y-4 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-800/50">
                {user?.id ? (
                  <Button 
                    variant="secondary" 
                    asChild 
                    size="lg" 
                    className="w-full rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 font-medium px-6 py-2.5 transition-all duration-200"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <AuthModals user={user} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
