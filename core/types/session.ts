export type Session = {
  id: string;
  date: string;
  swimmer: string;
  distance: number;
  stroke: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed';
  sessionType: 'aerobic' | 'threshold' | 'speed' | 'technique' | 'recovery';
  mainSet: string;
  notes?: string;
};
