import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  const [selectedDiet, setSelectedDiet] = useState("None");
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const diets = ["None", "Halal", "Vegan", "Vegetarian"];
  const allergies = ["Nuts", "Dairy", "Gluten", "Soy", "Shellfish", "Eggs"];

  function toggleAllergy(allergy) {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>
      <Text style={styles.subtitle}>Tell us about your dietary needs</Text>

      <Text style={styles.sectionTitle}>🍽️ Dietary Type</Text>
      <View style={styles.optionsRow}>
        {diets.map((diet) => (
          <TouchableOpacity
            key={diet}
            style={[styles.chip, selectedDiet === diet && styles.chipSelected]}
            onPress={() => setSelectedDiet(diet)}
          >
            <Text
              style={[
                styles.chipText,
                selectedDiet === diet && styles.chipTextSelected,
              ]}
            >
              {diet}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>⚠️ Allergies</Text>
      <View style={styles.optionsRow}>
        {allergies.map((allergy) => (
          <TouchableOpacity
            key={allergy}
            style={[
              styles.chip,
              selectedAllergies.includes(allergy) && styles.chipSelected,
            ]}
            onPress={() => toggleAllergy(allergy)}
          >
            <Text
              style={[
                styles.chipText,
                selectedAllergies.includes(allergy) && styles.chipTextSelected,
              ]}
            >
              {allergy}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Profile ✓</Text>
      </TouchableOpacity>

      <Text style={styles.summary}>
        Diet: {selectedDiet} {"\n"}
        Allergies:{" "}
        {selectedAllergies.length > 0 ? selectedAllergies.join(", ") : "None"}
      </Text>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#00d4aa",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.7,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
    marginTop: 10,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 25,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  chipSelected: {
    backgroundColor: "#00d4aa",
  },
  chipText: {
    color: "#00d4aa",
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#1a1a2e",
  },
  saveButton: {
    backgroundColor: "#00d4aa",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "bold",
  },
  summary: {
    color: "#ffffff",
    opacity: 0.7,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
  },
});
