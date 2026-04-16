import { View, Text, StyleSheet, Pressable } from "react-native";

export default function DayNavigator({ onNext, onPrev }: any) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPrev} testID="prev-button">
        <Text style={styles.arrow}>‹</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={onNext} testID="next-button">
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",

    // efecto vidrio
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",

    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  arrow: {
    fontSize: 28,
    color: "white",
  },
});
