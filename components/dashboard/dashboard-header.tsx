"use client";

import { Badge } from "@/components/ui/badge";
import { WidgetManager } from "./widget-manager";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex items-center space-x-2">
        <WidgetManager />
        <Badge variant="outline" className="text-sm">
          Última actualización: {new Date().toLocaleDateString()}
        </Badge>
      </div>
    </div>
  );
}
