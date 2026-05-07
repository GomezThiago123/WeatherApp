import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type WeatherDay = {
  date: string;
  min: number;
  max: number;
  current: number;
  humidity: number;
  pressure: number;
  wind: number;
  weatherCode: number;
};

const EMPTY_DAY: WeatherDay = {
  date: "--/--",
  min: 0,
  max: 0,
  current: 0,
  humidity: 0,
  pressure: 0,
  wind: 0,
  weatherCode: 0,
};

const getWeatherIcon = (code: number) => {
  if (code === 0) return "weather-sunny";
  if (code >= 1 && code <= 3) return "weather-cloudy";
  if (code >= 4 && code <= 48) return "weather-fog";
  if (code >= 49 && code <= 69) return "weather-rainy";
  if (code >= 70 && code <= 79) return "weather-snowy";
  if (code >= 80 && code <= 84) return "weather-pouring";
  if (code >= 85 && code <= 94) return "weather-snowy-heavy";
  if (code >= 95 && code <= 99) return "weather-lightning";
  return "weather-cloudy";
};

const getWeatherName = (code: number) => {
  if (code === 0) return "sunny";
  if (code >= 1 && code <= 3) return "cloudy";
  if (code >= 4 && code <= 48) return "foggy";
  if (code >= 49 && code <= 69) return "rainy";
  if (code >= 70 && code <= 79) return "snowy";
  if (code >= 80 && code <= 84) return "showers";
  if (code >= 85 && code <= 94) return "snow-showers";
  if (code >= 95 && code <= 99) return "storm";
  return "cloudy";
};

