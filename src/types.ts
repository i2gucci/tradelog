export interface Trade {
  id: string;
  txn: string;
  ticker: string;
  status: 'win' | 'loss';
  percentageChange: number;
  dollarChange: number;
  description: string;
  timestamp: number;
  
  // Detailed report fields
  chartUrl?: string;
  actions: string[];
  expectedOutcome: string;
  actualOutcome: string;
  feedbackAnalysis: string[];
  // Reflection categories
  lessonsLearned: string[];
  emotionalState: string;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  trades: Trade[];
  createdAt: number;
}

export interface AppState {
  sessions: Session[];
  activeSessionId: string | null;
}

// Shared emotion options for consistency across components
export interface EmotionOption {
  value: string;
  emoji: string;
  tooltip: string;
}

export const EMOTION_OPTIONS: EmotionOption[] = [
  { value: 'rage', emoji: '😡', tooltip: 'Rage trade' },
  { value: 'desperation', emoji: '😰', tooltip: 'Desperate' },
  { value: 'neutral', emoji: '😐', tooltip: 'Neutral' },
  { value: 'relaxed', emoji: '😌', tooltip: 'Relaxed' },
  { value: 'calculated', emoji: '🎯', tooltip: 'Calculated' },
];
