import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchCities, getWeatherForecast, getAirPollution } from './openWeather';
import { mockForecast, mockAirPollution } from './mocks';

global.fetch = vi.fn();

describe('Тесты для API (OpenWeather)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Поиск городов работает правильно', async () => {
    const mockResponse = [{ name: 'Москва', lat: 55.75, lon: 37.6, country: 'RU' }];
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await searchCities('Москва');
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalled();
  });

  it('Загрузка прогноза погоды работает правильно', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockForecast,
    });

    const result = await getWeatherForecast(55.75, 37.6);
    expect(result).toEqual(mockForecast);
  });

  it('Загрузка данных о воздухе работает правильно', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockAirPollution,
    });

    const result = await getAirPollution(55.75, 37.6);
    expect(result).toEqual(mockAirPollution);
  });

  it('Выдает ошибку, если запрос неудачный', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    await expect(searchCities('Лондон')).rejects.toThrow('Ошибка при поиске городов');
  });
});
