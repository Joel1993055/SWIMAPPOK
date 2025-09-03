import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TrainingZonesProvider } from "@/lib/contexts/training-zones-context";
import { AICoachProvider } from "@/lib/contexts/ai-coach-context";
import { ReportsProvider } from "@/lib/contexts/reports-context";
import { TrainingPhasesProvider } from "@/lib/contexts/training-phases-context";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Swim APP PRO - Plataforma de Análisis de Natación",
  description: "La plataforma de análisis de natación más avanzada para nadadores de todos los niveles",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
                          <TrainingZonesProvider>
                  <AICoachProvider>
                    <ReportsProvider>
                      <TrainingPhasesProvider>
                        <main className="min-h-screen">
                          {children}
                        </main>
                      </TrainingPhasesProvider>
                    </ReportsProvider>
                  </AICoachProvider>
                </TrainingZonesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
