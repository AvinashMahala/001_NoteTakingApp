import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { fetchNotes, createNote, updateNote, deleteNote } from '../../services/noteService';
import AlertMessage from '../Alert/AlertMessage';
import NoteModal from '../Modal/NoteModal';
import NoteList from './NoteList';
import { Note } from '../../types/noteTypes';

interface AlertMessageType {
  type: 'success' | 'danger' | 'warning' | 'info';
  text: string;
}

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessageType | null>(null);
  const [loading, setLoading] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleSaveNote = async (noteData: Partial<Note>) => {
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

  const confirmDeleteNote = (id: number) => {
    setNoteToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteNote = async () => {
    if (noteToDelete !== null) {
      try {
        await deleteNote(noteToDelete);
        showAlert('success', 'Note deleted successfully.');
        loadNotes();
      } catch {
        showAlert('danger', 'Failed to delete note.');
      } finally {
        setShowDeleteConfirm(false);
        setNoteToDelete(null);
      }
    }
  };

  const handleOpenModal = (note?: Note) => {
    setEditNote(note || null);
    setShowModal(true);
  };

  // Function to generate 100 dummy notes
  const generateDummyData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/notes/generate_dummy_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        showAlert('success', '100 dummy notes generated successfully.');
        loadNotes(); // Reload notes to display the new dummy data
      } else {
        showAlert('danger', 'Failed to generate dummy notes.');
      }
    } catch (error) {
      console.error("Error generating dummy notes:", error);
      showAlert('danger', 'Error generating dummy notes.');
    }
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
          <Button variant="secondary" onClick={generateDummyData}>
            Generate 100 Dummy Notes
          </Button>
          {loading && <Spinner animation="border" />}
        </Col>
      </Row>

      <Row>
        <Col>
          <NoteList notes={notes} onEdit={handleOpenModal} onDelete={confirmDeleteNote} />
        </Col>
      </Row>

      {/* Modal for creating/updating a note */}
      <NoteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveNote}
        note={editNote}
      />

      {/* Confirmation Modal for Deletion */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this note?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteNote}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NotesApp;
