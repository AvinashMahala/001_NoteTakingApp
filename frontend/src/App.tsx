import React from 'react';
import NotesApp from './components/NotesApp';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <h1>Note Taking App</h1> */}
      <NotesApp />
      {/* <NoteForm />
      <NotesList /> */}
    </div>
  );
};

export default App;
