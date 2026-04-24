import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders weather actions', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /get weather/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /get forecast weather/i })).toBeInTheDocument();
});
