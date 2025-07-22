import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Input from '../Input';

describe('Input', () => {
  it('should render a text input', () => {
    render(<Input value="Test Value" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
  });

  it('should render a select dropdown', () => {
    const options = ['Option 1', 'Option 2'];
    render(<Input options={options} value="Option 1" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});
