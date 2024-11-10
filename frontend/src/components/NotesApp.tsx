// frontend/src/components/NotesApp.tsx
import React, { useState, useEffect } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote, Note } from '../services/noteService';
import { Container, Row, Col, Button, Modal, Form, Table, Alert } from 'react-bootstrap';

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const notes = await fetchNotes();
      setNotes(notes);
    } catch (error) {
      setAlertMessage({ type: 'danger', text: 'Failed to load notes.' });
    }
  };

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditId(note.id);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditId(null);
      setTitle('');
      setContent('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveNote = async () => {
    try {
      if (editId) {
        await updateNote(editId, { title, content });
        setAlertMessage({ type: 'success', text: 'Note updated successfully.' });
      } else {
        await createNote({ title, content });
        setAlertMessage({ type: 'success', text: 'Note added successfully.' });
      }
      loadNotes();
      handleCloseModal();
    } catch (error) {
      setAlertMessage({ type: 'danger', text: 'Failed to save note.' });
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      setAlertMessage({ type: 'success', text: 'Note deleted successfully.' });
      loadNotes();
    } catch (error) {
      setAlertMessage({ type: 'danger', text: 'Failed to delete note.' });
    }
  };

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Notes App</h1>

      {/* Display Alert Message */}
      {alertMessage && (
        <Alert
          variant={alertMessage.type}
          onClose={() => setAlertMessage(null)}
          dismissible
        >
          {alertMessage.text}
        </Alert>
      )}

      <Row>
        <Col>
          <Button variant="primary" onClick={() => handleOpenModal()} className="mb-3">
            Add New Note
          </Button>
          
          {/* Bootstrap Table to Display Notes */}
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
                <tr key={note.id}>
                  <td>{note.title}</td>
                  <td>{note.content}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleOpenModal(note)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal for creating/updating a note */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Update Note' : 'Add Note'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formContent" className="mt-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                placeholder="Enter content"
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            {editId ? 'Update Note' : 'Add Note'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NotesApp;
