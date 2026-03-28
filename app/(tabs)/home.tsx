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
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [activeTab, setActiveTab] = useState("today");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load profile
      const profile = await AsyncStorage.getItem("userProfile");
      if (profile) {
        const parsed = JSON.parse(profile);
        setDailyGoal(parsed.calorieGoal || 2000);
      }

      // Load meals
      const stored = await AsyncStorage.getItem("meals");
      if (stored) {
        const parsed = JSON.parse(stored);
        setMeals(parsed);
        const total = parsed.reduce((sum, meal) => sum + meal.calories, 0);
        setCalories(total);

        // Build weekly data (simulate for now)
        const weekly = [1200, 1800, 2100, 1600, total, 0, 0];
        setWeeklyData(weekly);
      }
    } catch (err) {
      console.log("Error loading data:", err);
    }
  }

  async function clearMeals() {
    await AsyncStorage.removeItem("meals");
    setMeals([]);
    setCalories(0);
  }

  const progress = Math.min((calories / dailyGoal) * 100, 100);
  const weeklyTotal = weeklyData.reduce((a, b) => a + b, 0);
  const weeklyAvg = Math.round(
    weeklyTotal / weeklyData.filter((d) => d > 0).length || 0,
  );
  const maxDay = Math.max(...weeklyData);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Good Morning! 👋</Text>
      <Text style={styles.subtitle}>Here's your nutrition overview</Text>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "today" && styles.tabActive]}
          onPress={() => setActiveTab("today")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "today" && styles.tabTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "weekly" && styles.tabActive]}
          onPress={() => setActiveTab("weekly")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "weekly" && styles.tabTextActive,
            ]}
          >
            Weekly Report
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "today" ? (
        <>
          {/* Calorie Card */}
          <View style={styles.calorieCard}>
            <Text style={styles.calorieNumber}>{calories}</Text>
            <Text style={styles.calorieLabel}>of {dailyGoal} kcal</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: progress > 100 ? "#ff6b6b" : "#00d4aa",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress >= 100
                ? "⚠️ Goal reached!"
                : `${Math.round(progress)}% of daily goal`}
            </Text>
            <Text style={styles.remainingText}>
              {Math.max(0, dailyGoal - calories)} kcal remaining
            </Text>
          </View>

          {/* Meal List */}
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
        </>
      ) : (
        <>
          {/* Weekly Report */}
          <View style={styles.weeklyCard}>
            <Text style={styles.weeklyTitle}>📅 Weekly Summary</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{weeklyTotal}</Text>
                <Text style={styles.statLabel}>Total kcal</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{weeklyAvg}</Text>
                <Text style={styles.statLabel}>Daily avg</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{meals.length}</Text>
                <Text style={styles.statLabel}>Meals logged</Text>
              </View>
            </View>

            {/* Bar Chart */}
            <Text style={styles.chartTitle}>Calories by Day</Text>
            <View style={styles.chart}>
              {weeklyData.map((val, i) => (
                <View key={i} style={styles.barContainer}>
                  <Text style={styles.barValue}>{val > 0 ? val : ""}</Text>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: maxDay > 0 ? (val / maxDay) * 120 : 0,
                          backgroundColor:
                            val > dailyGoal ? "#ff6b6b" : "#00d4aa",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{days[i]}</Text>
                </View>
              ))}
            </View>

            {/* Goal Line Info */}
            <View style={styles.goalInfo}>
              <View style={styles.goalDot} />
              <Text style={styles.goalInfoText}>
                Daily goal: {dailyGoal} kcal
              </Text>
            </View>
          </View>

          {/* Weekly Insights */}
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>💡 Weekly Insights</Text>
            <Text style={styles.insightItem}>
              {weeklyAvg < dailyGoal
                ? `✅ You're averaging ${dailyGoal - weeklyAvg} kcal under your goal`
                : `⚠️ You're averaging ${weeklyAvg - dailyGoal} kcal over your goal`}
            </Text>
            <Text style={styles.insightItem}>
              📊 Most active day: {days[weeklyData.indexOf(maxDay)]} ({maxDay}{" "}
              kcal)
            </Text>
            <Text style={styles.insightItem}>
              🍽️ Total meals logged this week: {meals.length}
            </Text>
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
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
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#16213e",
    borderRadius: 15,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#00d4aa",
  },
  tabText: {
    color: "#ffffff",
    opacity: 0.6,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#1a1a2e",
    opacity: 1,
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
    borderRadius: 5,
  },
  progressText: {
    color: "#ffffff",
    opacity: 0.6,
    fontSize: 13,
    marginBottom: 4,
  },
  remainingText: {
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
  weeklyCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#00d4aa30",
  },
  weeklyTitle: {
    color: "#00d4aa",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    color: "#00d4aa",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#ffffff",
    opacity: 0.6,
    fontSize: 12,
  },
  chartTitle: {
    color: "#ffffff",
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 10,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 160,
    marginBottom: 10,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  barValue: {
    color: "#ffffff",
    opacity: 0.5,
    fontSize: 9,
    marginBottom: 4,
  },
  barWrapper: {
    height: 120,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  bar: {
    width: "70%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    color: "#ffffff",
    opacity: 0.6,
    fontSize: 11,
    marginTop: 6,
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00d4aa",
    marginRight: 8,
  },
  goalInfoText: {
    color: "#ffffff",
    opacity: 0.6,
    fontSize: 12,
  },
  insightsCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#00d4aa30",
  },
  insightsTitle: {
    color: "#00d4aa",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
  insightItem: {
    color: "#ffffff",
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
});
