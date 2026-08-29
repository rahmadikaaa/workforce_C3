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

