"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import VolumeBarchart from "@/components/barchart";
import ChartComponent from "@/components/chartcomponent";

export function ChartsSection() {
  return (
    <>
      <VolumeBarchart />
      <ChartComponent />
    </>
  );
}
