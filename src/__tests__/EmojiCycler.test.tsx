import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmojiCycler from '../EmojiCycler';

describe('EmojiCycler', () => {
  it('should cycle through emojis', () => {
    vi.useFakeTimers();
    const emojis = ['ð', 'ð', 'ð'];
    render(<EmojiCycler emojis={emojis} />);

    expect(screen.getByText('ð')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('ð')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('ð')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
