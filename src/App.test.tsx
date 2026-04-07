import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as api from './api/openWeather';
import { mockForecast, mockAirPollution } from './api/mocks';

vi.mock('./api/openWeather', async () => {
  const actual = await vi.importActual('./api/openWeather');
  return {
    ...actual as any,
    fetchForecast: vi.fn(),
    fetchAirPollution: vi.fn(),
    fetchGeocoding: vi.fn()
  };
});

describe('Компонент App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchForecast as any).mockResolvedValue(mockForecast);
    (api.fetchAirPollution as any).mockResolvedValue(mockAirPollution);
  });

  it('отображает состояние загрузки изначально', async () => {
    render(<App />);
    expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();
  });

  it('отображает название города и температуру после загрузки', async () => {
    const { container } = render(<App />);

    // Ждем, пока исчезнет состояние загрузки
    await waitFor(() => {
      expect(screen.queryByText(/Загрузка/i)).not.toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText(/Москва/i)).toBeInTheDocument();
    // Используем getAllByText, так как температура может дублироваться в почасовом прогнозе
    expect(screen.getAllByText(/27°/)[0]).toBeInTheDocument();
  });

  it('отображает список прогноза на неделю', async () => {
    render(<App />);

    // Ждем появления элементов из списка прогноза
    const dailyItems = await screen.findAllByText(/понедельник|вторник|среда|четверг|пятница|суббота|воскресенье/i);
    expect(dailyItems.length).toBeGreaterThan(0);
  });

  it('отображает детали погоды (влажность, ветер, AQI)', async () => {
    render(<App />);

    expect(await screen.findByText('80%')).toBeInTheDocument(); // Влажность
    expect(screen.getByText('5 м/с')).toBeInTheDocument(); // Ветер
    expect(screen.getByText('3')).toBeInTheDocument(); // AQI
  });
});
