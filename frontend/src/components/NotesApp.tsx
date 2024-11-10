// frontend/src/components/NotesApp.tsx
import React, { useState, useEffect } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote, Note } from '../services/noteService';
import { Container, Row, Col, Button, Form, ListGroup, Card } from 'react-bootstrap';

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
    <Container className="my-4">
      <h1 className="text-center mb-4">Notes App</h1>
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="p-4">
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
              <Button
  variant="primary"
  onClick={handleAddNote}
  className="mt-3 w-100"  // Use 'w-100' to make the button full-width
>
  {editId ? 'Update Note' : 'Add Note'}
</Button>

            </Form>
          </Card>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={8} className="mx-auto">
          <h3 className="text-center">My Notes</h3>
          <ListGroup>
            {notes.map((note) => (
              <ListGroup.Item key={note.id} className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{note.title}</div>
                  <small>{note.content}</small>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleEditNote(note)}
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
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default NotesApp;
