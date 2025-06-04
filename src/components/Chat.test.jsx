// src/components/Chat.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from './Chat';

beforeEach(() => {
  jest
    .spyOn(global, 'fetch')
    .mockImplementation((url, options) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            // Chat liest nun data.message, nicht data.question
            message: 'Nächste Frage?',
            details: {}
          })
      })
    );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('zeigt nächste Frage nach Absenden', async () => {
  render(<Chat />);
  const textarea = screen.getByRole('textbox');
  fireEvent.change(textarea, { target: { value: 'Test-Symptom' } });
  fireEvent.click(screen.getByRole('button', { name: /Wuff/i }));

  await waitFor(() =>
    expect(screen.getByText(/Nächste Frage\?/i)).toBeInTheDocument()
  );
});

test('zeigt finale Diagnose, wenn Backend eine message zurückliefert', async () => {
  // stub nur diesen einen Aufruf um eine finale message zu simulieren
  global.fetch.mockImplementationOnce((url, options) =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Fertig!',
          details: {}
        })
    })
  );

  render(<Chat />);
  const textarea = screen.getByRole('textbox');
  fireEvent.change(textarea, { target: { value: 'Kein Stichwort' } });
  fireEvent.click(screen.getByRole('button', { name: /Wuff/i }));

  await waitFor(() =>
    expect(screen.getByText(/Fertig!/i)).toBeInTheDocument()
  );
});
