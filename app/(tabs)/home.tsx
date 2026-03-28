import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const [calories, setCalories] = useState(0);
  const [meals, setMeals] = useState([]);
  const dailyGoal = 2000;

  useEffect(() => {
    loadMeals();
  }, []);

  async function loadMeals() {
    try {
      const stored = await AsyncStorage.getItem("meals");
      if (stored) {
        const parsed = JSON.parse(stored);
        setMeals(parsed);
        const total = parsed.reduce((sum, meal) => sum + meal.calories, 0);
        setCalories(total);
      }
    } catch (err) {
      console.log("Error loading meals:", err);
    }
  }

  async function clearMeals() {
    await AsyncStorage.removeItem("meals");
    setMeals([]);
    setCalories(0);
  }

  const progress = Math.min((calories / dailyGoal) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Good Morning! 👋</Text>
      <Text style={styles.subtitle}>Here's your nutrition today</Text>

      <View style={styles.calorieCard}>
        <Text style={styles.calorieNumber}>{calories}</Text>
        <Text style={styles.calorieLabel}>of {dailyGoal} kcal</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress)}% of daily goal
        </Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🥩 Halal</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚠️ Nut-free</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {meals.length > 0 && (
          <TouchableOpacity onPress={clearMeals}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {meals.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyText}>No meals logged yet.</Text>
          <Text style={styles.emptySubtext}>
            Go to Scan tab to add a product!
          </Text>
        </View>
      ) : (
        meals.map((meal, index) => (
          <View key={index} style={styles.mealCard}>
            <View style={styles.mealLeft}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTime}>{meal.time}</Text>
              <Text style={styles.mealBadge}>
                {meal.halal} · {meal.vegan}
              </Text>
            </View>
            <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.6,
    marginBottom: 25,
  },
  calorieCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  calorieNumber: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#00d4aa",
  },
  calorieLabel: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.7,
    marginBottom: 15,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#1a1a2e",
    borderRadius: 5,
    marginBottom: 8,
  },
  progressFill: {
    height: 10,
    backgroundColor: "#00d4aa",
    borderRadius: 5,
  },
  progressText: {
    color: "#ffffff",
    opacity: 0.6,
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  badge: {
    backgroundColor: "#16213e",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  badgeText: {
    color: "#00d4aa",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  clearText: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyText: {
    color: "#ffffff",
    opacity: 0.6,
    fontSize: 16,
    marginBottom: 5,
  },
  emptySubtext: {
    color: "#00d4aa",
    fontSize: 14,
  },
  mealCard: {
    backgroundColor: "#16213e",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#00d4aa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealLeft: {
    flex: 1,
  },
  mealName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  mealTime: {
    color: "#ffffff",
    opacity: 0.5,
    fontSize: 12,
    marginBottom: 4,
  },
  mealBadge: {
    color: "#00d4aa",
    fontSize: 12,
  },
  mealCalories: {
    color: "#00d4aa",
    fontSize: 16,
    fontWeight: "bold",
  },
});
