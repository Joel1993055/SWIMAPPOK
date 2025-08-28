export type Session = {
  id: string;
  date: string;
  swimmer: string;
  distance: number;
  durationMin: number;
  stroke: "freestyle" | "backstroke" | "breaststroke" | "butterfly" | "mixed";
  sessionType: "aerobic" | "threshold" | "speed" | "technique" | "recovery";
  mainSet: string;
  RPE: 1|2|3|4|5|6|7|8|9|10;
  notes?: string;
}
