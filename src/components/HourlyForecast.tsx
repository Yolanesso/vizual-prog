import { getWeatherIconUrl } from '../api/openWeather';
import { WeatherForecastItem } from '../api/types';

interface HourlyForecastProps {
  hourlyList: WeatherForecastItem[];
}

export function HourlyForecast({ hourlyList }: HourlyForecastProps) {
  return (
    <section className="hourly-forecast">
      <div className="hourly-scroll">
        {hourlyList.slice(0, 8).map((item, index) => {
          const time = index === 0 ? 'Сейчас' : item.dt_txt.split(' ')[1]?.slice(0, 5) || '';
          const temp = Math.round(item.main.temp);
          const iconCode = item.weather[0]?.icon;

          return (
            <div key={index} className="hourly-item">
              <span className="hourly-time">{time}</span>
              {iconCode && (
                <img src={getWeatherIconUrl(iconCode, '2x')} alt="иконка" />
              )}
              <span className="hourly-temp">{temp}°</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
