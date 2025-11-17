import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders Comics United header', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /🎭 Comics United/i, level: 1 })).toBeInTheDocument();
  });
});
