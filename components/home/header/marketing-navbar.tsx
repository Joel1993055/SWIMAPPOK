'use client';

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthModals } from "./auth-modals";

const supabase = createClient();

interface Props {
  user: any;
}

export function MarketingNavbar({ user }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigation = [
    { name: "Inicio", href: "#hero" },
    { 
      name: "Producto", 
      href: "#", 
      dropdown: [
        { name: "Análisis", href: "#", icon: "📊" },
        { name: "Reportes", href: "#", icon: "📈" },
        { name: "Entrenamientos", href: "#", icon: "🏊" },
        { name: "Métricas", href: "#", icon: "📋" },
        { name: "Comparaciones", href: "#", icon: "⚖️" }
      ]
    },
    { 
      name: "Desarrolladores", 
      href: "#", 
      dropdown: [
        { name: "Documentación", href: "#", icon: "📚" },
        { name: "API", href: "#", icon: "🔌" },
        { name: "SDK", href: "#", icon: "🛠️" },
        { name: "Ejemplos", href: "#", icon: "💡" },
        { name: "Soporte", href: "#", icon: "🎯" }
      ]
    },
    { 
      name: "Recursos", 
      href: "#", 
      dropdown: [
        { name: "Blog", href: "#", icon: "📝" },
        { name: "Tutoriales", href: "#", icon: "🎓" },
        { name: "Casos de Uso", href: "#", icon: "📖" },
        { name: "Comunidad", href: "#", icon: "👥" },
        { name: "Eventos", href: "#", icon: "📅" }
      ]
    },
    { name: "Precios", href: "#pricing" },
    { name: "Contacto", href: "#contact" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      {/* Fondo especial del navbar con grid, verde y glow */}
      <div className="absolute inset-0 -z-10">
        <div className={'grain-blur background-base'} />
        <div className={'grain-background background-base'} />
        <div className={'grid-bg background-base'} />
        <div className={'large-blur background-base'} />
        <div className={'small-blur background-base'} />
      </div>
      
      <div className="mx-auto max-w-7xl relative px-4 sm:px-6 lg:px-8 py-0 sm:py-1">
        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between">
              {/* Logo - Left on mobile */}
              <div className="flex items-center">
                <Link className="flex items-center" href={"/"}>
                  <Image 
                    className="w-auto block h-40 sm:h-48" 
                    src="/DECKapp.svg" 
                    width={800} 
                    height={240} 
                    alt="DeckAPP" 
                    priority
                  />
                </Link>
              </div>

          {/* Right side - Demo button + Menu */}
          <div className="flex items-center gap-3">
            {/* Demo Button */}
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-black hover:bg-gray-100 rounded-full px-4 py-2 text-sm font-medium"
            >
              Get a Demo
            </Button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors duration-200 p-2"
              aria-label="Menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo - Left on desktop */}
          <div className="flex items-center">
            <Link className="flex items-center" href={"/"}>
              <Image 
                className="w-auto block h-24 lg:h-48 xl:h-52" 
                src="/DECKapp.svg" 
                width={450} 
                height={135} 
                alt="DeckAPP" 
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1"
                >
                  {item.name}
                  {item.dropdown && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                
                {/* Dropdown */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-[600px] bg-black/90 backdrop-blur-sm rounded-xl border border-gray-800/30 shadow-2xl z-50">
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-8">
                        {/* Columna 1 */}
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            {item.name.toUpperCase()}
                          </div>
                          <div className="space-y-3">
                            {item.dropdown.slice(0, 5).map((dropdownItem, index) => (
                              <Link
                                key={index}
                                href={dropdownItem.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200 group"
                              >
                                <span className="text-lg group-hover:scale-110 transition-transform duration-200">{dropdownItem.icon}</span>
                                <span className="text-sm font-medium">{dropdownItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        {/* Columna 2 */}
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            RECURSOS
                          </div>
                          <div className="space-y-3">
                            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200 group">
                              <span className="text-lg group-hover:scale-110 transition-transform duration-200">📚</span>
                              <span className="text-sm font-medium">Documentación</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200 group">
                              <span className="text-lg group-hover:scale-110 transition-transform duration-200">🎓</span>
                              <span className="text-sm font-medium">Tutoriales</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200 group">
                              <span className="text-lg group-hover:scale-110 transition-transform duration-200">👥</span>
                              <span className="text-sm font-medium">Comunidad</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200 group">
                              <span className="text-lg group-hover:scale-110 transition-transform duration-200">🎯</span>
                              <span className="text-sm font-medium">Soporte</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200 group">
                              <span className="text-lg group-hover:scale-110 transition-transform duration-200">📅</span>
                              <span className="text-sm font-medium">Eventos</span>
                            </Link>
                          </div>
                        </div>
                        
                        {/* Columna 3 - Blog */}
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            BLOG
                          </div>
                          <div className="space-y-4">
                            <Link href="#" className="block group">
                              <div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors duration-200 mb-1">
                                Análisis avanzado de rendimiento en natación
                              </div>
                              <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                                Descubre las últimas técnicas de análisis de datos para optimizar el rendimiento de tus nadadores...
                              </div>
                            </Link>
                            <Link href="#" className="block group">
                              <div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors duration-200 mb-1">
                                Métricas clave para entrenadores
                              </div>
                              <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                                Aprende qué métricas son esenciales para el seguimiento del progreso de tus atletas...
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

        </div>

        {/* Mobile Navigation - Minimal Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            {/* Minimal Overlay */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]" />
            
            {/* Menu Content */}
            <div className="fixed inset-0 z-[9999] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-end px-6 py-4">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="px-6 space-y-2">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between text-white hover:text-gray-300 transition-colors duration-200 font-medium py-3 text-lg group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        {item.dropdown && (
                          <svg className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </Link>
                      {item.dropdown && (
                        <div className="ml-4 space-y-1">
                          {item.dropdown.map((dropdownItem, index) => (
                            <Link
                              key={index}
                              href={dropdownItem.href}
                              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 py-2 text-base"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="text-sm">{dropdownItem.icon}</span>
                              <span>{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Auth Section */}
              <div className="p-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="text-white text-center">
                      <div className="text-sm text-gray-400 mb-1">Hola,</div>
                      <div className="font-medium truncate">{user.email}</div>
                    </div>
                    <Button
                      onClick={() => {
                        supabase.auth.signOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="lg"
                      className="w-full border-gray-600 text-white hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200 py-3"
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-gray-600 text-white hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200 py-3"
                        asChild
                      >
                        <Link href="/auth/signin">Log in</Link>
                      </Button>
                      <Button
                        size="lg"
                        className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-200 py-3 font-medium"
                        asChild
                      >
                        <Link href="/auth/signup">Get a Demo</Link>
                      </Button>
                    </div>
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
