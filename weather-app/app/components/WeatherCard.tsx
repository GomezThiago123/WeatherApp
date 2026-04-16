import { View, Text, StyleSheet } from "react-native";

export default function WeatherCard({ weather }: any) {
  const getIcon = () => {
    if (weather.condition === "Soleado") return "☀️";
    if (weather.condition === "Nublado") return "☁️";
    return "🌧️";
  };

  return (
    <View style={styles.card}>
      <Text style={styles.city} testID="city-name">
        {weather.city}
      </Text>

      <Text style={styles.day} testID="day">
        {weather.day}
      </Text>

      <Text style={styles.icon}>{getIcon()}</Text>

      <Text style={styles.temp} testID="temperature">
        {weather.temp}°
      </Text>

      <Text style={styles.minmax} testID="min-max">
        {weather.min}° / {weather.max}°
      </Text>

      <Text style={styles.condition} testID="condition">
        {weather.condition}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: 300,
    borderRadius: 25,
    padding: 25,
    alignItems: "center",

    // sombra (muy importante para efecto card)
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,

    marginBottom: 20,
  },
  city: {
    fontSize: 20,
    fontWeight: "bold",
  },
  day: {
    color: "gray",
    marginBottom: 10,
  },
  icon: {
    fontSize: 50,
    marginVertical: 10,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
  },
  minmax: {
    color: "gray",
  },
  condition: {
    marginTop: 5,
  },
});
