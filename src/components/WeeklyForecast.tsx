import { getWeatherIconUrl } from '../api/openWeather';
import { WeatherForecastItem } from '../api/types';

interface WeeklyForecastProps {
  dailyData: WeatherForecastItem[];
  formatDay: (dt: number) => string;
}

export function WeeklyForecast({ dailyData, formatDay }: WeeklyForecastProps) {
  return (
    <section className="daily-forecast">
      {dailyData.map((day, index) => {
        const dayName = formatDay(day.dt);
        const tempMax = Math.round(day.main.temp_max);
        const tempMin = Math.round(day.main.temp_min);
        const iconCode = day.weather[0]?.icon;

        return (
          <div key={index} className="daily-item">
            <span className="day-name">{dayName}</span>
            <div className="day-weather">
              {iconCode && (
                <img src={getWeatherIconUrl(iconCode, '2x')} alt="иконка" />
              )}
              <span className="day-temp">+{tempMax}°</span>
              <span className="day-temp-min">{tempMin}°</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
