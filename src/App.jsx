import React from 'react';
import Chat from './components/Chat';
// Styling vollständig über Tailwind – kein App.css mehr nötig

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <Chat />
      </div>
    </div>
  );
}

export default App;
