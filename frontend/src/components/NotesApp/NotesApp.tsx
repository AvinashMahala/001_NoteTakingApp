// frontend/src/components/NotesApp/NotesApp.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Spinner, Form } from 'react-bootstrap';
import { fetchNotes, createNote, updateNote, deleteNote } from '../../services/noteService';
import AlertMessage from '../Alert/AlertMessage';
import NoteModal from '../Modal/NoteModal';
import NoteList from './NoteList';

import { Note } from '../../types/noteTypes';

interface AlertMessageType {
  type: 'success' | 'danger' | 'warning' | 'info';
  text: string;
}

interface ValidationErrors {
  title?: string;
  content?: string;
}

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessageType | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const showAlert = useCallback((type: AlertMessageType['type'], text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 3000);
  }, []);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const notes = await fetchNotes();
      setNotes(notes);
    } catch {
      showAlert('danger', 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const validateNote = (noteData: Partial<Note>): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!noteData.title) errors.title = 'Title is required';
    if (!noteData.content) errors.content = 'Content is required';
    return errors;
  };

  const handleSaveNote = async (noteData: Partial<Note>) => {
    const validationErrors = validateNote(noteData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      if (editNote) {
        await updateNote(editNote.id, noteData);
        showAlert('success', 'Note updated successfully.');
      } else {
        await createNote(noteData);
        showAlert('success', 'Note added successfully.');
      }
      loadNotes();
      setShowModal(false);
    } catch {
      showAlert('danger', 'Failed to save note.');
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      showAlert('success', 'Note deleted successfully.');
      loadNotes();
    } catch {
      showAlert('danger', 'Failed to delete note.');
    }
  };

  const handleOpenModal = (note?: Note) => {
    setEditNote(note || null);
    setErrors({});
    setShowModal(true);
  };

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Notes App</h1>

      {/* Display Alert Message */}
      {alertMessage && (
        <AlertMessage
          type={alertMessage.type}
          text={alertMessage.text}
          onClose={() => setAlertMessage(null)}
        />
      )}

      <Row>
        <Col className="d-flex justify-content-between align-items-center mb-3">
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Add New Note
          </Button>
          {loading && <Spinner animation="border" />}
        </Col>
      </Row>

      <Row>
        <Col>
          <NoteList notes={notes} onEdit={handleOpenModal} onDelete={handleDeleteNote} />
        </Col>
      </Row>

      {/* Note Modal with Validation Errors */}
      <NoteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveNote}
        note={editNote}
        errors={errors}
      />
    </Container>
  );
};

export default NotesApp;
