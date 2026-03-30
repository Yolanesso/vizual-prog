import { AirPollutionResponse, ForecastResponse, GeocodingResponse } from './types';

const API_KEY = '22c33e4519538d3e3786d28dfc70beec';
const BASE_URL = 'https://api.openweathermap.org';

export const fetchGeocoding = async (query: string): Promise<GeocodingResponse[]> => {
  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch geocoding data');
  return response.json();
};

export const fetchForecast = async (lat: number, lon: number): Promise<ForecastResponse> => {
  const response = await fetch(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch forecast data');
  return response.json();
};

export const fetchAirPollution = async (lat: number, lon: number): Promise<AirPollutionResponse> => {
  const response = await fetch(
    `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch air pollution data');
  return response.json();
};

export const getIconUrl = (iconCode: string, size: '2x' | '4x' = '4x') => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};
