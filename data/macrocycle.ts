export interface MacrocycleWeek {
  week: number;
  date: string;
  period: 'BASIC' | 'SPECIFIC' | 'COMPETITION';
  meso: string;
  micro: number;
  tests: string[];
  competitions: string[];
  registrations: string[];
  holidays: string[];
  notes?: string;
  intensity?: 'LOW' | 'MEDIUM' | 'HIGH';
  focus?: string[];
}

export const macrocycleData: MacrocycleWeek[] = [
  // MACROCYCLE I - Q1 (Weeks 1-12)
  { week: 1, date: "Jan-1", period: "BASIC", meso: "B1", micro: 1, tests: [], competitions: [], registrations: [], holidays: ["New Year"] },
  { week: 2, date: "Jan-8", period: "BASIC", meso: "B1", micro: 2, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 3, date: "Jan-15", period: "BASIC", meso: "B2", micro: 3, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 4, date: "Jan-22", period: "BASIC", meso: "B2", micro: 4, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 5, date: "Jan-29", period: "BASIC", meso: "B2", micro: 5, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 6, date: "Feb-5", period: "BASIC", meso: "B2", micro: 6, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 7, date: "Feb-12", period: "BASIC", meso: "B3", micro: 7, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 8, date: "Feb-19", period: "BASIC", meso: "B3", micro: 8, tests: ["Fitness Test"], competitions: [], registrations: [], holidays: [] },
  { week: 9, date: "Feb-26", period: "BASIC", meso: "B3", micro: 9, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 10, date: "Mar-5", period: "SPECIFIC", meso: "E1", micro: 10, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 11, date: "Mar-12", period: "SPECIFIC", meso: "E1", micro: 11, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 12, date: "Mar-19", period: "SPECIFIC", meso: "PRECOM", micro: 12, tests: [], competitions: ["Spring Cup"], registrations: [], holidays: [] },

  // MACROCYCLE II - Q2 (Weeks 13-24)
  { week: 13, date: "Mar-26", period: "COMPETITION", meso: "COMP", micro: 13, tests: [], competitions: ["Regional Champs"], registrations: [], holidays: [] },
  { week: 14, date: "Apr-2", period: "COMPETITION", meso: "COMP", micro: 14, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 15, date: "Apr-9", period: "COMPETITION", meso: "COMP", micro: 15, tests: [], competitions: ["National Qualifier"], registrations: [], holidays: [] },
  { week: 16, date: "Apr-16", period: "BASIC", meso: "B1", micro: 16, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 17, date: "Apr-23", period: "BASIC", meso: "B1", micro: 17, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 18, date: "Apr-30", period: "BASIC", meso: "B2", micro: 18, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 19, date: "May-7", period: "BASIC", meso: "B2", micro: 19, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 20, date: "May-14", period: "BASIC", meso: "B2", micro: 20, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 21, date: "May-21", period: "BASIC", meso: "B3", micro: 21, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 22, date: "May-28", period: "BASIC", meso: "B3", micro: 22, tests: ["Mid-Season Test"], competitions: [], registrations: [], holidays: [] },
  { week: 23, date: "Jun-4", period: "SPECIFIC", meso: "E1", micro: 23, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 24, date: "Jun-11", period: "SPECIFIC", meso: "E1", micro: 24, tests: [], competitions: ["Summer Series"], registrations: [], holidays: [] },

  // MACROCYCLE III - Q3 (Weeks 25-36)
  { week: 25, date: "Jun-18", period: "SPECIFIC", meso: "PRECOM", micro: 25, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 26, date: "Jun-25", period: "COMPETITION", meso: "COMP", micro: 26, tests: [], competitions: ["Championship"], registrations: [], holidays: [] },
  { week: 27, date: "Jul-2", period: "COMPETITION", meso: "COMP", micro: 27, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 28, date: "Jul-9", period: "COMPETITION", meso: "COMP", micro: 28, tests: [], competitions: ["World Qualifier"], registrations: [], holidays: [] },
  { week: 29, date: "Jul-16", period: "BASIC", meso: "B1", micro: 29, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 30, date: "Jul-23", period: "BASIC", meso: "B1", micro: 30, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 31, date: "Jul-30", period: "BASIC", meso: "B2", micro: 31, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 32, date: "Aug-6", period: "BASIC", meso: "B2", micro: 32, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 33, date: "Aug-13", period: "BASIC", meso: "B2", micro: 33, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 34, date: "Aug-20", period: "BASIC", meso: "B3", micro: 34, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 35, date: "Aug-27", period: "BASIC", meso: "B3", micro: 35, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 36, date: "Sep-3", period: "SPECIFIC", meso: "E1", micro: 36, tests: [], competitions: ["Fall Classic"], registrations: [], holidays: [] },

  // MACROCYCLE IV - Q4 (Weeks 37-48)
  { week: 37, date: "Sep-10", period: "SPECIFIC", meso: "E1", micro: 37, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 38, date: "Sep-17", period: "SPECIFIC", meso: "PRECOM", micro: 38, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 39, date: "Sep-24", period: "SPECIFIC", meso: "PRECOM", micro: 39, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 40, date: "Oct-1", period: "COMPETITION", meso: "COMP", micro: 40, tests: [], competitions: ["Final Championship"], registrations: [], holidays: [] },
  { week: 41, date: "Oct-8", period: "COMPETITION", meso: "COMP", micro: 41, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 42, date: "Oct-15", period: "COMPETITION", meso: "COMP", micro: 42, tests: [], competitions: ["World Finals"], registrations: [], holidays: [] },
  { week: 43, date: "Oct-22", period: "BASIC", meso: "B1", micro: 43, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 44, date: "Oct-29", period: "BASIC", meso: "B1", micro: 44, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 45, date: "Nov-5", period: "BASIC", meso: "B2", micro: 45, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 46, date: "Nov-12", period: "BASIC", meso: "B2", micro: 46, tests: [], competitions: [], registrations: [], holidays: [] },
  { week: 47, date: "Nov-19", period: "BASIC", meso: "B3", micro: 47, tests: ["Year-End Test"], competitions: [], registrations: [], holidays: [] },
  { week: 48, date: "Nov-26", period: "BASIC", meso: "B3", micro: 48, tests: [], competitions: [], registrations: [], holidays: ["Thanksgiving"] },
];

export const periodColors = {
  BASIC: {
    bg: 'bg-muted/30',
    text: 'text-muted-foreground',
    border: 'border-muted',
    accent: 'bg-blue-50',
    accentText: 'text-blue-700'
  },
  SPECIFIC: {
    bg: 'bg-muted/50',
    text: 'text-foreground',
    border: 'border-muted',
    accent: 'bg-primary/10',
    accentText: 'text-primary'
  },
  COMPETITION: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
    accent: 'bg-destructive/20',
    accentText: 'text-destructive'
  }
} as const;
