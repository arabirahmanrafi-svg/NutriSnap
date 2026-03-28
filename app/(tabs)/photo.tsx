import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GROQ_API_KEY =
  process.env.EXPO_PUBLIC_GROQ_KEY || "your_groq_api_key_here";

export default function PhotoScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      setImage(res.assets[0]);
      setResult(null);
      analyzePhoto(res.assets[0].base64);
    }
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      setImage(res.assets[0]);
      setResult(null);
      analyzePhoto(res.assets[0].base64);
    }
  }

  async function analyzePhoto(base64) {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${base64}`,
                    },
                  },
                  {
                    type: "text",
                    text: `Analyze this food image and provide:
1. 🍽️ Food name and description
2. 🔥 Estimated calories (give a range)
3. 📊 Estimated macros (protein, carbs, fat)
4. ✅ Is it Halal? (yes/no/uncertain)
5. 🌱 Is it Vegan? (yes/no/uncertain)
6. ⚠️ Any common allergens?

Be concise and helpful. If it's not food, say so.`,
                  },
                ],
              },
            ],
            max_tokens: 300,
          }),
        },
      );
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        setResult(data.choices[0].message.content);
      } else {
        setResult("Could not analyze this image. Please try again.");
      }
    } catch (err) {
      setResult("Error analyzing image. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function saveMeal() {
    if (!result) return;
    try {
      const newMeal = {
        name: "Photo Meal 📸",
        calories: 0,
        halal: "❓ See AI analysis",
        vegan: "❓ See AI analysis",
        time: new Date().toLocaleTimeString(),
        aiAnalysis: result,
      };
      const existing = await AsyncStorage.getItem("meals");
      const meals = existing ? JSON.parse(existing) : [];
      meals.push(newMeal);
      await AsyncStorage.setItem("meals", JSON.stringify(meals));
      Alert.alert("✅ Saved!", "Meal added to your Dashboard!");
    } catch (err) {
      Alert.alert("Error", "Could not save meal.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📸 Photo Recognition</Text>
      <Text style={styles.subtitle}>
        Take a photo of any food to analyze it
      </Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text style={styles.photoButtonIcon}>📷</Text>
          <Text style={styles.photoButtonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={pickFromGallery}>
          <Text style={styles.photoButtonIcon}>🖼️</Text>
          <Text style={styles.photoButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#00d4aa" />
          <Text style={styles.loadingText}>🤖 Analyzing your food...</Text>
          <Text style={styles.loadingSubtext}>This takes 5-10 seconds</Text>
          <Text style={styles.loadingSubtext}>
            AI is identifying ingredients,
          </Text>
          <Text style={styles.loadingSubtext}>calories & dietary info...</Text>
        </View>
      )}

      {/* Result */}
      {result && !loading && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>🤖 AI Analysis</Text>
          <Text style={styles.resultText}>{result}</Text>
          <TouchableOpacity style={styles.saveButton} onPress={saveMeal}>
            <Text style={styles.saveButtonText}>➕ Add to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!image && !loading && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🍕</Text>
          <Text style={styles.emptyTitle}>No photo yet</Text>
          <Text style={styles.emptyText}>
            Take a photo or pick from your gallery to identify food and get
            nutritional info instantly!
          </Text>
        </View>
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
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
  },
  photoButton: {
    flex: 1,
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  photoButtonIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  photoButtonText: {
    color: "#00d4aa",
    fontWeight: "600",
    fontSize: 15,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#00d4aa",
  },
  image: {
    width: "100%",
    height: 250,
  },
  loadingBox: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#16213e",
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#00d4aa30",
  },
  loadingText: {
    color: "#ffffff",
    opacity: 0.9,
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingSubtext: {
    color: "#ffffff",
    opacity: 0.4,
    fontSize: 13,
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  resultTitle: {
    color: "#00d4aa",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  resultText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#00d4aa",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 20,
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    color: "#ffffff",
    opacity: 0.5,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
});
