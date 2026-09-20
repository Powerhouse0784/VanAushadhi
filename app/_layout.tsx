import "../global.css";
import "react-native-gesture-handler";
import React, { useCallback, useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts as useFraunces, Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import { colorScheme } from "nativewind";
import { AuthProvider } from "@/context/AuthContext";
import { AppDataProvider } from "@/context/AppDataContext";

SplashScreen.preventAutoHideAsync().catch(() => {});

// GreenRoots currently ships one fully-designed theme (light). Several
// screens pair hardcoded light background colors with Tailwind `dark:`
// text/icon classes, so letting the OS's dark mode flip those classes on
// its own produced light-on-light and low-contrast UI. Pinning the scheme
// keeps every screen looking the way it was designed, regardless of the
// device's system setting, until a real dark theme is built out.
colorScheme.set("light");

export default function RootLayout() {
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const [frauncesLoaded] = useFraunces({ Fraunces_600SemiBold });
  const fontsLoaded = interLoaded && frauncesLoaded;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppDataProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth/login" options={{ presentation: "modal" }} />
              <Stack.Screen name="auth/signup" options={{ presentation: "modal" }} />
              <Stack.Screen name="(app)" />
            </Stack>
          </AppDataProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
