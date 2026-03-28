import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1a1a2e", borderTopColor: "#00d4aa" },
        tabBarActiveTintColor: "#00d4aa",
        tabBarInactiveTintColor: "#ffffff",
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "🏠 Home" }} />
      <Tabs.Screen name="home" options={{ tabBarLabel: "📊 Dashboard" }} />
      <Tabs.Screen name="scan" options={{ tabBarLabel: "🔍 Scan" }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: "👤 Profile" }} />
    </Tabs>
  );
}
