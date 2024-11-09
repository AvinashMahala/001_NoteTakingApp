import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const fetchNotes = async (): Promise<Note[]> => {
  const response = await axios.get<Note[]>(`${API_URL}notes/`);
  return response.data;
};

export const createNote = async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note> => {
  const response = await axios.post<Note>(`${API_URL}notes/`, note);
  return response.data;
};
