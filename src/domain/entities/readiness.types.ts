export const READINESS_CATEGORIES = {
  SIAP: 'SIAP',
  HAMPIR_SIAP: 'HAMPIR_SIAP',
  PERLU_TINDAK_LANJUT: 'PERLU_TINDAK_LANJUT',
  PRIORITAS: 'PRIORITAS',
} as const;

export type ReadinessCategory = (typeof READINESS_CATEGORIES)[keyof typeof READINESS_CATEGORIES];

export interface ComponentScoreDetail {
  code: string;
  name: string;
  weight: number; // percentage, e.g. 20
  score: number; // 0 to 100 within component
  weightedScore: number; // (score / 100) * weight
  status: 'COMPLETE' | 'IN_PROGRESS' | 'ATTENTION' | 'PENDING';
  itemsChecklist: {
    label: string;
    isCompleted: boolean;
    notes?: string;
  }[];
}

export interface ReadinessCalculationResult {
  totalScore: number; // 0.00 to 100.00
  category: ReadinessCategory;
  categoryLabel: string;
  breakdown: Record<string, ComponentScoreDetail>;
  calculatedAt: Date;
}
