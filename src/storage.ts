import { AppState, Session, Trade } from './types';

const STORAGE_KEY = 'trade-tracker-data';

export const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state: AppState = JSON.parse(saved);
      
      // Migrate old data: convert feedbackAnalysis from string to array and add new fields
      state.sessions = state.sessions.map(session => ({
        ...session,
        trades: session.trades.map(trade => {
          const legacyTrade = trade as any;
          return {
            ...trade,
            feedbackAnalysis: Array.isArray(trade.feedbackAnalysis)
              ? trade.feedbackAnalysis
              : trade.feedbackAnalysis
                ? [trade.feedbackAnalysis as string]
                : [],
            lessonsLearned: Array.isArray(legacyTrade.lessonsLearned) ? legacyTrade.lessonsLearned : [],
            emotionalState: typeof legacyTrade.emotionalState === 'string' ? legacyTrade.emotionalState : '',
          };
        }),
      }));
      
      return state;
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  
  return {
    sessions: [],
    activeSessionId: null,
  };
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const createSession = (name: string, date: string): Session => {
  return {
    id: `session-${Date.now()}`,
    name,
    date,
    trades: [],
    createdAt: Date.now(),
  };
};

export const createTrade = (data: Omit<Trade, 'id' | 'timestamp'>): Trade => {
  return {
    ...data,
    id: `trade-${Date.now()}`,
    timestamp: Date.now(),
  };
};
