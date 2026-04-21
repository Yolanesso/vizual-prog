import { useState, useEffect } from 'react';
import { searchCities, getWeatherForecast, getAirPollution } from './api/openWeather';
import { WeatherForecastData, AirPollutionData, City } from './api/types';
import { mockForecast, mockAirPollution } from './api/mocks';

import { WeatherSearch } from './components/WeatherSearch';
import { WeatherHeader } from './components/WeatherHeader';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherDetails } from './components/WeatherDetails';
import { WeeklyForecast } from './components/WeeklyForecast';

import './App.css';

const MOSCOW: City = { name: 'Москва', lat: 55.7558, lon: 37.6173, country: 'RU' };
const AUTO_UPDATE_TIME = 3 * 60 * 60 * 1000; // 3 часа

function App() {
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastData | null>(null);
  const [pollutionData, setPollutionData] = useState<AirPollutionData | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const loadAllWeatherData = async (lat: number, lon: number) => {
    try {
      setErrorMessage(null);

      const weather = await getWeatherForecast(lat, lon);
      setWeatherData(weather);

      const pollution = await getAirPollution(lat, lon);
      setPollutionData(pollution);

    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setErrorMessage('Не удалось загрузить данные.');
    }
  };

  useEffect(() => {
    const savedCityJson = localStorage.getItem('lastCity');

    if (savedCityJson) {
      const parsedCity = JSON.parse(savedCityJson);
      setCurrentCity(parsedCity);
      loadAllWeatherData(parsedCity.lat, parsedCity.lon);
    } else {
      setCurrentCity(MOSCOW);
      loadAllWeatherData(MOSCOW.lat, MOSCOW.lon);
    }
  }, []);

  useEffect(() => {
    if (!currentCity) return;

    const intervalId = setInterval(() => {
      loadAllWeatherData(currentCity.lat, currentCity.lon);
    }, AUTO_UPDATE_TIME);

    return () => clearInterval(intervalId);
  }, [currentCity]);

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchCities(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCity = (city: City) => {
    setCurrentCity(city);
    localStorage.setItem('lastCity', JSON.stringify(city));

    setSuggestions([]);
    setSearchQuery('');

    loadAllWeatherData(city.lat, city.lon);
  };

  const useDemoData = () => {
    setWeatherData(mockForecast);
    setPollutionData(mockAirPollution);
    setErrorMessage(null);
  };

  if (errorMessage && !weatherData) {
    return (
      <div className="loading error-container">
        <div className="error-box">
          <p>{errorMessage}</p>
          <div className="error-actions">
            <button onClick={() => currentCity && loadAllWeatherData(currentCity.lat, currentCity.lon)} className="retry-btn">
              Попробовать снова
            </button>
            <button onClick={useDemoData} className="mock-btn">
              Демо-данные
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData || !pollutionData || !currentCity || weatherData.list.length === 0) {
    return <div className="loading">Загрузка данных...</div>;
  }

  const getWeatherClass = (weatherMain: string) => {
    const condition = weatherMain.toLowerCase();
    if (condition === 'clear') return 'weather-clear';
    if (condition === 'clouds') return 'weather-clouds';
    if (condition === 'rain') return 'weather-rain';
    if (condition === 'drizzle') return 'weather-drizzle';
    if (condition === 'thunderstorm') return 'weather-thunderstorm';
    if (condition === 'snow') return 'weather-snow';
    return 'weather-atmosphere';
  };

  const currentWeather = weatherData.list[0];
  if (!currentWeather) {
    return <div className="loading">Загрузка данных...</div>;
  }

  const isNight = currentWeather.weather[0]?.icon?.endsWith('n');
  const weatherMain = currentWeather.weather[0]?.main || 'Clear';

  const themeClass = isNight ? 'theme-night' : 'theme-day';
  const weatherClass = getWeatherClass(weatherMain);

  const dailyForecast = weatherData.list.filter((_, index) => index % 8 === 0).slice(0, 7);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`app-container ${themeClass} ${weatherClass}`}>
      <WeatherSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={isLoading}
        suggestions={suggestions}
        onSearch={handleCitySearch}
        onSelectCity={handleSelectCity}
      />

      <WeatherHeader
        currentWeather={currentWeather}
        city={currentCity}
        formatDate={formatDate}
      />

      <HourlyForecast
        hourlyList={weatherData.list}
      />

      <WeatherDetails
        currentWeather={currentWeather}
        pollution={pollutionData}
      />

      <WeeklyForecast
        dailyData={dailyForecast}
        formatDay={formatDate}
      />
    </div>
  );
}

export default App;
