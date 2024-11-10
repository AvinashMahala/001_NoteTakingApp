// src/components/Alert/AlertMessage.tsx
import React from 'react';
import { Alert } from 'react-bootstrap';

interface AlertMessageProps {
  type: 'success' | 'danger' | 'warning' | 'info'; // Strictly typed to the allowed values
  text: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, text, onClose }) => {
  return (
    <Alert variant={type} onClose={onClose} dismissible>
      {text}
    </Alert>
  );
};

export default AlertMessage;
