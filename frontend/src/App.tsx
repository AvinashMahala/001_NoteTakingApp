import React from 'react';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Note Taking App</h1>
      <NoteForm />
      <NotesList />
    </div>
  );
};

export default App;
