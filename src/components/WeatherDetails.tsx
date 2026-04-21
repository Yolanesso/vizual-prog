import { Droplets, Wind, Gauge, ShieldAlert } from 'lucide-react';
import { WeatherForecastItem, AirPollutionData } from '../api/types';

interface WeatherDetailsProps {
  currentWeather: WeatherForecastItem;
  pollution: AirPollutionData;
}

export function WeatherDetails({ currentWeather, pollution }: WeatherDetailsProps) {
  const humidity = currentWeather.main.humidity;
  const windSpeed = Math.round(currentWeather.wind.speed);
  const pressure = Math.round(currentWeather.main.pressure * 0.750062);
  const aqi = pollution.list[0]?.main.aqi || 0;

  return (
    <section className="details-grid">
      <div className="detail-card">
        <Droplets size={24} />
        <div className="detail-info">
          <span>Влажность</span>
          <strong>{humidity}%</strong>
        </div>
      </div>

      <div className="detail-card">
        <Wind size={24} />
        <div className="detail-info">
          <span>Ветер</span>
          <strong>{windSpeed} м/с</strong>
        </div>
      </div>

      <div className="detail-card">
        <Gauge size={24} />
        <div className="detail-info">
          <span>Давление</span>
          <strong>{pressure} мм</strong>
        </div>
      </div>

      <div className="detail-card">
        <ShieldAlert size={24} />
        <div className="detail-info">
          <span>AQI</span>
          <strong>{aqi}</strong>
        </div>
      </div>
    </section>
  );
}
