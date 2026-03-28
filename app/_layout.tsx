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
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarLabel: "🏠 Home" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "👤 Profile" }}
      />
      <Tabs.Screen
        name="home"
        options={{ title: "Dashboard", tabBarLabel: "📊 Dashboard" }}
      />
      <Tabs.Screen
        name="scan"
        options={{ title: "Scan", tabBarLabel: "🔍 Scan" }}
      />
    </Tabs>
  );
}
