import * as Location from "expo-location";
import { useEffect, useState } from "react";

export type WeatherDay = {
  date: string;
  min: number;
  max: number;
  current: number;
  humidity: number;
  pressure: number;
  wind: number;
  weatherCode: number;
};

export const EMPTY_DAY: WeatherDay = {
  date: "--/--",
  min: 0,
  max: 0,
  current: 0,
  humidity: 0,
  pressure: 0,
  wind: 0,
  weatherCode: 0,
};

export function useWeather() {
  const [forecast, setForecast] = useState<WeatherDay[]>([EMPTY_DAY]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setIsLoading(false);
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,temperature_2m_mean,surface_pressure_mean,wind_speed_10m_mean,weather_code&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&timezone=auto&past_days=1&forecast_days=2&wind_speed_unit=ms`;
        const response = await fetch(url);
        const data = await response.json();

        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

        const days = data.daily.time.map((rawDate: string, index: number) => {
          const isToday = rawDate === todayStr;
          const [, month, day] = rawDate.split("-");

          return {
            date: `${day}/${month}`,
            min: Math.round(data.daily.temperature_2m_min[index]),
            max: Math.round(data.daily.temperature_2m_max[index]),
            current: isToday
              ? Math.round(data.current.temperature_2m)
              : Math.round(data.daily.temperature_2m_mean[index]),
            humidity: isToday
              ? Math.round(data.current.relative_humidity_2m)
              : Math.round(data.daily.relative_humidity_2m_mean[index]),
            pressure: isToday
              ? Math.round(data.current.surface_pressure)
              : Math.round(data.daily.surface_pressure_mean[index]),
            wind: isToday
              ? Math.round(data.current.wind_speed_10m)
              : Math.round(data.daily.wind_speed_10m_mean[index]),
            weatherCode: isToday
              ? data.current.weather_code
              : data.daily.weather_code[index],
          };
        });

        setForecast(days);
        const todayIndex = data.daily.time.findIndex((d: string) => d === todayStr);
        setSelectedDay(todayIndex !== -1 ? todayIndex : 1);
      } catch (error) {
        console.error("Error cargando clima:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const weather = forecast[selectedDay] ?? EMPTY_DAY;
  const previousDate = forecast[selectedDay - 1]?.date;
  const nextDate = forecast[selectedDay + 1]?.date;
  const isToday = selectedDay === 1;

  const goToPrevDay = () => setSelectedDay((day) => Math.max(day - 1, 0));
  const goToNextDay = () => setSelectedDay((day) => Math.min(day + 1, forecast.length - 1));

  return {
    forecast,
    selectedDay,
    isLoading,
    weather,
    previousDate,
    nextDate,
    isToday,
    goToPrevDay,
    goToNextDay,
  };
}
