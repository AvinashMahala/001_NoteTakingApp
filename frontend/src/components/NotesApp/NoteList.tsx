// frontend/src/components/NotesApp/NoteList.tsx
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Note } from '../../types/noteTypes';
import NoteItem from './NoteItem';

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Title</th>
        <th>Content</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </tbody>
  </Table>
);

export default NoteList;