export default function HomeScreen() {
  const { height, width } = useWindowDimensions();
  const [forecast, setForecast] = useState<WeatherDay[]>([EMPTY_DAY]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

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

  const weatherIcon = useMemo(
    () => getWeatherIcon(weather.weatherCode),
    [weather.weatherCode],
  );
  const isCompact = height < 820;
  const iconSize = Math.min(isCompact ? 180 : 250, width * 0.52);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text style={styles.loaderText}>Cargando clima...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isCompact && styles.compactContainer]}
      testID="screen-weather"
    >
      <View style={[styles.content, isCompact && styles.compactContent]}>
        <View style={styles.navigation}>
          <View style={styles.navigationSide}>
            {previousDate ? (
              <TouchableOpacity
                testID="button-prev-day"
                onPress={() => setSelectedDay((day) => Math.max(day - 1, 0))}
                style={styles.navigationButton}
              >
                <MaterialCommunityIcons name="chevron-left" size={26} color="black" />
                <Text style={styles.navigationMuted}>{previousDate}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.navigationCenter}>
            <Text style={styles.currentDate}>{weather.date}</Text>
          </View>

          <View style={[styles.navigationSide, styles.navigationRight]}>
            {nextDate ? (
              <TouchableOpacity
                testID="button-next-day"
                onPress={() =>
                  setSelectedDay((day) => Math.min(day + 1, forecast.length - 1))
                }
                style={styles.navigationButton}
              >
                <Text style={styles.navigationMuted}>{nextDate}</Text>
                <MaterialCommunityIcons name="chevron-right" size={26} color="black" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={[styles.cityContainer, isCompact && styles.compactCityContainer]}>
          <Text style={[styles.city, isCompact && styles.compactCity]} testID="header-city">
            VILLA LUGANO
          </Text>
        </View>

        <View
          style={[styles.iconContainer, isCompact && styles.compactIconContainer]}
          testID={`icon-weather-${getWeatherName(weather.weatherCode)}`}
          accessibilityRole="image"
        >
          <MaterialCommunityIcons name={weatherIcon} size={iconSize} color="black" />
        </View>

        <View style={styles.metrics}>
          <View testID="metric-item" style={styles.metricItem}>
            <MaterialCommunityIcons
              testID="metric-icon"
              name="water-percent"
              size={32}
              color="black"
            />
            <View style={styles.metricValueRow}>
              <Text testID="metric-value" style={styles.metricValue}>
                {weather.humidity}
              </Text>
              <Text style={styles.metricUnit}> %</Text>
            </View>
          </View>

          <View testID="metric-item" style={styles.metricItem}>
            <MaterialCommunityIcons
              testID="metric-icon"
              name="gauge"
              size={32}
              color="black"
            />
            <View style={styles.metricValueRow}>
              <Text testID="metric-value" style={styles.metricValue}>
                {weather.pressure}
              </Text>
              <Text style={styles.metricUnit}> hPa</Text>
            </View>
          </View>

          <View testID="metric-item" style={styles.metricItem}>
            <MaterialCommunityIcons
              testID="metric-icon"
              name="weather-windy"
              size={32}
              color="black"
            />
            <View style={styles.metricValueRow}>
              <Text testID="metric-value" style={styles.metricValue}>
                {weather.wind}
              </Text>
              <Text style={styles.metricUnit}> m/s</Text>
            </View>
          </View>
        </View>

        <View style={[styles.temperatureContainer, isCompact && styles.compactTemperatureContainer]}>
          <View style={styles.temperatureRow}>
            <View style={styles.sideTemperature}>
              <Text
                testID="temp-min"
                style={[styles.secondaryTemperature, isCompact && styles.compactSecondaryTemperature]}
              >
                {weather.min}°
              </Text>
            </View>

            <View style={styles.mainTemperature}>
              <Text
                testID="temp-current"
                style={[styles.currentTemperature, isCompact && styles.compactCurrentTemperature]}
              >
                {weather.current}°
              </Text>
            </View>

            <View style={styles.sideTemperature}>
              <Text
                testID="temp-max"
                style={[styles.secondaryTemperature, isCompact && styles.compactSecondaryTemperature]}
              >
                {weather.max}°
              </Text>
            </View>
          </View>

          <View style={styles.temperatureLabels}>
            <Text style={styles.sideLabel}>MIN</Text>
            <Text testID="navigation-current-day" style={styles.centerLabel}>
              {isToday ? "NOW" : "AVG"}
            </Text>
            <Text style={styles.sideLabel}>MAX</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    gap: 12,
  },
  loaderText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 18,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    gap: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },
  compactContainer: {
    paddingHorizontal: 14,
  },
  compactContent: {
    gap: 8,
    paddingBottom: 12,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 48,
  },
  navigationSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  navigationCenter: {
    flex: 2,
    alignItems: "center",
  },
  navigationRight: {
    alignItems: "flex-end",
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  navigationMuted: {
    color: "black",
    fontSize: 20,
    opacity: 0.3,
  },
  currentDate: {
    color: "black",
    fontSize: 25,
  },
  cityContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 90,
  },
  compactCityContainer: {
    minHeight: 64,
  },
  city: {
    color: "black",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  compactCity: {
    fontSize: 34,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 245,
  },
  compactIconContainer: {
    minHeight: 178,
  },
  metrics: {
    alignSelf: "flex-start",
    gap: 4,
  },
  metricItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 44,
  },
  metricValueRow: {
    alignItems: "baseline",
    flexDirection: "row",
  },
  metricValue: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
  metricUnit: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.3,
  },
  temperatureContainer: {
    width: "100%",
    marginTop: "auto",
  },
  compactTemperatureContainer: {
    marginTop: 4,
  },
  temperatureRow: {
    alignItems: "baseline",
    flexDirection: "row",
    width: "100%",
  },
  sideTemperature: {
    flex: 1,
    alignItems: "center",
  },
  mainTemperature: {
    flex: 2,
    alignItems: "center",
  },
  secondaryTemperature: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
  },
  compactSecondaryTemperature: {
    fontSize: 34,
  },
  currentTemperature: {
    color: "black",
    fontSize: 90,
    fontWeight: "800",
  },
  compactCurrentTemperature: {
    fontSize: 72,
  },
  temperatureLabels: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  sideLabel: {
    flex: 1,
    color: "black",
    fontSize: 20,
    fontWeight: "700",
    opacity: 0.2,
    textAlign: "center",
  },
  centerLabel: {
    flex: 2,
    color: "black",
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },
});
