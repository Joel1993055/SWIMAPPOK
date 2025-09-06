import { CompetitionsProvider } from "@/lib/contexts/competitions-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompetitionsProvider>{children}</CompetitionsProvider>
  );
}
