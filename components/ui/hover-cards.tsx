"use client";

import { cn } from "@/lib/utils";

interface HoverCardProps {
  label: string;
  title: string;
  description: string;
  image: string;
  hoverImage?: string;
  className?: string;
}

interface HoverCardsSectionProps {
  cards: HoverCardProps[];
  className?: string;
}

export function HoverCard({ 
  label, 
  title, 
  description, 
  image, 
  hoverImage, 
  className 
}: HoverCardProps) {
  return (
    <div className={cn(
      "group [background:linear-gradient(#0a0a0a,#0a0a0a)_padding-box,linear-gradient(45deg,theme(colors.gray.900),theme(colors.gray.800/.6),theme(colors.gray.900))_border-box] relative before:absolute before:inset-0 before:bg-[url('/noise.png')] before:bg-[length:352px_382px] before:rounded-[inherit] rounded-none border border-transparent backdrop-blur-sm",
      className
    )}>
      <div className="relative">
        <div className="px-6 py-5">
          <div className="font-['Nothing_You_Could_Do'] text-lg text-white mb-1">
            {label}
          </div>
          <div className="text-lg font-bold text-white mb-1">
            {title}
          </div>
          <p className="text-sm text-white">
            {description}
          </p>
        </div>
        <div className="relative group-hover:-translate-y-1 transition-transform duration-500 ease-in-out flex items-center justify-center">
          <img 
            className="group-hover:opacity-0 transition-opacity duration-500" 
            src={image} 
            width="350" 
            height="240" 
            alt={`${title} image`}
          />
          {hoverImage && (
            <img 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              src={hoverImage} 
              width="350" 
              height="240" 
              alt={`${title} hover image`}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function HoverCardsSection({ cards, className }: HoverCardsSectionProps) {
  return (
    <section className={cn(
      "grid md:grid-cols-3 gap-6 max-md:max-w-xs mx-auto",
      className
    )}>
      {cards.map((card, index) => (
        <HoverCard
          key={index}
          {...card}
        />
      ))}
    </section>
  );
}

// Componente de ejemplo con datos predefinidos
export function ExampleHoverCards() {
  const exampleCards: HoverCardProps[] = [
    {
      label: "Label",
      title: "Daily Reports",
      description: "Building truly great products is both art and science. It's part intuition and part data.",
      image: "/card-01.png",
      hoverImage: "/card-01-hover.png"
    },
    {
      label: "Label",
      title: "Advanced Security",
      description: "Building truly great products is both art and science. It's part intuition and part data.",
      image: "/card-02.png",
      hoverImage: "/card-02-hover.png"
    },
    {
      label: "Label",
      title: "Powerful Analytics",
      description: "Building truly great products is both art and science. It's part intuition and part data.",
      image: "/card-03.png",
      hoverImage: "/card-03-hover.png"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
      <HoverCardsSection cards={exampleCards} />
    </div>
  );
}