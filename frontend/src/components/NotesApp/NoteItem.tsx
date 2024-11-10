// src/components/NotesApp/NoteItem.tsx

import React from 'react';
import { Button } from 'react-bootstrap';
import { Note } from '../../types/noteTypes';

interface NoteItemProps {
  note: Note;  // Use the Note interface here for type safety
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete }) => (
  <tr>
    <td>{note.title}</td>
    <td>{note.content}</td>
    <td>
      <Button variant="outline-secondary" size="sm" onClick={() => onEdit(note)} className="me-2">
        Edit
      </Button>
      <Button variant="outline-danger" size="sm" onClick={() => onDelete(note.id)}>
        Delete
      </Button>
    </td>
  </tr>
);

export default NoteItem;
