import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { weatherData } from "../data/weatherData";

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const weather = weatherData[index];

  return (
    <View style={styles.background} testID="screen-weather">
      {/* CARD */}
      <View style={styles.card}>
        {/* DIA */}
        <Text style={styles.day} testID="navigation-current-day">
          {weather.day}
        </Text>

        {/* CIUDAD */}
        <Text style={styles.city} testID="header-city">
          {weather.city.toUpperCase()}
        </Text>

        {/* ICONO */}
        <View
          style={styles.iconContainer}
          testID={`icon-weather-${weather.condition.toLowerCase()}`}
        >
          {weather.condition === "Soleado" && (
            <Feather name="circle" size={90} color="black" />
          )}
          {weather.condition === "Lluvia" && (
            <MaterialCommunityIcons
              name="weather-rainy"
              size={90}
              color="black"
            />
          )}
          {weather.condition === "Nublado" && (
            <MaterialCommunityIcons
              name="weather-cloudy"
              size={90}
              color="black"
            />
          )}
        </View>

        {/* METRICAS */}
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

        {/* TEMP */}
        <Text style={styles.temp} testID="temp-current">
          {weather.temp}°
        </Text>

        {/* MIN MAX */}
        <View style={styles.minmax}>
          <Text testID="temp-min">{weather.min}°</Text>
          <Text testID="temp-max">{weather.max}°</Text>
        </View>
      </View>

      {/* NAVEGACIÓN */}
      <View style={styles.navigation}>
        <Text
          style={styles.button}
          testID="button-prev-day"
          onPress={() => {
            if (index > 0) setIndex(index - 1);
          }}
        >
          ←
        </Text>

        <Text
          style={styles.button}
          testID="button-next-day"
          onPress={() => {
            if (index < weatherData.length - 1) setIndex(index + 1);
          }}
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

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  day: {
    textAlign: "center",
    color: "gray",
  },

  city: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },

  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
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
