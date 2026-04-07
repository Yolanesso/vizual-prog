import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookCard from './BookCard';

describe('Компонент BookCard', () => {
  const props = {
    title: 'Преступление и наказание',
    authors: ['Фёдор Достоевский'],
    coverId: 12345,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает заголовок и авторов книги', () => {
    render(<BookCard {...props} />);
    expect(screen.getByText('Преступление и наказание')).toBeInTheDocument();
    expect(screen.getByText('Фёдор Достоевский')).toBeInTheDocument();
  });

  it('отображает сообщение о загрузке в начале', () => {
    render(<BookCard {...props} />);
    expect(screen.getByText(/Загрузка байтов.../i)).toBeInTheDocument();
  });

  it('загружает и отображает обложку книги', async () => {
    // We want size > 100 as per BookCard.tsx logic
    const largeBlob = new Blob([new ArrayBuffer(200)], { type: 'image/jpeg' });

    (globalThis.fetch as any).mockResolvedValueOnce({
      blob: () => Promise.resolve(largeBlob),
    });

    render(<BookCard {...props} />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', props.title);
      expect(img).toHaveAttribute('src', 'mock-url');
    }, {});
  });

  it('корректно работает, если авторы не указаны', () => {
    render(<BookCard title="Untitled" authors={[]} />);
    expect(screen.getByText('Untitled')).toBeInTheDocument();
  });
});
