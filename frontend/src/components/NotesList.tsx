import React, { useEffect, useState } from 'react';
import { fetchNotes, Note } from '../api/api';

const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes", error);
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Notes List</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <small>Created at: {note.created_at}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
