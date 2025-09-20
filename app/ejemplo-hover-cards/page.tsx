import { ExampleHoverCards } from "@/components/ui/hover-cards";

export default function EjemploHoverCards() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center bg-slate-900 overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-200 mb-4">Tarjetas con Efecto Hover</h1>
        <p className="text-slate-400">Usando las imágenes originales con efecto de ruido y transiciones suaves</p>
      </div>
      <ExampleHoverCards />
    </main>
  );
}