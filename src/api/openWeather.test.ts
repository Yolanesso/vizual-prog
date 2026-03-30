import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGeocoding, fetchForecast, fetchAirPollution } from './openWeather';
import { mockForecast, mockAirPollution } from './mocks';

global.fetch = vi.fn();

describe('openWeather API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchGeocoding returns data on success', async () => {
    const mockRes = [{ name: 'Moscow', lat: 55.75, lon: 37.6, country: 'RU' }];
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockRes,
    });

    const result = await fetchGeocoding('Moscow');
    expect(result).toEqual(mockRes);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('geo/1.0/direct'));
  });

  it('fetchForecast returns data on success', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockForecast,
    });

    const result = await fetchForecast(55.75, 37.6);
    expect(result).toEqual(mockForecast);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('data/2.5/forecast'));
  });

  it('fetchAirPollution returns data on success', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockAirPollution,
    });

    const result = await fetchAirPollution(55.75, 37.6);
    expect(result).toEqual(mockAirPollution);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('data/2.5/air_pollution'));
  });

  it('throws error when response is not ok', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    await expect(fetchGeocoding('London')).rejects.toThrow('Failed to fetch geocoding data');
  });
});
