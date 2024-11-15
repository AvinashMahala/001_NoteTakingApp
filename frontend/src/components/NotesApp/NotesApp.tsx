import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Modal, Spinner, Pagination } from 'react-bootstrap';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const showAlert = useCallback((type: AlertMessageType['type'], text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 3000);
  }, []);

  // Modified loadNotes function to handle pagination
  const loadNotes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/notes/?page=${page}`);
      const data = await response.json();
      setNotes(data.results); // API response data
      setTotalPages(Math.ceil(data.count / 10)); // Calculate total pages
      setCurrentPage(page); // Set the current page
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
      loadNotes(currentPage);
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
        loadNotes(currentPage);
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

  // Pagination controls
  const handlePageChange = (page: number) => {
    loadNotes(page);
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
          <Button variant="secondary" onClick={() => loadNotes(currentPage)}>
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

      {/* Pagination Controls */}
      <Row className="justify-content-center">
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
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
