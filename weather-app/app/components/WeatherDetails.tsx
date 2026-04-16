import { View, Text, StyleSheet } from "react-native";

export default function WeatherDetails({ weather }: any) {
  return (
    <View style={styles.container}>
      <Text testID="humidity">💧 {weather.humidity}%</Text>
      <Text testID="pressure">📈 {weather.pressure} hPa</Text>
      <Text testID="wind">🌬️ {weather.wind} km/h</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
});
