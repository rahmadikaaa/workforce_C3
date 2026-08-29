export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Message {
  role: "user" | "model";
  text: string;
}

export interface Entry {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  summary: string;
  createdAt: number;
  updatedAt: number;
}

// WORKFORCE — Analysis Session types
export interface ActivityContext {
  app_name: string;
  activity_name: string;
  sop_link: string;
  server_path: string;
  command: string;
  scheduler: string;
}

export interface AnalysisSession {
  id: string;
  userId: string;
  activityContext: ActivityContext;
  sopContent: string;
  executableSource: string;
  analysisJson: Record<string, unknown>;
  analysisStatus: "complete";
  createdAt: number;
  updatedAt: number;
}

