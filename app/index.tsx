import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🥗</Text>
      <Text style={styles.title}>NutriSnap</Text>
      <Text style={styles.tagline}>Snap your food. Know what's in it.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/profile")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#00d4aa",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.8,
  },
  button: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "bold",
  },
});
