export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Weather[];
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

export interface WeatherForecastData {
  list: WeatherForecastItem[];
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AirPollutionData {
  list: {
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }[];
}
