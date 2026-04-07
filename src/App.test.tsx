import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('Компонент App', () => {
  const mockBooks = {
    docs: [
      {
        key: '1',
        title: 'Война и мир',
        author_name: ['Лев Толстой'],
        cover_i: 101,
      },
      {
        key: '2',
        title: 'Идиот',
        author_name: ['Фёдор Достоевский'],
        cover_i: 202,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает спиннер загрузки при инициализации', () => {
    (globalThis.fetch as any).mockReturnValue(new Promise(() => { })); // Never resolves
    render(<App />);
    expect(screen.getByText(/Листаем страницы истории/i)).toBeInTheDocument();
  });

  it('рендерит книги после успешной загрузки', async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockBooks),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Война и мир')).toBeInTheDocument();
      expect(screen.getByText('Идиот')).toBeInTheDocument();
    }, {});

    expect(screen.queryByText(/Листаем страницы истории/i)).not.toBeInTheDocument();
  });

  it('корректно обрабатывает ошибку загрузки', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
    (globalThis.fetch as any).mockRejectedValueOnce(new Error('Fetch failed'));

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Листаем страницы истории/i)).not.toBeInTheDocument();
    }, {});

  });
});
