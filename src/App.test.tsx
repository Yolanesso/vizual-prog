import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as api from './api/openWeather';
import { mockForecast, mockAirPollution } from './api/mocks';

vi.mock('./api/openWeather', async () => {
  const original = await vi.importActual('./api/openWeather');
  return {
    ...original as any,
    getWeatherForecast: vi.fn(),
    getAirPollution: vi.fn(),
    searchCities: vi.fn()
  };
});

describe('Тесты главного экрана (App)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getWeatherForecast as any).mockResolvedValue(mockForecast);
    (api.getAirPollution as any).mockResolvedValue(mockAirPollution);
  });

  it('Показывает надпись "Загрузка" при запуске', async () => {
    render(<App />);
    expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();
  });

  it('Показывает город и температуру после загрузки', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Загрузка/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Москва/i)).toBeInTheDocument();
    expect(screen.getAllByText(/27°/)[0]).toBeInTheDocument();
  });

  it('Показывает прогноз на неделю', async () => {
    render(<App />);

    const days = await screen.findAllByText(/понедельник|вторник|среда|четверг|пятница|суббота|воскресенье/i);
    expect(days.length).toBeGreaterThan(0);
  });

  it('Показывает детали: влажность, ветер и качество воздуха', async () => {
    render(<App />);

    expect(await screen.findByText('80%')).toBeInTheDocument();
    expect(screen.getByText('5 м/с')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
