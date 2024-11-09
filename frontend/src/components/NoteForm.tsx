import React, { useState } from 'react';
import { createNote } from '../api/api';

const NoteForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createNote({ title, content });
      setTitle('');
      setContent('');
      alert("Note created successfully!");
    } catch (error) {
      console.error("Error creating note", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Note</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Note</button>
    </form>
  );
};

export default NoteForm;
