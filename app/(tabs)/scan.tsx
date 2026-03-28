import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanScreen() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function searchProduct() {
    if (!barcode) return;
    setLoading(true);
    setError("");
    setProduct(null);
    setSaved(false);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      );
      const data = await response.json();
      if (data.status === 1) {
        setProduct(data.product);
      } else {
        setError("Product not found. Try another barcode!");
      }
    } catch (err) {
      setError("Network error. Check your connection!");
    } finally {
      setLoading(false);
    }
  }

  function checkDietaryStatus(ingredients) {
    if (!ingredients) return { halal: "❓ Unknown", vegan: "❓ Unknown" };
    const text = ingredients.toLowerCase();
    const haramItems = [
      "pork",
      "porc",
      "alcohol",
      "lard",
      "liqueur",
      "rum",
      "whiskey",
      "bacon",
      "ham",
      "gelatin",
      "gélatine",
    ];
    const nonVeganItems = [
      "milk",
      "lait",
      "egg",
      "oeuf",
      "meat",
      "viande",
      "chicken",
      "poulet",
      "beef",
      "boeuf",
      "fish",
      "poisson",
      "honey",
      "miel",
      "lactoserum",
      "whey",
      "butter",
      "beurre",
      "cream",
      "fromage",
    ];
    const isHaram = haramItems.some((item) =>
      new RegExp(`\\b${item}\\b`).test(text),
    );
    const isNonVegan = nonVeganItems.some((item) =>
      new RegExp(`\\b${item}\\b`).test(text),
    );
    return {
      halal: isHaram ? "❌ Not Halal" : "✅ Likely Halal",
      vegan: isNonVegan ? "❌ Not Vegan" : "✅ Likely Vegan",
    };
  }

  async function saveMeal(product) {
    try {
      const status = checkDietaryStatus(product.ingredients_text);
      const newMeal = {
        name: product.product_name || "Unknown Product",
        calories: Math.round(product.nutriments?.["energy-kcal_100g"] || 0),
        halal: status.halal,
        vegan: status.vegan,
        time: new Date().toLocaleTimeString(),
      };
      const existing = await AsyncStorage.getItem("meals");
      const meals = existing ? JSON.parse(existing) : [];
      meals.push(newMeal);
      await AsyncStorage.setItem("meals", JSON.stringify(meals));
      setSaved(true);
      Alert.alert("✅ Saved!", `${newMeal.name} added to your Dashboard!`);
    } catch (err) {
      Alert.alert("Error", "Could not save meal. Try again.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🔍 Scan Product</Text>
      <Text style={styles.subtitle}>Enter a barcode to check ingredients</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter barcode number..."
          placeholderTextColor="#ffffff50"
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchProduct}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>💡 Try: 3017620422003 (Nutella)</Text>

      {loading && (
        <ActivityIndicator size="large" color="#00d4aa" style={styles.loader} />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {product && (
        <View style={styles.productCard}>
          <Text style={styles.productName}>
            {product.product_name || "Unknown Product"}
          </Text>
          <Text style={styles.productBrand}>
            Brand: {product.brands || "Unknown"}
          </Text>

          <View style={styles.statusRow}>
            {(() => {
              const status = checkDietaryStatus(product.ingredients_text);
              return (
                <>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{status.halal}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{status.vegan}</Text>
                  </View>
                </>
              );
            })()}
          </View>

          {product.nutriments && (
            <View style={styles.nutritionBox}>
              <Text style={styles.nutritionTitle}>📊 Nutrition per 100g</Text>
              <Text style={styles.nutritionItem}>
                🔥 Calories:{" "}
                {Math.round(product.nutriments["energy-kcal_100g"] || 0)} kcal
              </Text>
              <Text style={styles.nutritionItem}>
                🥩 Protein: {product.nutriments.proteins_100g || 0}g
              </Text>
              <Text style={styles.nutritionItem}>
                🍞 Carbs: {product.nutriments.carbohydrates_100g || 0}g
              </Text>
              <Text style={styles.nutritionItem}>
                🧈 Fat: {product.nutriments.fat_100g || 0}g
              </Text>
            </View>
          )}

          {product.ingredients_text && (
            <View style={styles.ingredientsBox}>
              <Text style={styles.nutritionTitle}>🧪 Ingredients</Text>
              <Text style={styles.ingredientsText}>
                {product.ingredients_text}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.addButton, saved && styles.addButtonSaved]}
            onPress={() => saveMeal(product)}
            disabled={saved}
          >
            <Text style={styles.addButtonText}>
              {saved ? "✅ Added to Dashboard!" : "➕ Add to Dashboard"}
            </Text>
          </TouchableOpacity>
        </View>
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
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#16213e",
    color: "#ffffff",
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  searchButton: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 20,
    borderRadius: 15,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
    fontSize: 16,
  },
  hint: {
    color: "#ffffff",
    opacity: 0.5,
    fontSize: 13,
    marginBottom: 20,
  },
  loader: {
    marginTop: 30,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  productCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  productBrand: {
    color: "#ffffff",
    opacity: 0.6,
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
    flexWrap: "wrap",
  },
  statusBadge: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  nutritionBox: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  nutritionTitle: {
    color: "#00d4aa",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  nutritionItem: {
    color: "#ffffff",
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 5,
  },
  ingredientsBox: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  ingredientsText: {
    color: "#ffffff",
    opacity: 0.7,
    fontSize: 13,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: "#00d4aa",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 5,
  },
  addButtonSaved: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  addButtonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
    fontSize: 16,
  },
});
