// =====================================================
// TIPOS DE AI COACH
// =====================================================

export interface AICoachAdvice {
  id: string;
  type: "performance" | "technique" | "recovery" | "nutrition" | "motivation";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  actionText?: string;
  createdAt: Date;
}

export interface AICoachAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AICoachContextType {
  advice: AICoachAdvice[];
  analysis: AICoachAnalysis | null;
  isLoading: boolean;
  error: string | null;
  addAdvice: (advice: Omit<AICoachAdvice, "id" | "createdAt">) => void;
  updateAdvice: (id: string, updates: Partial<AICoachAdvice>) => void;
  deleteAdvice: (id: string) => void;
  generateAnalysis: (context: string) => AICoachAdvice[];
  clearAdvice: () => void;
}

export interface AICoachRequest {
  context: string;
  type: AICoachAdvice["type"];
  priority?: AICoachAdvice["priority"];
}

export interface AICoachResponse {
  success: boolean;
  advice?: AICoachAdvice[];
  analysis?: AICoachAnalysis;
  error?: string;
}
