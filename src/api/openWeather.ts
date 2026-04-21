import { AirPollutionData, WeatherForecastData, City } from './types';

const API_KEY = '22c33e4519538d3e3786d28dfc70beec';
const BASE_URL = 'https://api.openweathermap.org';

export const searchCities = async (cityName: string): Promise<City[]> => {
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Ошибка при поиске городов');
  }

  return response.json();
};

export const getWeatherForecast = async (lat: number, lon: number): Promise<WeatherForecastData> => {
  const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Ошибка при получении прогноза погоды');
  }

  return response.json();
};

export const getAirPollution = async (lat: number, lon: number): Promise<AirPollutionData> => {
  const url = `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Ошибка при получении данных о воздухе');
  }

  return response.json();
};

export const getWeatherIconUrl = (iconCode: string, size: '2x' | '4x' = '4x') => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};
