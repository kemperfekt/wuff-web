// src/components/Footer.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from './Footer';

test('rendert Textarea und Sende-Button', () => {
  const onInputChange = jest.fn();
  const onKeyDown = jest.fn();
  const onSend = jest.fn();
  render(
    <Footer
      input=""
      onInputChange={onInputChange}
      onKeyDown={onKeyDown}
      onSend={onSend}
    />
  );
  const textarea = screen.getByPlaceholderText(/Schreib'? hier\.\.\./i);
  expect(textarea).toBeInTheDocument();

  const button = screen.getByRole('button', { name: /Wuff/i });
  expect(button).toBeInTheDocument();
});

test('ruft onInputChange auf bei Änderung', () => {
  const onInputChange = jest.fn();
  render(
    <Footer
      input=""
      onInputChange={onInputChange}
      onKeyDown={() => {}}
      onSend={() => {}}
    />
  );
  const textarea = screen.getByPlaceholderText(/Schreib'? hier\.\.\./i);
  fireEvent.change(textarea, { target: { value: 'Hello' } });
  expect(onInputChange).toHaveBeenCalledWith('Hello');
});

test('ruft onSend auf beim Klick auf den Button', () => {
  const onSend = jest.fn();
  render(
    <Footer
      input=""
      onInputChange={() => {}}
      onKeyDown={() => {}}
      onSend={onSend}
    />
  );
  const button = screen.getByRole('button', { name: /Wuff/i });
  fireEvent.click(button);
  expect(onSend).toHaveBeenCalled();
});

test('ruft onKeyDown auf bei Enter-Taste', () => {
  const onKeyDown = jest.fn();
  render(
    <Footer
      input=""
      onInputChange={() => {}}
      onKeyDown={onKeyDown}
      onSend={() => {}}
    />
  );
  const textarea = screen.getByPlaceholderText(/Schreib'? hier\.\.\./i);
  fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', charCode: 13 });
  expect(onKeyDown).toHaveBeenCalled();
});
