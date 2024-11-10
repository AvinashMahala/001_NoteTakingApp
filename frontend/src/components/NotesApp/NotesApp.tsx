// frontend/src/components/NotesApp/NotesApp.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { fetchNotes, createNote, updateNote, deleteNote } from '../../services/noteService';
import AlertMessage from '../Alert/AlertMessage';
import NoteModal from "./../Modal/NoteModal";
import NoteList from './NoteList';

import { Note } from "./../../types/noteTypes";


interface AlertMessageType {
  type: 'success' | 'danger' | 'warning' | 'info';
  text: string;
}

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessageType | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const notes = await fetchNotes();
      setNotes(notes);
    } catch {
      setAlertMessage({ type: 'danger', text: 'Failed to load notes.' });
    }
  };

  const handleSaveNote = async (noteData: Partial<Note>) => {
    try {
      if (editNote) {
        await updateNote(editNote.id, noteData);
        setAlertMessage({ type: 'success', text: 'Note updated successfully.' });
      } else {
        await createNote(noteData);
        setAlertMessage({ type: 'success', text: 'Note added successfully.' });
      }
      loadNotes();
      handleCloseModal();
    } catch {
      setAlertMessage({ type: 'danger', text: 'Failed to save note.' });
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      setAlertMessage({ type: 'success', text: 'Note deleted successfully.' });
      loadNotes();
    } catch {
      setAlertMessage({ type: 'danger', text: 'Failed to delete note.' });
    }
  };

  const handleOpenModal = (note?: Note) => {
    setEditNote(note || null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Notes App</h1>

      {/* Display Alert Message */}
      {alertMessage && 
      <AlertMessage 
      type={alertMessage.type} 
      text={alertMessage.text} 
      onClose={() => setAlertMessage(null)}
      />}

      <Row>
        <Col>
          <Button variant="primary" onClick={() => handleOpenModal()} className="mb-3">
            Add New Note
          </Button>

          {/* Note List */}
          <NoteList notes={notes} onEdit={handleOpenModal} onDelete={handleDeleteNote} />
        </Col>
      </Row>

      {/* Modal for creating/updating a note */}
      <NoteModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSaveNote}
        note={editNote}
      />
    </Container>
  );
};

export default NotesApp;
