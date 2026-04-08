export interface TutorResponse {
  bigIdea: string;
  breakdown: string[];
  checkQuestion: string;
  rawText?: string;
  imageUrl?: string; // Cache the image for history
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AnalysisError {
  title: string;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface HistoryEntry {
  id: string;
  userId: string;
  timestamp: number;
  data: TutorResponse;
}
