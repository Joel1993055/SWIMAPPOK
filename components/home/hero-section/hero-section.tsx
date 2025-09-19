import Image from "next/image";

export function HeroSection() {
  return (
    <section className={"mx-auto max-w-7xl px-[32px] relative mt-32 mb-12"}>
      <div className={"text-center w-full mb-16"}>
        <h1 className={"text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium text-white"}>
          Descubre el poder de la
          <br />
          <span className="text-gray-200">
            tecnología en natación
          </span>
        </h1>
        <p className={"mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px] text-gray-300 max-w-3xl mx-auto"}>
          Experimenta la revolución en el análisis de natación con nuestras herramientas más avanzadas
        </p>
      </div>
      
      {/* Dashboard Image */}
      <div className="flex justify-center">
        <div className="relative max-w-6xl w-full">
          <Image
            src="/dashboard-dark.png"
            alt="DeckAPP Dashboard - Análisis de Natación"
            width={1200}
            height={800}
            className="rounded-2xl shadow-2xl border border-gray-700/50"
            priority
          />
          {/* Overlay gradient for better integration */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
        </div>
      </div>
    </section>
  );
}
