// =====================================================
// TRAINING TYPES
// =====================================================

export interface TrainingPhase {
  id: string;
  name: string;
  duration: number; // in weeks
  description: string;
  focus: string[];
  intensity: number; // 1-10
  volume: number; // meters per week
  color: string;
  startDate?: string;
  endDate?: string;
  order: number;
  phase_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingZones {
  z1: { name: string; min: number; max: number };
  z2: { name: string; min: number; max: number };
  z3: { name: string; min: number; max: number };
  z4: { name: string; min: number; max: number };
  z5: { name: string; min: number; max: number };
}

export interface ZoneDetection {
  zone: number;
  confidence: number;
}

export interface TrainingMetrics {
  distance: number;
  duration: number;
  pace: number;
  stroke: string;
}

export interface ZoneDetectionResult {
  zone: number;
  confidence: number;
  reasoning: string;
  metrics: {
    distance: number;
    duration: number;
    pace: number;
  };
}

export interface TrainingPhaseFormData {
  name: string;
  duration: number;
  description: string;
  focus: string[];
  intensity: number;
  volume: number;
  color: string;
  order: number;
}

export interface TrainingPhasesContextType {
  phases: TrainingPhase[];
  setPhases: (phases: TrainingPhase[]) => void;
  addPhase: (phase: TrainingPhase) => void;
  updatePhase: (id: string, updates: Partial<TrainingPhase>) => void;
  deletePhase: (id: string) => void;
  getCurrentPhase: () => TrainingPhase | null;
  getPhaseById: (id: string) => TrainingPhase | null;
}

export interface TrainingZonesContextType {
  selectedMethodology: string;
  currentZones: TrainingZones;
  setMethodology: (methodology: string) => void;
  updateZones: (zones: TrainingZones) => void;
}
