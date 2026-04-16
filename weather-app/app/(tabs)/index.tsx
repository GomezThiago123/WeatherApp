import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useState } from "react";
import { weatherData } from "../data/weatherData";

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const weather = weatherData[index];

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31",
      }}
      style={styles.background}
      resizeMode="cover"
      testID="screen-weather"
    >
      <View style={styles.container}>
        {/* CARD */}
        <View style={styles.card}>
          {/* DÍA */}
          <Text style={styles.day} testID="navigation-current-day">
            {weather.day}
          </Text>

          {/* CIUDAD */}
          <Text style={styles.city} testID="header-city">
            {weather.city.toUpperCase()}
          </Text>

          {/* ICONO */}
          <Text
            style={styles.icon}
            testID={`icon-weather-${weather.condition.toLowerCase()}`}
          >
            {weather.condition === "Soleado" ? "○" : "☁️"}
          </Text>

          {/* MÉTRICAS */}
          <View style={styles.metrics}>
            <View style={styles.metricItem} testID="metric-item">
              <Text>💧 {weather.humidity}%</Text>
            </View>
            <View style={styles.metricItem} testID="metric-item">
              <Text>📈 {weather.pressure} hPa</Text>
            </View>
            <View style={styles.metricItem} testID="metric-item">
              <Text>🌬️ {weather.wind} km/h</Text>
            </View>
          </View>

          {/* TEMPERATURA */}
          <Text style={styles.temp} testID="temp-current">
            {weather.temp}°
          </Text>

          {/* MIN MAX */}
          <View style={styles.minmax}>
            <Text testID="temp-min">{weather.min}°</Text>
            <Text testID="temp-max">{weather.max}°</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "white",
    width: 300,
    borderRadius: 25,
    padding: 25,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  day: {
    textAlign: "center",
    color: "gray",
    marginBottom: 5,
  },

  city: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  icon: {
    fontSize: 80,
    textAlign: "center",
    marginBottom: 20,
  },

  metrics: {
    marginBottom: 20,
  },

  metricItem: {
    flexDirection: "row",
    marginBottom: 5,
  },

  temp: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  minmax: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
