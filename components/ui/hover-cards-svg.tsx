"use client";

import { cn } from "@/utils/cn";

interface HoverCardSvgProps {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  hoverIcon: React.ReactNode;
  className?: string;
}

interface HoverCardsSectionSvgProps {
  cards: HoverCardSvgProps[];
  className?: string;
}

export function HoverCardSvg({ 
  label, 
  title, 
  description, 
  icon,
  hoverIcon,
  className 
}: HoverCardSvgProps) {
  return (
    <div className={cn(
      "group [background:linear-gradient(theme(colors.slate.900),theme(colors.slate.900))_padding-box,linear-gradient(45deg,theme(colors.slate.800),theme(colors.slate.600/.8),theme(colors.slate.800))_border-box] relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-slate-800/20 before:to-slate-600/10 before:rounded-[inherit] rounded-2xl border border-transparent",
      className
    )}>
      <div className="relative">
        <div className="px-6 py-5">
          <div className="font-['Nothing_You_Could_Do'] text-lg text-indigo-500 mb-1">
            {label}
          </div>
          <div className="text-lg font-bold text-slate-200 mb-1">
            {title}
          </div>
          <p className="text-sm text-slate-500">
            {description}
          </p>
        </div>
        <div className="relative group-hover:-translate-y-1 transition-transform duration-500 ease-in-out h-60 flex items-center justify-center">
          {/* Icono normal */}
          <div className="group-hover:opacity-0 transition-opacity duration-500 flex items-center justify-center w-full h-full">
            {icon}
          </div>
          {/* Icono hover */}
          <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center w-full h-full">
            {hoverIcon}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HoverCardsSectionSvg({ cards, className }: HoverCardsSectionSvgProps) {
  return (
    <section className={cn(
      "grid md:grid-cols-3 gap-6 max-md:max-w-xs mx-auto",
      className
    )}>
      {cards.map((card, index) => (
        <HoverCardSvg
          key={index}
          {...card}
        />
      ))}
    </section>
  );
}

// Componente de ejemplo con iconos SVG
export function ExampleHoverCardsSvg() {
  const exampleCards: HoverCardSvgProps[] = [
    {
      label: "Entrenamiento",
      title: "Análisis de Zonas",
      description: "Detecta automáticamente las zonas de entrenamiento de tus nadadores para optimizar el rendimiento.",
      icon: (
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      ),
      hoverIcon: (
        <div className="w-32 h-32 bg-gradient-to-br from-blue-600/30 to-cyan-700/30 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      )
    },
    {
      label: "Reportes",
      title: "Estadísticas Avanzadas",
      description: "Genera reportes detallados del rendimiento de tus equipos con métricas personalizadas.",
      icon: (
        <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      ),
      hoverIcon: (
        <div className="w-32 h-32 bg-gradient-to-br from-green-600/30 to-emerald-700/30 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-400 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )
    },
    {
      label: "Planificación",
      title: "Gestión de Equipos",
      description: "Organiza y gestiona tus equipos de natación con herramientas profesionales de planificación.",
      icon: (
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      ),
      hoverIcon: (
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600/30 to-pink-700/30 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-400 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
      <HoverCardsSectionSvg cards={exampleCards} />
    </div>
  );
}
