// src/types/noteTypes.ts

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at?: string; // Optional
  updated_at?: string; // Optional
}
