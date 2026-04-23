import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto",
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => console.log("Error cargando clima"));
  }, []);

  if (!weather) {
    return (
      <View style={styles.background}>
        <Text>Cargando clima...</Text>
      </View>
    );
  }

  // 🌡️ DATOS REALES
  const currentTemp = Math.round(weather.current_weather.temperature);
  const min = Math.round(weather.daily.temperature_2m_min[index]);
  const max = Math.round(weather.daily.temperature_2m_max[index]);

  return (
    <View style={styles.background} testID="screen-weather">
      <View style={styles.card}>
        {/* DIA */}
        <Text style={styles.day} testID="navigation-current-day">
          {index === 0 ? "HOY" : `DÍA ${index + 1}`}
        </Text>

        {/* CIUDAD */}
        <Text style={styles.city} testID="header-city">
          BUENOS AIRES
        </Text>

        {/* ICONO (simple por ahora) */}
        <View testID="icon-weather-sunny" style={styles.iconContainer}>
          <Feather name="circle" size={90} color="black" />
        </View>

        {/* MÉTRICAS (mock, API no las trae fácil) */}
        <View style={styles.metrics}>
          <View style={styles.metricItem} testID="metric-item">
            <Text>💧 --%</Text>
          </View>
          <View style={styles.metricItem} testID="metric-item">
            <Text>📈 -- hPa</Text>
          </View>
          <View style={styles.metricItem} testID="metric-item">
            <Text>🌬️ -- km/h</Text>
          </View>
        </View>

        {/* TEMP ACTUAL REAL */}
        <Text style={styles.temp} testID="temp-current">
          {currentTemp}°
        </Text>

        {/* MIN / MAX */}
        <View style={styles.minmax}>
          <Text testID="temp-min">{min}°</Text>
          <Text testID="temp-max">{max}°</Text>
        </View>
      </View>

      {/* NAVEGACIÓN */}
      <View style={styles.navigation}>
        <Text
          style={styles.button}
          testID="button-prev-day"
          onPress={() => index > 0 && setIndex(index - 1)}
        >
          ←
        </Text>

        <Text
          style={styles.button}
          testID="button-next-day"
          onPress={() => index < 6 && setIndex(index + 1)}
        >
          →
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#e6eef2",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "white",
    width: 260,
    height: 500,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
  },

  day: {
    textAlign: "center",
    color: "gray",
  },

  city: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  iconContainer: {
    alignItems: "center",
  },

  metrics: {
    alignItems: "flex-start",
  },

  metricItem: {
    marginBottom: 5,
  },

  temp: {
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center",
  },

  minmax: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  navigation: {
    flexDirection: "row",
    marginTop: 30,
    gap: 40,
  },

  button: {
    fontSize: 30,
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: 15,
    borderRadius: 10,
  },
});
