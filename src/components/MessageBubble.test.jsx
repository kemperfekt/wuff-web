// src/components/MessageBubble.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageBubble from './MessageBubble';

test('rendert User-Nachricht mit 👣 und Text', () => {
  render(<MessageBubble text="Hallo" sender="user" />);
  expect(screen.getByText('👣')).toBeInTheDocument();
  expect(screen.getByText('Hallo')).toBeInTheDocument();
});

test('rendert Error-Nachricht mit ⚠️ und Text', () => {
  render(<MessageBubble text="Fehler" sender="error" />);
  expect(screen.getByText('⚠️')).toBeInTheDocument();
  expect(screen.getByText('Fehler')).toBeInTheDocument();
});

test('zeigt drei Punkte bei Typing-Indikator', () => {
  const { container } = render(<MessageBubble text="" sender="typing" />);
  const dots = container.querySelectorAll('.dot');
  expect(dots).toHaveLength(3);
});

test('rendert Bot-Nachricht mit 🐾 und Text', () => {
  render(<MessageBubble text="Hallo Hund" sender="bot" />);
  expect(screen.getByText('🐾')).toBeInTheDocument();
  expect(screen.getByText('Hallo Hund')).toBeInTheDocument();
});
