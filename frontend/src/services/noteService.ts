// frontend/src/services/noteService.ts
import axios from 'axios';

// Set the base URL for Axios from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Define interfaces for Note data
export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Fetch all notes
export const fetchNotes = async (): Promise<Note[]> => {
  const response = await api.get<Note[]>('notes/');
  return response.data;
};

// Create a new note
export const createNote = async (note: Partial<Note>): Promise<Note> => {
  const response = await api.post<Note>('notes/', note);
  return response.data;
};

// Update an existing note
export const updateNote = async (id: number, note: Partial<Note>): Promise<Note> => {
  const response = await api.put<Note>(`notes/${id}/`, note);
  return response.data;
};

// Delete a note
export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`notes/${id}/`);
};
