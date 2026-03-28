import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ProfileScreen() {
  const [selectedDiet, setSelectedDiet] = useState("None");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [saved, setSaved] = useState(false);

  const diets = ["None", "Halal", "Vegan", "Vegetarian", "Keto", "Gluten-Free"];
  const allergies = ["Nuts", "Dairy", "Gluten", "Soy", "Shellfish", "Eggs"];
  const calorieOptions = [1500, 1800, 2000, 2200, 2500, 3000];

  const theme = {
    bg: darkMode ? "#1a1a2e" : "#f0f4f8",
    card: darkMode ? "#16213e" : "#ffffff",
    text: darkMode ? "#ffffff" : "#1a1a2e",
    subtext: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
    accent: "#00d4aa",
    border: darkMode ? "#00d4aa30" : "#00d4aa50",
  };

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const stored = await AsyncStorage.getItem("userProfile");
      if (stored) {
        const profile = JSON.parse(stored);
        setSelectedDiet(profile.diet || "None");
        setSelectedAllergies(profile.allergies || []);
        setCalorieGoal(profile.calorieGoal || 2000);
        setDarkMode(profile.darkMode !== undefined ? profile.darkMode : true);
        setNotificationsOn(profile.notificationsOn || false);
      }
    } catch (err) {
      console.log("Error loading profile:", err);
    }
  }

  async function toggleNotifications(value) {
    setNotificationsOn(value);
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please allow notifications in settings.",
        );
        setNotificationsOn(false);
        return;
      }
      await scheduleNotification();
      Alert.alert(
        "🔔 Notifications On!",
        "You'll get a daily reminder to log your meals!",
      );
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert(
        "🔕 Notifications Off",
        "Daily reminders have been turned off.",
      );
    }
  }

  async function scheduleNotification() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🥗 NutriSnap Daily Reminder",
        body: `Don't forget to log your meals! Goal: ${calorieGoal} kcal today.`,
        sound: true,
      },
      trigger: {
        hour: 12,
        minute: 0,
        repeats: true,
      },
    });
  }

  async function saveProfile() {
    try {
      const profile = {
        diet: selectedDiet,
        allergies: selectedAllergies,
        calorieGoal: calorieGoal,
        darkMode: darkMode,
        notificationsOn: notificationsOn,
      };
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
      setSaved(true);
      Alert.alert("✅ Saved!", "Your profile has been saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      Alert.alert("Error", "Could not save profile. Try again.");
    }
  }

  function toggleAllergy(allergy) {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.accent }]}>
        👤 Your Profile
      </Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Personalize your nutrition preferences
      </Text>

      {/* Dark/Light Mode */}
      <View
        style={[
          styles.toggleCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.toggleRow}>
          <Text style={styles.toggleEmoji}>{darkMode ? "🌙" : "☀️"}</Text>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>
            {darkMode ? "Dark Mode" : "Light Mode"}
          </Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#767577", true: "#00d4aa" }}
            thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Notifications */}
      <View
        style={[
          styles.toggleCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.toggleRow}>
          <Text style={styles.toggleEmoji}>🔔</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleLabel, { color: theme.text }]}>
              Daily Reminders
            </Text>
            <Text style={[styles.toggleSub, { color: theme.subtext }]}>
              Reminder at 12:00 PM every day
            </Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#00d4aa" }}
            thumbColor={notificationsOn ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Dietary Type */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          🍽️ Dietary Type
        </Text>
        <View style={styles.optionsRow}>
          {diets.map((diet) => (
            <TouchableOpacity
              key={diet}
              style={[
                styles.chip,
                { borderColor: theme.accent },
                selectedDiet === diet && { backgroundColor: theme.accent },
              ]}
              onPress={() => setSelectedDiet(diet)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.accent },
                  selectedDiet === diet && { color: "#1a1a2e" },
                ]}
              >
                {diet}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Allergies */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          ⚠️ Allergies
        </Text>
        <View style={styles.optionsRow}>
          {allergies.map((allergy) => (
            <TouchableOpacity
              key={allergy}
              style={[
                styles.chip,
                { borderColor: theme.accent },
                selectedAllergies.includes(allergy) && {
                  backgroundColor: theme.accent,
                },
              ]}
              onPress={() => toggleAllergy(allergy)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.accent },
                  selectedAllergies.includes(allergy) && { color: "#1a1a2e" },
                ]}
              >
                {allergy}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Calorie Goal */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          🎯 Daily Calorie Goal
        </Text>
        <View style={styles.optionsRow}>
          {calorieOptions.map((cal) => (
            <TouchableOpacity
              key={cal}
              style={[
                styles.chip,
                { borderColor: theme.accent },
                calorieGoal === cal && { backgroundColor: theme.accent },
              ]}
              onPress={() => setCalorieGoal(cal)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.accent },
                  calorieGoal === cal && { color: "#1a1a2e" },
                ]}
              >
                {cal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Card */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.summaryTitle, { color: theme.accent }]}>
          📋 Your Settings
        </Text>
        <Text style={[styles.summaryItem, { color: theme.subtext }]}>
          🍽️ Diet:{" "}
          <Text style={{ color: theme.accent, fontWeight: "600" }}>
            {selectedDiet}
          </Text>
        </Text>
        <Text style={[styles.summaryItem, { color: theme.subtext }]}>
          ⚠️ Allergies:{" "}
          <Text style={{ color: theme.accent, fontWeight: "600" }}>
            {selectedAllergies.length > 0
              ? selectedAllergies.join(", ")
              : "None"}
          </Text>
        </Text>
        <Text style={[styles.summaryItem, { color: theme.subtext }]}>
          🎯 Goal:{" "}
          <Text style={{ color: theme.accent, fontWeight: "600" }}>
            {calorieGoal} kcal/day
          </Text>
        </Text>
        <Text style={[styles.summaryItem, { color: theme.subtext }]}>
          {darkMode ? "🌙" : "☀️"} Theme:{" "}
          <Text style={{ color: theme.accent, fontWeight: "600" }}>
            {darkMode ? "Dark" : "Light"}
          </Text>
        </Text>
        <Text style={[styles.summaryItem, { color: theme.subtext }]}>
          🔔 Reminders:{" "}
          <Text style={{ color: theme.accent, fontWeight: "600" }}>
            {notificationsOn ? "On (12:00 PM daily)" : "Off"}
          </Text>
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saved && styles.saveButtonSaved]}
        onPress={saveProfile}
      >
        <Text style={[styles.saveButtonText, saved && { color: "#00d4aa" }]}>
          {saved ? "✅ Profile Saved!" : "💾 Save Profile"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 25,
  },
  toggleCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  toggleSub: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  summaryTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    marginBottom: 6,
  },
  saveButton: {
    backgroundColor: "#00d4aa",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  saveButtonSaved: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  saveButtonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "bold",
  },
});
