// frontend/src/services/noteService.ts
import axios from 'axios';
import { Note } from "./../types/noteTypes";

// Set the base URL for Axios from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Fetch all notes
export const fetchNotes = async (): Promise<Note[]> => {
  const response = await api.get<Note[]>('notes/list');
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
