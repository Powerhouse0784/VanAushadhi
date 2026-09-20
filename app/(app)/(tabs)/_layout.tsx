import React from "react";
import { Tabs } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { View, Text, Platform } from "react-native";

type IconName = "dashboard" | "map" | "library" | "assistant" | "profile";

function TabIcon({ name, color, size = 22 }: { name: IconName; color: string; size?: number }) {
  const common = { stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === "dashboard" && (
        <>
          <Rect x="3" y="3" width="8" height="8" rx="2" {...common} />
          <Rect x="13" y="3" width="8" height="5" rx="2" {...common} />
          <Rect x="13" y="10" width="8" height="11" rx="2" {...common} />
          <Rect x="3" y="13" width="8" height="8" rx="2" {...common} />
        </>
      )}
      {name === "map" && (
        <>
          <Path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" {...common} />
          <Path d="M9 4v14M15 6v14" {...common} />
        </>
      )}
      {name === "library" && (
        <>
          <Path d="M20 4C10 4 4 10 4 17c0 1.7 1.3 3 3 3 7 0 13-6 13-16Z" {...common} />
        </>
      )}
      {name === "assistant" && (
        <>
          <Path d="M12 3a1 1 0 0 1 1 1v2h1a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4h1V4a1 1 0 0 1 1-1Z" {...common} />
          <Circle cx="9.5" cy="11" r="0.9" fill={color} />
          <Circle cx="14.5" cy="11" r="0.9" fill={color} />
          <Path d="M8 20v-2M16 20v-2" {...common} />
        </>
      )}
      {name === "profile" && (
        <>
          <Circle cx="12" cy="8" r="3.4" {...common} />
          <Path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" {...common} />
        </>
      )}
    </Svg>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2C6E3B",
        tabBarInactiveTintColor: "#9CB8A3",
        tabBarLabelStyle: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
        tabBarStyle: {
          backgroundColor: "#FFFDF8",
          borderTopColor: "#EFE7D6",
          height: Platform.OS === "ios" ? 88 : 66,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: "Dashboard", tabBarIcon: ({ color }) => <TabIcon name="dashboard" color={color as string} /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: "Map", tabBarIcon: ({ color }) => <TabIcon name="map" color={color as string} /> }}
      />
      <Tabs.Screen
        name="library/index"
        options={{ title: "Library", tabBarIcon: ({ color }) => <TabIcon name="library" color={color as string} /> }}
      />
      <Tabs.Screen
        name="assistant"
        options={{ title: "Assistant", tabBarIcon: ({ color }) => <TabIcon name="assistant" color={color as string} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color }) => <TabIcon name="profile" color={color as string} /> }}
      />
    </Tabs>
  );
}
