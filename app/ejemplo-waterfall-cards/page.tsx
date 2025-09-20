import { ExampleWaterfallCards } from "@/components/ui/waterfall-cards";

export default function EjemploWaterfallCards() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden supports-[overflow:clip]:overflow-clip">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        
        <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-4xl font-bold text-slate-300 text-center">
          Scroll down
        </div>

        {/* Waterfall Cards */}
        <ExampleWaterfallCards />

        <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-4xl font-bold text-slate-300 text-center">
          Scroll up
        </div>

      </div>
    </main>
  );
}
