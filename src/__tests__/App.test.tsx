import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

describe('App', () => {
  it('should render the app', () => {
    render(<App />);
    expect(screen.getByAltText('Date Mate')).toBeInTheDocument();
  });
});
