import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/States";
import { View } from "react-native";

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <LoadingState label="Loading GreenRoots..." />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="plant/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="tree/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="verify/[treeId]" options={{ presentation: "modal" }} />
      <Stack.Screen name="safety/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="community/index" options={{ presentation: "card" }} />
      <Stack.Screen name="community/new" options={{ presentation: "modal" }} />
      <Stack.Screen name="video/index" options={{ presentation: "card" }} />
      <Stack.Screen name="admin/index" options={{ presentation: "card" }} />
      <Stack.Screen name="evidence" options={{ presentation: "card" }} />
    </Stack>
  );
}
