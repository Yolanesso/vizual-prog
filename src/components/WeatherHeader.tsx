import { getWeatherIconUrl } from '../api/openWeather';
import { WeatherForecastItem, City } from '../api/types';

interface WeatherHeaderProps {
  currentWeather: WeatherForecastItem;
  city: City;
  formatDate: (dt: number) => string;
}

export function WeatherHeader({ currentWeather, city, formatDate }: WeatherHeaderProps) {
  const temperature = Math.round(currentWeather.main.temp);
  const iconCode = currentWeather.weather[0]?.icon;

  return (
    <header className="weather-header">
      <p className="date-main">{formatDate(currentWeather.dt)}</p>
      <h1 className="city-name">{city.name}</h1>
      <div className="current-temp-block">
        <span className="temp-main">{temperature}°</span>
        {iconCode && (
          <img
            src={getWeatherIconUrl(iconCode, '4x')}
            alt="погода"
            className="main-icon"
          />
        )}
      </div>
    </header>
  );
}
