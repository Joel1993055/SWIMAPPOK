"use client";

import { LandingHeader } from "@/components/layout/landing-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

// Importar los componentes de marketing
import CTA from "./marketing/components/sections/cta/default";
import FAQ from "./marketing/components/sections/faq/default";
import Footer from "./marketing/components/sections/footer/default";
import Hero from "./marketing/components/sections/hero/default";
import Items from "./marketing/components/sections/items/default";
import Logos from "./marketing/components/sections/logos/default";
import Navbar from "./marketing/components/sections/navbar/default";
import Pricing from "./marketing/components/sections/pricing/default";
import Stats from "./marketing/components/sections/stats/default";

export default function Home() {
  const [showMarketing, setShowMarketing] = useState(false);

  const handleLandingToggle = (showMarketing: boolean) => {
    setShowMarketing(showMarketing);
  };

  if (showMarketing) {
    return (
      <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
        <Navbar />
        <Hero />
        <Logos />
        <Items />
        <Stats />
        <Pricing />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header superior */}
      <LandingHeader onLandingToggle={handleLandingToggle} />

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-12">
          {/* Título principal */}
          <h1 className="text-5xl font-bold text-white">Swim APP PRO</h1>

          {/* Botones de navegación */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/preview-dashboard">Preview</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
