import { render, screen, waitFor } from '@testing-library/react';
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

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchForecast as any).mockResolvedValue(mockForecast);
    (api.fetchAirPollution as any).mockResolvedValue(mockAirPollution);
  });

  it('renders loading state initially', async () => {
    render(<App />);
    expect(screen.getByText(/Загрузка/i)).toBeDefined();
  });

  it('renders city name and temperature after loading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Moscow')).toBeDefined();
      expect(screen.getByText(/27°/)).toBeDefined();
    });
  });

  it('renders daily forecast items', async () => {
    render(<App />);

    await waitFor(() => {
      // Суббота - один из дней в моках
      expect(screen.getAllByText(/суббота/i)).toBeDefined();
    });
  });

  it('renders weather details (humidity, wind, aqi)', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('80%')).toBeDefined(); // Влажность
      expect(screen.getByText('5 м/с')).toBeDefined(); // Ветер
      expect(screen.getByText('3')).toBeDefined(); // AQI
    });
  });
});
