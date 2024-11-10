// frontend/src/components/NotesApp.tsx
import React, { useState, useEffect } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote, Note } from '../services/noteService';

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const notes = await fetchNotes();
    setNotes(notes);
  };

  const handleAddNote = async () => {
    if (editId) {
      await updateNote(editId, { title, content });
      setEditId(null);
    } else {
      await createNote({ title, content });
    }
    setTitle('');
    setContent('');
    loadNotes();
  };

  const handleEditNote = (note: Note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id);
    loadNotes();
  };

  return (
    <div>
      <h1>Notes App</h1>
      <div>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          value={content}
          placeholder="Content"
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddNote}>{editId ? 'Update Note' : 'Add Note'}</button>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleEditNote(note)}>Edit</button>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesApp;
