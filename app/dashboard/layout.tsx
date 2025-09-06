import { TrainingPhasesProvider } from "@/lib/contexts/training-phases-context";
import { CompetitionsProvider } from "@/lib/contexts/competitions-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrainingPhasesProvider>
      <CompetitionsProvider>{children}</CompetitionsProvider>
    </TrainingPhasesProvider>
  );
}
