import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Wind, Droplets, Gauge, ShieldAlert } from 'lucide-react';
import { fetchGeocoding, fetchForecast, fetchAirPollution, getIconUrl } from './api/openWeather';
import { ForecastResponse, AirPollutionResponse, GeocodingResponse } from './api/types';
import { mockForecast, mockAirPollution } from './api/mocks';
import './App.css';

const UPDATE_INTERVAL = 3 * 60 * 60 * 1000; // 3 часа

function App() {
  const [city, setCity] = useState<GeocodingResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [pollution, setPollution] = useState<AirPollutionResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<GeocodingResponse[]>([]);

  const loadWeatherData = useCallback(async (lat: number, lon: number) => {
    try {
      setError(null);
      const [fData, pData] = await Promise.all([
        fetchForecast(lat, lon),
        fetchAirPollution(lat, lon)
      ]);
      setForecast(fData);
      setPollution(pData);
    } catch (err: any) {
      console.error('Error fetching weather:', err);
    }
  }, []);

  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
      const parsedCity = JSON.parse(savedCity);
      setCity(parsedCity);
      loadWeatherData(parsedCity.lat, parsedCity.lon);
    } else {
      // По умолчанию Москва
      const moscow = { name: 'Москва', lat: 55.7558, lon: 37.6173, country: 'RU' };
      setCity(moscow);
      loadWeatherData(moscow.lat, moscow.lon);
    }
  }, [loadWeatherData]);

  // Автообновление каждые 3 часа
  useEffect(() => {
    if (!city) return;
    const interval = setInterval(() => {
      loadWeatherData(city.lat, city.lon);
    }, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [city, loadWeatherData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await fetchGeocoding(searchQuery);
      setSuggestions(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectCity = (selected: GeocodingResponse) => {
    setCity(selected);
    localStorage.setItem('lastCity', JSON.stringify(selected));
    setSuggestions([]);
    setSearchQuery('');
    loadWeatherData(selected.lat, selected.lon);
  };

  if (error && !forecast) {
    return (
      <div className="loading error-container">
        <div className="error-box">
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => city && loadWeatherData(city.lat, city.lon)} className="retry-btn">
              Попробовать снова
            </button>
            <button
              onClick={() => {
                setForecast(mockForecast);
                setPollution(mockAirPollution);
                setError(null);
              }}
              className="mock-btn"
            >
              Использовать демо-данные
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!forecast || !pollution || !city || forecast.list.length === 0 || pollution.list.length === 0) {
    return <div className="loading">Загрузка...</div>;
  }

  const current = forecast.list[0]!;
  const isNight = current.weather[0]?.icon?.endsWith('n');
  const themeClass = isNight ? 'theme-night' : 'theme-day';

  // Группировка по дням
  const dailyData = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 7);

  const formatDate = (dt: number) => {
    const d = new Date(dt * 1000);
    return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric' });
  };

  const formatDay = (dt: number) => {
    const d = new Date(dt * 1000);
    return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric' });
  };

  return (
    <div className={`app-container ${themeClass}`}>
      <div className="search-wrapper">
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={20} color="#fff" />
          <input
            type="text"
            placeholder="Поиск города..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loading && <div className="spinner-small"></div>}
        </form>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => selectCity(s)}>
                {s.name}, {s.country} {s.state ? `(${s.state})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>

      <header className="weather-header">
        <p className="date-main">{formatDate(current.dt)}</p>
        <h1 className="city-name">{city.name}</h1>
        <div className="current-temp-block">
          <span className="temp-main">{Math.round(current.main.temp)}°</span>
          {current.weather[0] && (
            <img src={getIconUrl(current.weather[0].icon, '4x')} alt="weather icon" className="main-icon" />
          )}
        </div>
      </header>

      <section className="hourly-forecast">
        <div className="hourly-scroll">
          {forecast.list.slice(0, 8).map((item, i) => (
            <div key={i} className="hourly-item">
              <span className="hourly-time">{i === 0 ? 'Сейчас' : item.dt_txt.split(' ')[1].slice(0, 5)}</span>
              {item.weather[0] && (
                <img src={getIconUrl(item.weather[0].icon, '2x')} alt="icon" />
              )}
              <span className="hourly-temp">{Math.round(item.main.temp)}°</span>
            </div>
          ))}
        </div>
      </section>

      <section className="details-grid">
        <div className="detail-card">
          <Droplets size={24} />
          <div className="detail-info">
            <span>Влажность</span>
            <strong>{current.main.humidity}%</strong>
          </div>
        </div>
        <div className="detail-card">
          <Wind size={24} />
          <div className="detail-info">
            <span>Ветер</span>
            <strong>{Math.round(current.wind.speed)} м/с</strong>
          </div>
        </div>
        <div className="detail-card">
          <Gauge size={24} />
          <div className="detail-info">
            <span>Давление</span>
            <strong>{Math.round(current.main.pressure * 0.750062)} мм</strong>
          </div>
        </div>
        <div className="detail-card">
          <ShieldAlert size={24} />
          <div className="detail-info">
            <span>AQI</span>
            <strong>{pollution.list[0]!.main.aqi}</strong>
          </div>
        </div>
      </section>

      <section className="daily-forecast">
        {dailyData.map((day, i) => (
          <div key={i} className="daily-item">
            <span className="day-name">{formatDay(day.dt)}</span>
            <div className="day-weather">
              {day.weather[0] && (
                <img src={getIconUrl(day.weather[0].icon, '2x')} alt="icon" />
              )}
              <span className="day-temp">+{Math.round(day.main.temp_max)}°</span>
              <span className="day-temp-min">{Math.round(day.main.temp_min)}°</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
