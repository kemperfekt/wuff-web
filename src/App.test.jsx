// src/App.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('rendert Chat-Komponente (über Footer-Textarea)', () => {
  render(<App />);
  // wir greifen direkt auf das Textarea-Role zu
  const textarea = screen.getByRole('textbox');
  expect(textarea).toBeInTheDocument();
});
