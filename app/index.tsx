import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background circles for design */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🥗</Text>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>AI</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>NutriSnap</Text>
      <Text style={styles.tagline}>
        Snap your food.{"\n"}Know what's in it.
      </Text>

      {/* Features */}
      <View style={styles.featuresBox}>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>📷</Text>
          <Text style={styles.featureText}>Scan any barcode instantly</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>Halal & Vegan checker</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>⚠️</Text>
          <Text style={styles.featureText}>Allergen detection</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>📊</Text>
          <Text style={styles.featureText}>Daily calorie tracking</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/(tabs)/camera")}
      >
        <Text style={styles.primaryButtonText}>📷 Start Scanning</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text style={styles.secondaryButtonText}>View Dashboard →</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Powered by Open Food Facts · 1M+ products
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#00d4aa",
    opacity: 0.05,
    top: -100,
    right: -100,
  },
  circle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#00d4aa",
    opacity: 0.05,
    bottom: -50,
    left: -50,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 80,
  },
  logoBadge: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#00d4aa",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  logoBadgeText: {
    color: "#1a1a2e",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#00d4aa",
    marginBottom: 10,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 30,
    lineHeight: 26,
  },
  featuresBox: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#00d4aa20",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
  },
  featureText: {
    color: "#ffffff",
    fontSize: 15,
    opacity: 0.85,
  },
  primaryButton: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00d4aa",
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: "#00d4aa",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    color: "#ffffff",
    opacity: 0.3,
    fontSize: 12,
    textAlign: "center",
  },
});
