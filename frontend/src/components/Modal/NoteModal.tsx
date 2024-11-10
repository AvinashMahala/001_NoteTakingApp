// frontend/src/components/NoteModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Note } from "./../../types/noteTypes";

interface NoteModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (noteData: Partial<Note>) => void;
  note?: Note | null;
}

const NoteModal: React.FC<NoteModalProps> = ({ show, onHide, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    onSave({ title, content });
  };

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
