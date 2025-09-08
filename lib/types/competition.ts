// =====================================================
// TIPOS DE COMPETICIONES
// =====================================================

export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  type: 'nacional' | 'regional' | 'local' | 'internacional';
  events: string[];
  objectives: string;
  results?: CompetitionResult[];
  status: 'upcoming' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompetitionResult {
  event: string;
  time: string;
  position: number;
  personalBest: boolean;
  points?: number;
  notes?: string;
}

export interface CompetitionFormData {
  name: string;
  date: string;
  location: string;
  type: Competition['type'];
  events: string[];
  objectives: string;
  description?: string;
  priority: Competition['priority'];
}

export interface CompetitionContextType {
  competitions: Competition[];
  setCompetitions: (competitions: Competition[]) => void;
  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  getCompetitionsByDate: (date: string) => Competition[];
  getMainCompetition: () => Competition | null;
}
