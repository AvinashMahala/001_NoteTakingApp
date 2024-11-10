// frontend/src/components/Modal/NoteModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Note } from '../../types/noteTypes';

interface NoteModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (noteData: Partial<Note>) => void;
  note?: Note | null;
  errors?: { title?: string; content?: string };
}

const NoteModal: React.FC<NoteModalProps> = ({ show, onHide, onSave, note, errors = {} }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSave = () => onSave({ title, content });

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{note ? 'Update Note' : 'Add Note'}</Modal.Title>
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
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formContent" className="mt-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={content}
              placeholder="Enter content"
              onChange={(e) => setContent(e.target.value)}
              isInvalid={!!errors.content}
            />
            <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {note ? 'Update Note' : 'Add Note'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoteModal;
