// src/components/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('rendert Logo und Links', () => {
  render(<Header />);
  const logo = screen.getByAltText('Logo');
  expect(logo).toBeInTheDocument();

  const githubLink = screen.getByRole('link', { name: /GitHub/i });
  expect(githubLink).toHaveAttribute(
    'href',
    'https://github.com/kemperfekt'
  );

  const phoneLink = screen.getByRole('link', { name: /Anrufen/i });
  expect(phoneLink).toHaveAttribute('href', 'tel:+491713022065');
});
